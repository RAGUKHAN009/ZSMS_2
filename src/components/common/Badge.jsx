import React from "react";

// Status semantics (spec section 26): blue=info, green=active/approved,
// yellow=pending/review, red=error/reverted, purple=promotion, gray=draft/archived.
const STATUS_STYLES = {
  draft: { color: "var(--text-muted)", bg: "var(--gray-soft)", label: "Draft" },
  submitted: { color: "var(--primary)", bg: "var(--primary-soft)", label: "Submitted" },
  submitted_to_gs: { color: "var(--warning)", bg: "var(--warning-soft)", label: "Submitted to GS" },
  under_leader_review: { color: "var(--warning)", bg: "var(--warning-soft)", label: "Under Leader Review" },
  under_gs_review: { color: "var(--warning)", bg: "var(--warning-soft)", label: "Under GS Review" },
  under_gsl_review: { color: "var(--warning)", bg: "var(--warning-soft)", label: "Awaiting GSL Decision" },
  reverted_to_assistant: { color: "var(--danger)", bg: "var(--danger-soft)", label: "Reverted" },
  reverted_to_leader: { color: "var(--danger)", bg: "var(--danger-soft)", label: "Reverted to Leader" },
  reverted_to_fs: { color: "var(--danger)", bg: "var(--danger-soft)", label: "Reverted to FS" },
  approved_by_leader: { color: "var(--success)", bg: "var(--success-soft)", label: "Approved by Leader" },
  approved_by_gs: { color: "var(--success)", bg: "var(--success-soft)", label: "Approved by GS" },
  active: { color: "var(--success)", bg: "var(--success-soft)", label: "Active" },
  accepted: { color: "var(--success)", bg: "var(--success-soft)", label: "Accepted" },
  rejected: { color: "var(--danger)", bg: "var(--danger-soft)", label: "Rejected" },
  promotion_due: { color: "var(--purple)", bg: "var(--purple-soft)", label: "Promotion Due" },
  promotion_in_progress: { color: "var(--purple)", bg: "var(--purple-soft)", label: "Promotion In Progress" },
  transferred: { color: "var(--purple)", bg: "var(--purple-soft)", label: "Transferred" },
  archived: { color: "var(--text-muted)", bg: "var(--gray-soft)", label: "Archived" },
};

export default function Badge({ status, children }) {
  const s = STATUS_STYLES[status] || { color: "var(--text-muted)", bg: "var(--gray-soft)", label: status };
  return (
    <span className="badge" style={{ color: s.color, background: s.bg }}>
      <span className="dot" />
      {children || s.label}
    </span>
  );
}
