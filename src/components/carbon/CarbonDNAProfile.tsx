// ============================================================
// CarbonTwin AI - Carbon DNA Profile
// ============================================================



import { Card, CardHeader } from "@/components/carbon/Card";
import type { CarbonStore } from "@/hooks/useCarbonStore";
import type { CarbonDNAType } from "@/lib/carbon/types";
import { formatEmissions } from "@/lib/carbon/formatters";
import { GLOBAL_AVERAGES } from "@/lib/carbon/carbonCalculations";

interface CarbonDNAProfileProps {
  store: CarbonStore;
}

const DNA_CONFIG: Record<
  CarbonDNAType,
  {
    label: string;
    emoji: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
    strengths: string[];
    challenges: string[];
  }
> = {
  "transport-heavy": {
    label: "Transport Heavy",
    emoji: "🚗",
    description:
      "Your biggest climate impact comes from how you move. Cars, flights, and travel dominate your footprint — but this is also your biggest opportunity.",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    strengths: ["Likely efficient in home energy", "Conscious about diet choices"],
    challenges: [
      "High transport emissions from car use",
      "Aviation significantly inflates footprint",
    ],
  },
  "energy-intensive": {
    label: "Energy Intensive",
    emoji: "⚡",
    description:
      "Your home is your biggest carbon source. Heating, cooling, and electricity use represent the majority of your impact.",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    strengths: ["Lower transport emissions", "Mindful consumption habits"],
    challenges: ["High home energy use", "Gas heating driving emissions"],
  },
  "food-impact": {
    label: "Food Impact",
    emoji: "🥩",
    description:
      "What you eat drives your carbon footprint. Diet choices — especially animal products — are your primary emission source.",
    color: "text-forest-700",
    bgColor: "bg-forest-50",
    borderColor: "border-forest-200",
    strengths: ["Lower energy and transport footprint", "Likely walks or cycles"],
    challenges: ["High-meat diet multiplies food emissions", "Dairy adds to footprint"],
  },
  "sustainability-champion": {
    label: "Sustainability Champion",
    emoji: "🏆",
    description:
      "You are a climate leader. Your footprint is below the Paris Agreement target — your choices are making a real difference.",
    color: "text-forest-700",
    bgColor: "bg-forest-50",
    borderColor: "border-forest-200",
    strengths: [
      "Below Paris target emissions",
      "Balanced low-carbon lifestyle",
      "An inspiration to others",
    ],
    challenges: ["Fine-tune remaining emissions for maximum impact"],
  },
  balanced: {
    label: "Balanced Emitter",
    emoji: "⚖️",
    description:
      "Your emissions are spread across categories without a dominant source. Multiple small wins across all areas will have the biggest impact.",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    strengths: ["No single catastrophic source", "Easy wins across all categories"],
    challenges: ["Multiple areas need attention simultaneously"],
  },
};

export function CarbonDNAProfile({ store }: CarbonDNAProfileProps) {
  const { carbonDNA, totalEmissions, emissionsByCategory } = store;
  const config = DNA_CONFIG[carbonDNA];

  const parisTarget = GLOBAL_AVERAGES.paris_target;
  const vsTarget = ((totalEmissions - parisTarget) / parisTarget) * 100;

  const categories = [
    { label: "Transport", value: emissionsByCategory.transport, color: "#3b82f6" },
    { label: "Energy", value: emissionsByCategory.energy, color: "#f59e0b" },
    { label: "Diet", value: emissionsByCategory.diet, color: "#22c55e" },
    { label: "Consumption", value: emissionsByCategory.consumption, color: "#a855f7" },
  ];

  const maxCategoryValue = Math.max(...categories.map((c) => c.value));

  return (
    <section
      id="profile"
      aria-labelledby="dna-profile-heading"
      className="space-y-6"
    >
      <div>
        <h2
          id="dna-profile-heading"
          className="text-2xl font-bold text-carbon-900"
        >
          Your Carbon DNA Profile
        </h2>
        <p className="mt-1 text-carbon-500">
          A personalised classification of your emission patterns.
        </p>
      </div>

      {/* DNA Card */}
      <Card
        as="article"
        className={`border-2 ${config.borderColor} ${config.bgColor}`}
        aria-labelledby="dna-type-label"
      >
        <div className="flex items-start gap-4">
          <span
            className="text-5xl"
            role="img"
            aria-label={config.label}
          >
            {config.emoji}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-carbon-400">
              Carbon DNA Type
            </p>
            <h3
              id="dna-type-label"
              className={`text-2xl font-bold ${config.color}`}
            >
              {config.label}
            </h3>
            <p className="mt-2 text-carbon-700">{config.description}</p>
          </div>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card as="article">
          <p className="text-sm text-carbon-500">Your monthly total</p>
          <p className="mt-1 text-2xl font-bold text-carbon-900">
            {formatEmissions(totalEmissions)}
          </p>
        </Card>
        <Card as="article">
          <p className="text-sm text-carbon-500">Paris Agreement target</p>
          <p className="mt-1 text-2xl font-bold text-forest-600">
            {formatEmissions(parisTarget)}
          </p>
          <p className="mt-0.5 text-xs text-carbon-400">2.5 t CO₂e / year</p>
        </Card>
        <Card as="article">
          <p className="text-sm text-carbon-500">Your gap from target</p>
          <p
            className={`mt-1 text-2xl font-bold ${vsTarget > 0 ? "text-red-500" : "text-forest-600"}`}
          >
            {vsTarget > 0 ? "+" : ""}
            {vsTarget.toFixed(0)}%
          </p>
          <p className="mt-0.5 text-xs text-carbon-400">
            {vsTarget > 0 ? "above" : "below"} the 1.5°C pathway
          </p>
        </Card>
      </div>

      {/* Category DNA radar (bar representation) */}
      <Card
        as="article"
        aria-labelledby="dna-radar-heading"
      >
        <CardHeader
          id="dna-radar-heading"
          title="Emission DNA Radar"
          subtitle="How each category contributes to your profile"
        />
        <div
          className="space-y-4"
          role="list"
          aria-label="Emission contributions by category"
        >
          {categories.map((cat) => {
            const pct = maxCategoryValue > 0 ? (cat.value / maxCategoryValue) * 100 : 0;
            const totalPct = totalEmissions > 0 ? (cat.value / totalEmissions) * 100 : 0;
            return (
              <div
                key={cat.label}
                role="listitem"
              >
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-carbon-800">{cat.label}</span>
                  <span className="text-carbon-500">
                    {cat.value} kg ({totalPct.toFixed(0)}%)
                  </span>
                </div>
                <div
                  className="h-3 overflow-hidden rounded-full bg-carbon-100"
                  role="progressbar"
                  aria-valuenow={totalPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${cat.label}: ${cat.value} kg CO₂e, ${totalPct.toFixed(0)}% of total`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Strengths and challenges */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          as="article"
          aria-labelledby="strengths-heading"
        >
          <CardHeader
            id="strengths-heading"
            title="✓ Your Strengths"
          />
          <ul
            className="space-y-2"
            role="list"
          >
            {config.strengths.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-carbon-700"
              >
                <span
                  className="mt-0.5 text-forest-500"
                  aria-hidden="true"
                >
                  ✓
                </span>
                {s}
              </li>
            ))}
          </ul>
        </Card>

        <Card
          as="article"
          aria-labelledby="challenges-heading"
        >
          <CardHeader
            id="challenges-heading"
            title="⚡ Key Challenges"
          />
          <ul
            className="space-y-2"
            role="list"
          >
            {config.challenges.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-carbon-700"
              >
                <span
                  className="mt-0.5 text-red-400"
                  aria-hidden="true"
                >
                  ▲
                </span>
                {c}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* All DNA types reference */}
      <Card
        as="article"
        aria-labelledby="dna-types-heading"
      >
        <CardHeader
          id="dna-types-heading"
          title="Carbon DNA Types"
          subtitle="Where do other users fit?"
        />
        <ul
          className="grid gap-3 sm:grid-cols-2"
          role="list"
        >
          {(Object.entries(DNA_CONFIG) as [CarbonDNAType, (typeof DNA_CONFIG)[CarbonDNAType]][]).map(
            ([type, cfg]) => (
              <li
                key={type}
                className={`flex items-center gap-3 rounded-xl border p-3 ${
                  type === carbonDNA ? cfg.borderColor + " " + cfg.bgColor : "border-carbon-100"
                }`}
                aria-current={type === carbonDNA ? "true" : undefined}
              >
                <span
                  className="text-2xl"
                  aria-hidden="true"
                >
                  {cfg.emoji}
                </span>
                <div>
                  <p className={`text-sm font-semibold ${type === carbonDNA ? cfg.color : "text-carbon-700"}`}>
                    {cfg.label}
                    {type === carbonDNA && (
                      <span className="ml-1 text-xs font-normal">(you)</span>
                    )}
                  </p>
                </div>
              </li>
            ),
          )}
        </ul>
      </Card>
    </section>
  );
}
