// ============================================================
// CarbonTwin AI - DNA Strengths List
// ============================================================

import { Card, CardHeader } from "@/components/carbon/Card";

interface DNAStrengthsProps {
  readonly strengths: ReadonlyArray<string>;
}

export function DNAStrengths({ strengths }: DNAStrengthsProps) {
  return (
    <Card as="article" aria-labelledby="strengths-heading">
      <CardHeader id="strengths-heading" title="✓ Your Strengths" />
      <ul className="space-y-2" role="list">
        {strengths.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-carbon-700">
            <span className="mt-0.5 text-forest-500" aria-hidden="true">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}
