// ============================================================
// CarbonTwin AI - Coach Response Strategies
// ============================================================

import { GLOBAL_AVERAGES, KG_CO2_PER_TREE_MONTH } from "@/lib/carbon/carbonCalculations";
import type { EmissionCategory } from "@/lib/carbon/types";
import type { CoachContext, CoachIntent, CoachResponseBuilder } from "./coachTypes";

// --- Helpers ------------------------------------------------------------

function pct(part: number, whole: number): number {
  return whole === 0 ? 0 : Math.round((part / whole) * 100);
}

function topCategory(
  ctx: CoachContext,
): readonly [EmissionCategory, number] {
  const entries = Object.entries(ctx.emissionsByCategory) as Array<
    [EmissionCategory, number]
  >;
  return entries.sort(([, a], [, b]) => b - a)[0];
}

// --- Strategies ---------------------------------------------------------

const biggestSource: CoachResponseBuilder = (ctx) => {
  const [cat, value] = topCategory(ctx);
  return `Your biggest emission source is **${cat}** at ${value} kg CO₂e/month (${pct(value, ctx.totalEmissions)}% of your total). This is where you should focus your efforts first for the highest impact.`;
};

const transport: CoachResponseBuilder = (ctx) =>
  `Your transport emissions are ${ctx.emissionsByCategory.transport} kg CO₂e/month. Top ways to cut this: (1) Switch to an EV or hybrid — saves up to 75% on car emissions. (2) Replace short flights with trains — rail emits 90% less. (3) Cycle or walk for trips under 5 km — zero emissions and good for health.`;

const diet: CoachResponseBuilder = (ctx) =>
  `Your diet accounts for ${ctx.emissionsByCategory.diet} kg CO₂e/month. The single biggest change: reduce beef and lamb consumption. Switching from a meat-heavy diet to a flexitarian diet can cut food emissions by 40-50%. Even replacing one meat meal per day with plant-based makes a significant difference.`;

const comparison: CoachResponseBuilder = (ctx) => {
  const ukAvg = GLOBAL_AVERAGES.uk;
  const diff = ctx.totalEmissions - ukAvg;
  if (diff > 0) {
    return `You emit ${ctx.totalEmissions} kg CO₂e/month, which is ${diff} kg (${pct(diff, ukAvg)}%) above the UK average of ${ukAvg} kg. Focus on your top emission category to bring this below average.`;
  }
  return `Great news — you emit ${ctx.totalEmissions} kg CO₂e/month, which is ${Math.abs(diff)} kg below the UK average of ${ukAvg} kg. Keep it up and push towards the Paris target of ${GLOBAL_AVERAGES.paris_target} kg/month.`;
};

const parisTarget: CoachResponseBuilder = (ctx) => {
  const target = GLOBAL_AVERAGES.paris_target;
  const gap = ctx.totalEmissions - target;
  const status =
    gap > 0 ? `${gap} kg (${pct(gap, target)}%) over target` : "on track! Well done";
  return `The Paris Agreement's 1.5°C pathway requires global per-capita emissions of about 2.5 tonnes/year — that's ${target} kg CO₂e per month. You currently emit ${ctx.totalEmissions} kg/month, which is ${status}. The biggest reductions come from switching to EVs, heat pumps, and plant-rich diets.`;
};

const treesOffset: CoachResponseBuilder = (ctx) => {
  const trees = Math.ceil(ctx.totalEmissions / KG_CO2_PER_TREE_MONTH);
  return `To offset your current footprint of ${ctx.totalEmissions} kg CO₂e/month, you'd need approximately ${trees} mature trees actively growing (each absorbs ~${KG_CO2_PER_TREE_MONTH} kg CO₂/month). However, tree planting is not a substitute for reducing emissions — it's a supplement. Focus on reducing first, then offset what remains.`;
};

const energy: CoachResponseBuilder = (ctx) =>
  `Your energy emissions are ${ctx.emissionsByCategory.energy} kg CO₂e/month. Key actions: (1) Switch to a renewable energy tariff — immediate 100% reduction in electricity emissions. (2) Lower your thermostat by 1°C — saves ~10% on heating. (3) Consider a heat pump if you have gas heating — 3x more efficient.`;

const consumption: CoachResponseBuilder = (ctx) =>
  `Your consumption footprint is ${ctx.emissionsByCategory.consumption} kg CO₂e/month. Tips: (1) Buy less, buy second-hand — eliminating manufacturing is the best saving. (2) Choose quality over quantity — longer-lasting products reduce replacement. (3) Repair before replacing electronics — manufacturing a new phone emits ~70 kg CO₂e.`;

const fallback: CoachResponseBuilder = (ctx) => {
  const [cat] = topCategory(ctx);
  return `Based on your profile, your total monthly footprint is ${ctx.totalEmissions} kg CO₂e. Your top priority should be reducing ${cat} emissions, as this is your largest source. Would you like specific advice on any particular category?`;
};

/** Intent → builder strategy table. */
export const COACH_RESPONSES: Readonly<Record<CoachIntent, CoachResponseBuilder>> = {
  "biggest-source": biggestSource,
  transport,
  diet,
  comparison,
  "paris-target": parisTarget,
  "trees-offset": treesOffset,
  energy,
  consumption,
  fallback,
};
