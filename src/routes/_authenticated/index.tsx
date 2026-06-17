import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/carbon/Header";
import { Dashboard } from "@/components/carbon/Dashboard";
import { WhatIfSimulator } from "@/components/carbon/WhatIfSimulator";
import { ActionPlan } from "@/components/carbon/ActionPlan";
import { CarbonDNAProfile } from "@/components/carbon/CarbonDNAProfile";
import { AICoach } from "@/components/carbon/AICoach";
import { Roadmap } from "@/components/carbon/Roadmap";
import { CarbonBudget } from "@/components/carbon/CarbonBudget";
import { DecisionMatrix } from "@/components/carbon/DecisionMatrix";
import { SavingsTracker } from "@/components/carbon/SavingsTracker";
import { useCarbonStore } from "@/hooks/useCarbonStore";
import { useProfile } from "@/hooks/useProfile";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "CarbonTwin AI — Predict Your Carbon Footprint Before It Happens" },
      {
        name: "description",
        content:
          "CarbonTwin AI helps you understand, track, and reduce your carbon footprint with personalised insights, scenario simulation, and an AI sustainability coach.",
      },
      { property: "og:title", content: "CarbonTwin AI" },
      {
        property: "og:description",
        content:
          "Predict your carbon footprint before it happens. Track emissions, simulate scenarios, and get personalised reduction plans.",
      },
    ],
  }),
  component: Home,
});

type Section =
  | "dashboard"
  | "roadmap"
  | "budget"
  | "matrix"
  | "savings"
  | "simulator"
  | "actions"
  | "profile"
  | "coach";

function Home() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const store = useCarbonStore();
  const { data: profile } = useProfile();
  const displayName = profile?.display_name ?? "Explorer";

  const handleNavigate = (section: string) => {
    setActiveSection(section as Section);
    const main = document.getElementById("main-content");
    main?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-carbon-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-forest-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      <main
        id="main-content"
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
        tabIndex={-1}
      >
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-forest-800 via-forest-700 to-forest-600 p-8 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-forest-200">
                Personalised Climate Intelligence
              </p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                {`Welcome back ${displayName}\u00a0👋`}
              </h1>
              <p className="mt-2 text-forest-100">
                Your monthly footprint:{" "}
                <strong className="text-white">{store.totalEmissions} kg CO₂e</strong> — tracking
                your path to net zero.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">
                <p className="text-2xl font-bold">{store.actionsByStatus.completed.length}</p>
                <p className="text-xs text-forest-200">Actions done</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur">
                <p className="text-2xl font-bold">{store.potentialMonthlySavings}</p>
                <p className="text-xs text-forest-200">kg saveable</p>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-fade-in">
          {activeSection === "dashboard" && <Dashboard store={store} />}
          {activeSection === "roadmap" && <Roadmap store={store} />}
          {activeSection === "budget" && <CarbonBudget store={store} />}
          {activeSection === "matrix" && <DecisionMatrix store={store} />}
          {activeSection === "savings" && <SavingsTracker store={store} />}
          {activeSection === "simulator" && <WhatIfSimulator />}
          {activeSection === "actions" && <ActionPlan store={store} />}
          {activeSection === "profile" && <CarbonDNAProfile store={store} />}
          {activeSection === "coach" && <AICoach store={store} />}
        </div>
      </main>

      <footer className="border-t border-carbon-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-carbon-800">CarbonTwin AI</p>
              <p className="text-sm text-carbon-400">
                Predict Your Carbon Footprint Before It Happens.
              </p>
            </div>
            <p className="text-xs text-carbon-400">
              Emission factors sourced from IPCC &amp; DESNZ · WCAG 2.1 AA · Open source
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
