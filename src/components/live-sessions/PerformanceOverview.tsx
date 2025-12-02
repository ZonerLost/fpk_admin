import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import StatCard from "../../shared/data-display/StatCard";

const PerformanceOverview: React.FC = () => {
  return (
    <SectionCard
      title="Performance Overview"
      className="bg-[#04130d]"
      contentClassName="space-y-3"
    >
      <StatCard
        label="Total Views (Last 30 days)"
        value="4,590"
        className="bg-transparent border border-white/5"
      />
      <StatCard
        label="Average Live Attendance"
        value="128"
        className="bg-transparent border border-white/5"
      />
      <StatCard
        label="Top Performing Session"
        value="Defensive Positioning"
        className="bg-transparent border border-white/5"
      />
    </SectionCard>
  );
};

export default PerformanceOverview;
