// ============================================================
// CarbonTwin AI - Unit Tests: Formatters
// ============================================================

import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatEmissions,
  formatMonthLabel,
  formatPercentChange,
  formatDate,
  currentMonth,
  today,
  generateId,
  getEmissionColor,
  getCategoryColor,
  getCategoryTextColor,
  getCategoryBgLight,
  CATEGORY_CHART_COLORS,
} from "@/lib/carbon/formatters";

describe("formatNumber", () => {
  it("formats integer with 1 decimal by default", () => {
    expect(formatNumber(1000)).toBe("1,000.0");
  });

  it("respects decimals param", () => {
    expect(formatNumber(1234.5678, 2)).toBe("1,234.57");
  });

  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0.0");
  });

  it("formats negative number", () => {
    expect(formatNumber(-100)).toBe("-100.0");
  });
});

describe("formatEmissions", () => {
  it("formats under 1000 as kg CO₂e", () => {
    expect(formatEmissions(500)).toContain("kg CO₂e");
    expect(formatEmissions(500)).toContain("500.0");
  });

  it("formats 1000+ as tonnes", () => {
    expect(formatEmissions(2000)).toContain("t CO₂e");
    expect(formatEmissions(2000)).toContain("2.00");
  });

  it("formats zero", () => {
    expect(formatEmissions(0)).toBe("0.0 kg CO₂e");
  });

  it("formats exactly 1000 as 1.00 t", () => {
    expect(formatEmissions(1000)).toBe("1.00 t CO₂e");
  });

  it("formats 999.9 as kg", () => {
    expect(formatEmissions(999.9)).toContain("kg CO₂e");
  });
});

describe("formatMonthLabel", () => {
  it("formats YYYY-MM to Month YYYY", () => {
    expect(formatMonthLabel("2024-01")).toContain("2024");
    expect(formatMonthLabel("2024-01")).toContain("Jan");
  });

  it("formats December correctly", () => {
    expect(formatMonthLabel("2024-12")).toContain("Dec");
    expect(formatMonthLabel("2024-12")).toContain("2024");
  });

  it("formats June correctly", () => {
    expect(formatMonthLabel("2024-06")).toContain("Jun");
  });
});

describe("formatPercentChange", () => {
  it("adds + prefix for positive values", () => {
    expect(formatPercentChange(5)).toBe("+5.0%");
  });

  it("no prefix for negative values", () => {
    expect(formatPercentChange(-5)).toBe("-5.0%");
  });

  it("formats zero", () => {
    expect(formatPercentChange(0)).toBe("+0.0%");
  });

  it("formats decimal values", () => {
    expect(formatPercentChange(3.567)).toBe("+3.6%");
  });
});

describe("formatDate", () => {
  it("formats ISO date string to readable format", () => {
    const formatted = formatDate("2024-06-15");
    expect(formatted).toContain("2024");
    expect(formatted).toContain("June");
    expect(formatted).toContain("15");
  });

  it("formats January correctly", () => {
    const formatted = formatDate("2024-01-01");
    expect(formatted).toContain("January");
    expect(formatted).toContain("2024");
  });
});

describe("currentMonth", () => {
  it("returns string in YYYY-MM format", () => {
    const result = currentMonth();
    expect(result).toMatch(/^\d{4}-\d{2}$/);
  });

  it("returns the current year", () => {
    const result = currentMonth();
    const year = new Date().getFullYear().toString();
    expect(result).toContain(year);
  });
});

describe("today", () => {
  it("returns string in YYYY-MM-DD format", () => {
    const result = today();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("matches current date", () => {
    const result = today();
    const now = new Date().toISOString().split("T")[0];
    expect(result).toBe(now);
  });
});

describe("generateId", () => {
  it("returns a non-empty string", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it("contains a timestamp component", () => {
    const before = Date.now();
    const id = generateId();
    const after = Date.now();
    const timestamp = parseInt(id.split("-")[0]);
    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });
});

describe("getEmissionColor", () => {
  it("returns green for values well below target", () => {
    const color = getEmissionColor(100, 200);
    expect(color).toContain("forest");
  });

  it("returns amber for values at target", () => {
    const color = getEmissionColor(200, 200);
    expect(color).toContain("earth");
  });

  it("returns orange for values moderately above target", () => {
    const color = getEmissionColor(250, 200);
    expect(color).toContain("orange");
  });

  it("returns red for values far above target", () => {
    const color = getEmissionColor(400, 200);
    expect(color).toContain("red");
  });
});

describe("getCategoryColor", () => {
  it("returns correct color for transport", () => {
    expect(getCategoryColor("transport")).toContain("blue");
  });

  it("returns correct color for energy", () => {
    expect(getCategoryColor("energy")).toContain("amber");
  });

  it("returns correct color for diet", () => {
    expect(getCategoryColor("diet")).toContain("forest");
  });

  it("returns correct color for consumption", () => {
    expect(getCategoryColor("consumption")).toContain("purple");
  });

  it("returns bg class", () => {
    expect(getCategoryColor("transport")).toContain("bg-");
  });
});

describe("getCategoryTextColor", () => {
  it("returns text class", () => {
    expect(getCategoryTextColor("transport")).toContain("text-");
  });

  it("returns different colors for different categories", () => {
    const transport = getCategoryTextColor("transport");
    const energy = getCategoryTextColor("energy");
    expect(transport).not.toBe(energy);
  });
});

describe("getCategoryBgLight", () => {
  it("returns light background class", () => {
    expect(getCategoryBgLight("transport")).toContain("bg-");
    expect(getCategoryBgLight("transport")).toContain("50");
  });

  it("returns different classes for all categories", () => {
    const categories = ["transport", "energy", "diet", "consumption"] as const;
    const classes = categories.map(getCategoryBgLight);
    const unique = new Set(classes);
    expect(unique.size).toBe(4);
  });
});

describe("CATEGORY_CHART_COLORS", () => {
  it("has all four categories", () => {
    expect(CATEGORY_CHART_COLORS).toHaveProperty("transport");
    expect(CATEGORY_CHART_COLORS).toHaveProperty("energy");
    expect(CATEGORY_CHART_COLORS).toHaveProperty("diet");
    expect(CATEGORY_CHART_COLORS).toHaveProperty("consumption");
  });

  it("uses valid hex color format", () => {
    const hexPattern = /^#[0-9a-f]{6}$/i;
    for (const color of Object.values(CATEGORY_CHART_COLORS)) {
      expect(color).toMatch(hexPattern);
    }
  });
});
