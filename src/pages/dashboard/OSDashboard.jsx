import React from "react";
import { StatCard, SectionTitle, EmptyState } from "../../components/common/Card";
import { Users, ClipboardList } from "lucide-react";
import { useMockCollection } from "../../hooks/useMockCollection";

// The spec (section 36, open decision #5) flags exact OS requirements as
// undecided. This is a light placeholder — office/admin visibility into
// scouts and proposals — until that scope is finalized.
export default function OSDashboard() {
  const scouts = useMockCollection("scouts");
  const proposals = useMockCollection("proposals");

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Office Secretary Dashboard</div>
          <div className="page-subtitle">General office visibility. Exact OS scope is still an open decision — see spec section 36.</div>
        </div>
      </div>
      <div className="grid grid-2">
        <StatCard icon={Users} label="Total scouts" value={scouts.length} accent="var(--primary)" />
        <StatCard icon={ClipboardList} label="Total proposals" value={proposals.length} accent="var(--primary)" />
      </div>
      <SectionTitle>Notes</SectionTitle>
      <EmptyState message="Define OS-specific modules here once requirements are finalized." />
    </div>
  );
}
