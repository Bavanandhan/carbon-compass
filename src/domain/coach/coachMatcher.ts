// ============================================================
// CarbonTwin AI - Coach Intent Matcher
// ============================================================

import { COACH_INTENT_KEYWORDS } from "./coachKeywords";
import type { CoachIntent } from "./coachTypes";

/**
 * Map a user question to a {@link CoachIntent}. Pure, case-insensitive,
 * cyclomatic complexity 2 — the conditional chain lives in data.
 */
export function detectIntent(question: string): CoachIntent {
  const q = question.toLowerCase().trim();
  if (!q) return "fallback";

  for (const { intent, keywords } of COACH_INTENT_KEYWORDS) {
    if (keywords.some((kw) => q.includes(kw))) return intent;
  }
  return "fallback";
}
