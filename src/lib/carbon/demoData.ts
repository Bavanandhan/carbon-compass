// ============================================================
// CarbonTwin AI - Demo / Seed Data Service
// ============================================================

import type {
  EmissionSource,
  CarbonAction,
  MonthlySummary,
  SimulationScenario,
  CoachInsight,
  UserProfile,
} from "@/lib/carbon/types";

export const DEMO_PROFILE: UserProfile = {
  id: "demo-user",
  name: "Alex Johnson",
  location: "London, UK",
  createdAt: "2024-01-01",
  dnaType: "transport-heavy",
  totalMonthlyEmissions: 687,
};

export const DEMO_EMISSION_SOURCES: EmissionSource[] = [
  // Transport
  {
    id: "t1",
    category: "transport",
    label: "Car (petrol, 500 km/month)",
    value: 105,
    unit: "kg CO₂e",
    icon: "🚗",
  },
  {
    id: "t2",
    category: "transport",
    label: "Short-haul flights (1/month avg)",
    value: 89,
    unit: "kg CO₂e",
    icon: "✈️",
  },
  {
    id: "t3",
    category: "transport",
    label: "Public transport",
    value: 14,
    unit: "kg CO₂e",
    icon: "🚌",
  },

  // Energy
  {
    id: "e1",
    category: "energy",
    label: "Electricity (350 kWh/month)",
    value: 82,
    unit: "kg CO₂e",
    icon: "⚡",
  },
  {
    id: "e2",
    category: "energy",
    label: "Natural gas heating",
    value: 121,
    unit: "kg CO₂e",
    icon: "🔥",
  },

  // Diet
  {
    id: "d1",
    category: "diet",
    label: "Meat consumption (medium)",
    value: 169,
    unit: "kg CO₂e",
    icon: "🥩",
  },
  {
    id: "d2",
    category: "diet",
    label: "Dairy products",
    value: 41,
    unit: "kg CO₂e",
    icon: "🥛",
  },

  // Consumption
  {
    id: "c1",
    category: "consumption",
    label: "Online shopping",
    value: 38,
    unit: "kg CO₂e",
    icon: "📦",
  },
  {
    id: "c2",
    category: "consumption",
    label: "Streaming & devices",
    value: 28,
    unit: "kg CO₂e",
    icon: "📱",
  },
];

export const DEMO_MONTHLY_SUMMARIES: MonthlySummary[] = [
  { month: "2024-01", transport: 220, energy: 230, diet: 195, consumption: 72, total: 717 },
  { month: "2024-02", transport: 198, energy: 215, diet: 210, consumption: 68, total: 691 },
  { month: "2024-03", transport: 245, energy: 180, diet: 205, consumption: 82, total: 712 },
  { month: "2024-04", transport: 180, energy: 155, diet: 200, consumption: 75, total: 610 },
  { month: "2024-05", transport: 210, energy: 140, diet: 195, consumption: 90, total: 635 },
  { month: "2024-06", transport: 195, energy: 130, diet: 210, consumption: 88, total: 623 },
  { month: "2024-07", transport: 230, energy: 125, diet: 215, consumption: 95, total: 665 },
  { month: "2024-08", transport: 220, energy: 120, diet: 210, consumption: 82, total: 632 },
  { month: "2024-09", transport: 205, energy: 140, diet: 205, consumption: 78, total: 628 },
  { month: "2024-10", transport: 215, energy: 170, diet: 200, consumption: 85, total: 670 },
  { month: "2024-11", transport: 208, energy: 195, diet: 210, consumption: 80, total: 693 },
  { month: "2024-12", transport: 208, energy: 203, diet: 210, consumption: 66, total: 687 },
];

export const DEMO_ACTIONS: CarbonAction[] = [
  {
    id: "a1",
    title: "Switch to an electric vehicle",
    description:
      "Replace your petrol car with an EV. With the UK grid, EVs emit ~75% less CO₂ per km.",
    category: "transport",
    impact: "high",
    estimatedReduction: 79,
    status: "pending",
    tips: [
      "Government grants available up to £2,500",
      "Home charger installation is fast and affordable",
      "Calculate total cost of ownership — EVs are cheaper to run",
    ],
  },
  {
    id: "a2",
    title: "Switch to a heat pump",
    description: "Replace gas boiler with an air-source heat pump. 3x more efficient.",
    category: "energy",
    impact: "high",
    estimatedReduction: 97,
    status: "pending",
    tips: [
      "Boiler Upgrade Scheme offers £7,500 grant",
      "Pair with solar panels for maximum savings",
      "Works well in well-insulated homes",
    ],
  },
  {
    id: "a3",
    title: "Reduce meat to 3 days per week",
    description: "Plant-based meals on other days can cut your diet emissions significantly.",
    category: "diet",
    impact: "high",
    estimatedReduction: 67,
    status: "in-progress",
    tips: [
      "Start with Meat-Free Mondays",
      "Explore high-protein plant foods: lentils, chickpeas, tofu",
      "Even one less meat meal per day makes a big difference",
    ],
  },
  {
    id: "a4",
    title: "Install solar panels",
    description: "Rooftop solar can cover 50–70% of typical UK home electricity needs.",
    category: "energy",
    impact: "high",
    estimatedReduction: 41,
    status: "pending",
    tips: [
      "Average payback period: 8–10 years",
      "Smart Export Guarantee pays you for excess energy",
      "Battery storage maximises self-consumption",
    ],
  },
  {
    id: "a5",
    title: "Cycle or walk for short journeys",
    description: "Replace car trips under 5 km with cycling or walking.",
    category: "transport",
    impact: "medium",
    estimatedReduction: 21,
    status: "in-progress",
    tips: [
      "Cycle to Work scheme offers tax savings on bike purchases",
      "E-bikes make hilly routes manageable",
      "Use Google Maps cycling directions",
    ],
  },
  {
    id: "a6",
    title: "Replace one flight with train travel",
    description: "Eurostar from London to Paris emits 90% less CO₂ than flying.",
    category: "transport",
    impact: "medium",
    estimatedReduction: 44,
    status: "pending",
    tips: [
      "Book in advance for better rail prices",
      "Night trains to Europe offer comfortable alternatives",
      "Use Rome2Rio to find train options",
    ],
  },
  {
    id: "a7",
    title: "Switch to a green energy tariff",
    description: "Choose a 100% renewable electricity tariff from your supplier.",
    category: "energy",
    impact: "medium",
    estimatedReduction: 41,
    status: "pending",
    tips: [
      "Compare tariffs on Energy Saving Trust",
      "Look for REGO-backed tariffs for genuine renewables",
      "Consider community energy co-ops",
    ],
  },
  {
    id: "a8",
    title: "Buy second-hand clothing",
    description: "Second-hand shopping eliminates manufacturing emissions for each item.",
    category: "consumption",
    impact: "low",
    estimatedReduction: 15,
    status: "pending",
    tips: ["Explore Vinted, Depop, or local charity shops", "Host a clothes swap with friends"],
  },
];

export const DEMO_SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: "s1",
    label: "Drive electric instead of petrol",
    description: "Replace your current petrol car with an equivalent electric vehicle.",
    category: "transport",
    reductionPercent: 75,
    currentValue: 105,
  },
  {
    id: "s2",
    label: "Go fully plant-based",
    description: "Switch from a medium-meat diet to a fully plant-based diet.",
    category: "diet",
    reductionPercent: 60,
    currentValue: 210,
  },
  {
    id: "s3",
    label: "Switch to renewable electricity",
    description: "Replace grid electricity with 100% renewable energy tariff.",
    category: "energy",
    reductionPercent: 100,
    currentValue: 82,
  },
  {
    id: "s4",
    label: "Replace gas heating with heat pump",
    description: "Swap natural gas boiler for an air-source heat pump.",
    category: "energy",
    reductionPercent: 80,
    currentValue: 121,
  },
  {
    id: "s5",
    label: "Replace all short flights with trains",
    description: "Use rail alternatives for every flight under 5 hours.",
    category: "transport",
    reductionPercent: 90,
    currentValue: 89,
  },
  {
    id: "s6",
    label: "Halve online shopping",
    description: "Buy fewer new items and choose second-hand alternatives.",
    category: "consumption",
    reductionPercent: 50,
    currentValue: 38,
  },
];

export const DEMO_COACH_INSIGHTS: CoachInsight[] = [
  {
    id: "i1",
    type: "warning",
    title: "Transport is your biggest source",
    message:
      "Your transport emissions are 30% above average for London. Switching to an EV or cycling for short journeys could save 100+ kg CO₂e per month.",
    category: "transport",
    priority: 5,
    actionId: "a1",
  },
  {
    id: "i2",
    type: "prediction",
    title: "You're on track to reduce by 8% this year",
    message:
      "Based on your trend over the last 6 months, you're projected to emit 7,840 kg CO₂e this year — 620 kg less than last year. Keep it up!",
    priority: 4,
  },
  {
    id: "i3",
    type: "tip",
    title: "Winter heating spike incoming",
    message:
      "Your energy usage typically jumps 40% in January–February. Consider turning down the thermostat by 1°C to save ~10% on heating emissions.",
    category: "energy",
    priority: 4,
  },
  {
    id: "i4",
    type: "achievement",
    title: "Meat reduction in progress!",
    message:
      "Great work — you've started reducing meat consumption. Staying consistent for 3 more months will lock in a 67 kg/month saving.",
    category: "diet",
    priority: 3,
    actionId: "a3",
  },
  {
    id: "i5",
    type: "tip",
    title: "Quick win: green energy tariff",
    message:
      "Switching to a renewable electricity tariff takes 10 minutes online and could remove 41 kg CO₂e from your monthly footprint.",
    category: "energy",
    priority: 3,
    actionId: "a7",
  },
];
