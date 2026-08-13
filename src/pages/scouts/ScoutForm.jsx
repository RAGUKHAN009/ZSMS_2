import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { Save, Send } from "lucide-react";
import { Card } from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/common/Toast";
import { createScout, getScout, submitScout, updateScout } from "../../services/scoutService";
import { calculateAge, getScoutSection } from "../../utils/ageUtils";
import { canCreateScout } from "../../utils/permissionUtils";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Don't Know"];

const emptyForm = () => ({
  full_name: "", father_name: "", contact_number: "", cnic_bform: "",
  emergency_contact: "", blood_group: "Don't Know", date_of_birth: "",
  uniform_available: "No", old_uniform_donation: "No", need_uniform: "No",
});

export default function ScoutForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { role, user } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();
  const [form, setForm] = useState(emptyForm());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isEdit) getScout(id).then((s) => s && setForm({ ...emptyForm(), ...s }));
  }, [id, isEdit]);

  if (!isEdit && !canCreateScout(role)) return <Navigate to="/scouts" replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const age = calculateAge(form.date_of_birth);
  const projectedSection = getScoutSection(form.date_of_birth);

  const validate = () => form.full_name && form.father_name && form.contact_number && form.date_of_birth;

  const saveDraft = async () => {
    if (!validate()) { showToast("Fill in name, father's name, contact and date of birth."); return; }
    setBusy(true);
    try {
      if (isEdit) await updateScout(id, form);
      else await createScout(form, user);
      showToast("Saved as draft.");
      navigate("/scouts");
    } finally { setBusy(false); }
  };

  const submitForReview = async () => {
    if (!validate()) { showToast("Fill in name, father's name, contact and date of birth."); return; }
    setBusy(true);
    try {
      let scoutId = id;
      if (!isEdit) {
        const created = await createScout(form, user);
        scoutId = created.id;
      } else {
        await updateScout(id, form);
      }
      await submitScout(scoutId, user);
      showToast(`Submitted for ${projectedSection} leader review.`);
      navigate("/scouts");
    } finally { setBusy(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? "Edit Scout Form" : "New Scout Form"}</div>
          <div className="page-subtitle">Age and section are calculated automatically from Date of Birth — never entered manually.</div>
        </div>
      </div>

      <Card>
        <div className="grid grid-2">
          <div className="field"><label>Name</label><input className="input" value={form.full_name} onChange={set("full_name")} /></div>
          <div className="field"><label>Father's Name</label><input className="input" value={form.father_name} onChange={set("father_name")} /></div>
        </div>
        <div className="grid grid-2">
          <div className="field"><label>Contact Number</label><input className="input" value={form.contact_number} onChange={set("contact_number")} /></div>
          <div className="field"><label>Emergency Contact</label><input className="input" value={form.emergency_contact} onChange={set("emergency_contact")} /></div>
        </div>
        <div className="grid grid-2">
          <div className="field"><label>CNIC / B-Form Number</label><input className="input" value={form.cnic_bform} onChange={set("cnic_bform")} /></div>
          <div className="field">
            <label>Blood Group</label>
            <select className="input" value={form.blood_group} onChange={set("blood_group")}>
              {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label>Date of Birth</label>
          <input type="date" className="input" style={{ maxWidth: 220 }} value={form.date_of_birth} onChange={set("date_of_birth")} />
          {age && (
            <div className="hint">
              Age: {age.years}y {age.months}m {age.days}d — auto-assigned section: <strong>{projectedSection}</strong>
            </div>
          )}
        </div>

        <div className="grid grid-3">
          {[
            ["uniform_available", "Scouts Uniform Available?"],
            ["old_uniform_donation", "Old Uniform Available for Donation?"],
            ["need_uniform", "Need Uniform?"],
          ].map(([key, label]) => (
            <div className="field" key={key}>
              <label>{label}</label>
              <select className="input" value={form[key]} onChange={set(key)}>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          ))}
        </div>

        <div className="row gap-10">
          <button className="btn btn-outline" disabled={busy} onClick={saveDraft}><Save size={15} /> Save Draft</button>
          <button className="btn btn-primary" disabled={busy} onClick={submitForReview}><Send size={15} /> Submit for Review</button>
        </div>
      </Card>
    </div>
  );
}
