// ============================================================
// CarbonTwin AI - Carbon Savings Tracker
// ============================================================
// Converts completed/in-progress actions into tangible metrics:
// CO₂ saved, money saved, trees-equivalent, fuel saved, streak days.

import type { CarbonAction } from "@/lib/carbon/types";
import { KG_CO2_PER_TREE_MONTH } from "@/lib/carbon/carbonCalculations";

/** kg CO₂ per litre of petrol (DEFRA 2023). */
export const KG_CO2_PER_LITRE_PETROL = 2.31;
/** Indicative £ saving per kg CO₂ avoided (energy + fuel blend). */
export const GBP_PER_KG_CO2_SAVED = 0.18;

export interface SavingsReport {
  co2SavedKg: number;
  co2SavedAnnualKg: number;
  moneySavedGbp: number;
  treesEquivalent: number;
  fuelSavedLitres: number;
  completedCount: number;
  inProgressCount: number;
}

/**
 * Compute a cumulative savings report from the user's action list.
 * Completed actions count fully; in-progress actions count at 50%.
 */
export function buildSavingsReport(
  actions: ReadonlyArray<CarbonAction>,
): SavingsReport {
  let monthlyCo2 = 0;
  let completed = 0;
  let inProgress = 0;

  for (const a of actions) {
    if (a.status === "completed") {
      monthlyCo2 += a.estimatedReduction;
      completed++;
    } else if (a.status === "in-progress") {
      monthlyCo2 += a.estimatedReduction * 0.5;
      inProgress++;
    }
  }

  const annual = monthlyCo2 * 12;

  return {
    co2SavedKg: Math.round(monthlyCo2),
    co2SavedAnnualKg: Math.round(annual),
    moneySavedGbp: Math.round(annual * GBP_PER_KG_CO2_SAVED),
    treesEquivalent: Math.round(annual / (KG_CO2_PER_TREE_MONTH * 12)),
    fuelSavedLitres: Math.round(annual / KG_CO2_PER_LITRE_PETROL),
    completedCount: completed,
    inProgressCount: inProgress,
  };
}

/**
 * Calculate the user's current logging streak in days.
 * A streak breaks on any gap > 1 day between consecutive entries.
 * @param entryDates ISO date strings (YYYY-MM-DD), any order
 * @param today      reference "today" for the streak (defaults to now)
 */
export function calculateStreak(
  entryDates: ReadonlyArray<string>,
  today: Date = new Date(),
): number {
  if (entryDates.length === 0) return 0;

  const unique = Array.from(new Set(entryDates)).sort().reverse();
  const todayKey = today.toISOString().slice(0, 10);

  let streak = 0;
  let cursor = new Date(todayKey + "T00:00:00Z");

  for (const dateStr of unique) {
    const cursorKey = cursor.toISOString().slice(0, 10);
    if (dateStr === cursorKey) {
      streak++;
      cursor = new Date(cursor.getTime() - 86_400_000);
    } else if (dateStr < cursorKey) {
      break;
    }
  }

  return streak;
}
