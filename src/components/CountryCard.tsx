"use client";

import { CountryCulture } from "@/data/generalCulture";

interface CountryCardProps {
  country: CountryCulture;
  onSelect: (id: string) => void;
}

export default function CountryCard({ country, onSelect }: CountryCardProps) {
  return (
    <div
      id={`country-card-${country.id}`}
      className="glass-card animate-fade-in"
      onClick={() => onSelect(country.id)}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        padding: "2.5rem 1.75rem",
      }}
    >
      <div
        style={{
          fontSize: "4.5rem",
          marginBottom: "0.5rem",
          userSelect: "none",
          transform: "scale(1)",
          transition: "transform 0.3s ease",
        }}
        className="flag-icon"
      >
        {country.flagUrl}
      </div>

      <div>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "0.25rem" }}>{country.name}</h2>
        <p style={{ fontStyle: "italic", fontSize: "0.95rem", opacity: 0.8 }}>
          {country.nativeName}
        </p>
      </div>

      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "var(--border-light)",
          margin: "0.5rem 0",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          width: "100%",
          textAlign: "left",
          fontSize: "0.9rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "hsl(var(--text-secondary))" }}>Başkent:</span>
          <span style={{ fontWeight: 600 }}>{country.capital}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "hsl(var(--text-secondary))" }}>Dil:</span>
          <span style={{ fontWeight: 600 }}>{country.language}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "hsl(var(--text-secondary))" }}>Para Birimi:</span>
          <span style={{ fontWeight: 600 }}>{country.currency}</span>
        </div>
      </div>

      <button
        id={`select-btn-${country.id}`}
        className="btn btn-primary"
        style={{ marginTop: "1.5rem", width: "100%" }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(country.id);
        }}
      >
        Çalışmaya Başla
      </button>
    </div>
  );
}
