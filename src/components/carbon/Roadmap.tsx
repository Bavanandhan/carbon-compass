// ============================================================
// CarbonTwin AI - Roadmap Component
// ============================================================

import { useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/carbon/Card";
import type { CarbonStore } from "@/hooks/useCarbonStore";
import {
  generateRoadmap,
  roadmapProgress,
  type RoadmapHorizon,
} from "@/lib/carbon/roadmap";
import {
  CATEGORY_CHART_COLORS,
  formatEmissions,
} from "@/lib/carbon/formatters";

interface RoadmapProps {
  store: CarbonStore;
}

const HORIZONS: ReadonlyArray<{ id: RoadmapHorizon; label: string }> = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "1y", label: "1 year" },
];

export function Roadmap({ store }: RoadmapProps) {
  const [horizon, setHorizon] = useState<RoadmapHorizon>("30d");
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const roadmap = useMemo(
    () => generateRoadmap(store.actions, horizon, completed),
    [store.actions, horizon, completed],
  );

  const progress = roadmapProgress(roadmap);

  const toggleStep = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      aria-labelledby="roadmap-heading"
      className="space-y-6"
    >
      <div>
        <h1
          id="roadmap-heading"
          className="text-2xl font-bold text-carbon-900"
        >
          Your Carbon Reduction Roadmap
        </h1>
        <p className="mt-1 text-carbon-500">
          A personalised week-by-week plan to cut emissions, projected to save{" "}
          <strong>{formatEmissions(roadmap.totalAnnualReduction)}</strong> per year.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Roadmap horizon"
        className="flex flex-wrap gap-2"
      >
        {HORIZONS.map((h) => (
          <button
            key={h.id}
            type="button"
            role="tab"
            aria-selected={horizon === h.id}
            onClick={() => setHorizon(h.id)}
            className={
              "rounded-full border px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 " +
              (horizon === h.id
                ? "border-forest-600 bg-forest-600 text-white"
                : "border-carbon-200 bg-white text-carbon-700 hover:bg-carbon-50")
            }
          >
            {h.label}
          </button>
        ))}
      </div>

      <Card as="article" aria-labelledby="roadmap-progress-heading">
        <CardHeader
          id="roadmap-progress-heading"
          title="Plan progress"
          subtitle={`${progress}% complete · ${roadmap.steps.length} weekly steps`}
        />
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Roadmap completion"
          className="h-3 overflow-hidden rounded-full bg-carbon-100"
        >
          <div
            className="h-full rounded-full bg-forest-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      <ol
        className="space-y-3"
        aria-label="Roadmap steps"
      >
        {roadmap.steps.map((step) => (
          <li key={step.id}>
            <Card as="article" className="!p-4">
              <div className="flex items-start gap-4">
                <input
                  id={`step-${step.id}`}
                  type="checkbox"
                  checked={step.completed}
                  onChange={() => toggleStep(step.id)}
                  className="mt-1 h-5 w-5 cursor-pointer rounded border-carbon-300 text-forest-600 focus:ring-forest-500"
                  aria-describedby={`step-${step.id}-desc`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-carbon-400">
                      Week {step.week}
                    </span>
                    <label
                      htmlFor={`step-${step.id}`}
                      className={
                        "text-base font-semibold " +
                        (step.completed
                          ? "text-carbon-400 line-through"
                          : "text-carbon-900")
                      }
                    >
                      {step.title}
                    </label>
                  </div>
                  <p
                    id={`step-${step.id}-desc`}
                    className="mt-1 text-sm text-carbon-600"
                  >
                    {step.description}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className="rounded-full px-2 py-0.5 font-semibold text-white"
                      style={{
                        backgroundColor: CATEGORY_CHART_COLORS[step.category],
                      }}
                    >
                      {step.category}
                    </span>
                    <span className="rounded-full bg-carbon-100 px-2 py-0.5 font-medium text-carbon-700">
                      {step.difficulty}
                    </span>
                    <span className="rounded-full bg-forest-50 px-2 py-0.5 font-medium text-forest-700">
                      Saves ~{step.estimatedMonthlyReduction} kg/mo
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  );
}
