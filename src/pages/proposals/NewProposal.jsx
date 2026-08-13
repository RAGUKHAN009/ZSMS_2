import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Send } from "lucide-react";
import { Card } from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/common/Toast";
import { createProposal } from "../../services/proposalService";
import { addDaysISO } from "../../utils/dateUtils";
import { SECTION_BY_ROLE, canSubmitProposal } from "../../utils/permissionUtils";

const emptyForm = () => ({
  activity_name: "",
  timeline: "",
  execution_date: addDaysISO(7),
  purpose: "",
  total_scouts: "",
  details: "",
  outcomes: "",
});

export default function NewProposal() {
  const { role, user } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [form, setForm] = useState(emptyForm());
  const [busy, setBusy] = useState(false);

  if (!canSubmitProposal(role)) return <Navigate to="/proposals" replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.activity_name || !form.execution_date || !form.purpose || !form.details) {
      showToast("Fill in activity name, purpose, execution date and details.");
      return;
    }
    setBusy(true);
    try {
      const p = await createProposal({ ...form, total_scouts: Number(form.total_scouts) || 0, scouts_group: SECTION_BY_ROLE[role] }, user);
      showToast(`Proposal ${p.id} sent to GS for verification.`);
      navigate("/proposals");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Submit Activity Proposal</div>
          <div className="page-subtitle">{role} · {SECTION_BY_ROLE[role]} section — goes to GS for verification and printing, then GSL for a decision.</div>
        </div>
      </div>

      <Card>
        <form onSubmit={submit}>
          <div className="field">
            <label>Name of Activity</label>
            <input className="input" value={form.activity_name} onChange={set("activity_name")} placeholder="e.g. Annual Monsoon Hiking Camp" />
          </div>

          <div className="grid grid-2">
            <div className="field">
              <label>Time-Line</label>
              <input className="input" value={form.timeline} onChange={set("timeline")} placeholder="e.g. Fri 6 AM – Sun 5 PM" />
            </div>
            <div className="field">
              <label>Date of Execution</label>
              <input type="date" className="input" value={form.execution_date} onChange={set("execution_date")} />
            </div>
          </div>

          <div className="field">
            <label>Purpose</label>
            <textarea className="input" style={{ minHeight: 60 }} value={form.purpose} onChange={set("purpose")} placeholder="Why this activity, and what it's meant to achieve" />
          </div>

          <div className="grid grid-2">
            <div className="field">
              <label>Total Scouts Included</label>
              <input type="number" className="input" value={form.total_scouts} onChange={set("total_scouts")} placeholder="0" />
            </div>
            <div className="field">
              <label>Scouts Group</label>
              <input className="input" value={SECTION_BY_ROLE[role]} disabled />
              <div className="hint">Auto-set from your section</div>
            </div>
          </div>

          <div className="field">
            <label>Details</label>
            <textarea className="input" style={{ minHeight: 130 }} value={form.details} onChange={set("details")} placeholder="Full plan: logistics, staffing, risk notes, itinerary" />
            <div className="hint">Main text area — cover everything GS and GSL need to evaluate this.</div>
          </div>

          <div className="field">
            <label>Expected Outcomes</label>
            <textarea className="input" style={{ minHeight: 60 }} value={form.outcomes} onChange={set("outcomes")} />
          </div>

          <div className="row gap-10">
            <button className="btn btn-primary" disabled={busy}><Send size={15} /> Submit to GS</button>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </Card>
    </div>
  );
}
