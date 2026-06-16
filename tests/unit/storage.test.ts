// ============================================================
// CarbonTwin AI - Unit Tests: Storage
// ============================================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import { saveState, loadState, clearState } from "@/lib/carbon/storage";
import type { AppState } from "@/lib/carbon/types";

const mockState: AppState = {
  profile: {
    id: "test-user",
    name: "Test User",
    location: "London",
    createdAt: "2024-01-01",
    dnaType: "balanced",
    totalMonthlyEmissions: 500,
  },
  entries: [
    {
      id: "entry-1",
      date: "2024-06-01",
      category: "transport",
      label: "Car trip",
      value: 50,
    },
  ],
  actions: [],
  monthlySummaries: [],
  lastUpdated: "2024-06-01T00:00:00.000Z",
};

describe("saveState", () => {
  it("saves state and returns true", () => {
    const result = saveState(mockState);
    expect(result).toBe(true);
    expect(window.localStorage.setItem).toHaveBeenCalled();
  });

  it("stores JSON-serializable data", () => {
    saveState(mockState);
    const calls = vi.mocked(window.localStorage.setItem).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const [, stored] = calls[0];
    // Should be parseable JSON
    expect(() => JSON.parse(stored)).not.toThrow();
  });

  it("wraps data in a versioned envelope", () => {
    saveState(mockState);
    const calls = vi.mocked(window.localStorage.setItem).mock.calls;
    const [, stored] = calls[0];
    const envelope = JSON.parse(stored);
    expect(envelope).toHaveProperty("version");
    expect(envelope).toHaveProperty("timestamp");
    expect(envelope).toHaveProperty("data");
  });

  it("includes the correct data in envelope", () => {
    saveState(mockState);
    const calls = vi.mocked(window.localStorage.setItem).mock.calls;
    const [, stored] = calls[0];
    const envelope = JSON.parse(stored);
    expect(envelope.data.profile?.name).toBe("Test User");
  });

  it("returns false when localStorage throws", () => {
    vi.mocked(window.localStorage.setItem).mockImplementationOnce(() => {
      throw new Error("QuotaExceededError");
    });
    const result = saveState(mockState);
    expect(result).toBe(false);
  });
});

describe("loadState", () => {
  beforeEach(() => {
    // Pre-populate with valid saved state
    saveState(mockState);
    vi.mocked(window.localStorage.getItem).mockImplementation((key: string) => {
      // Find what was saved
      const calls = vi.mocked(window.localStorage.setItem).mock.calls;
      const match = calls.find(([k]) => k === key);
      return match ? match[1] : null;
    });
  });

  it("returns null when nothing is stored", () => {
    vi.mocked(window.localStorage.getItem).mockReturnValueOnce(null);
    const result = loadState();
    expect(result).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    vi.mocked(window.localStorage.getItem).mockReturnValueOnce("not-valid-json{{{");
    const result = loadState();
    expect(result).toBeNull();
  });

  it("returns null for wrong version", () => {
    const wrongVersion = JSON.stringify({ version: 99, timestamp: "2024-01-01", data: mockState });
    vi.mocked(window.localStorage.getItem).mockReturnValueOnce(wrongVersion);
    const result = loadState();
    expect(result).toBeNull();
  });

  it("returns null when data is not an object", () => {
    const badData = JSON.stringify({ version: 1, timestamp: "2024-01-01", data: "string" });
    vi.mocked(window.localStorage.getItem).mockReturnValueOnce(badData);
    const result = loadState();
    expect(result).toBeNull();
  });

  it("returns state when valid data exists", () => {
    const envelope = JSON.stringify({ version: 1, timestamp: "2024-01-01", data: mockState });
    vi.mocked(window.localStorage.getItem).mockReturnValueOnce(envelope);
    const result = loadState();
    expect(result).not.toBeNull();
    expect(result?.profile?.name).toBe("Test User");
  });
});

describe("clearState", () => {
  it("calls localStorage.removeItem", () => {
    clearState();
    expect(window.localStorage.removeItem).toHaveBeenCalled();
  });

  it("does not throw when storage is unavailable", () => {
    vi.mocked(window.localStorage.removeItem).mockImplementationOnce(() => {
      throw new Error("Storage unavailable");
    });
    expect(() => clearState()).not.toThrow();
  });
});
