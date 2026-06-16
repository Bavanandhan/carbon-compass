// ============================================================
// CarbonTwin AI - Core Type Definitions
// ============================================================

// --- Emission Categories ---

export type EmissionCategory = "transport" | "energy" | "diet" | "consumption";

export interface EmissionSource {
  id: string;
  category: EmissionCategory;
  label: string;
  value: number; // kg CO2e per month
  unit: string;
  icon: string;
}

// --- User Profile ---

export type CarbonDNAType =
  | "transport-heavy"
  | "energy-intensive"
  | "food-impact"
  | "sustainability-champion"
  | "balanced";

export interface UserProfile {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  dnaType: CarbonDNAType;
  totalMonthlyEmissions: number; // kg CO2e
}

// --- Carbon Entry (for tracking over time) ---

export interface CarbonEntry {
  id: string;
  date: string; // ISO date string
  category: EmissionCategory;
  label: string;
  value: number; // kg CO2e
  notes?: string;
}

// --- Monthly Summary ---

export interface MonthlySummary {
  month: string; // "YYYY-MM"
  transport: number;
  energy: number;
  diet: number;
  consumption: number;
  total: number;
}

// --- Actions ---

export type ActionImpact = "high" | "medium" | "low";
export type ActionStatus = "pending" | "in-progress" | "completed";

export interface CarbonAction {
  id: string;
  title: string;
  description: string;
  category: EmissionCategory;
  impact: ActionImpact;
  estimatedReduction: number; // kg CO2e per month
  status: ActionStatus;
  tips: string[];
}

// --- Simulation ---

export interface SimulationScenario {
  id: string;
  label: string;
  description: string;
  category: EmissionCategory;
  reductionPercent: number; // 0-100
  currentValue: number;
}

export interface SimulationResult {
  scenarioId: string;
  label: string;
  currentEmissions: number;
  projectedEmissions: number;
  reduction: number;
  reductionPercent: number;
  annualImpact: number;
  treesEquivalent: number;
}

// --- AI Coach ---

export interface CoachInsight {
  id: string;
  type: "tip" | "warning" | "achievement" | "prediction";
  title: string;
  message: string;
  category?: EmissionCategory;
  priority: number; // 1-5, higher = more important
  actionId?: string;
}

// --- Input Validation ---

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// --- Storage ---

export interface AppState {
  profile: UserProfile | null;
  entries: CarbonEntry[];
  actions: CarbonAction[];
  monthlySummaries: MonthlySummary[];
  lastUpdated: string;
}

// --- API Response ---

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  timestamp: string;
}

// --- Chart Data ---

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface TrendDataPoint {
  month: string;
  transport: number;
  energy: number;
  diet: number;
  consumption: number;
  total: number;
}

// --- Comparison ---

export interface RegionalBenchmark {
  region: string;
  average: number; // kg CO2e per month
  target: number; // Paris Agreement aligned
}
