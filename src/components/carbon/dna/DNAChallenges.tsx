// ============================================================
// CarbonTwin AI - DNA Challenges List
// ============================================================

import { Card, CardHeader } from "@/components/carbon/Card";

interface DNAChallengesProps {
  readonly challenges: ReadonlyArray<string>;
}

export function DNAChallenges({ challenges }: DNAChallengesProps) {
  return (
    <Card as="article" aria-labelledby="challenges-heading">
      <CardHeader id="challenges-heading" title="⚡ Key Challenges" />
      <ul className="space-y-2" role="list">
        {challenges.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-carbon-700">
            <span className="mt-0.5 text-red-400" aria-hidden="true">
              ▲
            </span>
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}
