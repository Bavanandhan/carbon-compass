// ============================================================
// CarbonTwin AI - Coach Typing Indicator
// ============================================================

export function CoachTypingIndicator() {
  return (
    <div className="flex justify-start" aria-label="Coach is typing">
      <div className="rounded-2xl bg-white px-4 py-2.5 shadow-sm">
        <span className="inline-flex gap-1">
          <span className="animate-bounce text-carbon-400 delay-0">●</span>
          <span className="animate-bounce text-carbon-400" style={{ animationDelay: "0.1s" }}>
            ●
          </span>
          <span className="animate-bounce text-carbon-400" style={{ animationDelay: "0.2s" }}>
            ●
          </span>
        </span>
      </div>
    </div>
  );
}
