// ============================================================
// CarbonTwin AI - Carbon Budget Component
// ============================================================

import { useMemo, useState } from "react";
import { Card, CardHeader, StatCard } from "@/components/carbon/Card";
import type { CarbonStore } from "@/hooks/useCarbonStore";
import {
  buildBudgetReport,
  budgetAlert,
  DEFAULT_MONTHLY_BUDGET_KG,
} from "@/lib/carbon/budget";
import { formatEmissions } from "@/lib/carbon/formatters";
import { GLOBAL_AVERAGES } from "@/lib/carbon/carbonCalculations";

interface CarbonBudgetProps {
  store: CarbonStore;
}

export function CarbonBudget({ store }: CarbonBudgetProps) {
  const [budget, setBudget] = useState<number>(DEFAULT_MONTHLY_BUDGET_KG);
  const used = store.totalEmissions;

  const report = useMemo(() => buildBudgetReport(used, budget), [used, budget]);
  const alert = budgetAlert(report);

  const statusColor: Record<typeof report.status, "green" | "amber" | "red"> = {
    under: "green",
    approaching: "amber",
    over: "red",
    critical: "red",
  };

  const usedClamped = Math.min(report.usedPercent, 100);
  const overflow = Math.max(report.usedPercent - 100, 0);

  return (
    <section aria-labelledby="budget-heading" className="space-y-6">
      <div>
        <h1
          id="budget-heading"
          className="text-2xl font-bold text-carbon-900"
        >
          Your Carbon Budget
        </h1>
        <p className="mt-1 text-carbon-500">
          Track emissions the way you track money — set a monthly limit and stay
          under it.
        </p>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={
          "rounded-2xl border p-4 text-sm font-medium " +
          (report.status === "under"
            ? "border-forest-200 bg-forest-50 text-forest-800"
            : report.status === "approaching"
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-red-200 bg-red-50 text-red-800")
        }
      >
        {alert}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Monthly Budget"
          value={formatEmissions(report.budget)}
          sub="Paris-aligned default"
          color="default"
          icon="🎯"
        />
        <StatCard
          label="Used so far"
          value={formatEmissions(report.used)}
          sub={`${report.usedPercent.toFixed(0)}% of budget`}
          color={statusColor[report.status]}
          icon="📊"
        />
        <StatCard
          label="Remaining"
          value={formatEmissions(Math.max(report.remaining, 0))}
          sub={`${report.daysInMonth - report.daysIntoMonth} days left`}
          color={report.remaining < 0 ? "red" : "green"}
          icon="💰"
        />
        <StatCard
          label="Projected total"
          value={formatEmissions(report.projectedMonthlyTotal)}
          sub={
            report.paceVsLinear > 0
              ? `+${report.paceVsLinear.toFixed(0)}% over pace`
              : `${report.paceVsLinear.toFixed(0)}% under pace`
          }
          color={
            report.projectedMonthlyTotal > report.budget ? "red" : "green"
          }
          icon="📈"
        />
      </div>

      <Card as="article" aria-labelledby="budget-bar-heading">
        <CardHeader
          id="budget-bar-heading"
          title="Budget utilisation"
          subtitle="How much of your monthly carbon budget you've consumed"
        />
        <div
          role="progressbar"
          aria-valuenow={Math.round(report.usedPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Budget used"
          className="relative h-6 overflow-hidden rounded-full bg-carbon-100"
        >
          <div
            className={
              "h-full transition-all duration-500 " +
              (report.status === "under"
                ? "bg-forest-500"
                : report.status === "approaching"
                  ? "bg-amber-500"
                  : "bg-red-500")
            }
            style={{ width: `${usedClamped}%` }}
          />
          {overflow > 0 && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-xs font-semibold text-red-700">
              +{overflow.toFixed(0)}%
            </div>
          )}
        </div>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between">
            <dt className="text-carbon-500">Paris Agreement target</dt>
            <dd className="font-medium text-carbon-900">
              {formatEmissions(GLOBAL_AVERAGES.paris_target)}/mo
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-carbon-500">UK average</dt>
            <dd className="font-medium text-carbon-900">
              {formatEmissions(GLOBAL_AVERAGES.uk)}/mo
            </dd>
          </div>
        </dl>
      </Card>

      <Card as="article" aria-labelledby="budget-edit-heading">
        <CardHeader
          id="budget-edit-heading"
          title="Adjust your monthly budget"
          subtitle="Set a personal target in kg CO₂e per month"
        />
        <label
          htmlFor="budget-input"
          className="block text-sm font-medium text-carbon-700"
        >
          Monthly budget (kg CO₂e)
        </label>
        <input
          id="budget-input"
          type="number"
          min={1}
          max={5000}
          step={10}
          value={budget}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (Number.isFinite(next) && next > 0) setBudget(next);
          }}
          className="mt-1 w-full max-w-xs rounded-lg border border-carbon-200 px-3 py-2 text-base focus:border-forest-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
        />
      </Card>
    </section>
  );
}
