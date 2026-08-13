import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FileText, Clock, CheckCircle2, XCircle, Printer, Eye } from "lucide-react";
import { SectionTitle, EmptyState } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useMockCollection } from "../../hooks/useMockCollection";
import { formatDate } from "../../utils/dateUtils";
import { canSubmitProposal } from "../../utils/permissionUtils";

function Row({ p }) {
  return (
    <Link to={`/proposals/${p.id}`} className="list-row">
      <div>
        <div className="title">{p.activity_name}</div>
        <div className="meta">{p.id} · {p.submitting_role} · {p.scouts_group} · exec {formatDate(p.execution_date)}</div>
      </div>
      <Badge status={p.status} />
    </Link>
  );
}

export default function ProposalsList() {
  const { role, user } = useAuth();
  const proposals = useMockCollection("proposals");

  const grouped = useMemo(() => {
    if (["SSL", "SL", "RL"].includes(role)) {
      const mine = proposals.filter((p) => p.submitting_role === role);
      return {
        title: "My Activity Proposals",
        sections: [
          { label: "Assigned to me (accepted)", icon: CheckCircle2, rows: mine.filter((p) => p.status === "accepted") },
          { label: "In review", icon: Clock, rows: mine.filter((p) => ["submitted_to_gs", "under_gsl_review"].includes(p.status)) },
          { label: "Rejected", icon: XCircle, rows: mine.filter((p) => p.status === "rejected") },
        ],
      };
    }
    if (role === "GS") {
      return {
        title: "Activity Proposals — GS",
        sections: [
          { label: "Incoming (verify & forward)", icon: Printer, rows: proposals.filter((p) => p.status === "submitted_to_gs") },
          { label: "Accepted", icon: CheckCircle2, rows: proposals.filter((p) => p.status === "accepted") },
          { label: "Rejected", icon: XCircle, rows: proposals.filter((p) => p.status === "rejected") },
        ],
      };
    }
    // GSL and everyone else with visibility
    return {
      title: "Activity Proposals — GSL",
      sections: [
        { label: "Awaiting my decision", icon: Clock, rows: proposals.filter((p) => p.status === "under_gsl_review") },
        { label: "Accepted", icon: CheckCircle2, rows: proposals.filter((p) => p.status === "accepted") },
        { label: "Rejected", icon: XCircle, rows: proposals.filter((p) => p.status === "rejected") },
        { label: "All proposals (full preview access)", icon: Eye, rows: proposals },
      ],
    };
  }, [role, proposals, user]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{grouped.title}</div>
          <div className="page-subtitle">Fixed template: name, timeline, execution date, purpose, scout count, group, details, outcomes.</div>
        </div>
        {canSubmitProposal(role) && (
          <Link to="/proposals/new" className="btn btn-primary"><FileText size={16} /> Submit Activity Proposal</Link>
        )}
      </div>

      {grouped.sections.map((s) => (
        <div key={s.label}>
          <SectionTitle icon={s.icon}>{s.label}</SectionTitle>
          {s.rows.length === 0 ? <EmptyState /> : s.rows.map((p) => <Row key={p.id} p={p} />)}
        </div>
      ))}
    </div>
  );
}
