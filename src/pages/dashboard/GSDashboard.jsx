import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Printer, CheckCircle2, XCircle, Wallet, Users, ClipboardList } from "lucide-react";
import { StatCard, SectionTitle, EmptyState } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { useMockCollection } from "../../hooks/useMockCollection";
import { formatDate } from "../../utils/dateUtils";

export default function GSDashboard() {
  const scouts = useMockCollection("scouts");
  const proposals = useMockCollection("proposals");
  const expenses = useMockCollection("expenses");

  const scoutQueue = useMemo(() => scouts.filter((s) => s.status === "under_gs_review"), [scouts]);
  const gsQueue = useMemo(() => proposals.filter((p) => p.status === "submitted_to_gs"), [proposals]);
  const accepted = useMemo(() => proposals.filter((p) => p.status === "accepted"), [proposals]);
  const rejected = useMemo(() => proposals.filter((p) => p.status === "rejected"), [proposals]);
  const expenseQueue = useMemo(() => expenses.filter((e) => e.status === "under_gs_review"), [expenses]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Group Secretary Dashboard</div>
          <div className="page-subtitle">Verify and print scout forms, forward activity proposals, review finance records.</div>
        </div>
      </div>

      <div className="grid grid-4">
        <StatCard icon={Users} label="Scouts to verify" value={scoutQueue.length} accent="var(--warning)" />
        <StatCard icon={ClipboardList} label="Proposals to forward" value={gsQueue.length} accent="var(--warning)" />
        <StatCard icon={Wallet} label="Expenses to review" value={expenseQueue.length} accent="var(--warning)" />
        <StatCard icon={CheckCircle2} label="Accepted proposals" value={accepted.length} accent="var(--success)" />
      </div>

      <SectionTitle icon={Printer}>Incoming Activity Proposals</SectionTitle>
      {gsQueue.length === 0 ? <EmptyState message="Nothing waiting to be verified and forwarded." /> : gsQueue.map((p) => (
        <Link to={`/proposals/${p.id}`} key={p.id} className="list-row">
          <div><div className="title">{p.activity_name}</div><div className="meta">{p.id} · {p.submitting_role} · exec {formatDate(p.execution_date)}</div></div>
          <Badge status={p.status} />
        </Link>
      ))}

      <SectionTitle icon={Users}>Scouts Awaiting Verification</SectionTitle>
      {scoutQueue.length === 0 ? <EmptyState message="No scout forms waiting on GS." /> : scoutQueue.map((s) => (
        <Link to={`/scouts/${s.id}`} key={s.id} className="list-row">
          <div><div className="title">{s.full_name}</div><div className="meta">{s.scout_id} · {s.section}</div></div>
          <Badge status={s.status} />
        </Link>
      ))}

      <SectionTitle icon={CheckCircle2}>Accepted Proposals</SectionTitle>
      {accepted.length === 0 ? <EmptyState /> : accepted.map((p) => (
        <Link to={`/proposals/${p.id}`} key={p.id} className="list-row">
          <div><div className="title">{p.activity_name}</div><div className="meta">{p.id} · exec {formatDate(p.execution_date)}</div></div>
          <Badge status={p.status} />
        </Link>
      ))}

      <SectionTitle icon={XCircle}>Rejected Proposals</SectionTitle>
      {rejected.length === 0 ? <EmptyState /> : rejected.map((p) => (
        <Link to={`/proposals/${p.id}`} key={p.id} className="list-row">
          <div><div className="title">{p.activity_name}</div><div className="meta">{p.id}</div></div>
          <Badge status={p.status} />
        </Link>
      ))}
    </div>
  );
}
