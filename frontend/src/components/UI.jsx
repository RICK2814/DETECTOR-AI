// components/UI.jsx — Shared low-level components
import React from "react";

// Lightweight, consistent SVG icon system — no emoji or icon-font dependencies.
function IconGlyph({ name }) {
  switch (name) {
    case "scan": return <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5M10.5 7.5v6M7.5 10.5h6M4 3H3v4M20 3h1v4M4 21H3v-4M20 21h1v-4"/></>;
    case "history": return <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.4 2M4.1 5.1 2.8 8.2l3.4.2"/></>;
    case "chart": return <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2M3 7l6-3 6 7 6-5"/></>;
    case "file-text": return <><path d="M6 3h8l4 4v14H6zM14 3v5h5M9 12h6M9 16h6"/></>;
    case "globe": return <><circle cx="12" cy="12" r="9"/><path d="M3.5 12h17M12 3c2.4 2.5 3.4 5.5 3.4 9s-1 6.5-3.4 9c-2.4-2.5-3.4-5.5-3.4-9S9.6 5.5 12 3Z"/></>;
    case "file": return <><path d="M6 3h8l4 4v14H6zM14 3v5h5"/></>;
    case "alert-triangle": return <><path d="m12 3 9 16H3L12 3Z"/><path d="M12 9v4M12 16.5h.01"/></>;
    case "info": return <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/></>;
    case "newspaper": return <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h4v4H7zM14 8h4M14 11h4M7 15h11M7 17.5h11"/></>;
    case "trash": return <><path d="M4 7h16M10 3h4M6.5 7l1 14h9l1-14M10 10v7M14 10v7"/></>;
    case "database": return <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></>;
    case "bot": return <><rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M8 12h.01M16 12h.01M8 16h8M2 11v5M22 11v5"/></>;
    case "user-round": return <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>;
    case "flag": return <><path d="M5 21V4M5 5c5-4 9 4 14 0v10c-5 4-9-4-14 0"/></>;
    case "check-circle": return <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 9"/></>;
    case "x-circle": return <><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/></>;
    case "sparkles": return <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 14 1 2.5 2 1-2 1L19 21l-1-2.5-2-1 2-1 1-2.5ZM5 2l.7 1.8L7.5 4.5l-1.8.7L5 7l-.7-1.8L2.5 4.5l1.8-.7L5 2Z"/></>;
    case "arrow-left": return <><path d="M19 12H5M12 19l-7-7 7-7"/></>;
    case "external-link": return <><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>;
    case "shield-check": return <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>;
    case "brain": return <><path d="M12 5a4 4 0 0 0-7-2 4 4 0 0 0-1 7 4.5 4.5 0 0 0 2 8 4 4 0 0 0 6 2V5ZM12 5a4 4 0 0 1 7-2 4 4 0 0 1 1 7 4.5 4.5 0 0 1-2 8 4 4 0 0 1-6 2V5Z"/><path d="M8 7v3l2 1M16 7v3l-2 1M7 15l3-1M17 15l-3-1"/></>;
    case "layers": return <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>;
    case "upload": return <><path d="M12 16V4m-5 5 5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></>;
    case "lightbulb": return <><path d="M9 18h6M10 21h4M8.5 14.5A7 7 0 1 1 15.5 14.5c-.9.7-1.5 1.6-1.5 3h-4c0-1.4-.6-2.3-1.5-3Z"/></>;
    default: return <><circle cx="12" cy="12" r="9"/><path d="M12 7v5m0 4h.01"/></>;
  }
}
export function Icon({ name = "info", size = 18, strokeWidth = 1.75, className = "", style = {} }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" style={{ display:"inline-block", flexShrink:0, verticalAlign:"-0.16em", ...style }}><IconGlyph name={name}/></svg>;
}


// ── Gauge ─────────────────────────────────────────────────────────────────────

export function Gauge({ pct, color, size = 120 }) {
  const r = size * 0.4;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div style={{ width: size, height: size, position: "relative", flexShrink: 0 }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={size*0.083} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={size*0.083}
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 ${size*0.07}px ${color})`, transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: "var(--head)", fontSize: size*0.22, fontWeight: 800, color, lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: size*0.09, color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>AI</span>
      </div>
    </div>
  );
}

// ── Signal Bar ────────────────────────────────────────────────────────────────

export function SignalBar({ name, score, label, invert = false }) {
  const display = invert ? 100 - score : score;
  const aiScore = invert ? 100 - score : score;
  const color = aiScore >= 70 ? "var(--accent2)" : aiScore >= 40 ? "var(--warn)" : "var(--accent3)";

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 10, padding: 16,
    }}>
      <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
        {name}
      </div>
      <div style={{ background: "var(--bg)", borderRadius: 4, height: 6, marginBottom: 8, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 4, width: `${display}%`,
          background: color, boxShadow: `0 0 8px ${color}`,
          transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)" }}>
        <span>{label}</span>
        <span style={{ color: "var(--text)", fontWeight: 700 }}>{display}/100</span>
      </div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────

export function VerdictBadge({ verdict, size = "md" }) {
  const config = {
    AI:     { color: "var(--accent2)", bg: "rgba(255,60,110,0.12)", icon: "alert-triangle", label: "AI Generated" },
    Human:  { color: "var(--accent3)", bg: "rgba(109,255,179,0.1)", icon: "check-circle", label: "Human Written" },
    Mixed:  { color: "var(--warn)",    bg: "rgba(255,184,48,0.1)",  icon: "layers", label: "Mixed Content" },
  };
  const c = config[verdict] || config.Mixed;
  const fs = size === "sm" ? 11 : 14;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: size === "sm" ? "3px 8px" : "6px 14px",
      background: c.bg, border: `1px solid ${c.color}`,
      borderRadius: 6, fontSize: fs, color: c.color, fontWeight: 700,
    }}>
      <Icon name={c.icon} size={size === "sm" ? 13 : 16} /> {c.label}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────

export function Card({ children, style, className = "" }) {
  return (
    <div className={`ui-card${className ? ` ${className}` : ""}`} style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, overflow: "hidden", ...style,
    }}>
      {children}
    </div>
  );
}

export function CardHeader({ children, dot = true, className = "" }) {
  return (
    <div className={`ui-card__header${className ? ` ${className}` : ""}`} style={{
      padding: "13px 20px", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", gap: 10,
      fontSize: 11, color: "var(--muted)", letterSpacing: 1.5,
      textTransform: "uppercase", background: "var(--surface2)",
    }}>
      {dot && <span style={{
        width: 8, height: 8, borderRadius: "50%",
        background: "var(--accent)", boxShadow: "0 0 8px var(--accent)",
        flexShrink: 0, animation: "pulse 2s infinite",
      }} />}
      {children}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────

export function Spinner({ size = 40 }) {
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          position: "absolute",
          inset: i * (size * 0.1),
          borderRadius: "50%",
          border: "2px solid transparent",
          borderTopColor: i === 0 ? "var(--accent)" : i === 1 ? "#0077ff" : "rgba(0,229,255,0.4)",
          animation: `spin ${1 + i * 0.5}s linear infinite`,
          animationDirection: i === 1 ? "reverse" : "normal",
        }} />
      ))}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────

export function Button({ children, onClick, disabled, variant = "primary", style, className = "", type = "button" }) {
  const base = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "13px 24px", border: "none", borderRadius: 8,
    fontFamily: "var(--body)", fontSize: 13, fontWeight: 700,
    letterSpacing: 0.2, textTransform: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    opacity: disabled ? 0.56 : 1,
    ...style,
  };
  const variants = {
    primary: {
      background: "linear-gradient(135deg, var(--accent), #0077ff)",
      color: "#000",
      boxShadow: disabled ? "none" : "0 4px 20px rgba(0,229,255,0.25)",
    },
    ghost: {
      background: "transparent",
      color: "var(--muted)",
      border: "1px solid var(--border2)",
    },
    danger: {
      background: "rgba(255,60,110,0.1)",
      color: "var(--accent2)",
      border: "1px solid rgba(255,60,110,0.3)",
    },
  };
  return (
    <button
      type={type}
      className={`ui-button ui-button--${variant}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant] }}
    >
      {children}
    </button>
  );
}
