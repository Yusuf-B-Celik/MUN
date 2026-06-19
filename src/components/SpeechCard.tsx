"use client";

import { Speech } from "@/app/api/speeches/route";

interface SpeechCardProps {
  speech: Speech;
  isActive: boolean;
  isCompleted: boolean;
  onSelect: (speech: Speech) => void;
}

export default function SpeechCard({
  speech,
  isActive,
  isCompleted,
  onSelect,
}: SpeechCardProps) {
  let statusText = "Bekliyor";
  let statusColor = "hsl(var(--text-secondary))";
  let statusBg = "rgba(255, 255, 255, 0.05)";
  let statusIcon = "📄";

  if (isActive) {
    statusText = "Çalışılıyor";
    statusColor = "hsl(var(--accent-blue))";
    statusBg = "rgba(14, 165, 233, 0.15)";
    statusIcon = "⚡";
  } else if (isCompleted) {
    statusText = "Tamamlandı";
    statusColor = "hsl(var(--accent-green))";
    statusBg = "rgba(16, 185, 129, 0.15)";
    statusIcon = "✓";
  }

  return (
    <div
      id={`speech-card-${speech.id}`}
      className="glass-card animate-fade-in"
      onClick={() => onSelect(speech)}
      style={{
        cursor: "pointer",
        padding: "1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        borderColor: isActive ? "hsl(var(--accent-purple))" : "var(--border-light)",
        background: isActive ? "hsla(263, 90%, 64%, 0.08)" : "var(--glass-bg)",
        boxShadow: isActive ? "var(--shadow-glow)" : "none",
        transform: isActive ? "translateY(-1px)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: isCompleted
              ? "hsla(142, 71%, 45%, 0.2)"
              : isActive
              ? "hsla(263, 90%, 64%, 0.2)"
              : "rgba(255, 255, 255, 0.05)",
            color: isCompleted
              ? "hsl(var(--accent-green))"
              : isActive
              ? "hsl(var(--accent-purple))"
              : "hsl(var(--text-secondary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "0.95rem",
          }}
        >
          {speech.id}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem", flex: 1 }}>
          <h4
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: isActive ? "white" : "hsl(var(--text-primary))",
            }}
          >
            {speech.title}
          </h4>
          <span style={{ fontSize: "0.75rem", color: "hsl(var(--text-secondary))" }}>
            Konuşma {speech.id}
          </span>
        </div>
      </div>

      <div
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          padding: "0.25rem 0.6rem",
          borderRadius: "8px",
          color: statusColor,
          backgroundColor: statusBg,
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
        }}
      >
        <span>{statusIcon}</span>
        <span>{statusText}</span>
      </div>
    </div>
  );
}
