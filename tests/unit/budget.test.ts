import { describe, it, expect } from "vitest";
import {
  buildBudgetReport,
  budgetAlert,
  classifyBudgetStatus,
  DEFAULT_MONTHLY_BUDGET_KG,
} from "@/lib/carbon/budget";

describe("classifyBudgetStatus", () => {
  it.each([
    [10, "under"],
    [79.9, "under"],
    [80, "approaching"],
    [99, "approaching"],
    [100, "over"],
    [109, "over"],
    [110, "critical"],
    [250, "critical"],
  ])("classifies %i%% as %s", (pct, expected) => {
    expect(classifyBudgetStatus(pct)).toBe(expected);
  });
});

describe("buildBudgetReport", () => {
  const mid = new Date("2024-01-15T12:00:00Z");

  it("computes remaining and percentage correctly", () => {
    const r = buildBudgetReport(100, 200, mid);
    expect(r.remaining).toBe(100);
    expect(r.usedPercent).toBe(50);
    expect(r.status).toBe("under");
  });

  it("flags status critical when way over budget", () => {
    const r = buildBudgetReport(500, 200, mid);
    expect(r.status).toBe("critical");
    expect(r.remaining).toBe(-300);
  });

  it("projects monthly total linearly from current pace", () => {
    const r = buildBudgetReport(100, 400, mid);
    // 15 days into 31-day month → projected ~ 100 / 15 * 31
    expect(Math.round(r.projectedMonthlyTotal)).toBe(207);
  });

  it("uses Paris-aligned default budget", () => {
    const r = buildBudgetReport(100);
    expect(r.budget).toBe(DEFAULT_MONTHLY_BUDGET_KG);
  });

  it("rejects invalid inputs", () => {
    expect(() => buildBudgetReport(-1)).toThrow();
    expect(() => buildBudgetReport(10, 0)).toThrow();
  });
});

describe("budgetAlert", () => {
  it("produces a critical-tone alert when over budget", () => {
    const r = buildBudgetReport(500, 200, new Date("2024-01-15"));
    expect(budgetAlert(r).toLowerCase()).toContain("critical");
  });
  it("produces an on-track alert when under budget", () => {
    const r = buildBudgetReport(50, 200, new Date("2024-01-15"));
    expect(budgetAlert(r).toLowerCase()).toContain("track");
  });
});
