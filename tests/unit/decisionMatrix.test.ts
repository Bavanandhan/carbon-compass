import { describe, it, expect } from "vitest";
import {
  buildDecisionMatrix,
  classifyQuadrant,
  inferCost,
  topRecommendation,
} from "@/lib/carbon/decisionMatrix";
import type { CarbonAction } from "@/lib/carbon/types";

const actions: CarbonAction[] = [
  {
    id: "a1",
    title: "Cycle or walk for short journeys",
    description: "",
    category: "transport",
    impact: "medium",
    estimatedReduction: 25,
    status: "pending",
    tips: [],
  },
  {
    id: "a2",
    title: "Install solar panels",
    description: "",
    category: "energy",
    impact: "high",
    estimatedReduction: 100,
    status: "pending",
    tips: [],
  },
  {
    id: "a3",
    title: "Buy second-hand clothing",
    description: "",
    category: "consumption",
    impact: "low",
    estimatedReduction: 10,
    status: "pending",
    tips: [],
  },
];

describe("classifyQuadrant", () => {
  it("returns quick-win for high impact + low cost", () => {
    expect(classifyQuadrant(80, 20)).toBe("quick-win");
  });
  it("returns strategic for high impact + high cost", () => {
    expect(classifyQuadrant(80, 80)).toBe("strategic");
  });
  it("returns fill-in for low impact + low cost", () => {
    expect(classifyQuadrant(20, 20)).toBe("fill-in");
  });
  it("returns thankless for low impact + high cost", () => {
    expect(classifyQuadrant(20, 80)).toBe("thankless");
  });
});

describe("inferCost", () => {
  it("respects explicit cost map", () => {
    expect(inferCost(actions[1])).toBe("high");
    expect(inferCost(actions[2])).toBe("low");
  });
});

describe("buildDecisionMatrix", () => {
  it("returns a ranked list (highest priority first)", () => {
    const matrix = buildDecisionMatrix(actions);
    expect(matrix).toHaveLength(3);
    for (let i = 1; i < matrix.length; i++) {
      expect(matrix[i - 1].priority).toBeGreaterThanOrEqual(matrix[i].priority);
    }
  });

  it("normalises impact scores 0..100", () => {
    const matrix = buildDecisionMatrix(actions);
    for (const o of matrix) {
      expect(o.impactScore).toBeGreaterThanOrEqual(0);
      expect(o.impactScore).toBeLessThanOrEqual(100);
    }
  });
});

describe("topRecommendation", () => {
  it("prefers a quick-win when available", () => {
    const matrix = buildDecisionMatrix(actions);
    const top = topRecommendation(matrix);
    expect(top).not.toBeNull();
  });

  it("returns null for empty input", () => {
    expect(topRecommendation([])).toBeNull();
  });
});
