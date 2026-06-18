// ============================================================
// CarbonTwin AI - Coach Intent Keywords
// ============================================================

import type { CoachIntent } from "./coachTypes";

/**
 * Ordered intent → keyword mapping. First match wins, so list the most
 * specific intents before broader ones.
 */
export const COACH_INTENT_KEYWORDS: ReadonlyArray<{
  readonly intent: Exclude<CoachIntent, "fallback">;
  readonly keywords: ReadonlyArray<string>;
}> = [
  { intent: "biggest-source", keywords: ["biggest source", "largest"] },
  { intent: "transport", keywords: ["transport", "car", "flight", "commute"] },
  { intent: "diet", keywords: ["diet", "food", "eat", "meal"] },
  { intent: "comparison", keywords: ["compare", "average", "uk"] },
  { intent: "paris-target", keywords: ["paris", "target", "goal"] },
  { intent: "trees-offset", keywords: ["tree", "offset", "forest"] },
  { intent: "energy", keywords: ["energy", "home", "electricity", "heating"] },
  { intent: "consumption", keywords: ["consumption", "shopping", "buy"] },
];
