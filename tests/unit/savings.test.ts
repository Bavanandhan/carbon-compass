import { describe, it, expect } from "vitest";
import {
  buildSavingsReport,
  calculateStreak,
} from "@/lib/carbon/savings";
import type { CarbonAction } from "@/lib/carbon/types";

const baseAction = (
  id: string,
  status: CarbonAction["status"],
  reduction: number,
): CarbonAction => ({
  id,
  title: id,
  description: "",
  category: "transport",
  impact: "medium",
  estimatedReduction: reduction,
  status,
  tips: [],
});

describe("buildSavingsReport", () => {
  it("counts completed actions at 100%, in-progress at 50%", () => {
    const r = buildSavingsReport([
      baseAction("a", "completed", 100),
      baseAction("b", "in-progress", 100),
      baseAction("c", "pending", 100),
    ]);
    expect(r.co2SavedKg).toBe(150);
    expect(r.completedCount).toBe(1);
    expect(r.inProgressCount).toBe(1);
  });

  it("derives annual, trees and fuel metrics", () => {
    const r = buildSavingsReport([baseAction("a", "completed", 100)]);
    expect(r.co2SavedAnnualKg).toBe(1200);
    expect(r.treesEquivalent).toBeGreaterThan(0);
    expect(r.fuelSavedLitres).toBeGreaterThan(0);
    expect(r.moneySavedGbp).toBeGreaterThan(0);
  });

  it("returns zeros for empty input", () => {
    const r = buildSavingsReport([]);
    expect(r.co2SavedKg).toBe(0);
    expect(r.completedCount).toBe(0);
  });
});

describe("calculateStreak", () => {
  const today = new Date("2024-06-10T12:00:00Z");

  it("returns 0 with no entries", () => {
    expect(calculateStreak([], today)).toBe(0);
  });

  it("counts consecutive days ending today", () => {
    expect(
      calculateStreak(["2024-06-08", "2024-06-09", "2024-06-10"], today),
    ).toBe(3);
  });

  it("breaks streak on gap", () => {
    expect(
      calculateStreak(["2024-06-07", "2024-06-09", "2024-06-10"], today),
    ).toBe(2);
  });

  it("ignores duplicate days", () => {
    expect(
      calculateStreak(["2024-06-10", "2024-06-10", "2024-06-09"], today),
    ).toBe(2);
  });

  it("returns 0 if today is missing", () => {
    expect(calculateStreak(["2024-06-08", "2024-06-09"], today)).toBe(0);
  });
});
