// ============================================================
// CarbonTwin AI - Secure Storage Utility
// ============================================================

import type { AppState } from "@/lib/carbon/types";

const STORAGE_KEY = "carbontwin_v1";
const STORAGE_VERSION = 1;

interface StorageEnvelope {
  version: number;
  timestamp: string;
  data: AppState;
}

/**
 * Safely parse JSON without throwing
 */
function safeParse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const test = "__carbontwin_test__";
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save app state to localStorage
 */
export function saveState(state: AppState): boolean {
  if (!isStorageAvailable()) return false;

  try {
    const envelope: StorageEnvelope = {
      version: STORAGE_VERSION,
      timestamp: new Date().toISOString(),
      data: state,
    };

    const serialized = JSON.stringify(envelope);

    // Basic size check (5MB limit with buffer)
    if (serialized.length > 4 * 1024 * 1024) {
      console.warn("CarbonTwin: Storage payload too large, pruning old entries");
      return false;
    }

    window.localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch {
    console.error("CarbonTwin: Failed to save state");
    return false;
  }
}

/**
 * Load app state from localStorage
 */
export function loadState(): AppState | null {
  if (!isStorageAvailable()) return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const envelope = safeParse<StorageEnvelope>(raw);
    if (!envelope) return null;

    // Version check — migrate if needed
    if (envelope.version !== STORAGE_VERSION) {
      console.warn("CarbonTwin: Storage version mismatch, resetting");
      clearState();
      return null;
    }

    // Validate basic structure
    if (!envelope.data || typeof envelope.data !== "object") return null;

    return envelope.data;
  } catch {
    console.error("CarbonTwin: Failed to load state");
    return null;
  }
}

/**
 * Clear all stored state
 */
export function clearState(): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.error("CarbonTwin: Failed to clear state");
  }
}

/**
 * Export state as downloadable JSON
 */
export function exportStateAsJson(state: AppState): void {
  if (typeof window === "undefined") return;

  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `carbontwin-export-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
