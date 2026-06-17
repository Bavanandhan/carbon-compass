// ============================================================
// CarbonTwin AI - Carbon Budget System
// ============================================================
// Treat emissions like a monthly personal-finance budget.

import { GLOBAL_AVERAGES } from "@/lib/carbon/carbonCalculations";

/** Default monthly budget aligned with the Paris Agreement (208 kg CO2e). */
export const DEFAULT_MONTHLY_BUDGET_KG = GLOBAL_AVERAGES.paris_target;

export type BudgetStatus = "under" | "approaching" | "over" | "critical";

export interface BudgetReport {
  budget: number;
  used: number;
  remaining: number;
  usedPercent: number;
  status: BudgetStatus;
  daysIntoMonth: number;
  daysInMonth: number;
  paceVsLinear: number; // % above (+) or below (-) a linear daily pace
  projectedMonthlyTotal: number;
}

/**
 * Classify a budget's status from the percentage used.
 * Thresholds are inclusive on the lower bound.
 */
export function classifyBudgetStatus(usedPercent: number): BudgetStatus {
  if (usedPercent >= 110) return "critical";
  if (usedPercent >= 100) return "over";
  if (usedPercent >= 80) return "approaching";
  return "under";
}

/**
 * Compute a full budget report for a given month.
 * @param used   kg CO2e emitted so far this month
 * @param budget monthly budget in kg CO2e (defaults to Paris target)
 * @param date   reference date — defaults to "now"
 */
export function buildBudgetReport(
  used: number,
  budget: number = DEFAULT_MONTHLY_BUDGET_KG,
  date: Date = new Date(),
): BudgetReport {
  if (budget <= 0) throw new RangeError("budget must be > 0");
  if (used < 0) throw new RangeError("used must be >= 0");

  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();
  const daysIntoMonth = Math.max(1, date.getDate());
  const usedPercent = (used / budget) * 100;
  const linearExpected = (daysIntoMonth / daysInMonth) * budget;
  const paceVsLinear =
    linearExpected === 0 ? 0 : ((used - linearExpected) / linearExpected) * 100;
  const projectedMonthlyTotal = (used / daysIntoMonth) * daysInMonth;

  return {
    budget,
    used,
    remaining: budget - used,
    usedPercent,
    status: classifyBudgetStatus(usedPercent),
    daysIntoMonth,
    daysInMonth,
    paceVsLinear,
    projectedMonthlyTotal,
  };
}

/**
 * Human-readable alert text for the budget status.
 */
export function budgetAlert(report: BudgetReport): string {
  switch (report.status) {
    case "critical":
      return `Critical — you have exceeded your monthly carbon budget by ${(report.usedPercent - 100).toFixed(0)}%.`;
    case "over":
      return `You have used 100% of your monthly carbon budget. Time to slow down.`;
    case "approaching":
      return `You have used ${report.usedPercent.toFixed(0)}% of your monthly budget — close to the limit.`;
    case "under":
      return `On track — ${report.remaining.toFixed(0)} kg CO₂e remaining this month.`;
  }
}
