// ============================================================
// CarbonTwin AI - DNA Type Reference Grid
// ============================================================

import { Card, CardHeader } from "@/components/carbon/Card";
import type { CarbonDNAType } from "@/lib/carbon/types";
import { DNA_CONFIG } from "./dnaConfig";

interface DNATypeGridProps {
  readonly current: CarbonDNAType;
}

export function DNATypeGrid({ current }: DNATypeGridProps) {
  const entries = Object.entries(DNA_CONFIG) as Array<
    [CarbonDNAType, (typeof DNA_CONFIG)[CarbonDNAType]]
  >;

  return (
    <Card as="article" aria-labelledby="dna-types-heading">
      <CardHeader
        id="dna-types-heading"
        title="Carbon DNA Types"
        subtitle="Where do other users fit?"
      />
      <ul className="grid gap-3 sm:grid-cols-2" role="list">
        {entries.map(([type, cfg]) => {
          const isCurrent = type === current;
          const cls = isCurrent ? `${cfg.borderColor} ${cfg.bgColor}` : "border-carbon-100";
          return (
            <li
              key={type}
              className={`flex items-center gap-3 rounded-xl border p-3 ${cls}`}
              aria-current={isCurrent ? "true" : undefined}
            >
              <span className="text-2xl" aria-hidden="true">
                {cfg.emoji}
              </span>
              <div>
                <p
                  className={`text-sm font-semibold ${isCurrent ? cfg.color : "text-carbon-700"}`}
                >
                  {cfg.label}
                  {isCurrent && <span className="ml-1 text-xs font-normal">(you)</span>}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
