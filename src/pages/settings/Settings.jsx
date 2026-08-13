import React from "react";
import { Sun, Moon, Database, RotateCcw, AlertTriangle } from "lucide-react";
import { Card, SectionTitle } from "../../components/common/Card";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../components/common/Toast";
import { resetMockDb } from "../../data/mockDb";
import { USE_APPWRITE } from "../../services/appwrite/appwrite";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const showToast = useToast();

  const handleReset = () => {
    if (!window.confirm("Reset all demo data back to the seeded starting point? This clears everything you've added.")) return;
    resetMockDb();
    showToast("Demo data reset.");
  };

  return (
    <div>
      <div className="page-header"><div className="page-title">Settings</div></div>

      <SectionTitle>Appearance</SectionTitle>
      <Card>
        <div className="row gap-10">
          <button className={`btn ${theme === "light" ? "btn-primary" : "btn-outline"}`} onClick={() => setTheme("light")}><Sun size={15} /> Light</button>
          <button className={`btn ${theme === "dark" ? "btn-primary" : "btn-outline"}`} onClick={() => setTheme("dark")}><Moon size={15} /> Dark</button>
        </div>
      </Card>

      <SectionTitle>Backend</SectionTitle>
      <Card>
        <div className="row gap-10" style={{ alignItems: "flex-start" }}>
          <Database size={18} color="var(--text-muted)" style={{ marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              {USE_APPWRITE ? "Connected to Appwrite" : "Running on demo data (in-memory / localStorage)"}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4 }}>
              Set <code>VITE_USE_APPWRITE=true</code> and fill in <code>.env</code> (see <code>.env.example</code>) to switch every screen over to your real Appwrite database — no component code needs to change.
            </div>
          </div>
        </div>
      </Card>

      {!USE_APPWRITE && (
        <>
          <SectionTitle icon={AlertTriangle}>Demo Data</SectionTitle>
          <Card>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
              Resets scouts, proposals, expenses, events and notifications back to the original seed data.
            </div>
            <button className="btn btn-danger-outline" onClick={handleReset}><RotateCcw size={15} /> Reset Demo Data</button>
          </Card>
        </>
      )}
    </div>
  );
}
