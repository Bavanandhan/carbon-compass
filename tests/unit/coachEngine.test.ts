import { describe, it, expect } from "vitest";
import { generateCoachResponse } from "@/domain/coach/coachEngine";
import type { CoachContext } from "@/domain/coach/coachEngine";

const ctx: CoachContext = {
  totalEmissions: 700,
  emissionsByCategory: {
    transport: 300,
    energy: 200,
    diet: 150,
    consumption: 50,
  },
};

describe("generateCoachResponse", () => {
  it("biggest-source names the top category and share", () => {
    const out = generateCoachResponse("What is my biggest source?", ctx);
    expect(out).toContain("transport");
    expect(out).toContain("300");
    expect(out).toMatch(/4\d%/);
  });

  it("transport quotes transport emissions", () => {
    expect(generateCoachResponse("car emissions?", ctx)).toContain("300 kg");
  });

  it("diet quotes diet emissions", () => {
    expect(generateCoachResponse("food impact?", ctx)).toContain("150 kg");
  });

  it("energy quotes energy emissions", () => {
    expect(generateCoachResponse("electricity bill?", ctx)).toContain("200 kg");
  });

  it("consumption quotes consumption emissions", () => {
    expect(generateCoachResponse("shopping tips?", ctx)).toContain("50 kg");
  });

  it("comparison branches on above/below UK average", () => {
    const above = generateCoachResponse("compare to UK average", ctx);
    expect(above).toMatch(/above/);

    const below = generateCoachResponse("compare to UK average", {
      ...ctx,
      totalEmissions: 400,
    });
    expect(below).toMatch(/below/);
  });

  it("paris-target branches on over/under target", () => {
    const over = generateCoachResponse("paris target?", ctx);
    expect(over).toMatch(/over target/);

    const under = generateCoachResponse("paris goal?", { ...ctx, totalEmissions: 100 });
    expect(under).toMatch(/on track/);
  });

  it("trees-offset computes tree count", () => {
    const out = generateCoachResponse("how many trees?", ctx);
    expect(out).toMatch(/\d+ mature trees/);
  });

  it("fallback for unknown questions still references top category", () => {
    const out = generateCoachResponse("hello there", ctx);
    expect(out).toContain("700 kg");
    expect(out).toContain("transport");
  });

  it("handles zero-emission edge case without dividing by zero", () => {
    const empty: CoachContext = {
      totalEmissions: 0,
      emissionsByCategory: { transport: 0, energy: 0, diet: 0, consumption: 0 },
    };
    const out = generateCoachResponse("biggest source", empty);
    expect(out).toContain("0%");
  });
});
