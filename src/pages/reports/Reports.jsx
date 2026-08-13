import React, { useMemo } from "react";
import { Users, Wallet, ClipboardList, TrendingUp, Printer } from "lucide-react";
import { StatCard, SectionTitle, EmptyState } from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";
import { useMockCollection } from "../../hooks/useMockCollection";
import { isPromotionDue } from "../../utils/ageUtils";
import { triggerPrint } from "../../utils/printUtils";

export default function Reports() {
  const { role } = useAuth();
  const scouts = useMockCollection("scouts");
  const proposals = useMockCollection("proposals");
  const expenses = useMockCollection("expenses");
  const events = useMockCollection("events");

  const totals = useMemo(() => ({
    scouts: scouts.length,
    ss: scouts.filter((s) => s.section === "SS").length,
    bs: scouts.filter((s) => s.section === "BS").length,
    rs: scouts.filter((s) => s.section === "RS").length,
    promotionsDue: scouts.filter((s) => isPromotionDue(s.date_of_birth, s.section)).length,
    proposalsAccepted: proposals.filter((p) => p.status === "accepted").length,
    proposalsRejected: proposals.filter((p) => p.status === "rejected").length,
    proposalsPending: proposals.filter((p) => ["submitted_to_gs", "under_gsl_review"].includes(p.status)).length,
    expenseTotal: expenses.reduce((sum, e) => sum + Number(e.total_amount || 0), 0)
      + events.reduce((sum, ev) => sum + (ev.expenses || []).reduce((s2, r) => s2 + Number(r.total_expense || 0), 0), 0),
  }), [scouts, proposals, expenses, events]);

  const canSeeFinance = ["GSL", "GS", "FS"].includes(role);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Reports</div>
          <div className="page-subtitle">Summary snapshot across scouts, proposals{canSeeFinance ? " and finance" : ""}.</div>
        </div>
        <button className="btn btn-outline no-print" onClick={triggerPrint}><Printer size={15} /> Print Report</button>
      </div>

      <SectionTitle icon={Users}>Scouts</SectionTitle>
      <div className="grid grid-4">
        <StatCard icon={Users} label="Total Enrolled" value={totals.scouts} accent="var(--primary)" />
        <StatCard icon={Users} label="Shaheen (SS)" value={totals.ss} accent="var(--purple)" />
        <StatCard icon={Users} label="Boy Scout (BS)" value={totals.bs} accent="var(--success)" />
        <StatCard icon={Users} label="Rover (RS)" value={totals.rs} accent="var(--warning)" />
      </div>

      <SectionTitle icon={TrendingUp}>Promotions</SectionTitle>
      <div className="grid grid-2">
        <StatCard icon={TrendingUp} label="Currently Due" value={totals.promotionsDue} accent="var(--purple)" />
        <StatCard icon={TrendingUp} label="Total Enrolled" value={totals.scouts} accent="var(--text-muted)" />
      </div>

      <SectionTitle icon={ClipboardList}>Activity Proposals</SectionTitle>
      <div className="grid grid-3">
        <StatCard icon={ClipboardList} label="In Review" value={totals.proposalsPending} accent="var(--warning)" />
        <StatCard icon={ClipboardList} label="Accepted" value={totals.proposalsAccepted} accent="var(--success)" />
        <StatCard icon={ClipboardList} label="Rejected" value={totals.proposalsRejected} accent="var(--danger)" />
      </div>

      {canSeeFinance ? (
        <>
          <SectionTitle icon={Wallet}>Finance</SectionTitle>
          <div className="grid grid-2">
            <StatCard icon={Wallet} label="Total Logged Expenses" value={`Rs ${totals.expenseTotal.toLocaleString()}`} accent="var(--danger)" />
            <StatCard icon={Wallet} label="Total Income" value="Rs 0" accent="var(--success)" />
          </div>
        </>
      ) : null}
    </div>
  );
}
