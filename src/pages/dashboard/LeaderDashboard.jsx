import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { FileText, ClipboardList, Clock, CheckCircle2, XCircle, Users, AlertTriangle } from "lucide-react";
import { StatCard, SectionTitle, EmptyState } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useMockCollection } from "../../hooks/useMockCollection";
import { SECTION_BY_ROLE } from "../../utils/permissionUtils";
import { daysUntil, formatDate } from "../../utils/dateUtils";

export default function LeaderDashboard() {
  const { user, role } = useAuth();
  const section = SECTION_BY_ROLE[role];
  const scouts = useMockCollection("scouts");
  const proposals = useMockCollection("proposals");

  const sectionScouts = useMemo(() => scouts.filter((s) => s.section === section), [scouts, section]);
  const reviewQueue = useMemo(() => sectionScouts.filter((s) => s.status === "under_leader_review"), [sectionScouts]);

  const myProposals = useMemo(() => proposals.filter((p) => p.submitting_role === role), [proposals, role]);
  const myAssigned = useMemo(() => myProposals.filter((p) => p.status === "accepted"), [myProposals]);
  const nearExecution = useMemo(() => myAssigned.filter((p) => { const d = daysUntil(p.execution_date); return d >= 0 && d <= 3; }), [myAssigned]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{user?.full_name}'s Dashboard</div>
          <div className="page-subtitle">{role} — reviews {section} scout records and proposes {section} activities.</div>
        </div>
        <Link to="/proposals/new" className="btn btn-primary"><FileText size={16} /> Submit Activity Proposal</Link>
      </div>

      {nearExecution.length > 0 && (
        <div className="banner banner-warning">
          <AlertTriangle size={17} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>Execution reminder.</strong>
            {nearExecution.map((p) => (
              <div key={p.id} style={{ marginTop: 4 }}>{p.activity_name} runs {formatDate(p.execution_date)} ({daysUntil(p.execution_date)}d left).</div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-4">
        <StatCard icon={Users} label={`${section} scouts to review`} value={reviewQueue.length} accent="var(--warning)" />
        <StatCard icon={Clock} label="Proposals in review" value={myProposals.filter(p => ["submitted_to_gs", "under_gsl_review"].includes(p.status)).length} accent="var(--warning)" />
        <StatCard icon={CheckCircle2} label="Accepted" value={myProposals.filter(p => p.status === "accepted").length} accent="var(--success)" />
        <StatCard icon={XCircle} label="Rejected" value={myProposals.filter(p => p.status === "rejected").length} accent="var(--danger)" />
      </div>

      <SectionTitle icon={ClipboardList}>My Assigned Activities</SectionTitle>
      {myAssigned.length === 0 ? <EmptyState message="No accepted activities waiting on execution." /> : myAssigned.map((p) => (
        <Link to={`/proposals/${p.id}`} key={p.id} className="list-row">
          <div><div className="title">{p.activity_name}</div><div className="meta">{p.id} · exec {formatDate(p.execution_date)}</div></div>
          <span style={{ fontSize: 12, fontWeight: 700, color: daysUntil(p.execution_date) <= 3 ? "var(--warning)" : "var(--text-muted)" }}>
            {daysUntil(p.execution_date)}d to execution
          </span>
        </Link>
      ))}

      <SectionTitle icon={FileText}>My Proposals</SectionTitle>
      {myProposals.length === 0 ? <EmptyState message="You haven't submitted a proposal yet." /> : myProposals.map((p) => (
        <Link to={`/proposals/${p.id}`} key={p.id} className="list-row">
          <div><div className="title">{p.activity_name}</div><div className="meta">{p.id} · exec {formatDate(p.execution_date)}</div></div>
          <Badge status={p.status} />
        </Link>
      ))}

      <SectionTitle icon={Users}>{section} Records Under Your Review</SectionTitle>
      {reviewQueue.length === 0 ? <EmptyState message="Nothing waiting on your review." /> : reviewQueue.map((s) => (
        <Link to={`/scouts/${s.id}`} key={s.id} className="list-row">
          <div><div className="title">{s.full_name}</div><div className="meta">{s.scout_id}</div></div>
          <Badge status={s.status} />
        </Link>
      ))}
    </div>
  );
}
