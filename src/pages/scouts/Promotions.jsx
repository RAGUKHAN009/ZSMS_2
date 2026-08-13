import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { SectionTitle, EmptyState } from "../../components/common/Card";
import { useMockCollection } from "../../hooks/useMockCollection";
import { isPromotionDue, getPromotionTarget, calculateAge } from "../../utils/ageUtils";

export default function Promotions() {
  const scouts = useMockCollection("scouts");
  const due = useMemo(() => scouts.filter((s) => isPromotionDue(s.date_of_birth, s.section)), [scouts]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Promotions</div>
          <div className="page-subtitle">Automatically detected from Date of Birth against the SS/BS/RS age thresholds.</div>
        </div>
      </div>

      <SectionTitle icon={TrendingUp}>Pending Promotions ({due.length})</SectionTitle>
      {due.length === 0 ? <EmptyState message="No scouts are currently due for promotion." /> : due.map((s) => {
        const age = calculateAge(s.date_of_birth);
        return (
          <Link to={`/scouts/${s.id}`} key={s.id} className="list-row">
            <div>
              <div className="title">{s.full_name}</div>
              <div className="meta">{s.scout_id} · {age.years}y {age.months}m — {s.section} → {getPromotionTarget(s.section)}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
