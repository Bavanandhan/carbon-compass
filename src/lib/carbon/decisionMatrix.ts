// ============================================================
// CarbonTwin AI - Impact vs Cost Decision Matrix
// ============================================================
// Prioritisation engine answering: "What should I do first?"

import type { CarbonAction, EmissionCategory } from "@/lib/carbon/types";

export type CostLevel = "free" | "low" | "medium" | "high";
export type Quadrant = "quick-win" | "strategic" | "fill-in" | "thankless";

export interface DecisionOption {
  id: string;
  title: string;
  category: EmissionCategory;
  /** 0–100 — normalised impact score. */
  impactScore: number;
  /** 0–100 — normalised cost score (0 = free, 100 = costly). */
  costScore: number;
  /** Quadrant on the impact-vs-cost matrix. */
  quadrant: Quadrant;
  /** Composite priority ranking, higher = do sooner. */
  priority: number;
  monthlyReductionKg: number;
  cost: CostLevel;
}

const COST_TO_SCORE: Record<CostLevel, number> = {
  free: 5,
  low: 30,
  medium: 60,
  high: 90,
};

const DEFAULT_COSTS: Record<string, CostLevel> = {
  "Cycle or walk for short journeys": "free",
  "Reduce meat to 3 days per week": "free",
  "Switch to a green energy tariff": "low",
  "Buy second-hand clothing": "low",
  "Replace one flight with train travel": "low",
  "Switch to an electric vehicle": "high",
  "Switch to a heat pump": "high",
  "Install solar panels": "high",
};

/** Heuristic cost classifier when no explicit cost is supplied. */
export function inferCost(action: CarbonAction): CostLevel {
  return DEFAULT_COSTS[action.title] ?? (
    action.impact === "high" ? "medium" : "low"
  );
}

/** Classify quadrant from impact and cost scores. */
export function classifyQuadrant(
  impactScore: number,
  costScore: number,
): Quadrant {
  const highImpact = impactScore >= 50;
  const lowCost = costScore < 50;
  if (highImpact && lowCost) return "quick-win";
  if (highImpact && !lowCost) return "strategic";
  if (!highImpact && lowCost) return "fill-in";
  return "thankless";
}

/** Build a fully ranked decision matrix from a list of actions. */
export function buildDecisionMatrix(
  actions: ReadonlyArray<CarbonAction>,
): DecisionOption[] {
  const maxReduction = Math.max(
    1,
    ...actions.map((a) => a.estimatedReduction),
  );

  const options: DecisionOption[] = actions.map((a) => {
    const cost = inferCost(a);
    const costScore = COST_TO_SCORE[cost];
    const impactScore = Math.round((a.estimatedReduction / maxReduction) * 100);
    const quadrant = classifyQuadrant(impactScore, costScore);
    // Priority favours impact and penalises cost.
    const priority = Math.round(impactScore * 0.7 + (100 - costScore) * 0.3);

    return {
      id: a.id,
      title: a.title,
      category: a.category,
      impactScore,
      costScore,
      quadrant,
      priority,
      monthlyReductionKg: a.estimatedReduction,
      cost,
    };
  });

  return options.sort((a, b) => b.priority - a.priority);
}

/** Return the recommended "do first" action — the highest-priority quick win. */
export function topRecommendation(
  options: ReadonlyArray<DecisionOption>,
): DecisionOption | null {
  const quickWins = options.filter((o) => o.quadrant === "quick-win");
  const pool = quickWins.length > 0 ? quickWins : options;
  return pool[0] ?? null;
}
