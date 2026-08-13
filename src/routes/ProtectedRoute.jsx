import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allow }) {
  const { user, loading, role } = useAuth();

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(role)) return <Navigate to="/dashboard" replace />;

  return children;
}
