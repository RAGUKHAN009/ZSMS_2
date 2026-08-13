import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { USE_APPWRITE } from "../../services/appwrite/appwrite";

const ROLES = [
  { id: "GSL", label: "Group Scout Leader", sub: "GSL" },
  { id: "GS", label: "Group Secretary", sub: "GS" },
  { id: "SSL", label: "Shaheen Scout Leader", sub: "SSL" },
  { id: "ASSL", label: "Assistant Shaheen Leader", sub: "ASSL" },
  { id: "SL", label: "Scout Leader", sub: "SL" },
  { id: "ASL", label: "Assistant Scout Leader", sub: "ASL" },
  { id: "RL", label: "Rover Scout Leader", sub: "RL" },
  { id: "ARL", label: "Assistant Rover Leader", sub: "ARL" },
  { id: "FS", label: "Finance Secretary", sub: "FS" },
  { id: "OS", label: "Office Secretary", sub: "OS" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleRolePick = async (roleId) => {
    setBusy(true);
    setError("");
    try {
      await login(roleId);
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleAppwriteLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (e2) {
      setError(e2.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div className="row gap-10" style={{ justifyContent: "center", marginBottom: 22 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Compass size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>ZSMS</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Zulfiqarabad Scouts Management System</div>
          </div>
        </div>

        <div className="card">
          {!USE_APPWRITE ? (
            <>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Sign in as…</div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 16 }}>
                Demo mode — pick a role to explore that dashboard. Real login (email + password against Appwrite Auth) turns on automatically once VITE_USE_APPWRITE=true.
              </div>
              <div className="grid grid-2">
                {ROLES.map((r) => (
                  <button key={r.id} disabled={busy} onClick={() => handleRolePick(r.id)} className="btn btn-outline" style={{ justifyContent: "flex-start", flexDirection: "column", alignItems: "flex-start", gap: 2, padding: "12px 14px" }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "var(--primary)" }}>{r.sub}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>{r.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={handleAppwriteLogin}>
              <div className="field">
                <label>Email</label>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="field">
                <label>Password</label>
                <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button className="btn btn-primary" disabled={busy} style={{ width: "100%" }}>{busy ? "Signing in…" : "Sign in"}</button>
            </form>
          )}
          {error && <div style={{ color: "var(--danger)", fontSize: 12.5, marginTop: 12 }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
