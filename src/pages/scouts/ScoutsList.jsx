import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Search } from "lucide-react";
import { SectionTitle, EmptyState } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { useMockCollection } from "../../hooks/useMockCollection";
import { canCreateScout, SECTION_BY_ROLE } from "../../utils/permissionUtils";

export default function ScoutsList() {
  const { role } = useAuth();
  const scouts = useMockCollection("scouts");
  const [query, setQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState("ALL");

  const visible = useMemo(() => {
    let rows = scouts;
    // Leaders/assistants primarily see their own section, GS/GSL see all.
    if (SECTION_BY_ROLE[role] && !["GS", "GSL"].includes(role)) {
      rows = rows.filter((s) => s.section === SECTION_BY_ROLE[role]);
    }
    if (sectionFilter !== "ALL") rows = rows.filter((s) => s.section === sectionFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((s) => s.full_name.toLowerCase().includes(q) || s.scout_id.toLowerCase().includes(q));
    }
    return rows;
  }, [scouts, role, sectionFilter, query]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Scouts</div>
          <div className="page-subtitle">Central registry — {visible.length} record{visible.length === 1 ? "" : "s"} visible to your role.</div>
        </div>
        {canCreateScout(role) && (
          <Link to="/scouts/new" className="btn btn-primary"><UserPlus size={16} /> New Scout Form</Link>
        )}
      </div>

      <div className="row gap-10 wrap" style={{ marginBottom: 16 }}>
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-muted)" }} />
          <input className="input" style={{ paddingLeft: 34 }} placeholder="Search name or Scout ID" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="input" style={{ width: 150 }} value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}>
          <option value="ALL">All sections</option>
          <option value="SS">Shaheen (SS)</option>
          <option value="BS">Boy Scout (BS)</option>
          <option value="RS">Rover (RS)</option>
        </select>
      </div>

      <SectionTitle>Records</SectionTitle>
      {visible.length === 0 ? <EmptyState message="No scout records match." /> : visible.map((s) => (
        <Link to={`/scouts/${s.id}`} key={s.id} className="list-row">
          <div><div className="title">{s.full_name}</div><div className="meta">{s.scout_id} · {s.section}</div></div>
          <Badge status={s.status} />
        </Link>
      ))}
    </div>
  );
}
