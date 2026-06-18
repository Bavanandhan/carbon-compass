// ============================================================
// CarbonTwin AI - Coach Chat (orchestrates messages + input)
// ============================================================

import { useCallback, useState } from "react";
import { Card, CardHeader } from "@/components/carbon/Card";
import { CoachMessages } from "./CoachMessages";
import { CoachInput } from "./CoachInput";
import { generateCoachResponse, type CoachContext, type CoachMessage } from "@/domain/coach/coachEngine";

const INITIAL_MESSAGE: CoachMessage = {
  role: "assistant",
  text: "Hello! I'm your AI Sustainability Coach. I've analysed your carbon profile and I'm here to give you personalised advice. Ask me anything about your footprint, or tap one of the suggested questions below.",
};

const TYPING_DELAY_MS = 800;

interface CoachChatProps {
  readonly context: CoachContext;
}

export function CoachChat({ context }: CoachChatProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);

  const send = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed) return;

      setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
      setIsTyping(true);

      await new Promise((resolve) => setTimeout(resolve, TYPING_DELAY_MS));

      const response = generateCoachResponse(trimmed, context);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
      setIsTyping(false);
    },
    [context],
  );

  return (
    <Card as="article" aria-labelledby="chat-heading">
      <CardHeader
        id="chat-heading"
        title="🤖 Ask Your Coach"
        subtitle="Get personalised advice about your carbon footprint"
      />
      <CoachMessages messages={messages} isTyping={isTyping} />
      <CoachInput disabled={isTyping} onSend={send} />
    </Card>
  );
}
