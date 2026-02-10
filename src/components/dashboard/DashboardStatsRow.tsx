/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import StatCard from "../../shared/data-display/StatCard";
import { cn } from "../../shared/utils/cn";
import {
  type CustomerSegment,
  normalizeSegments,
} from "./customerSegments";

type DashboardStatsRowProps = {
  className?: string;

  //  NEW
  selectedSegments: CustomerSegment[];
};

const fmt = new Intl.NumberFormat();

function sum(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0);
}

const DashboardStatsRow: React.FC<DashboardStatsRowProps> = ({
  className,
  selectedSegments,
}) => {
  const segs = normalizeSegments(selectedSegments);

  // mock base totals
  const base = {
    registered: 11475,
    pro_monthly: 540,
    pro_6_month: 271,
    pro_12_month: 170,
  };

  const registeredOn = segs.includes("registered");
  const proMonthlyOn = segs.includes("pro_monthly");
  const pro6On = segs.includes("pro_6_month");
  const pro12On = segs.includes("pro_12_month");

  const proSelected = [proMonthlyOn, pro6On, pro12On].some(Boolean);
  const proUsers = proSelected
    ? sum([
        proMonthlyOn ? base.pro_monthly : 0,
        pro6On ? base.pro_6_month : 0,
        pro12On ? base.pro_12_month : 0,
      ])
    : null;

  const stats = [
    {
      label: "Registered Users",
      value: registeredOn ? fmt.format(base.registered) : "—",
      delta: registeredOn ? { value: "+4.1%", direction: "up" as const } : undefined,
    },
    {
      label: "Pro Users",
      value: proUsers != null ? fmt.format(proUsers) : "—",
      delta: proUsers != null ? { value: "+2.1%", direction: "up" as const } : undefined,
    },
    {
      label: "Pro Monthly Plan",
      value: proMonthlyOn ? fmt.format(base.pro_monthly) : "—",
      delta: proMonthlyOn ? { value: "+1.2%", direction: "up" as const } : undefined,
    },
    {
      label: "Pro 6-Month Plan",
      value: pro6On ? fmt.format(base.pro_6_month) : "—",
      delta: pro6On ? { value: "+0.8%", direction: "up" as const } : undefined,
    },
    {
      label: "Pro 12-Month Plan",
      value: pro12On ? fmt.format(base.pro_12_month) : "—",
      delta: pro12On ? { value: "+0.6%", direction: "up" as const } : undefined,
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
          delta={stat.delta as any}
        />
      ))}
    </div>
  );
};

export default DashboardStatsRow;
