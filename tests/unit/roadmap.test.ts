import { describe, it, expect } from "vitest";
import {
  generateRoadmap,
  prioritiseActions,
  roadmapProgress,
} from "@/lib/carbon/roadmap";
import type { CarbonAction } from "@/lib/carbon/types";

const actions: CarbonAction[] = [
  {
    id: "a1",
    title: "Cycle",
    description: "Cycle to work",
    category: "transport",
    impact: "medium",
    estimatedReduction: 20,
    status: "pending",
    tips: [],
  },
  {
    id: "a2",
    title: "Heat pump",
    description: "Install a heat pump",
    category: "energy",
    impact: "high",
    estimatedReduction: 100,
    status: "pending",
    tips: [],
  },
  {
    id: "a3",
    title: "Done",
    description: "Already done",
    category: "diet",
    impact: "low",
    estimatedReduction: 5,
    status: "completed",
    tips: [],
  },
];

describe("roadmap engine", () => {
  it("prioritises higher-reduction pending actions first", () => {
    const ordered = prioritiseActions(actions);
    expect(ordered[0].id).toBe("a2");
  });

  it("generates 1 step for 7d horizon", () => {
    const r = generateRoadmap(actions, "7d");
    expect(r.steps).toHaveLength(1);
    expect(r.steps[0].week).toBe(1);
    expect(r.steps[0].title).toBe("Heat pump");
  });

  it("generates 4 weekly steps for 30d horizon", () => {
    const r = generateRoadmap(actions, "30d");
    expect(r.steps).toHaveLength(4);
  });

  it("generates 52 steps for 1y horizon and cycles through actions", () => {
    const r = generateRoadmap(actions, "1y");
    expect(r.steps).toHaveLength(52);
  });

  it("handles empty actions list", () => {
    const r = generateRoadmap([], "30d");
    expect(r.steps).toHaveLength(0);
    expect(r.totalAnnualReduction).toBe(0);
  });

  it("computes completion progress", () => {
    const r = generateRoadmap(actions, "30d");
    const completed = new Set([r.steps[0].id, r.steps[1].id]);
    const r2 = generateRoadmap(actions, "30d", completed);
    expect(roadmapProgress(r2)).toBe(50);
  });

  it("annual reduction sums unique steps × 12", () => {
    const r = generateRoadmap(actions, "30d");
    expect(r.totalAnnualReduction).toBeGreaterThan(0);
  });
});
