// ============================================================
// CarbonTwin AI - Carbon Reduction Roadmap Engine
// ============================================================
// Pure functions that build personalised reduction plans across
// 7-day, 30-day, 90-day and 1-year horizons based on the user's
// emission profile and available actions.

import type {
  CarbonAction,
  EmissionCategory,
} from "@/lib/carbon/types";

export type RoadmapHorizon = "7d" | "30d" | "90d" | "1y";

export interface RoadmapStep {
  id: string;
  week: number;
  title: string;
  description: string;
  category: EmissionCategory;
  difficulty: "easy" | "moderate" | "challenging";
  impact: "low" | "medium" | "high";
  estimatedMonthlyReduction: number; // kg CO2e / month
  estimatedAnnualReduction: number; // kg CO2e / year
  completed: boolean;
}

export interface Roadmap {
  horizon: RoadmapHorizon;
  generatedAt: string;
  totalAnnualReduction: number;
  steps: RoadmapStep[];
}

const HORIZON_WEEKS: Record<RoadmapHorizon, number> = {
  "7d": 1,
  "30d": 4,
  "90d": 13,
  "1y": 52,
};

const DIFFICULTY_BY_IMPACT: Record<
  CarbonAction["impact"],
  RoadmapStep["difficulty"]
> = {
  low: "easy",
  medium: "moderate",
  high: "challenging",
};

/**
 * Rank actions by reduction-per-difficulty ratio (highest first).
 * Pending actions are prioritised over in-progress ones.
 */
export function prioritiseActions(actions: CarbonAction[]): CarbonAction[] {
  const weight: Record<CarbonAction["status"], number> = {
    pending: 1,
    "in-progress": 0.6,
    completed: 0,
  };
  return [...actions].sort(
    (a, b) =>
      b.estimatedReduction * weight[b.status] -
      a.estimatedReduction * weight[a.status],
  );
}

/**
 * Generate a roadmap by laying out prioritised actions across the
 * available weeks for the chosen horizon. Repeats prioritised actions
 * across longer horizons rather than padding with low-value busywork.
 */
export function generateRoadmap(
  actions: CarbonAction[],
  horizon: RoadmapHorizon,
  completedIds: ReadonlySet<string> = new Set(),
): Roadmap {
  const ordered = prioritiseActions(
    actions.filter((a) => a.status !== "completed"),
  );
  const weeks = HORIZON_WEEKS[horizon];
  const steps: RoadmapStep[] = [];

  if (ordered.length === 0) {
    return {
      horizon,
      generatedAt: new Date().toISOString(),
      totalAnnualReduction: 0,
      steps,
    };
  }

  for (let i = 0; i < weeks; i++) {
    const source = ordered[i % ordered.length];
    const id = `${horizon}-${i + 1}-${source.id}`;
    steps.push({
      id,
      week: i + 1,
      title: source.title,
      description: source.description,
      category: source.category,
      difficulty: DIFFICULTY_BY_IMPACT[source.impact],
      impact: source.impact,
      estimatedMonthlyReduction: source.estimatedReduction,
      estimatedAnnualReduction: source.estimatedReduction * 12,
      completed: completedIds.has(id),
    });
  }

  const unique = new Map<string, RoadmapStep>();
  for (const step of steps) unique.set(step.title, step);
  const totalAnnualReduction = Array.from(unique.values()).reduce(
    (sum, s) => sum + s.estimatedAnnualReduction,
    0,
  );

  return {
    horizon,
    generatedAt: new Date().toISOString(),
    totalAnnualReduction,
    steps,
  };
}

/**
 * Progress percentage (0–100) for a roadmap.
 */
export function roadmapProgress(roadmap: Roadmap): number {
  if (roadmap.steps.length === 0) return 0;
  const done = roadmap.steps.filter((s) => s.completed).length;
  return Math.round((done / roadmap.steps.length) * 100);
}
