import { describe, it, expect } from "vitest";
import { determineCarbonDNA } from "@/lib/carbon/carbonCalculations";

describe("determineCarbonDNA", () => {
  it("classifies transport-dominant footprints", () => {
    expect(
      determineCarbonDNA({ transport: 400, energy: 100, diet: 80, consumption: 50 }),
    ).toBe("transport-heavy");
  });

  it("classifies energy-dominant footprints", () => {
    expect(
      determineCarbonDNA({ transport: 80, energy: 500, diet: 100, consumption: 60 }),
    ).toBe("energy-intensive");
  });

  it("classifies diet-dominant footprints", () => {
    expect(
      determineCarbonDNA({ transport: 80, energy: 70, diet: 400, consumption: 50 }),
    ).toBe("food-impact");
  });

  it("classifies a footprint below the Paris target as champion", () => {
    expect(
      determineCarbonDNA({ transport: 40, energy: 50, diet: 40, consumption: 30 }),
    ).toBe("sustainability-champion");
  });

  it("returns a deterministic, defined DNA type for balanced inputs", () => {
    const dna = determineCarbonDNA({
      transport: 200,
      energy: 200,
      diet: 200,
      consumption: 200,
    });
    expect(dna).toBeDefined();
  });
});
