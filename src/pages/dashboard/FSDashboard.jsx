import React from "react";
import { Link } from "react-router-dom";
import { Plus, Wallet, Calendar } from "lucide-react";
import { StatCard, SectionTitle, EmptyState } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { useMockCollection } from "../../hooks/useMockCollection";

export default function FSDashboard() {
  const expenses = useMockCollection("expenses");
  const events = useMockCollection("events");
  const total = expenses.reduce((sum, e) => sum + Number(e.total_amount || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Finance Secretary Dashboard</div>
          <div className="page-subtitle">Log general expenses and event expenses for GS review.</div>
        </div>
        <div className="row gap-8">
          <Link to="/finance/expenses/new" className="btn btn-outline"><Plus size={15} /> New Expense</Link>
          <Link to="/finance/events/new" className="btn btn-primary"><Plus size={15} /> New Event Expense</Link>
        </div>
      </div>

      <div className="grid grid-3">
        <StatCard icon={Wallet} label="Total logged this month" value={`Rs ${total.toLocaleString()}`} accent="var(--primary)" />
        <StatCard icon={Wallet} label="Awaiting GS review" value={expenses.filter(e => e.status === "under_gs_review").length} accent="var(--warning)" />
        <StatCard icon={Calendar} label="Event drafts" value={events.filter(e => e.status === "draft").length} accent="var(--text-muted)" />
      </div>

      <SectionTitle icon={Wallet}>Recent Expenses</SectionTitle>
      {expenses.length === 0 ? <EmptyState /> : expenses.map((e) => (
        <Link to={`/finance/expenses/${e.id}`} key={e.id} className="list-row">
          <div><div className="title">{e.expense_number}</div><div className="meta">Rs {Number(e.total_amount).toLocaleString()} · {e.expense_date}</div></div>
          <Badge status={e.status} />
        </Link>
      ))}

      <SectionTitle icon={Calendar}>Event Expenses</SectionTitle>
      {events.length === 0 ? <EmptyState /> : events.map((ev) => (
        <Link to={`/finance/events/${ev.id}`} key={ev.id} className="list-row">
          <div><div className="title">{ev.event_name}</div><div className="meta">{ev.event_date}</div></div>
          <Badge status={ev.status} />
        </Link>
      ))}
    </div>
  );
}
