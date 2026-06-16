// ============================================================
// CarbonTwin AI - Personalized Action Plan
// ============================================================



import { useState } from "react";
import { Card, CardHeader } from "@/components/carbon/Card";
import type { CarbonStore } from "@/hooks/useCarbonStore";
import type { CarbonAction, ActionImpact, EmissionCategory } from "@/lib/carbon/types";
import { clsx } from "clsx";

interface ActionPlanProps {
  store: CarbonStore;
}

const IMPACT_CONFIG: Record<ActionImpact, { label: string; color: string; bg: string }> = {
  high: { label: "High Impact", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  medium: { label: "Medium Impact", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  low: { label: "Quick Win", color: "text-forest-700", bg: "bg-forest-50 border-forest-200" },
};

const STATUS_CONFIG = {
  pending: { label: "Not started", color: "text-carbon-500", dot: "bg-carbon-300" },
  "in-progress": { label: "In progress", color: "text-amber-600", dot: "bg-amber-400" },
  completed: { label: "Completed ✓", color: "text-forest-600", dot: "bg-forest-500" },
};

const CATEGORY_ICONS: Record<EmissionCategory, string> = {
  transport: "🚗",
  energy: "⚡",
  diet: "🥗",
  consumption: "📦",
};

function ActionCard({
  action,
  onStatusChange,
}: {
  action: CarbonAction;
  onStatusChange: (id: string, status: CarbonAction["status"]) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const impactCfg = IMPACT_CONFIG[action.impact];
  const statusCfg = STATUS_CONFIG[action.status];

  return (
    <article
      className={clsx(
        "overflow-hidden rounded-2xl border bg-white shadow-sm transition-all",
        action.status === "completed" && "opacity-70",
      )}
      aria-labelledby={`action-title-${action.id}`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span
            className="mt-1 flex-shrink-0 text-xl"
            aria-hidden="true"
          >
            {CATEGORY_ICONS[action.category]}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={clsx(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
                  impactCfg.bg,
                  impactCfg.color,
                )}
              >
                {impactCfg.label}
              </span>
              <span className="text-xs text-carbon-400 capitalize">{action.category}</span>
            </div>
            <h3
              id={`action-title-${action.id}`}
              className={clsx(
                "mt-1 text-base font-semibold text-carbon-900",
                action.status === "completed" && "line-through",
              )}
            >
              {action.title}
            </h3>
            <p className="mt-1 text-sm text-carbon-600">{action.description}</p>
          </div>
        </div>

        {/* Savings badge */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-lg bg-forest-50 px-3 py-1 text-sm font-medium text-forest-700">
            Save {action.estimatedReduction} kg CO₂e/month
          </span>
          {/* Status indicator */}
          <span className={clsx("flex items-center gap-1.5 text-xs font-medium", statusCfg.color)}>
            <span
              className={clsx("h-2 w-2 rounded-full", statusCfg.dot)}
              aria-hidden="true"
            />
            {statusCfg.label}
          </span>
        </div>

        {/* Tips expand */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs font-medium text-forest-600 hover:text-forest-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
          aria-expanded={expanded}
          aria-controls={`action-tips-${action.id}`}
        >
          {expanded ? "▲ Hide tips" : "▼ Show tips"}
        </button>

        {expanded && (
          <div
            id={`action-tips-${action.id}`}
            className="mt-3 rounded-xl bg-carbon-50 p-3"
          >
            <p className="mb-2 text-xs font-semibold text-carbon-500 uppercase tracking-wide">
              Tips to get started
            </p>
            <ul
              className="space-y-1"
              role="list"
            >
              {action.tips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-carbon-700"
                >
                  <span
                    className="mt-0.5 text-forest-500"
                    aria-hidden="true"
                  >
                    •
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Status buttons */}
        <div
          className="mt-4 flex flex-wrap gap-2"
          role="group"
          aria-label={`Update status for: ${action.title}`}
        >
          {(["pending", "in-progress", "completed"] as CarbonAction["status"][]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onStatusChange(action.id, status)}
              className={clsx(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500",
                action.status === status
                  ? "bg-carbon-900 text-white"
                  : "bg-carbon-100 text-carbon-600 hover:bg-carbon-200",
              )}
              aria-pressed={action.status === status}
            >
              {STATUS_CONFIG[status].label}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

export function ActionPlan({ store }: ActionPlanProps) {
  const [filter, setFilter] = useState<"all" | ActionImpact>("all");
  const { actions, updateActionStatus, potentialMonthlySavings } = store;

  const filteredActions = actions.filter((a) => filter === "all" || a.impact === filter);
  const completedCount = actions.filter((a) => a.status === "completed").length;
  const completionPct = Math.round((completedCount / actions.length) * 100);

  return (
    <section
      id="actions"
      aria-labelledby="actions-heading"
      className="space-y-6"
    >
      <div>
        <h2
          id="actions-heading"
          className="text-2xl font-bold text-carbon-900"
        >
          Personalised Action Plan
        </h2>
        <p className="mt-1 text-carbon-500">
          Curated actions based on your carbon profile, ranked by impact.
        </p>
      </div>

      {/* Progress summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card as="article">
          <p className="text-sm text-carbon-500">Actions completed</p>
          <p className="mt-1 text-2xl font-bold text-carbon-900">
            {completedCount}/{actions.length}
          </p>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-carbon-100"
            role="progressbar"
            aria-valuenow={completionPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${completionPct}% of actions completed`}
          >
            <div
              className="h-full rounded-full bg-forest-500 transition-all duration-700"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-carbon-400">{completionPct}% complete</p>
        </Card>

        <Card as="article">
          <p className="text-sm text-carbon-500">Potential monthly savings</p>
          <p className="mt-1 text-2xl font-bold text-forest-600">
            {potentialMonthlySavings} kg CO₂e
          </p>
          <p className="mt-0.5 text-xs text-carbon-400">If all high-impact actions taken</p>
        </Card>

        <Card as="article">
          <p className="text-sm text-carbon-500">In progress</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {actions.filter((a) => a.status === "in-progress").length} actions
          </p>
          <p className="mt-0.5 text-xs text-carbon-400">Keep going!</p>
        </Card>
      </div>

      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label="Filter actions by impact level"
        className="flex gap-2 flex-wrap"
      >
        {(["all", "high", "medium", "low"] as const).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500",
              filter === f
                ? "bg-carbon-900 text-white"
                : "bg-carbon-100 text-carbon-600 hover:bg-carbon-200",
            )}
          >
            {f === "all" ? "All actions" : IMPACT_CONFIG[f].label}
            <span className="ml-1.5 text-xs opacity-70">
              ({f === "all" ? actions.length : actions.filter((a) => a.impact === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Action cards */}
      <div
        className="space-y-4"
        role="tabpanel"
        aria-label={`${filter === "all" ? "All" : IMPACT_CONFIG[filter as ActionImpact]?.label} actions`}
      >
        {filteredActions.length === 0 ? (
          <div
            className="rounded-2xl border-2 border-dashed border-carbon-200 p-8 text-center"
            role="status"
          >
            <p className="text-carbon-500">No actions found for this filter.</p>
          </div>
        ) : (
          filteredActions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              onStatusChange={updateActionStatus}
            />
          ))
        )}
      </div>
    </section>
  );
}
