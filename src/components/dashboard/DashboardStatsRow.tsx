import React from "react";
import StatCard from "../../shared/data-display/StatCard";
import { cn } from "../../shared/utils/cn";

type DashboardStatsRowProps = {
  className?: string;
};

const DashboardStatsRow: React.FC<DashboardStatsRowProps> = ({ className }) => {
  // Mock top-level summary
  const stats = [
    {
      label: "Registered Users",
      value: "11,475",
      delta: { value: "+4.1%", direction: "up" as const },
    },
    {
      label: "Pro Users",
      value: "981",
      delta: { value: "+2.1%", direction: "up" as const },
    },
    {
      label: "Pro Monthly Plan",
      value: "540",
      delta: { value: "+1.2%", direction: "up" as const },
    },
    {
      label: "Pro 6-Month Plan",
      value: "271",
      delta: { value: "+0.8%", direction: "up" as const },
    },
    {
      label: "Pro 12-Month Plan",
      value: "170",
      delta: { value: "+0.6%", direction: "up" as const },
    },
  ];

  return (
    <div
      className={cn(
        "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        className
      )}
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          delta={stat.delta}
        />
      ))}
    </div>
  );
};

export default DashboardStatsRow;
