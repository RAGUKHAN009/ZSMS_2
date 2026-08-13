import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Users, Calendar, Target, FileText, CheckCircle2, XCircle,
  Printer, Eye, AlertTriangle,
} from "lucide-react";
import { Card } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/common/Toast";
import { useMockCollection } from "../../hooks/useMockCollection";
import {
  gsForwardProposal, gslAcceptProposal, gslRejectProposal,
} from "../../services/proposalService";
import { daysUntil, formatDate } from "../../utils/dateUtils";
import { canForwardProposal, canDecideProposal } from "../../utils/permissionUtils";
import { triggerPrint } from "../../utils/printUtils";

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <Icon size={15} color="var(--text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: .4 }}>{label}</div>
        <div style={{ fontSize: 14, marginTop: 2 }}>{value ?? "—"}</div>
      </div>
    </div>
  );
}

export default function ProposalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const showToast = useToast();
  const proposals = useMockCollection("proposals");
  const users = useMockCollection("users");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const p = proposals.find((row) => row.id === id);

  if (!p) {
    return <div className="empty-state">Proposal not found.</div>;
  }

  const nameOf = (userId) => users.find((u) => u.id === userId)?.full_name || userId;
  const days = daysUntil(p.execution_date);

  const handleForward = async () => {
    setBusy(true);
    try {
      await gsForwardProposal(p.id, user);
      showToast("Printed and forwarded to GSL for decision.");
    } finally {
      setBusy(false);
    }
  };

  const handleDecision = async (decision) => {
    setBusy(true);
    try {
      if (decision === "accepted") await gslAcceptProposal(p.id, user, comment);
      else await gslRejectProposal(p.id, user, comment);
      showToast(decision === "accepted"
        ? `Accepted — routed back to ${p.submitting_role} for execution.`
        : "Proposal rejected and returned with a comment.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button className="btn btn-ghost no-print" onClick={() => navigate(-1)} style={{ marginBottom: 12, paddingLeft: 0 }}>
        <ArrowLeft size={15} /> Back
      </button>

      <Card>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700 }}>{p.id}</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>{p.activity_name}</div>
          </div>
          <div className="row gap-8">
            <Badge status={p.status} />
            <button className="btn btn-outline btn-sm no-print" onClick={triggerPrint}><Printer size={14} /> Print</button>
          </div>
        </div>

        {p.status === "accepted" && days <= 3 && days >= 0 && (
          <div className="banner banner-warning" style={{ marginTop: 14 }}>
            <AlertTriangle size={16} />
            Execution in {days} day{days === 1 ? "" : "s"} — reminder active for {p.submitting_role}, GS and GSL.
          </div>
        )}

        <div style={{ marginTop: 10 }}>
          <DetailRow icon={Users} label="Submitted by" value={`${nameOf(p.submitted_by)} · ${p.submitting_role} · ${p.scouts_group || ""}`} />
          <DetailRow icon={Calendar} label="Time-line" value={p.timeline} />
          <DetailRow icon={Calendar} label="Date of execution" value={formatDate(p.execution_date)} />
          <DetailRow icon={Target} label="Purpose" value={p.purpose} />
          <DetailRow icon={Users} label="Total scouts included" value={p.total_scouts} />
          <DetailRow icon={FileText} label="Details" value={p.details} />
          <DetailRow icon={CheckCircle2} label="Expected outcomes" value={p.outcomes} />
          {p.gs_reviewed_by && <DetailRow icon={Printer} label="Verified & forwarded by" value={nameOf(p.gs_reviewed_by)} />}
          {p.gsl_decision_by && (
            <DetailRow icon={Eye} label="GSL decision by" value={`${nameOf(p.gsl_decision_by)}${p.gsl_comment ? ` — "${p.gsl_comment}"` : ""}`} />
          )}
        </div>

        {canForwardProposal(role) && p.status === "submitted_to_gs" && (
          <div className="row gap-10 no-print" style={{ marginTop: 20 }}>
            <button className="btn btn-primary" disabled={busy} onClick={handleForward}>
              <Printer size={15} /> Print & Forward to GSL
            </button>
          </div>
        )}

        {canDecideProposal(role) && p.status === "under_gsl_review" && (
          <div className="no-print" style={{ marginTop: 20 }}>
            <div className="field">
              <label>Decision comment (optional)</label>
              <textarea className="input" style={{ minHeight: 60 }} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Visible to the submitting leader" />
            </div>
            <div className="row gap-10">
              <button className="btn btn-success" disabled={busy} onClick={() => handleDecision("accepted")}><CheckCircle2 size={15} /> Accept</button>
              <button className="btn btn-danger-outline" disabled={busy} onClick={() => handleDecision("rejected")}><XCircle size={15} /> Reject</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
