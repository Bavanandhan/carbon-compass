// ============================================================
// CarbonTwin AI - Carbon Store Hook (State Management)
// ============================================================



import { useState, useCallback, useEffect, useMemo } from "react";
import type { AppState, CarbonEntry, CarbonAction, EmissionSource } from "@/lib/carbon/types";
import { loadState, saveState } from "@/lib/carbon/storage";
import { generateId, currentMonth, today } from "@/lib/carbon/formatters";
import {
  calculateByCategory,
  calculateTotalEmissions,
  determineCarbonDNA,
} from "@/lib/carbon/carbonCalculations";
import {
  DEMO_PROFILE,
  DEMO_EMISSION_SOURCES,
  DEMO_MONTHLY_SUMMARIES,
  DEMO_ACTIONS,
} from "@/lib/carbon/demoData";

const INITIAL_STATE: AppState = {
  profile: DEMO_PROFILE,
  entries: [],
  actions: DEMO_ACTIONS,
  monthlySummaries: DEMO_MONTHLY_SUMMARIES,
  lastUpdated: new Date().toISOString(),
};

export function useCarbonStore() {
  const [state, setState] = useState<AppState>(() => {
    const saved = loadState();
    return saved ?? INITIAL_STATE;
  });

  // Persist on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  // --- Computed values ---

  const emissionSources: EmissionSource[] = useMemo(() => DEMO_EMISSION_SOURCES, []);

  const totalEmissions = useMemo(
    () => calculateTotalEmissions(emissionSources),
    [emissionSources],
  );

  const emissionsByCategory = useMemo(
    () => calculateByCategory(emissionSources),
    [emissionSources],
  );

  const carbonDNA = useMemo(
    () => determineCarbonDNA(emissionsByCategory),
    [emissionsByCategory],
  );

  // --- Actions ---

  const addEntry = useCallback(
    (entry: Omit<CarbonEntry, "id">) => {
      const newEntry: CarbonEntry = {
        ...entry,
        id: generateId(),
      };

      setState((prev) => ({
        ...prev,
        entries: [...prev.entries, newEntry],
        lastUpdated: new Date().toISOString(),
      }));

      return newEntry;
    },
    [],
  );

  const updateActionStatus = useCallback(
    (actionId: string, status: CarbonAction["status"]) => {
      setState((prev) => ({
        ...prev,
        actions: prev.actions.map((a) => (a.id === actionId ? { ...a, status } : a)),
        lastUpdated: new Date().toISOString(),
      }));
    },
    [],
  );

  const resetToDemo = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // Quick carbon log for today
  const quickLog = useCallback(
    (category: CarbonEntry["category"], label: string, value: number) => {
      return addEntry({
        date: today(),
        category,
        label,
        value,
      });
    },
    [addEntry],
  );

  // Get entries for current month
  const currentMonthEntries = useMemo(() => {
    const month = currentMonth();
    return state.entries.filter((e) => e.date.startsWith(month));
  }, [state.entries]);

  // Get actions by status
  const actionsByStatus = useMemo(() => {
    return {
      pending: state.actions.filter((a) => a.status === "pending"),
      inProgress: state.actions.filter((a) => a.status === "in-progress"),
      completed: state.actions.filter((a) => a.status === "completed"),
    };
  }, [state.actions]);

  // Potential monthly savings if all pending high-impact actions taken
  const potentialMonthlySavings = useMemo(() => {
    return state.actions
      .filter((a) => a.status === "pending" && a.impact === "high")
      .reduce((sum, a) => sum + a.estimatedReduction, 0);
  }, [state.actions]);

  return {
    // State
    state,
    profile: state.profile,
    entries: state.entries,
    actions: state.actions,
    monthlySummaries: state.monthlySummaries,

    // Computed
    emissionSources,
    totalEmissions,
    emissionsByCategory,
    carbonDNA,
    currentMonthEntries,
    actionsByStatus,
    potentialMonthlySavings,

    // Actions
    addEntry,
    updateActionStatus,
    quickLog,
    resetToDemo,
  };
}

export type CarbonStore = ReturnType<typeof useCarbonStore>;
