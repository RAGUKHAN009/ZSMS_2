import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Send, Save } from "lucide-react";
import { Card } from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/common/Toast";
import { saveEventExpenseDraft, submitEventExpense } from "../../services/financeService";
import { addDaysISO } from "../../utils/dateUtils";

export default function NewEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(addDaysISO(14));
  const [rows, setRows] = useState([{ product_name: "", vendor_name: "", total_expense: "" }]);
  const [busy, setBusy] = useState(false);

  const updateRow = (i, key, val) => setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  const addRow = () => setRows((r) => [...r, { product_name: "", vendor_name: "", total_expense: "" }]);
  const removeRow = (i) => setRows((r) => r.filter((_, idx) => idx !== i));

  const total = rows.reduce((sum, r) => sum + Number(r.total_expense || 0), 0);

  const save = async (andExit, sendToGs) => {
    if (!eventName) { showToast("Give the event a name first."); return; }
    setBusy(true);
    try {
      const ev = await saveEventExpenseDraft({ event_name: eventName, event_date: eventDate, expenses: rows }, user);
      if (sendToGs) {
        await submitEventExpense(ev.id, user);
        showToast("Event expense sent to GS.");
      } else {
        showToast(andExit ? "Saved — you can reopen this draft anytime." : "Saved.");
      }
      if (andExit || sendToGs) navigate("/finance");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <div className="page-header"><div className="page-title">New Event Expense</div></div>
      <Card>
        <div className="grid grid-2">
          <div className="field"><label>Event Name</label><input className="input" value={eventName} onChange={(e) => setEventName(e.target.value)} /></div>
          <div className="field"><label>Event Date</label><input type="date" className="input" value={eventDate} onChange={(e) => setEventDate(e.target.value)} /></div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Product</th><th>Vendor</th><th>Total</th><th></th></tr></thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td><input className="input" value={row.product_name} onChange={(e) => updateRow(i, "product_name", e.target.value)} /></td>
                  <td><input className="input" value={row.vendor_name} onChange={(e) => updateRow(i, "vendor_name", e.target.value)} /></td>
                  <td style={{ width: 140 }}><input type="number" className="input" value={row.total_expense} onChange={(e) => updateRow(i, "total_expense", e.target.value)} /></td>
                  <td style={{ width: 40 }}><button className="btn btn-ghost btn-sm" onClick={() => removeRow(i)} disabled={rows.length === 1}><Trash2 size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-outline btn-sm" onClick={addRow} style={{ marginTop: 10 }}><Plus size={14} /> Add Row</button>

        <div style={{ fontWeight: 800, fontSize: 15, margin: "16px 0" }}>Total: Rs {total.toLocaleString()}</div>

        <div className="row gap-10 wrap">
          <button className="btn btn-outline" disabled={busy} onClick={() => save(false, false)}><Save size={15} /> Save</button>
          <button className="btn btn-outline" disabled={busy} onClick={() => save(true, false)}>Save & Exit</button>
          <button className="btn btn-primary" disabled={busy} onClick={() => save(true, true)}><Send size={15} /> Send to GS</button>
        </div>
      </Card>
    </div>
  );
}
