"use client";

import { renderFormattedText } from "@/utils/formatter";

interface EvaluationResultProps {
  feedback: string;
  onRetry: () => void;
  onContinue: () => void;
}

export default function EvaluationResult({
  feedback,
  onRetry,
  onContinue,
}: EvaluationResultProps) {
  // Parse feedback if it contains markers or just render it cleanly.
  // We will ask MiniMax to output a structured review with score, explanation, and suggestions.
  // We can render this markdown-like review in a gorgeous container.

  const isExcellent = feedback.toLowerCase().includes("harika") || feedback.toLowerCase().includes("mükemmel") || feedback.toLowerCase().includes("başarılı");

  return (
    <div
      className="glass-card glow-effect animate-fade-in"
      style={{
        marginTop: "1.5rem",
        borderLeft: `4px solid ${isExcellent ? "hsl(var(--accent-green))" : "hsl(var(--accent-purple))"}`,
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.5rem" }}>🤖</span>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Yapay Zeka Değerlendirmesi</h3>
      </div>

      <div
        style={{
          fontSize: "0.95rem",
          color: "hsl(var(--text-primary))",
          background: "rgba(255, 255, 255, 0.02)",
          padding: "1rem",
          borderRadius: "10px",
          border: "1px solid var(--border-light)",
        }}
      >
        {renderFormattedText(feedback)}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
          marginTop: "0.5rem",
        }}
      >
        <button className="btn btn-secondary" onClick={onRetry}>
          🔄 Tekrar Cevapla
        </button>
        <button className="btn btn-primary" onClick={onContinue}>
          İlerle ➜
        </button>
      </div>
    </div>
  );
}
