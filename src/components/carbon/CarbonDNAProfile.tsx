// ============================================================
// CarbonTwin AI - Carbon DNA Profile (orchestration only)
// ============================================================

import type { CarbonStore } from "@/hooks/useCarbonStore";
import { DNA_CONFIG } from "./dna/dnaConfig";
import { DNAHeader } from "./dna/DNAHeader";
import { DNAStats } from "./dna/DNAStats";
import { DNAContributions } from "./dna/DNAContributions";
import { DNAStrengths } from "./dna/DNAStrengths";
import { DNAChallenges } from "./dna/DNAChallenges";
import { DNATypeGrid } from "./dna/DNATypeGrid";

interface CarbonDNAProfileProps {
  store: CarbonStore;
}

export function CarbonDNAProfile({ store }: CarbonDNAProfileProps) {
  const { carbonDNA, totalEmissions, emissionsByCategory } = store;
  const style = DNA_CONFIG[carbonDNA];

  return (
    <section id="profile" aria-labelledby="dna-profile-heading" className="space-y-6">
      <div>
        <h2 id="dna-profile-heading" className="text-2xl font-bold text-carbon-900">
          Your Carbon DNA Profile
        </h2>
        <p className="mt-1 text-carbon-500">
          A personalised classification of your emission patterns.
        </p>
      </div>

      <DNAHeader style={style} />
      <DNAStats totalEmissions={totalEmissions} />
      <DNAContributions
        totalEmissions={totalEmissions}
        emissionsByCategory={emissionsByCategory}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <DNAStrengths strengths={style.strengths} />
        <DNAChallenges challenges={style.challenges} />
      </div>

      <DNATypeGrid current={carbonDNA} />
    </section>
  );
}
