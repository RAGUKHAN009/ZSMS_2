import React from "react";
import { useAuth } from "../../context/AuthContext";
import GSLDashboard from "./GSLDashboard";
import GSDashboard from "./GSDashboard";
import LeaderDashboard from "./LeaderDashboard";
import AssistantDashboard from "./AssistantDashboard";
import FSDashboard from "./FSDashboard";
import OSDashboard from "./OSDashboard";

export default function Dashboard() {
  const { role } = useAuth();

  if (role === "GSL") return <GSLDashboard />;
  if (role === "GS") return <GSDashboard />;
  if (["SSL", "SL", "RL"].includes(role)) return <LeaderDashboard />;
  if (["ASSL", "ASL", "ARL"].includes(role)) return <AssistantDashboard />;
  if (role === "FS") return <FSDashboard />;
  if (role === "OS") return <OSDashboard />;

  return <div className="empty-state">No dashboard configured for this role yet.</div>;
}
