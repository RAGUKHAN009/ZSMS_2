import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users, ShieldCheck, Wallet, ArrowRight, Clock, CheckCircle2, XCircle,
  TrendingUp, ClipboardList, Bell, AlertTriangle,
} from "lucide-react";
import { StatCard, SectionTitle, EmptyState } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { useMockCollection } from "../../hooks/useMockCollection";
import { daysUntil, formatDate } from "../../utils/dateUtils";
import { isPromotionDue } from "../../utils/ageUtils";

export default function GSLDashboard() {
  const scouts = useMockCollection("scouts");
  const proposals = useMockCollection("proposals");
  const expenses = useMockCollection("expenses");

  const totals = useMemo(() => ({
    total: scouts.length,
    ss: scouts.filter((s) => s.section === "SS").length,
    bs: scouts.filter((s) => s.section === "BS").length,
    rs: scouts.filter((s) => s.section === "RS").length,
  }), [scouts]);

  const promotionsDue = useMemo(
    () => scouts.filter((s) => isPromotionDue(s.date_of_birth, s.section)),
    [scouts]
  );

  const gslQueue = useMemo(() => proposals.filter((p) => p.status === "under_gsl_review"), [proposals]);
  const accepted = useMemo(() => proposals.filter((p) => p.status === "accepted"), [proposals]);
  const rejected = useMemo(() => proposals.filter((p) => p.status === "rejected"), [proposals]);
  const upcoming = useMemo(
    () => accepted.filter((p) => { const d = daysUntil(p.execution_date); return d >= 0 && d <= 3; }),
    [accepted]
  );

  const totalExpense = useMemo(() => expenses.reduce((sum, e) => sum + Number(e.total_amount || 0), 0), [expenses]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">GSL Dashboard</div>
          <div className="page-subtitle">Organization-wide view — scouts, reviews, promotions, finance and activity proposals.</div>
        </div>
      </div>

      {upcoming.length > 0 && (
        <div className="banner banner-warning">
          <AlertTriangle size={17} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>Execution reminder.</strong> {upcoming.length} accepted activit{upcoming.length === 1 ? "y runs" : "ies run"} within 3 days.
            <div style={{ marginTop: 4 }}>
              {upcoming.map((p) => (
                <div key={p.id}>{p.activity_name} — {formatDate(p.execution_date)} ({p.submitting_role})</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <SectionTitle icon={Users}>Scout Totals</SectionTitle>
      <div className="grid grid-4">
        <StatCard icon={Users} label="Total Enrolled" value={totals.total} accent="var(--primary)" />
        <StatCard icon={Users} label="Shaheen (SS)" value={totals.ss} accent="var(--purple)" />
        <StatCard icon={Users} label="Boy Scout (BS)" value={totals.bs} accent="var(--success)" />
        <StatCard icon={Users} label="Rover (RS)" value={totals.rs} accent="var(--warning)" />
      </div>

      <SectionTitle icon={ShieldCheck}>Review Queues</SectionTitle>
      <div className="grid grid-4">
        <StatCard icon={Clock} label="Under SSL Review" value={scouts.filter(s => s.status === "under_leader_review" && s.section === "SS").length} accent="var(--warning)" />
        <StatCard icon={Clock} label="Under SL Review" value={scouts.filter(s => s.status === "under_leader_review" && s.section === "BS").length} accent="var(--warning)" />
        <StatCard icon={Clock} label="Under RL Review" value={scouts.filter(s => s.status === "under_leader_review" && s.section === "RS").length} accent="var(--warning)" />
        <StatCard icon={Clock} label="Under GS Review" value={scouts.filter(s => s.status === "under_gs_review").length} accent="var(--warning)" />
      </div>

      <SectionTitle icon={TrendingUp}>Promotions</SectionTitle>
      <div className="grid grid-3">
        <StatCard icon={TrendingUp} label="Shaheen due" value={promotionsDue.filter(s => s.section === "SS").length} accent="var(--purple)" />
        <StatCard icon={TrendingUp} label="Boy Scout due" value={promotionsDue.filter(s => s.section === "BS").length} accent="var(--purple)" />
        <StatCard icon={TrendingUp} label="Total pending" value={promotionsDue.length} accent="var(--purple)" />
      </div>

      <SectionTitle icon={Wallet}>Finance</SectionTitle>
      <div className="grid grid-3">
        <StatCard icon={Wallet} label="Monthly Expenses" value={`Rs ${totalExpense.toLocaleString()}`} accent="var(--danger)" />
        <StatCard icon={Wallet} label="Monthly Income" value="Rs 0" accent="var(--success)" />
        <StatCard icon={Wallet} label="Balance" value={`-Rs ${totalExpense.toLocaleString()}`} accent="var(--text-muted)" />
      </div>

      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <SectionTitle icon={ClipboardList}>Activity Proposals</SectionTitle>
        <Link to="/proposals" className="btn btn-ghost btn-sm">Open proposals <ArrowRight size={14} /></Link>
      </div>
      <div className="grid grid-3">
        <StatCard icon={Clock} label="Awaiting Decision" value={gslQueue.length} accent="var(--warning)" />
        <StatCard icon={CheckCircle2} label="Accepted" value={accepted.length} accent="var(--success)" />
        <StatCard icon={XCircle} label="Rejected" value={rejected.length} accent="var(--danger)" />
      </div>

      {gslQueue.length === 0 ? <EmptyState message="Nothing waiting on your decision right now." /> : (
        <div style={{ marginTop: 12 }}>
          {gslQueue.map((p) => (
            <Link to={`/proposals/${p.id}`} key={p.id} className="list-row">
              <div>
                <div className="title">{p.activity_name}</div>
                <div className="meta">{p.id} · {p.submitting_role} · exec {formatDate(p.execution_date)}</div>
              </div>
              <Badge status={p.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
