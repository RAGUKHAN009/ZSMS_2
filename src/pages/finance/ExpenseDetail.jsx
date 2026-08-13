import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, RotateCcw, CheckCircle2 } from "lucide-react";
import { Card } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/common/Toast";
import { useMockCollection } from "../../hooks/useMockCollection";
import { revertExpense } from "../../services/financeService";
import { setCollection, addAuditLog } from "../../data/mockDb";
import { canReviewFinance } from "../../utils/permissionUtils";
import { triggerPrint, signaturesForSection } from "../../utils/printUtils";

export default function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const showToast = useToast();
  const expenses = useMockCollection("expenses");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const e = expenses.find((row) => row.id === id);
  if (!e) return <div className="empty-state">Expense not found.</div>;
  const [sig1, sig2] = signaturesForSection("FINANCE");

  const finalize = async () => {
    setBusy(true);
    try {
      setCollection("expenses", (rows) => rows.map((row) => (row.id === id ? { ...row, status: "active" } : row)));
      addAuditLog({ actor: user.full_name, action: "expense_finalized", entity: "expenses", entityId: id, newState: "active" });
      showToast("Printed and finalized to the finance database.");
    } finally { setBusy(false); }
  };

  const revert = async () => {
    setBusy(true);
    try {
      await revertExpense(id, user, comment);
      showToast("Reverted to FS.");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <button className="btn btn-ghost no-print" onClick={() => navigate(-1)} style={{ marginBottom: 12, paddingLeft: 0 }}><ArrowLeft size={15} /> Back</button>
      <Card>
        <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700 }}>{e.expense_number}</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Rs {Number(e.total_amount).toLocaleString()}</div>
          </div>
          <div className="row gap-8">
            <Badge status={e.status} />
            <button className="btn btn-outline btn-sm no-print" onClick={triggerPrint}><Printer size={14} /> Print</button>
          </div>
        </div>

        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table className="data-table">
            <thead><tr><th>Item</th><th>Quantity</th><th>Total</th></tr></thead>
            <tbody>
              {(e.items || []).map((row) => (
                <tr key={row.id}><td>{row.item_name}</td><td>{row.quantity}</td><td>Rs {Number(row.total_expense).toLocaleString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        {e.notes && <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>{e.notes}</div>}

        {canReviewFinance(role) && e.status === "under_gs_review" && (
          <div className="no-print" style={{ marginTop: 20 }}>
            <div className="field"><label>Comment (if reverting)</label><textarea className="input" style={{ minHeight: 60 }} value={comment} onChange={(ev) => setComment(ev.target.value)} /></div>
            <div className="row gap-10">
              <button className="btn btn-primary" disabled={busy} onClick={finalize}><CheckCircle2 size={15} /> Print & Finalize</button>
              <button className="btn btn-danger-outline" disabled={busy} onClick={revert}><RotateCcw size={15} /> Revert to FS</button>
            </div>
          </div>
        )}

        <div className="grid grid-2" style={{ marginTop: 30 }}>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 30, textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>{sig1}</div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 30, textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>{sig2}</div>
        </div>
      </Card>
    </div>
  );
}
