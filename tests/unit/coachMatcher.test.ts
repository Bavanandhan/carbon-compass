import { describe, it, expect } from "vitest";
import { detectIntent } from "@/domain/coach/coachMatcher";

describe("detectIntent", () => {
  it.each([
    ["What is my biggest source?", "biggest-source"],
    ["Largest emitter please", "biggest-source"],
    ["How do I cut my car commute?", "transport"],
    ["Tell me about diet impact", "diet"],
    ["What about my food choices?", "diet"],
    ["How do I compare to UK average?", "comparison"],
    ["Paris target?", "paris-target"],
    ["Trees to offset?", "trees-offset"],
    ["Reduce heating at home", "energy"],
    ["Tips for shopping less", "consumption"],
  ] as const)("maps %j → %s", (question, expected) => {
    expect(detectIntent(question)).toBe(expected);
  });

  it("returns fallback for empty / whitespace input", () => {
    expect(detectIntent("")).toBe("fallback");
    expect(detectIntent("    ")).toBe("fallback");
  });

  it("returns fallback for unrelated question", () => {
    expect(detectIntent("Tell me a joke please")).toBe("fallback");
  });

  it("is case-insensitive", () => {
    expect(detectIntent("TRANSPORT options")).toBe("transport");
  });
});
