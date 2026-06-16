// ============================================================
// CarbonTwin AI - AI Sustainability Coach
// ============================================================



import { useState, useCallback } from "react";
import { Card, CardHeader } from "@/components/carbon/Card";
import type { CarbonStore } from "@/hooks/useCarbonStore";
import type { CoachInsight } from "@/lib/carbon/types";
import { DEMO_COACH_INSIGHTS } from "@/lib/carbon/demoData";
import { clsx } from "clsx";

interface AICoachProps {
  store: CarbonStore;
}

const INSIGHT_TYPE_CONFIG = {
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

const SUGGESTED_QUESTIONS = [
  "What is my biggest source of emissions?",
  "How can I reduce my transport footprint?",
  "What diet changes would have the most impact?",
  "How do I compare to the UK average?",
  "What is the Paris Agreement target?",
  "How many trees would offset my footprint?",
];

// Simple rule-based AI coach response generator
function generateCoachResponse(question: string, store: CarbonStore): string {
  const q = question.toLowerCase();
  const { totalEmissions, emissionsByCategory } = store;

  if (q.includes("biggest source") || q.includes("largest")) {
    const entries = Object.entries(emissionsByCategory) as [
      keyof typeof emissionsByCategory,
      number,
    ][];
    const [topCat, topVal] = entries.sort(([, a], [, b]) => b - a)[0];
    return `Your biggest emission source is **${topCat}** at ${topVal} kg CO₂e/month (${Math.round((topVal / totalEmissions) * 100)}% of your total). This is where you should focus your efforts first for the highest impact.`;
  }

  if (q.includes("transport")) {
    return `Your transport emissions are ${emissionsByCategory.transport} kg CO₂e/month. Top ways to cut this: (1) Switch to an EV or hybrid — saves up to 75% on car emissions. (2) Replace short flights with trains — rail emits 90% less. (3) Cycle or walk for trips under 5 km — zero emissions and good for health.`;
  }

  if (q.includes("diet") || q.includes("food") || q.includes("eat")) {
    return `Your diet accounts for ${emissionsByCategory.diet} kg CO₂e/month. The single biggest change: reduce beef and lamb consumption. Switching from a meat-heavy diet to a flexitarian diet can cut food emissions by 40-50%. Even replacing one meat meal per day with plant-based makes a significant difference.`;
  }

  if (q.includes("compare") || q.includes("average") || q.includes("uk")) {
    const ukAvg = 625;
    const diff = totalEmissions - ukAvg;
    if (diff > 0) {
      return `You emit ${totalEmissions} kg CO₂e/month, which is ${diff} kg (${Math.round((diff / ukAvg) * 100)}%) above the UK average of ${ukAvg} kg. Focus on your top emission category to bring this below average.`;
    }
    return `Great news — you emit ${totalEmissions} kg CO₂e/month, which is ${Math.abs(diff)} kg below the UK average of ${ukAvg} kg. Keep it up and push towards the Paris target of 208 kg/month.`;
  }

  if (q.includes("paris") || q.includes("target") || q.includes("goal")) {
    const target = 208;
    const gap = totalEmissions - target;
    return `The Paris Agreement's 1.5°C pathway requires global per-capita emissions of about 2.5 tonnes/year — that's 208 kg CO₂e per month. You currently emit ${totalEmissions} kg/month, which is ${gap > 0 ? `${gap} kg (${Math.round((gap / target) * 100)}%) over target` : "on track! Well done"}. The biggest reductions come from switching to EVs, heat pumps, and plant-rich diets.`;
  }

  if (q.includes("tree") || q.includes("offset") || q.includes("forest")) {
    const trees = Math.ceil(totalEmissions / 1.75);
    return `To offset your current footprint of ${totalEmissions} kg CO₂e/month, you'd need approximately ${trees} mature trees actively growing (each absorbs ~1.75 kg CO₂/month). However, tree planting is not a substitute for reducing emissions — it's a supplement. Focus on reducing first, then offset what remains.`;
  }

  if (q.includes("energy") || q.includes("home") || q.includes("electricity") || q.includes("heating")) {
    return `Your energy emissions are ${emissionsByCategory.energy} kg CO₂e/month. Key actions: (1) Switch to a renewable energy tariff — immediate 100% reduction in electricity emissions. (2) Lower your thermostat by 1°C — saves ~10% on heating. (3) Consider a heat pump if you have gas heating — 3x more efficient.`;
  }

  if (q.includes("consumption") || q.includes("shopping") || q.includes("buy")) {
    return `Your consumption footprint is ${emissionsByCategory.consumption} kg CO₂e/month. Tips: (1) Buy less, buy second-hand — eliminating manufacturing is the best saving. (2) Choose quality over quantity — longer-lasting products reduce replacement. (3) Repair before replacing electronics — manufacturing a new phone emits ~70 kg CO₂e.`;
  }

  // Default response
  return `Based on your profile, your total monthly footprint is ${totalEmissions} kg CO₂e. Your top priority should be reducing ${Object.entries(emissionsByCategory).sort(([, a], [, b]) => b - a)[0][0]} emissions, as this is your largest source. Would you like specific advice on any particular category?`;
}

export function AICoach({ store }: AICoachProps) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    {
      role: "assistant",
      text: `Hello! I'm your AI Sustainability Coach. I've analysed your carbon profile and I'm here to give you personalised advice. Ask me anything about your footprint, or tap one of the suggested questions below.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim()) return;

      const userMessage = { role: "user" as const, text: question };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      // Simulate AI thinking delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const response = generateCoachResponse(question, store);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
      setIsTyping(false);
    },
    [store],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const sortedInsights = [...DEMO_COACH_INSIGHTS].sort((a, b) => b.priority - a.priority);

  return (
    <section
      id="coach"
      aria-labelledby="coach-heading"
      className="space-y-6"
    >
      <div>
        <h2
          id="coach-heading"
          className="text-2xl font-bold text-carbon-900"
        >
          AI Sustainability Coach
        </h2>
        <p className="mt-1 text-carbon-500">
          Personalised insights and recommendations based on your carbon profile.
        </p>
      </div>

      {/* Coach Insights */}
      <Card
        as="article"
        aria-labelledby="insights-heading"
      >
        <CardHeader
          id="insights-heading"
          title="📊 Personalised Insights"
          subtitle="Analysis based on your emission patterns"
        />
        <ul
          className="space-y-3"
          role="list"
          aria-label="AI-generated carbon insights"
        >
          {sortedInsights.map((insight) => {
            const cfg = INSIGHT_TYPE_CONFIG[insight.type];
            return (
              <li
                key={insight.id}
                className={clsx(
                  "rounded-xl border p-4",
                  cfg.bg,
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 text-lg"
                    aria-hidden="true"
                  >
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

      {/* Chat interface */}
      <Card
        as="article"
        aria-labelledby="chat-heading"
      >
        <CardHeader
          id="chat-heading"
          title="🤖 Ask Your Coach"
          subtitle="Get personalised advice about your carbon footprint"
        />

        {/* Message thread */}
        <div
          className="mb-4 max-h-80 space-y-3 overflow-y-auto rounded-xl bg-carbon-50 p-4"
          role="log"
          aria-label="Coach conversation"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={clsx(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={clsx(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                  msg.role === "user"
                    ? "bg-forest-600 text-white"
                    : "bg-white text-carbon-800 shadow-sm",
                )}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div
              className="flex justify-start"
              aria-label="Coach is typing"
            >
              <div className="rounded-2xl bg-white px-4 py-2.5 shadow-sm">
                <span className="inline-flex gap-1">
                  <span className="animate-bounce text-carbon-400 delay-0">●</span>
                  <span
                    className="animate-bounce text-carbon-400"
                    style={{ animationDelay: "0.1s" }}
                  >
                    ●
                  </span>
                  <span
                    className="animate-bounce text-carbon-400"
                    style={{ animationDelay: "0.2s" }}
                  >
                    ●
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested questions */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-carbon-400">
            Suggested questions
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="Suggested questions for the coach"
          >
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                className="rounded-full border border-carbon-200 bg-white px-3 py-1.5 text-xs text-carbon-600 transition-colors hover:border-forest-300 hover:text-forest-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
                role="listitem"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label="Ask the AI coach a question"
        >
          <div className="flex gap-2">
            <label
              htmlFor="coach-input"
              className="sr-only"
            >
              Ask a question about your carbon footprint
            </label>
            <input
              id="coach-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your carbon footprint..."
              maxLength={200}
              className="min-w-0 flex-1 rounded-xl border border-carbon-200 bg-carbon-50 px-4 py-2.5 text-sm text-carbon-900 placeholder-carbon-400 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200"
              aria-required="true"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="rounded-xl bg-forest-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message to coach"
            >
              Ask
            </button>
          </div>
        </form>
      </Card>
    </section>
  );
}
