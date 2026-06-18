// ============================================================
// CarbonTwin AI - DNA Header Card
// ============================================================

import { Card } from "@/components/carbon/Card";
import type { DNAStyle } from "./dnaConfig";

interface DNAHeaderProps {
  readonly style: DNAStyle;
}

export function DNAHeader({ style }: DNAHeaderProps) {
  return (
    <Card
      as="article"
      className={`border-2 ${style.borderColor} ${style.bgColor}`}
      aria-labelledby="dna-type-label"
    >
      <div className="flex items-start gap-4">
        <span className="text-5xl" role="img" aria-label={style.label}>
          {style.emoji}
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-carbon-400">
            Carbon DNA Type
          </p>
          <h3 id="dna-type-label" className={`text-2xl font-bold ${style.color}`}>
            {style.label}
          </h3>
          <p className="mt-2 text-carbon-700">{style.description}</p>
        </div>
      </div>
    </Card>
  );
}
