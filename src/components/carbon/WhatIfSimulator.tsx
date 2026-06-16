// ============================================================
// CarbonTwin AI - What-If Scenario Simulator
// ============================================================



import { useState, useMemo } from "react";
import { Card, CardHeader } from "@/components/carbon/Card";
import { simulateScenario } from "@/lib/carbon/carbonCalculations";
import { DEMO_SIMULATION_SCENARIOS } from "@/lib/carbon/demoData";
import { formatEmissions } from "@/lib/carbon/formatters";
import type { SimulationScenario, SimulationResult } from "@/lib/carbon/types";
import { clsx } from "clsx";

const CATEGORY_LABELS = {
  transport: "Transport",
  energy: "Energy",
  diet: "Diet",
  consumption: "Consumption",
};

const CATEGORY_ICONS = {
  transport: "🚗",
  energy: "⚡",
  diet: "🥗",
  consumption: "📦",
};

export function WhatIfSimulator() {
  const [activeScenarios, setActiveScenarios] = useState<Set<string>>(new Set());
  const [customPercents, setCustomPercents] = useState<Record<string, number>>(
    Object.fromEntries(
      DEMO_SIMULATION_SCENARIOS.map((s) => [s.id, s.reductionPercent]),
    ),
  );

  const toggleScenario = (id: string) => {
    setActiveScenarios((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const results: SimulationResult[] = useMemo(() => {
    return DEMO_SIMULATION_SCENARIOS.filter((s) => activeScenarios.has(s.id)).map((s) => {
      const modified: SimulationScenario = {
        ...s,
        reductionPercent: customPercents[s.id] ?? s.reductionPercent,
      };
      return simulateScenario(modified);
    });
  }, [activeScenarios, customPercents]);

  const totalReduction = useMemo(
    () => results.reduce((sum, r) => sum + r.reduction, 0),
    [results],
  );

  const totalAnnualSaving = useMemo(
    () => results.reduce((sum, r) => sum + r.annualImpact, 0),
    [results],
  );

  const totalTrees = useMemo(
    () => results.reduce((sum, r) => sum + r.treesEquivalent, 0),
    [results],
  );

  return (
    <section
      id="simulator"
      aria-labelledby="simulator-heading"
      className="space-y-6"
    >
      <div>
        <h2
          id="simulator-heading"
          className="text-2xl font-bold text-carbon-900"
        >
          What-If Simulator
        </h2>
        <p className="mt-1 text-carbon-500">
          Explore how lifestyle changes could reduce your carbon footprint before committing.
        </p>
      </div>

      {/* Scenario selection */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_SIMULATION_SCENARIOS.map((scenario) => {
          const isActive = activeScenarios.has(scenario.id);
          const pct = customPercents[scenario.id] ?? scenario.reductionPercent;

          return (
            <Card
              key={scenario.id}
              as="article"
              className={clsx(
                "cursor-pointer transition-all duration-200",
                isActive
                  ? "ring-2 ring-forest-500 ring-offset-2"
                  : "hover:border-forest-300",
              )}
              aria-label={`${scenario.label} — ${isActive ? "Active" : "Inactive"} scenario`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="text-lg"
                      aria-hidden="true"
                    >
                      {CATEGORY_ICONS[scenario.category]}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wide text-carbon-400">
                      {CATEGORY_LABELS[scenario.category]}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-carbon-900">{scenario.label}</h3>
                  <p className="mt-1 text-xs text-carbon-500">{scenario.description}</p>
                </div>

                {/* Toggle */}
                <button
                  role="switch"
                  aria-checked={isActive}
                  onClick={() => toggleScenario(scenario.id)}
                  className={clsx(
                    "mt-1 flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500",
                    isActive ? "bg-forest-500" : "bg-carbon-200",
                  )}
                  aria-label={`Toggle ${scenario.label}`}
                >
                  <span
                    className={clsx(
                      "h-5 w-5 rounded-full bg-white shadow transition-transform",
                      isActive ? "translate-x-5" : "translate-x-0.5",
                    )}
                  />
                </button>
              </div>

              {/* Custom reduction slider */}
              {isActive && (
                <div className="mt-4 border-t border-carbon-100 pt-4">
                  <label
                    htmlFor={`slider-${scenario.id}`}
                    className="mb-2 block text-xs font-medium text-carbon-600"
                  >
                    Reduction: <strong>{pct}%</strong>
                  </label>
                  <input
                    id={`slider-${scenario.id}`}
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={pct}
                    onChange={(e) =>
                      setCustomPercents((prev) => ({
                        ...prev,
                        [scenario.id]: parseInt(e.target.value),
                      }))
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-carbon-200 accent-forest-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
                    aria-label={`Adjust reduction percentage for ${scenario.label}`}
                  />
                  <div className="mt-1 flex justify-between text-xs text-carbon-400">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>

                  {/* Result preview */}
                  {(() => {
                    const r = simulateScenario({ ...scenario, reductionPercent: pct });
                    return (
                      <div className="mt-3 rounded-lg bg-forest-50 p-3">
                        <p className="text-xs text-carbon-600">
                          Saves{" "}
                          <strong className="text-forest-700">
                            {formatEmissions(r.reduction)}/month
                          </strong>
                          {" · "}
                          <strong className="text-forest-700">{r.treesEquivalent}</strong> trees/yr
                          equivalent
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Combined impact summary */}
      {results.length > 0 && (
        <Card
          as="article"
          aria-labelledby="impact-summary-heading"
          className="border-forest-200 bg-forest-50"
        >
          <CardHeader
            id="impact-summary-heading"
            title="Combined Projection"
            subtitle={`Impact of ${results.length} active scenario${results.length > 1 ? "s" : ""}`}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <div
              className="rounded-xl bg-white p-4 shadow-sm"
              role="img"
              aria-label={`Monthly savings: ${formatEmissions(totalReduction)}`}
            >
              <p className="text-sm text-carbon-500">Monthly savings</p>
              <p className="mt-1 text-2xl font-bold text-forest-600">
                {formatEmissions(totalReduction)}
              </p>
              <p className="mt-0.5 text-xs text-carbon-400">CO₂e per month</p>
            </div>

            <div
              className="rounded-xl bg-white p-4 shadow-sm"
              role="img"
              aria-label={`Annual impact: ${formatEmissions(totalAnnualSaving)}`}
            >
              <p className="text-sm text-carbon-500">Annual impact</p>
              <p className="mt-1 text-2xl font-bold text-forest-600">
                {formatEmissions(totalAnnualSaving)}
              </p>
              <p className="mt-0.5 text-xs text-carbon-400">CO₂e per year</p>
            </div>

            <div
              className="rounded-xl bg-white p-4 shadow-sm"
              role="img"
              aria-label={`Tree equivalent: ${totalTrees} trees per year`}
            >
              <p className="text-sm text-carbon-500">Tree equivalent</p>
              <p className="mt-1 text-2xl font-bold text-forest-600">🌳 {totalTrees}</p>
              <p className="mt-0.5 text-xs text-carbon-400">Trees absorbing your savings</p>
            </div>
          </div>

          {/* Per-scenario breakdown */}
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-semibold text-carbon-700">Scenario breakdown</h3>
            <ul
              className="space-y-2"
              aria-label="Individual scenario results"
            >
              {results.map((r) => (
                <li
                  key={r.scenarioId}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm shadow-sm"
                >
                  <span className="text-carbon-700">{r.label}</span>
                  <span className="font-semibold text-forest-600">
                    −{formatEmissions(r.reduction)}/mo
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {results.length === 0 && (
        <div
          className="rounded-2xl border-2 border-dashed border-carbon-200 p-8 text-center"
          role="status"
          aria-label="No scenarios selected"
        >
          <p className="text-4xl"
            aria-hidden="true">🔮</p>
          <p className="mt-2 text-carbon-600">Toggle scenarios above to see their projected impact</p>
        </div>
      )}
    </section>
  );
}
