// ============================================================
// CarbonTwin AI - Coach Domain Types
// ============================================================

import type { EmissionCategory } from "@/lib/carbon/types";

/** All intents the coach can recognise. */
export type CoachIntent =
  | "biggest-source"
  | "transport"
  | "diet"
  | "energy"
  | "consumption"
  | "comparison"
  | "paris-target"
  | "trees-offset"
  | "fallback";

/** Minimal store slice required to build any coach response. */
export interface CoachContext {
  readonly totalEmissions: number;
  readonly emissionsByCategory: Readonly<Record<EmissionCategory, number>>;
}

/** Strategy signature: an intent maps to a builder over the coach context. */
export type CoachResponseBuilder = (ctx: CoachContext) => string;

/** A single chat message exchanged with the coach. */
export interface CoachMessage {
  readonly role: "user" | "assistant";
  readonly text: string;
}
