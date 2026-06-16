// ============================================================
// CarbonTwin AI - Formatting Utilities
// ============================================================

/**
 * Format a number with comma separators
 */
export function formatNumber(n: number, decimals = 1): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format kg CO2e emissions for display
 */
export function formatEmissions(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} t CO₂e`;
  }
  return `${kg.toFixed(1)} kg CO₂e`;
}

/**
 * Format a month string "YYYY-MM" to "Month YYYY"
 */
export function formatMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * Format a percentage with sign
 */
export function formatPercentChange(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Format a date string to display format
 */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Get current month as "YYYY-MM"
 */
export function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Get today as "YYYY-MM-DD"
 */
export function today(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Get CSS color class based on emission level vs target
 */
export function getEmissionColor(value: number, target: number): string {
  const ratio = value / target;
  if (ratio <= 0.8) return "text-forest-600";
  if (ratio <= 1.0) return "text-earth-600";
  if (ratio <= 1.5) return "text-orange-500";
  return "text-red-500";
}

/**
 * Get background color class for emission category
 */
export function getCategoryColor(
  category: "transport" | "energy" | "diet" | "consumption",
): string {
  const colors = {
    transport: "bg-blue-500",
    energy: "bg-amber-500",
    diet: "bg-forest-500",
    consumption: "bg-purple-500",
  };
  return colors[category];
}

export function getCategoryTextColor(
  category: "transport" | "energy" | "diet" | "consumption",
): string {
  const colors = {
    transport: "text-blue-600",
    energy: "text-amber-600",
    diet: "text-forest-600",
    consumption: "text-purple-600",
  };
  return colors[category];
}

export function getCategoryBgLight(
  category: "transport" | "energy" | "diet" | "consumption",
): string {
  const colors = {
    transport: "bg-blue-50",
    energy: "bg-amber-50",
    diet: "bg-forest-50",
    consumption: "bg-purple-50",
  };
  return colors[category];
}

export const CATEGORY_CHART_COLORS = {
  transport: "#3b82f6",
  energy: "#f59e0b",
  diet: "#22c55e",
  consumption: "#a855f7",
};
