// ============================================================
// CarbonTwin AI - Coach Input Form (with suggested questions)
// ============================================================

import { useState, type FormEvent } from "react";

const SUGGESTED_QUESTIONS: ReadonlyArray<string> = [
  "What is my biggest source of emissions?",
  "How can I reduce my transport footprint?",
  "What diet changes would have the most impact?",
  "How do I compare to the UK average?",
  "What is the Paris Agreement target?",
  "How many trees would offset my footprint?",
];

interface CoachInputProps {
  readonly disabled: boolean;
  readonly onSend: (question: string) => void;
}

export function CoachInput({ disabled, onSend }: CoachInputProps) {
  const [value, setValue] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <>
      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-carbon-400">
          Suggested questions
        </p>
        <div
          className="flex flex-wrap gap-2"
          role="list"
          aria-label="Suggested questions for the coach"
        >
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onSend(q)}
              className="rounded-full border border-carbon-200 bg-white px-3 py-1.5 text-xs text-carbon-600 transition-colors hover:border-forest-300 hover:text-forest-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
              role="listitem"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={submit} noValidate aria-label="Ask the AI coach a question">
        <div className="flex gap-2">
          <label htmlFor="coach-input" className="sr-only">
            Ask a question about your carbon footprint
          </label>
          <input
            id="coach-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask about your carbon footprint..."
            maxLength={200}
            className="min-w-0 flex-1 rounded-xl border border-carbon-200 bg-carbon-50 px-4 py-2.5 text-sm text-carbon-900 placeholder-carbon-400 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200"
            aria-required="true"
            disabled={disabled}
          />
          <button
            type="submit"
            disabled={!value.trim() || disabled}
            className="rounded-xl bg-forest-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message to coach"
          >
            Ask
          </button>
        </div>
      </form>
    </>
  );
}
