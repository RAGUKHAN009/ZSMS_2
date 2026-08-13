import React from "react";
import { Link } from "react-router-dom";
import { Wallet, Calendar, Plus } from "lucide-react";
import { SectionTitle, EmptyState } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useMockCollection } from "../../hooks/useMockCollection";
import { canManageFinance } from "../../utils/permissionUtils";

export default function Finance() {
  const { role } = useAuth();
  const expenses = useMockCollection("expenses");
  const events = useMockCollection("events");

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Finance</div>
          <div className="page-subtitle">General expenses and event expenses, from draft through GS review.</div>
        </div>
        {canManageFinance(role) && (
          <div className="row gap-8">
            <Link to="/finance/expenses/new" className="btn btn-outline"><Plus size={15} /> New Expense</Link>
            <Link to="/finance/events/new" className="btn btn-primary"><Plus size={15} /> New Event Expense</Link>
          </div>
        )}
      </div>

      <SectionTitle icon={Wallet}>General Expenses</SectionTitle>
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
