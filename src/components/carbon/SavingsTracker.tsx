// ============================================================
// CarbonTwin AI - Carbon Savings Tracker Component
// ============================================================

import { useMemo } from "react";
import { Card, CardHeader, StatCard } from "@/components/carbon/Card";
import type { CarbonStore } from "@/hooks/useCarbonStore";
import {
  buildSavingsReport,
  calculateStreak,
} from "@/lib/carbon/savings";
import { formatEmissions, formatNumber } from "@/lib/carbon/formatters";

interface SavingsTrackerProps {
  store: CarbonStore;
}

export function SavingsTracker({ store }: SavingsTrackerProps) {
  const report = useMemo(
    () => buildSavingsReport(store.actions),
    [store.actions],
  );
  const streak = useMemo(
    () => calculateStreak(store.entries.map((e) => e.date)),
    [store.entries],
  );

  return (
    <section aria-labelledby="savings-heading" className="space-y-6">
      <div>
        <h1
          id="savings-heading"
          className="text-2xl font-bold text-carbon-900"
        >
          Your Carbon Savings
        </h1>
        <p className="mt-1 text-carbon-500">
          Real-world impact from the actions you've already taken.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="CO₂ saved (monthly)"
          value={formatEmissions(report.co2SavedKg)}
          sub={`~${formatEmissions(report.co2SavedAnnualKg)} per year`}
          color="green"
          icon="🌍"
        />
        <StatCard
          label="Money saved"
          value={`£${formatNumber(report.moneySavedGbp, 0)}`}
          sub="Per year, indicative"
          color="green"
          icon="💷"
        />
        <StatCard
          label="Trees equivalent"
          value={`${report.treesEquivalent} trees`}
          sub="Annual CO₂ absorbed"
          color="green"
          icon="🌳"
        />
        <StatCard
          label="Fuel saved"
          value={`${formatNumber(report.fuelSavedLitres, 0)} L`}
          sub="Petrol equivalent / year"
          color="amber"
          icon="⛽"
        />
      </div>

      <Card as="article" aria-labelledby="streak-heading">
        <CardHeader
          id="streak-heading"
          title="Tracking streak"
          subtitle="Consecutive days of logging emissions"
        />
        <div className="flex items-center gap-4">
          <span className="text-5xl font-bold text-forest-600" aria-hidden="true">
            {streak}
          </span>
          <div>
            <p className="text-sm text-carbon-700">
              {streak === 0
                ? "Log an entry today to start your streak."
                : streak === 1
                  ? "1 day — keep going!"
                  : `${streak} days in a row — habit forming!`}
            </p>
            <p className="text-xs text-carbon-500">
              Streaks reinforce sustainable habits.
            </p>
          </div>
        </div>
      </Card>

      <Card as="article" aria-labelledby="progress-heading">
        <CardHeader
          id="progress-heading"
          title="Action progress"
          subtitle={`${report.completedCount} completed · ${report.inProgressCount} in progress`}
        />
        <p className="text-sm text-carbon-600">
          Each completed action counts at 100%; in-progress actions count at
          50% until finished.
        </p>
      </Card>
    </section>
  );
}
