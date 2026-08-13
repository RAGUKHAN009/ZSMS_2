import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Send } from "lucide-react";
import { Card } from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/common/Toast";
import { createExpense, submitExpense } from "../../services/financeService";

export default function NewExpense() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [items, setItems] = useState([{ item_name: "", quantity: 1, total_expense: "" }]);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const updateItem = (i, key, val) => setItems((rows) => rows.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  const addRow = () => setItems((rows) => [...rows, { item_name: "", quantity: 1, total_expense: "" }]);
  const removeRow = (i) => setItems((rows) => rows.filter((_, idx) => idx !== i));

  const total = items.reduce((sum, r) => sum + Number(r.total_expense || 0), 0);

  const submit = async (sendToGs) => {
    setBusy(true);
    try {
      const exp = await createExpense({ items, notes }, user);
      if (sendToGs) await submitExpense(exp.id, user);
      showToast(sendToGs ? "Expense sent to GS." : "Saved as draft.");
      navigate("/finance");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">New General Expense</div>
      </div>

      <Card>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Item</th><th>Quantity</th><th>Total</th><th></th></tr></thead>
            <tbody>
              {items.map((row, i) => (
                <tr key={i}>
                  <td><input className="input" value={row.item_name} onChange={(e) => updateItem(i, "item_name", e.target.value)} /></td>
                  <td style={{ width: 110 }}><input type="number" className="input" value={row.quantity} onChange={(e) => updateItem(i, "quantity", e.target.value)} /></td>
                  <td style={{ width: 140 }}><input type="number" className="input" value={row.total_expense} onChange={(e) => updateItem(i, "total_expense", e.target.value)} /></td>
                  <td style={{ width: 40 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => removeRow(i)} disabled={items.length === 1}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn btn-outline btn-sm" onClick={addRow} style={{ marginTop: 10 }}><Plus size={14} /> Add Another Expense</button>

        <div className="field" style={{ marginTop: 20 }}>
          <label>Notes</label>
          <textarea className="input" style={{ minHeight: 60 }} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div style={{ fontWeight: 800, fontSize: 15, margin: "16px 0" }}>Total: Rs {total.toLocaleString()}</div>

        <div className="row gap-10">
          <button className="btn btn-outline" disabled={busy} onClick={() => submit(false)}>Save Draft</button>
          <button className="btn btn-primary" disabled={busy} onClick={() => submit(true)}><Send size={15} /> Send to GS</button>
        </div>
      </Card>
    </div>
  );
}
