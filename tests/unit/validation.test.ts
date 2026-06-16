// ============================================================
// CarbonTwin AI - Unit Tests: Validation
// ============================================================

import { describe, it, expect, beforeEach } from "vitest";
import {
  validateEmissionEntry,
  validateUserProfile,
  validateSimulationParams,
  sanitizeString,
  isSafeNumber,
  RateLimiter,
} from "@/lib/carbon/validation";

describe("validateEmissionEntry", () => {
  const validEntry = {
    category: "transport",
    label: "Car commute",
    value: 150,
    date: "2024-06-01",
  };

  it("accepts a valid entry", () => {
    const result = validateEmissionEntry(validEntry);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("rejects missing category", () => {
    const result = validateEmissionEntry({ ...validEntry, category: undefined });
    expect(result.valid).toBe(false);
    expect(result.errors.category).toBeDefined();
  });

  it("rejects invalid category", () => {
    const result = validateEmissionEntry({ ...validEntry, category: "flying" });
    expect(result.valid).toBe(false);
    expect(result.errors.category).toBeDefined();
  });

  it("rejects empty label", () => {
    const result = validateEmissionEntry({ ...validEntry, label: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.label).toBeDefined();
  });

  it("rejects label over 100 characters", () => {
    const result = validateEmissionEntry({ ...validEntry, label: "a".repeat(101) });
    expect(result.valid).toBe(false);
    expect(result.errors.label).toBeDefined();
  });

  it("rejects label with XSS characters", () => {
    const result = validateEmissionEntry({ ...validEntry, label: "<script>alert(1)</script>" });
    expect(result.valid).toBe(false);
    expect(result.errors.label).toBeDefined();
  });

  it("rejects negative value", () => {
    const result = validateEmissionEntry({ ...validEntry, value: -1 });
    expect(result.valid).toBe(false);
    expect(result.errors.value).toBeDefined();
  });

  it("rejects value above 100000", () => {
    const result = validateEmissionEntry({ ...validEntry, value: 100001 });
    expect(result.valid).toBe(false);
    expect(result.errors.value).toBeDefined();
  });

  it("rejects non-finite value", () => {
    const result = validateEmissionEntry({ ...validEntry, value: Infinity });
    expect(result.valid).toBe(false);
    expect(result.errors.value).toBeDefined();
  });

  it("accepts value of exactly 0", () => {
    const result = validateEmissionEntry({ ...validEntry, value: 0 });
    expect(result.valid).toBe(true);
  });

  it("rejects invalid date format", () => {
    const result = validateEmissionEntry({ ...validEntry, date: "01/06/2024" });
    expect(result.valid).toBe(false);
    expect(result.errors.date).toBeDefined();
  });

  it("rejects date before 2020", () => {
    const result = validateEmissionEntry({ ...validEntry, date: "2019-12-31" });
    expect(result.valid).toBe(false);
    expect(result.errors.date).toBeDefined();
  });

  it("rejects future date", () => {
    const result = validateEmissionEntry({ ...validEntry, date: "2099-01-01" });
    expect(result.valid).toBe(false);
    expect(result.errors.date).toBeDefined();
  });

  it("accepts optional notes", () => {
    const result = validateEmissionEntry({ ...validEntry, notes: "Drove to work" });
    expect(result.valid).toBe(true);
  });

  it("rejects notes over 500 characters", () => {
    const result = validateEmissionEntry({ ...validEntry, notes: "a".repeat(501) });
    expect(result.valid).toBe(false);
    expect(result.errors.notes).toBeDefined();
  });

  it("accepts all valid categories", () => {
    const categories = ["transport", "energy", "diet", "consumption"];
    for (const category of categories) {
      const result = validateEmissionEntry({ ...validEntry, category });
      expect(result.valid).toBe(true);
    }
  });
});

describe("validateUserProfile", () => {
  const validProfile = {
    name: "Alex Johnson",
    location: "London, UK",
  };

  it("accepts a valid profile", () => {
    const result = validateUserProfile(validProfile);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("rejects empty name", () => {
    const result = validateUserProfile({ ...validProfile, name: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("rejects name over 50 characters", () => {
    const result = validateUserProfile({ ...validProfile, name: "a".repeat(51) });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("rejects name with invalid characters", () => {
    const result = validateUserProfile({ ...validProfile, name: "Alex<script>" });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("rejects empty location", () => {
    const result = validateUserProfile({ ...validProfile, location: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.location).toBeDefined();
  });

  it("rejects null input", () => {
    const result = validateUserProfile(null);
    expect(result.valid).toBe(false);
  });

  it("rejects non-object input", () => {
    const result = validateUserProfile("string input");
    expect(result.valid).toBe(false);
  });
});

describe("validateSimulationParams", () => {
  it("accepts valid params", () => {
    const result = validateSimulationParams({ scenarioId: "s1", reductionPercent: 50 });
    expect(result.valid).toBe(true);
  });

  it("rejects reductionPercent below 0", () => {
    const result = validateSimulationParams({ scenarioId: "s1", reductionPercent: -1 });
    expect(result.valid).toBe(false);
    expect(result.errors.reductionPercent).toBeDefined();
  });

  it("rejects reductionPercent above 100", () => {
    const result = validateSimulationParams({ scenarioId: "s1", reductionPercent: 101 });
    expect(result.valid).toBe(false);
    expect(result.errors.reductionPercent).toBeDefined();
  });

  it("accepts boundary values 0 and 100", () => {
    expect(validateSimulationParams({ scenarioId: "s1", reductionPercent: 0 }).valid).toBe(true);
    expect(validateSimulationParams({ scenarioId: "s1", reductionPercent: 100 }).valid).toBe(true);
  });

  it("rejects empty scenarioId", () => {
    const result = validateSimulationParams({ scenarioId: "", reductionPercent: 50 });
    expect(result.valid).toBe(false);
    expect(result.errors.scenarioId).toBeDefined();
  });
});

describe("sanitizeString", () => {
  it("encodes HTML entities", () => {
    expect(sanitizeString("<script>alert('xss')</script>")).not.toContain("<");
    expect(sanitizeString("<script>alert('xss')</script>")).not.toContain(">");
  });

  it("encodes ampersand", () => {
    expect(sanitizeString("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("encodes double quotes", () => {
    expect(sanitizeString('"hello"')).toBe("&quot;hello&quot;");
  });

  it("encodes single quotes", () => {
    expect(sanitizeString("it's")).toBe("it&#x27;s");
  });

  it("encodes forward slash", () => {
    expect(sanitizeString("/path/to")).toBe("&#x2F;path&#x2F;to");
  });

  it("returns safe plain text unchanged (mostly)", () => {
    // Plain text has no special chars to encode
    expect(sanitizeString("hello world 123")).toBe("hello world 123");
  });

  it("handles empty string", () => {
    expect(sanitizeString("")).toBe("");
  });
});

describe("isSafeNumber", () => {
  it("returns true for finite numbers", () => {
    expect(isSafeNumber(42)).toBe(true);
    expect(isSafeNumber(0)).toBe(true);
    expect(isSafeNumber(-10)).toBe(true);
    expect(isSafeNumber(3.14)).toBe(true);
  });

  it("returns false for Infinity", () => {
    expect(isSafeNumber(Infinity)).toBe(false);
    expect(isSafeNumber(-Infinity)).toBe(false);
  });

  it("returns false for NaN", () => {
    expect(isSafeNumber(NaN)).toBe(false);
  });

  it("returns false for non-numbers", () => {
    expect(isSafeNumber("42")).toBe(false);
    expect(isSafeNumber(null)).toBe(false);
    expect(isSafeNumber(undefined)).toBe(false);
    expect(isSafeNumber({})).toBe(false);
    expect(isSafeNumber([])).toBe(false);
  });
});

describe("RateLimiter", () => {
  beforeEach(() => {
    // Reset time mocks if any
  });

  it("allows requests within limit", () => {
    const limiter = new RateLimiter(5, 60000);
    for (let i = 0; i < 5; i++) {
      expect(limiter.isAllowed()).toBe(true);
    }
  });

  it("blocks requests exceeding limit", () => {
    const limiter = new RateLimiter(3, 60000);
    limiter.isAllowed();
    limiter.isAllowed();
    limiter.isAllowed();
    expect(limiter.isAllowed()).toBe(false);
  });

  it("tracks remaining requests correctly", () => {
    const limiter = new RateLimiter(5, 60000);
    expect(limiter.getRemainingRequests()).toBe(5);
    limiter.isAllowed();
    expect(limiter.getRemainingRequests()).toBe(4);
    limiter.isAllowed();
    expect(limiter.getRemainingRequests()).toBe(3);
  });

  it("remaining requests never go below 0", () => {
    const limiter = new RateLimiter(2, 60000);
    limiter.isAllowed();
    limiter.isAllowed();
    limiter.isAllowed(); // exceeds limit
    expect(limiter.getRemainingRequests()).toBe(0);
  });

  it("uses default limit and window when not specified", () => {
    const limiter = new RateLimiter();
    expect(limiter.getRemainingRequests()).toBe(10);
  });
});
