import React from "react";
import StatCard from "../../shared/data-display/StatCard";
import { cn } from "../../shared/utils/cn";

type DashboardStatsRowProps = {
  className?: string;
};

const DashboardStatsRow: React.FC<DashboardStatsRowProps> = ({
  className,
}) => {
  const stats = [
    {
      label: "Total Users",
      value: "12,456",
      delta: { value: "+5.2%", direction: "up" as const },
    },
    {
      label: "Active Users",
      value: "2,102",
      delta: { value: "+2.8%", direction: "up" as const },
    },
    {
      label: "Pro Subscribers",
      value: "981",
      delta: { value: "+2.1%", direction: "up" as const },
    },
    {
      label: "Content Uploaded",
      value: "56",
      delta: { value: "+15%", direction: "up" as const },
    },
    {
      label: "Live Sessions",
      value: "12",
      delta: { value: "+8%", direction: "up" as const },
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
