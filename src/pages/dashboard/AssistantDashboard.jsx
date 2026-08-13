import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Users, Clock, RotateCcw } from "lucide-react";
import { StatCard, SectionTitle, EmptyState } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useMockCollection } from "../../hooks/useMockCollection";
import { SECTION_BY_ROLE } from "../../utils/permissionUtils";

export default function AssistantDashboard() {
  const { user, role } = useAuth();
  const section = SECTION_BY_ROLE[role];
  const scouts = useMockCollection("scouts");

  const mine = useMemo(() => scouts.filter((s) => s.created_by === user?.id), [scouts, user]);
  const reverted = useMemo(() => mine.filter((s) => s.status === "reverted_to_assistant"), [mine]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{user?.full_name}'s Dashboard</div>
          <div className="page-subtitle">{role} — creates and submits {section} scout records.</div>
        </div>
        <Link to="/scouts/new" className="btn btn-primary"><UserPlus size={16} /> New Scout Form</Link>
      </div>

      <div className="grid grid-3">
        <StatCard icon={Users} label={`My ${section} records`} value={mine.length} accent="var(--primary)" />
        <StatCard icon={Clock} label="Under review" value={mine.filter(s => ["submitted", "under_leader_review", "under_gs_review"].includes(s.status)).length} accent="var(--warning)" />
        <StatCard icon={RotateCcw} label="Returned for correction" value={reverted.length} accent="var(--danger)" />
      </div>

      <SectionTitle icon={RotateCcw}>Returned for Correction</SectionTitle>
      {reverted.length === 0 ? <EmptyState message="Nothing returned right now." /> : reverted.map((s) => (
        <Link to={`/scouts/${s.id}/edit`} key={s.id} className="list-row">
          <div><div className="title">{s.full_name}</div><div className="meta">{s.scout_id}</div></div>
          <Badge status={s.status} />
        </Link>
      ))}

      <SectionTitle icon={Users}>My Records</SectionTitle>
      {mine.length === 0 ? <EmptyState message="You haven't created any scout records yet." /> : mine.map((s) => (
        <Link to={`/scouts/${s.id}`} key={s.id} className="list-row">
          <div><div className="title">{s.full_name}</div><div className="meta">{s.scout_id}</div></div>
          <Badge status={s.status} />
        </Link>
      ))}
    </div>
  );
}
