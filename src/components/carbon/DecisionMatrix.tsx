// ============================================================
// CarbonTwin AI - Impact vs Cost Decision Matrix Component
// ============================================================

import { useMemo } from "react";
import { Card, CardHeader } from "@/components/carbon/Card";
import type { CarbonStore } from "@/hooks/useCarbonStore";
import {
  buildDecisionMatrix,
  topRecommendation,
  type Quadrant,
} from "@/lib/carbon/decisionMatrix";
import { CATEGORY_CHART_COLORS } from "@/lib/carbon/formatters";

interface DecisionMatrixProps {
  store: CarbonStore;
}

const QUADRANT_META: Record<
  Quadrant,
  { label: string; tone: string; description: string }
> = {
  "quick-win": {
    label: "Quick wins",
    tone: "bg-forest-50 text-forest-800 border-forest-200",
    description: "High impact, low cost — do these first.",
  },
  strategic: {
    label: "Strategic bets",
    tone: "bg-blue-50 text-blue-800 border-blue-200",
    description: "High impact but costly — plan and budget for these.",
  },
  "fill-in": {
    label: "Fill-ins",
    tone: "bg-amber-50 text-amber-800 border-amber-200",
    description: "Low impact, low cost — easy bonus reductions.",
  },
  thankless: {
    label: "Avoid",
    tone: "bg-carbon-100 text-carbon-700 border-carbon-200",
    description: "Low impact, high cost — deprioritise.",
  },
};

const QUADRANT_ORDER: ReadonlyArray<Quadrant> = [
  "quick-win",
  "strategic",
  "fill-in",
  "thankless",
];

export function DecisionMatrix({ store }: DecisionMatrixProps) {
  const options = useMemo(
    () => buildDecisionMatrix(store.actions),
    [store.actions],
  );
  const top = useMemo(() => topRecommendation(options), [options]);

  return (
    <section aria-labelledby="matrix-heading" className="space-y-6">
      <div>
        <h1
          id="matrix-heading"
          className="text-2xl font-bold text-carbon-900"
        >
          Impact vs Cost Decision Matrix
        </h1>
        <p className="mt-1 text-carbon-500">
          Answers the question: <em>what should I do first?</em>
        </p>
      </div>

      {top && (
        <Card as="article" aria-labelledby="top-rec-heading">
          <CardHeader
            id="top-rec-heading"
            title="Do this first"
            subtitle="Top-priority recommendation based on impact vs cost"
          />
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: CATEGORY_CHART_COLORS[top.category] }}
            >
              {top.category}
            </span>
            <p className="text-lg font-semibold text-carbon-900">{top.title}</p>
            <span className="text-sm text-carbon-500">
              Priority {top.priority}/100 · saves ~{top.monthlyReductionKg} kg
              CO₂e/mo
            </span>
          </div>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {QUADRANT_ORDER.map((q) => {
          const items = options.filter((o) => o.quadrant === q);
          return (
            <Card key={q} as="article" aria-labelledby={`q-${q}-heading`}>
              <div
                className={
                  "mb-3 rounded-xl border px-3 py-2 " + QUADRANT_META[q].tone
                }
              >
                <h2
                  id={`q-${q}-heading`}
                  className="text-sm font-semibold uppercase tracking-wider"
                >
                  {QUADRANT_META[q].label}
                </h2>
                <p className="text-xs">{QUADRANT_META[q].description}</p>
              </div>
              {items.length === 0 ? (
                <p className="text-sm text-carbon-500">
                  No actions in this quadrant.
                </p>
              ) : (
                <ul className="space-y-2" aria-label={QUADRANT_META[q].label}>
                  {items.map((o) => (
                    <li
                      key={o.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-carbon-100 bg-carbon-50/40 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-carbon-900">
                          {o.title}
                        </p>
                        <p className="text-xs text-carbon-500">
                          Impact {o.impactScore} · Cost {o.costScore} ·{" "}
                          {o.cost}
                        </p>
                      </div>
                      <span className="flex-shrink-0 rounded-full bg-white px-2 py-1 text-xs font-semibold text-carbon-700 ring-1 ring-carbon-200">
                        #{options.indexOf(o) + 1}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
