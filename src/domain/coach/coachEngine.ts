// ============================================================
// CarbonTwin AI - Coach Engine (Service Layer)
// ============================================================

import { detectIntent } from "./coachMatcher";
import { COACH_RESPONSES } from "./coachResponses";
import type { CoachContext } from "./coachTypes";

/**
 * Pure orchestration: detect intent → look up strategy → produce response.
 * Cyclomatic complexity = 1.
 */
export function generateCoachResponse(question: string, ctx: CoachContext): string {
  const intent = detectIntent(question);
  return COACH_RESPONSES[intent](ctx);
}

export { detectIntent } from "./coachMatcher";
export { COACH_RESPONSES } from "./coachResponses";
export type { CoachContext, CoachIntent, CoachMessage, CoachResponseBuilder } from "./coachTypes";
