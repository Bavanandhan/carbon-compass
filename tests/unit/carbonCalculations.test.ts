// ============================================================
// CarbonTwin AI - Unit Tests: Carbon Calculations
// ============================================================

import { describe, it, expect } from "vitest";
import {
  calculateTotalEmissions,
  calculateByCategory,
  simulateScenario,
  determineCarbonDNA,
  percentageChange,
  formatEmissions,
  vsParisTarget,
  treesNeededToOffset,
  rankEmissionSources,
  clamp,
  GLOBAL_AVERAGES,
  KG_CO2_PER_TREE_MONTH,
} from "@/lib/carbon/carbonCalculations";
import type { EmissionSource, SimulationScenario } from "@/lib/carbon/types";

// --- Test fixtures ---

const mockSources: EmissionSource[] = [
  { id: "t1", category: "transport", label: "Car", value: 100, unit: "kg", icon: "🚗" },
  { id: "t2", category: "transport", label: "Flight", value: 50, unit: "kg", icon: "✈️" },
  { id: "e1", category: "energy", label: "Electricity", value: 80, unit: "kg", icon: "⚡" },
  { id: "d1", category: "diet", label: "Meat", value: 120, unit: "kg", icon: "🥩" },
  { id: "c1", category: "consumption", label: "Shopping", value: 30, unit: "kg", icon: "📦" },
];

const mockScenario: SimulationScenario = {
  id: "s1",
  label: "Switch to EV",
  description: "Replace petrol car with electric",
  category: "transport",
  reductionPercent: 75,
  currentValue: 100,
};

// --- Tests ---

describe("calculateTotalEmissions", () => {
  it("sums all emission source values", () => {
    expect(calculateTotalEmissions(mockSources)).toBe(380);
  });

  it("returns 0 for empty array", () => {
    expect(calculateTotalEmissions([])).toBe(0);
  });

  it("handles single source", () => {
    expect(calculateTotalEmissions([mockSources[0]])).toBe(100);
  });

  it("handles decimal values correctly", () => {
    const sources: EmissionSource[] = [
      { id: "1", category: "transport", label: "X", value: 0.1, unit: "kg", icon: "" },
      { id: "2", category: "transport", label: "Y", value: 0.2, unit: "kg", icon: "" },
    ];
    expect(calculateTotalEmissions(sources)).toBeCloseTo(0.3);
  });
});

describe("calculateByCategory", () => {
  it("correctly sums emissions by category", () => {
    const result = calculateByCategory(mockSources);
    expect(result.transport).toBe(150); // 100 + 50
    expect(result.energy).toBe(80);
    expect(result.diet).toBe(120);
    expect(result.consumption).toBe(30);
  });

  it("returns zeros for empty sources", () => {
    const result = calculateByCategory([]);
    expect(result.transport).toBe(0);
    expect(result.energy).toBe(0);
    expect(result.diet).toBe(0);
    expect(result.consumption).toBe(0);
  });

  it("handles sources with only one category", () => {
    const transportOnly: EmissionSource[] = [
      { id: "1", category: "transport", label: "Car", value: 200, unit: "kg", icon: "🚗" },
    ];
    const result = calculateByCategory(transportOnly);
    expect(result.transport).toBe(200);
    expect(result.energy).toBe(0);
    expect(result.diet).toBe(0);
    expect(result.consumption).toBe(0);
  });
});

describe("simulateScenario", () => {
  it("calculates correct reduction amount", () => {
    const result = simulateScenario(mockScenario);
    expect(result.reduction).toBe(75); // 100 * 0.75
  });

  it("calculates correct projected emissions", () => {
    const result = simulateScenario(mockScenario);
    expect(result.projectedEmissions).toBe(25); // 100 - 75
  });

  it("calculates annual impact correctly", () => {
    const result = simulateScenario(mockScenario);
    expect(result.annualImpact).toBe(900); // 75 * 12
  });

  it("calculates trees equivalent", () => {
    const result = simulateScenario(mockScenario);
    const expectedTrees = Math.round(900 / (KG_CO2_PER_TREE_MONTH * 12));
    expect(result.treesEquivalent).toBe(expectedTrees);
  });

  it("handles 0% reduction", () => {
    const zeroReduction = { ...mockScenario, reductionPercent: 0 };
    const result = simulateScenario(zeroReduction);
    expect(result.reduction).toBe(0);
    expect(result.projectedEmissions).toBe(100);
  });

  it("handles 100% reduction", () => {
    const fullReduction = { ...mockScenario, reductionPercent: 100 };
    const result = simulateScenario(fullReduction);
    expect(result.reduction).toBe(100);
    expect(result.projectedEmissions).toBe(0);
  });

  it("preserves scenario ID and label", () => {
    const result = simulateScenario(mockScenario);
    expect(result.scenarioId).toBe("s1");
    expect(result.label).toBe("Switch to EV");
  });

  it("returns correct reductionPercent", () => {
    const result = simulateScenario(mockScenario);
    expect(result.reductionPercent).toBe(75);
  });
});

describe("determineCarbonDNA", () => {
  it("identifies transport-heavy user", () => {
    const byCategory = { transport: 300, energy: 80, diet: 100, consumption: 30 };
    expect(determineCarbonDNA(byCategory)).toBe("transport-heavy");
  });

  it("identifies energy-intensive user", () => {
    const byCategory = { transport: 80, energy: 350, diet: 100, consumption: 30 };
    expect(determineCarbonDNA(byCategory)).toBe("energy-intensive");
  });

  it("identifies food-impact user", () => {
    const byCategory = { transport: 60, energy: 80, diet: 280, consumption: 30 };
    expect(determineCarbonDNA(byCategory)).toBe("food-impact");
  });

  it("identifies sustainability champion (all categories low)", () => {
    const byCategory = { transport: 40, energy: 50, diet: 60, consumption: 30 };
    // total = 180, below paris_target (208) and max% < 35%
    expect(determineCarbonDNA(byCategory)).toBe("sustainability-champion");
  });

  it("returns balanced for zero total", () => {
    const byCategory = { transport: 0, energy: 0, diet: 0, consumption: 0 };
    expect(determineCarbonDNA(byCategory)).toBe("balanced");
  });

  it("returns balanced for evenly distributed emissions above paris target", () => {
    const byCategory = { transport: 130, energy: 130, diet: 130, consumption: 130 };
    // total = 520, max = 130/520 = 25% — no category dominates (< 35%)
    expect(determineCarbonDNA(byCategory)).toBe("balanced");
  });
});

describe("percentageChange", () => {
  it("calculates positive change", () => {
    expect(percentageChange(120, 100)).toBe(20);
  });

  it("calculates negative change", () => {
    expect(percentageChange(80, 100)).toBe(-20);
  });

  it("returns 0 when previous is 0", () => {
    expect(percentageChange(100, 0)).toBe(0);
  });

  it("returns 0 for no change", () => {
    expect(percentageChange(100, 100)).toBe(0);
  });
});

describe("formatEmissions", () => {
  it("formats values below 1000 as kg", () => {
    expect(formatEmissions(500)).toBe("500.0 kg CO₂e");
  });

  it("formats values above 1000 as tonnes", () => {
    expect(formatEmissions(2500)).toBe("2.50 t CO₂e");
  });

  it("formats exactly 1000 as tonnes", () => {
    expect(formatEmissions(1000)).toBe("1.00 t CO₂e");
  });

  it("handles zero", () => {
    expect(formatEmissions(0)).toBe("0.0 kg CO₂e");
  });

  it("handles decimal kg values", () => {
    expect(formatEmissions(1.5)).toBe("1.5 kg CO₂e");
  });
});

describe("vsParisTarget", () => {
  it("correctly identifies over-target emissions", () => {
    const result = vsParisTarget(500);
    expect(result.onTrack).toBe(false);
    expect(result.overBy).toBeGreaterThan(0);
  });

  it("correctly identifies on-target emissions", () => {
    const result = vsParisTarget(100);
    expect(result.onTrack).toBe(true);
    expect(result.overBy).toBeLessThan(0);
  });

  it("correctly identifies exact target emissions", () => {
    const result = vsParisTarget(GLOBAL_AVERAGES.paris_target);
    expect(result.onTrack).toBe(true);
    expect(result.overBy).toBe(0);
  });

  it("calculates overByPercent correctly", () => {
    const result = vsParisTarget(GLOBAL_AVERAGES.paris_target * 2);
    expect(result.overByPercent).toBeCloseTo(100);
  });
});

describe("treesNeededToOffset", () => {
  it("calculates correct number of trees", () => {
    // At 1.75 kg/month per tree, 175 kg needs 100 trees
    expect(treesNeededToOffset(175)).toBe(100);
  });

  it("rounds up partial trees", () => {
    // 180 / 1.75 = 102.857... → 103
    expect(treesNeededToOffset(180)).toBe(103);
  });

  it("returns 0 for zero emissions", () => {
    expect(treesNeededToOffset(0)).toBe(0);
  });
});

describe("rankEmissionSources", () => {
  it("sorts sources descending by value", () => {
    const ranked = rankEmissionSources(mockSources);
    expect(ranked[0].value).toBeGreaterThanOrEqual(ranked[1].value);
    expect(ranked[1].value).toBeGreaterThanOrEqual(ranked[2].value);
  });

  it("does not mutate the original array", () => {
    const original = [...mockSources];
    rankEmissionSources(mockSources);
    expect(mockSources).toEqual(original);
  });

  it("handles empty array", () => {
    expect(rankEmissionSources([])).toEqual([]);
  });
});

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });

  it("clamps to min", () => {
    expect(clamp(-10, 0, 100)).toBe(0);
  });

  it("clamps to max", () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it("returns min when value equals min", () => {
    expect(clamp(0, 0, 100)).toBe(0);
  });

  it("returns max when value equals max", () => {
    expect(clamp(100, 0, 100)).toBe(100);
  });
});
