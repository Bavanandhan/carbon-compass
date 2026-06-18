// ============================================================
// CarbonTwin AI - DNA Category Contributions (radar bars)
// ============================================================

import { Card, CardHeader } from "@/components/carbon/Card";
import type { EmissionCategory } from "@/lib/carbon/types";

interface CategoryRow {
  readonly label: string;
  readonly value: number;
  readonly color: string;
}

const CATEGORY_PALETTE: Readonly<Record<EmissionCategory, { label: string; color: string }>> = {
  transport: { label: "Transport", color: "#3b82f6" },
  energy: { label: "Energy", color: "#f59e0b" },
  diet: { label: "Diet", color: "#22c55e" },
  consumption: { label: "Consumption", color: "#a855f7" },
};

interface DNAContributionsProps {
  readonly totalEmissions: number;
  readonly emissionsByCategory: Readonly<Record<EmissionCategory, number>>;
}

export function DNAContributions({ totalEmissions, emissionsByCategory }: DNAContributionsProps) {
  const rows: ReadonlyArray<CategoryRow> = (
    Object.keys(CATEGORY_PALETTE) as EmissionCategory[]
  ).map((key) => ({
    label: CATEGORY_PALETTE[key].label,
    color: CATEGORY_PALETTE[key].color,
    value: emissionsByCategory[key],
  }));

  const maxValue = Math.max(...rows.map((r) => r.value));

  return (
    <Card as="article" aria-labelledby="dna-radar-heading">
      <CardHeader
        id="dna-radar-heading"
        title="Emission DNA Radar"
        subtitle="How each category contributes to your profile"
      />
      <div className="space-y-4" role="list" aria-label="Emission contributions by category">
        {rows.map((row) => (
          <ContributionBar
            key={row.label}
            row={row}
            maxValue={maxValue}
            totalEmissions={totalEmissions}
          />
        ))}
      </div>
    </Card>
  );
}

interface ContributionBarProps {
  readonly row: CategoryRow;
  readonly maxValue: number;
  readonly totalEmissions: number;
}

function ContributionBar({ row, maxValue, totalEmissions }: ContributionBarProps) {
  const widthPct = maxValue > 0 ? (row.value / maxValue) * 100 : 0;
  const sharePct = totalEmissions > 0 ? (row.value / totalEmissions) * 100 : 0;

  return (
    <div role="listitem">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-carbon-800">{row.label}</span>
        <span className="text-carbon-500">
          {row.value} kg ({sharePct.toFixed(0)}%)
        </span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-carbon-100"
        role="progressbar"
        aria-valuenow={sharePct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${row.label}: ${row.value} kg CO₂e, ${sharePct.toFixed(0)}% of total`}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${widthPct}%`, backgroundColor: row.color }}
        />
      </div>
    </div>
  );
}
