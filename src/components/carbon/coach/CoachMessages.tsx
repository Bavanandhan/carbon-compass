// ============================================================
// CarbonTwin AI - Coach Message Thread
// ============================================================

import { clsx } from "clsx";
import { CoachTypingIndicator } from "./CoachTypingIndicator";
import type { CoachMessage } from "@/domain/coach/coachEngine";

interface CoachMessagesProps {
  readonly messages: ReadonlyArray<CoachMessage>;
  readonly isTyping: boolean;
}

export function CoachMessages({ messages, isTyping }: CoachMessagesProps) {
  return (
    <div
      className="mb-4 max-h-80 space-y-3 overflow-y-auto rounded-xl bg-carbon-50 p-4"
      role="log"
      aria-label="Coach conversation"
      aria-live="polite"
      aria-relevant="additions"
    >
      {messages.map((msg, i) => (
        <div
          key={i}
          className={clsx("flex", msg.role === "user" ? "justify-end" : "justify-start")}
        >
          <div
            className={clsx(
              "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
              msg.role === "user"
                ? "bg-forest-600 text-white"
                : "bg-white text-carbon-800 shadow-sm",
            )}
          >
            {msg.text}
          </div>
        </div>
      ))}
      {isTyping && <CoachTypingIndicator />}
    </div>
  );
}
