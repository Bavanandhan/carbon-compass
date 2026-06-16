// ============================================================
// CarbonTwin AI - Input Validation Utilities
// ============================================================

import { z } from "zod";
import type { ValidationResult } from "@/lib/carbon/types";

// --- Schemas ---

export const emissionEntrySchema = z.object({
  category: z.enum(["transport", "energy", "diet", "consumption"]),
  label: z
    .string()
    .min(1, "Label is required")
    .max(100, "Label must be under 100 characters")
    .regex(/^[a-zA-Z0-9\s\-_.,'()]+$/, "Label contains invalid characters"),
  value: z
    .number()
    .min(0, "Value must be non-negative")
    .max(100000, "Value exceeds maximum allowed (100,000 kg CO2e)")
    .finite("Value must be a finite number"),
  notes: z
    .string()
    .max(500, "Notes must be under 500 characters")
    .regex(/^[a-zA-Z0-9\s\-_.,'()!?\n]*$/, "Notes contain invalid characters")
    .optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((d) => {
      const date = new Date(d);
      const now = new Date();
      const minDate = new Date("2020-01-01");
      return date >= minDate && date <= now;
    }, "Date must be between 2020-01-01 and today"),
});

export const userProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be under 50 characters")
    .regex(/^[a-zA-Z\s\-'.]+$/, "Name contains invalid characters"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(100, "Location must be under 100 characters")
    .regex(/^[a-zA-Z0-9\s\-,.']+$/, "Location contains invalid characters"),
});

export const simulationParamsSchema = z.object({
  scenarioId: z.string().min(1).max(50),
  reductionPercent: z
    .number()
    .min(0, "Reduction must be at least 0%")
    .max(100, "Reduction cannot exceed 100%"),
});

// --- Validation Functions ---

export function validateEmissionEntry(data: unknown): ValidationResult {
  const result = emissionEntrySchema.safeParse(data);

  if (result.success) {
    return { valid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0]?.toString() ?? "unknown";
    errors[key] = issue.message;
  }

  return { valid: false, errors };
}

export function validateUserProfile(data: unknown): ValidationResult {
  const result = userProfileSchema.safeParse(data);

  if (result.success) {
    return { valid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0]?.toString() ?? "unknown";
    errors[key] = issue.message;
  }

  return { valid: false, errors };
}

export function validateSimulationParams(data: unknown): ValidationResult {
  const result = simulationParamsSchema.safeParse(data);

  if (result.success) {
    return { valid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0]?.toString() ?? "unknown";
    errors[key] = issue.message;
  }

  return { valid: false, errors };
}

/**
 * Sanitize a string to prevent XSS
 * Removes HTML tags and encodes special characters
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate that a number is within safe bounds
 */
export function isSafeNumber(value: unknown): value is number {
  return typeof value === "number" && isFinite(value) && !isNaN(value);
}

/**
 * Rate limiter for client-side actions
 */
export class RateLimiter {
  private requests: number[] = [];
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number = 10, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  isAllowed(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter((t) => now - t < this.windowMs);

    if (this.requests.length >= this.limit) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter((t) => now - t < this.windowMs);
    return Math.max(0, this.limit - this.requests.length);
  }
}
