import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, RotateCcw, Printer, TrendingUp } from "lucide-react";
import { Card } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/common/Toast";
import { useMockCollection } from "../../hooks/useMockCollection";
import { approveScout, revertScout, promoteScout } from "../../services/scoutService";
import { calculateAge, isPromotionDue, getPromotionTarget } from "../../utils/ageUtils";
import { canReviewScout, SECTION_BY_ROLE } from "../../utils/permissionUtils";
import { triggerPrint, signaturesForSection } from "../../utils/printUtils";

function Field({ label, value }) {
  return (
    <div style={{ padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 14, marginTop: 2 }}>{value ?? "—"}</div>
    </div>
  );
}

export default function ScoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const showToast = useToast();
  const scouts = useMockCollection("scouts");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const s = scouts.find((row) => row.id === id);
  if (!s) return <div className="empty-state">Scout not found.</div>;

  const age = calculateAge(s.date_of_birth);
  const promotionDue = isPromotionDue(s.date_of_birth, s.section);
  const isMyReview = canReviewScout(role) && SECTION_BY_ROLE[role] === s.section && s.status === "under_leader_review";
  const isGsReview = role === "GS" && s.status === "under_gs_review";
  const [sig1, sig2] = signaturesForSection(s.section);

  const doApprove = async (nextStatus) => {
    setBusy(true);
    try {
      await approveScout(s.id, user, nextStatus);
      showToast("Approved and moved forward.");
    } finally { setBusy(false); }
  };

  const doRevert = async () => {
    setBusy(true);
    try {
      await revertScout(s.id, user, comment);
      showToast("Reverted for correction.");
    } finally { setBusy(false); }
  };

  const doPromote = async () => {
    setBusy(true);
    try {
      await promoteScout(s.id, user);
      showToast(`Promoted to ${getPromotionTarget(s.section)}.`);
    } finally { setBusy(false); }
  };

  return (
    <div>
      <button className="btn btn-ghost no-print" onClick={() => navigate(-1)} style={{ marginBottom: 12, paddingLeft: 0 }}>
        <ArrowLeft size={15} /> Back
      </button>

      <Card>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700 }}>{s.scout_id}</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginTop: 2 }}>{s.full_name}</div>
          </div>
          <div className="row gap-8">
            <Badge status={s.status} />
            <button className="btn btn-outline btn-sm no-print" onClick={triggerPrint}><Printer size={14} /> Print</button>
          </div>
        </div>

        {promotionDue && (
          <div className="banner" style={{ background: "var(--purple-soft)", color: "var(--purple)", marginTop: 14 }}>
            <TrendingUp size={16} /> Promotion due — age now qualifies for {getPromotionTarget(s.section)}.
          </div>
        )}

        <div className="grid grid-2" style={{ marginTop: 10 }}>
          <Field label="Father's Name" value={s.father_name} />
          <Field label="Contact Number" value={s.contact_number} />
          <Field label="Emergency Contact" value={s.emergency_contact} />
          <Field label="CNIC / B-Form" value={s.cnic_bform} />
          <Field label="Blood Group" value={s.blood_group} />
          <Field label="Section" value={s.section} />
          <Field label="Date of Birth" value={s.date_of_birth} />
          <Field label="Age" value={age ? `${age.years}y ${age.months}m ${age.days}d` : "—"} />
        </div>

        {isMyReview && (
          <div className="no-print" style={{ marginTop: 20 }}>
            <div className="field">
              <label>Comment (required if reverting)</label>
              <textarea className="input" style={{ minHeight: 60 }} value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
            <div className="row gap-10">
              <button className="btn btn-success" disabled={busy} onClick={() => doApprove("under_gs_review")}><CheckCircle2 size={15} /> Approve → send to GS</button>
              <button className="btn btn-danger-outline" disabled={busy} onClick={doRevert}><RotateCcw size={15} /> Revert to assistant</button>
            </div>
          </div>
        )}

        {isGsReview && (
          <div className="no-print" style={{ marginTop: 20 }}>
            <div className="row gap-10">
              <button className="btn btn-primary" disabled={busy} onClick={() => doApprove("active")}><Printer size={15} /> Print & Finalize</button>
              <button className="btn btn-danger-outline" disabled={busy} onClick={doRevert}><RotateCcw size={15} /> Revert to leader</button>
            </div>
          </div>
        )}

        {role === "GSL" && promotionDue && (
          <div className="no-print" style={{ marginTop: 20 }}>
            <button className="btn btn-primary" disabled={busy} onClick={doPromote}><TrendingUp size={15} /> Initiate Promotion</button>
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
