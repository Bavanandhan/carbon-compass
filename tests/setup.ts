// ============================================================
// CarbonTwin AI - Vitest Test Setup
// ============================================================

import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock window.URL.createObjectURL
Object.defineProperty(window.URL, "createObjectURL", {
  value: vi.fn(() => "mock-url"),
  writable: true,
});

Object.defineProperty(window.URL, "revokeObjectURL", {
  value: vi.fn(),
  writable: true,
});

// Clear mocks between tests
beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});
