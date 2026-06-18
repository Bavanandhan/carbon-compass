// ============================================================
// CarbonTwin AI - DNA Stats Grid (target comparison)
// ============================================================

import { Card } from "@/components/carbon/Card";
import { formatEmissions } from "@/lib/carbon/formatters";
import { GLOBAL_AVERAGES } from "@/lib/carbon/carbonCalculations";

interface DNAStatsProps {
  readonly totalEmissions: number;
}

export function DNAStats({ totalEmissions }: DNAStatsProps) {
  const parisTarget = GLOBAL_AVERAGES.paris_target;
  const vsTarget = ((totalEmissions - parisTarget) / parisTarget) * 100;
  const overTarget = vsTarget > 0;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card as="article">
        <p className="text-sm text-carbon-500">Your monthly total</p>
        <p className="mt-1 text-2xl font-bold text-carbon-900">
          {formatEmissions(totalEmissions)}
        </p>
      </Card>
      <Card as="article">
        <p className="text-sm text-carbon-500">Paris Agreement target</p>
        <p className="mt-1 text-2xl font-bold text-forest-600">
          {formatEmissions(parisTarget)}
        </p>
        <p className="mt-0.5 text-xs text-carbon-400">2.5 t CO₂e / year</p>
      </Card>
      <Card as="article">
        <p className="text-sm text-carbon-500">Your gap from target</p>
        <p
          className={`mt-1 text-2xl font-bold ${overTarget ? "text-red-500" : "text-forest-600"}`}
        >
          {overTarget ? "+" : ""}
          {vsTarget.toFixed(0)}%
        </p>
        <p className="mt-0.5 text-xs text-carbon-400">
          {overTarget ? "above" : "below"} the 1.5°C pathway
        </p>
      </Card>
    </div>
  );
}
