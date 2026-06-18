// ============================================================
// CarbonTwin AI - AI Sustainability Coach (orchestration only)
// ============================================================

import type { CarbonStore } from "@/hooks/useCarbonStore";
import { DEMO_COACH_INSIGHTS } from "@/lib/carbon/demoData";
import { CoachInsights } from "./coach/CoachInsights";
import { CoachChat } from "./coach/CoachChat";

interface AICoachProps {
  store: CarbonStore;
}

export function AICoach({ store }: AICoachProps) {
  return (
    <section id="coach" aria-labelledby="coach-heading" className="space-y-6">
      <div>
        <h2 id="coach-heading" className="text-2xl font-bold text-carbon-900">
          AI Sustainability Coach
        </h2>
        <p className="mt-1 text-carbon-500">
          Personalised insights and recommendations based on your carbon profile.
        </p>
      </div>

      <CoachInsights insights={DEMO_COACH_INSIGHTS} />
      <CoachChat
        context={{
          totalEmissions: store.totalEmissions,
          emissionsByCategory: store.emissionsByCategory,
        }}
      />
    </section>
  );
}
