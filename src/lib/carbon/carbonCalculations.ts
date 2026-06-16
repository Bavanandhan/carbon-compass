// ============================================================
// CarbonTwin AI - Carbon Calculation Utilities
// ============================================================

import type {
  EmissionCategory,
  EmissionSource,
  MonthlySummary,
  SimulationResult,
  SimulationScenario,
  CarbonDNAType,
  TrendDataPoint,
} from "@/lib/carbon/types";

// --- Emission Factors (kg CO2e per unit) ---

export const EMISSION_FACTORS = {
  // Transport
  car_petrol_km: 0.21, // per km
  car_diesel_km: 0.17, // per km
  car_electric_km: 0.05, // per km
  bus_km: 0.089, // per km
  train_km: 0.041, // per km
  flight_short_km: 0.255, // per km (< 3h)
  flight_long_km: 0.195, // per km (> 3h)

  // Energy
  electricity_kwh: 0.233, // per kWh (UK grid average)
  natural_gas_kwh: 0.202, // per kWh
  heating_oil_l: 2.52, // per litre

  // Diet
  meat_heavy_daily: 7.19, // per day (kg CO2e)
  meat_medium_daily: 5.63,
  vegetarian_daily: 3.81,
  vegan_daily: 2.89,

  // Consumption
  clothing_item: 8.0, // per item purchased
  electronics_small: 70, // per small device
  electronics_large: 300, // per large device
  streaming_hour: 0.036, // per hour
} as const;

// --- Global Averages ---

export const GLOBAL_AVERAGES = {
  world: 500, // kg CO2e per month
  usa: 1417,
  uk: 625,
  eu: 708,
  india: 142,
  paris_target: 208, // 2.5 tonnes/year ÷ 12
} as const;

// --- Tree Equivalence ---
// One mature tree absorbs ~21 kg CO2 per year = 1.75 kg/month

export const KG_CO2_PER_TREE_MONTH = 1.75;

/**
 * Calculate total emissions from sources
 */
export function calculateTotalEmissions(sources: EmissionSource[]): number {
  return sources.reduce((sum, s) => sum + s.value, 0);
}

/**
 * Calculate emissions by category
 */
export function calculateByCategory(
  sources: EmissionSource[],
): Record<EmissionCategory, number> {
  const result: Record<EmissionCategory, number> = {
    transport: 0,
    energy: 0,
    diet: 0,
    consumption: 0,
  };

  for (const source of sources) {
    result[source.category] += source.value;
  }

  return result;
}

/**
 * Simulate scenario impact
 */
export function simulateScenario(scenario: SimulationScenario): SimulationResult {
  const reduction = scenario.currentValue * (scenario.reductionPercent / 100);
  const projectedEmissions = scenario.currentValue - reduction;
  const annualImpact = reduction * 12;
  const treesEquivalent = Math.round(annualImpact / (KG_CO2_PER_TREE_MONTH * 12));

  return {
    scenarioId: scenario.id,
    label: scenario.label,
    currentEmissions: scenario.currentValue,
    projectedEmissions,
    reduction,
    reductionPercent: scenario.reductionPercent,
    annualImpact,
    treesEquivalent,
  };
}

/**
 * Determine Carbon DNA type based on emission breakdown
 */
export function determineCarbonDNA(
  byCategory: Record<EmissionCategory, number>,
): CarbonDNAType {
  const total = Object.values(byCategory).reduce((a, b) => a + b, 0);

  if (total === 0) return "balanced";

  const percentages = {
    transport: byCategory.transport / total,
    energy: byCategory.energy / total,
    diet: byCategory.diet / total,
    consumption: byCategory.consumption / total,
  };

  const max = Math.max(...Object.values(percentages));

  if (max < 0.35) {
    // Check if below Paris target
    return total < GLOBAL_AVERAGES.paris_target
      ? "sustainability-champion"
      : "balanced";
  }

  if (percentages.transport === max) return "transport-heavy";
  if (percentages.energy === max) return "energy-intensive";
  if (percentages.diet === max) return "food-impact";

  return "balanced";
}

/**
 * Calculate percentage change between two values
 */
export function percentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Format kg CO2e for display
 */
export function formatEmissions(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} t`;
  }
  return `${kg.toFixed(1)} kg`;
}

/**
 * Calculate emissions vs Paris Agreement target
 */
export function vsParisTarget(monthlyKg: number): {
  overBy: number;
  overByPercent: number;
  onTrack: boolean;
} {
  const target = GLOBAL_AVERAGES.paris_target;
  const overBy = monthlyKg - target;
  const overByPercent = ((monthlyKg - target) / target) * 100;

  return {
    overBy,
    overByPercent,
    onTrack: monthlyKg <= target,
  };
}

/**
 * Generate trend data from monthly summaries
 */
export function generateTrendData(summaries: MonthlySummary[]): TrendDataPoint[] {
  return summaries.map((s) => ({
    month: s.month,
    transport: s.transport,
    energy: s.energy,
    diet: s.diet,
    consumption: s.consumption,
    total: s.total,
  }));
}

/**
 * Calculate trees needed to offset current emissions
 */
export function treesNeededToOffset(monthlyKg: number): number {
  return Math.ceil(monthlyKg / KG_CO2_PER_TREE_MONTH);
}

/**
 * Rank emission sources by value descending
 */
export function rankEmissionSources(sources: EmissionSource[]): EmissionSource[] {
  return [...sources].sort((a, b) => b.value - a.value);
}

/**
 * Clamp a number to a range
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
