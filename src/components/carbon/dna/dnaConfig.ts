// ============================================================
// CarbonTwin AI - Carbon DNA Configuration
// ============================================================

import type { CarbonDNAType } from "@/lib/carbon/types";

export interface DNAStyle {
  readonly label: string;
  readonly emoji: string;
  readonly description: string;
  readonly color: string;
  readonly bgColor: string;
  readonly borderColor: string;
  readonly strengths: ReadonlyArray<string>;
  readonly challenges: ReadonlyArray<string>;
}

export const DNA_CONFIG: Readonly<Record<CarbonDNAType, DNAStyle>> = {
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
