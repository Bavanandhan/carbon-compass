// ============================================================
// CarbonTwin AI - Coach Insights Panel
// ============================================================

import { clsx } from "clsx";
import { Card, CardHeader } from "@/components/carbon/Card";
import type { CoachInsight } from "@/lib/carbon/types";

interface InsightTypeStyle {
  readonly icon: string;
  readonly label: string;
  readonly bg: string;
  readonly text: string;
}

const INSIGHT_TYPE_CONFIG: Readonly<Record<CoachInsight["type"], InsightTypeStyle>> = {
  tip: { icon: "💡", label: "Tip", bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  warning: { icon: "⚠️", label: "Alert", bg: "bg-red-50 border-red-200", text: "text-red-700" },
  achievement: {
    icon: "🏆",
    label: "Achievement",
    bg: "bg-forest-50 border-forest-200",
    text: "text-forest-700",
  },
  prediction: {
    icon: "🔮",
    label: "Prediction",
    bg: "bg-purple-50 border-purple-200",
    text: "text-purple-700",
  },
};

interface CoachInsightsProps {
  readonly insights: ReadonlyArray<CoachInsight>;
}

export function CoachInsights({ insights }: CoachInsightsProps) {
  const sorted = [...insights].sort((a, b) => b.priority - a.priority);

  return (
    <Card as="article" aria-labelledby="insights-heading">
      <CardHeader
        id="insights-heading"
        title="📊 Personalised Insights"
        subtitle="Analysis based on your emission patterns"
      />
      <ul className="space-y-3" role="list" aria-label="AI-generated carbon insights">
        {sorted.map((insight) => {
          const cfg = INSIGHT_TYPE_CONFIG[insight.type];
          return (
            <li key={insight.id} className={clsx("rounded-xl border p-4", cfg.bg)}>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 text-lg" aria-hidden="true">
                  {cfg.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={clsx("text-sm font-semibold", cfg.text)}>{insight.title}</p>
                    <span
                      className={clsx(
                        "rounded-full px-1.5 py-0.5 text-xs font-medium",
                        cfg.bg,
                        cfg.text,
                      )}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-carbon-700">{insight.message}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
