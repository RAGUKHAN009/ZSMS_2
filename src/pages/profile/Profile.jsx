import React from "react";
import { UserCircle, Mail, Phone, Shield } from "lucide-react";
import { Card, SectionTitle } from "../../components/common/Card";
import { useAuth } from "../../context/AuthContext";

function Row({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
      <Icon size={15} color="var(--text-muted)" style={{ marginTop: 2 }} />
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: 14, marginTop: 2 }}>{value || "—"}</div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header"><div className="page-title">Profile</div></div>
      <Card>
        <div className="row gap-10" style={{ marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 999, background: "var(--primary-soft)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UserCircle size={26} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{user?.full_name}</div>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{user?.designation}{user?.section ? ` · ${user.section}` : ""}</div>
          </div>
        </div>
        <Row icon={Mail} label="Email" value={user?.email} />
        <Row icon={Phone} label="Phone" value={user?.phone} />
        <Row icon={Shield} label="Designation" value={user?.designation} />
      </Card>
    </div>
  );
}
