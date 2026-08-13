import React from "react";

export function Card({ children, style }) {
  return <div className="card" style={style}>{children}</div>;
}

export function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="stat-card">
      <div className="stat-label" style={{ color: accent || "var(--text-muted)" }}>
        {Icon && <Icon size={15} />}
        {label}
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export function EmptyState({ message = "Nothing here yet." }) {
  return <div className="card empty-state">{message}</div>;
}

export function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="section-title">
      {Icon && <Icon size={15} />}
      {children}
    </div>
  );
}
