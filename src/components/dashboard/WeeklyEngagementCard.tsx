import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import BarChartCard from "../../shared/charts/BarChartCard";
import { cn } from "../../shared/utils/cn";

type WeeklyEngagementCardProps = {
  className?: string;
};

const weeklyEngagementData = [
  { day: "Mon", hours: 3.8 },
  { day: "Tue", hours: 4.2 },
  { day: "Wed", hours: 4.6 },
  { day: "Thu", hours: 4.1 },
  { day: "Fri", hours: 4.8 },
  { day: "Sat", hours: 3.9 },
  { day: "Sun", hours: 4.0 },
];

const WeeklyEngagementCard: React.FC<WeeklyEngagementCardProps> = ({
  className,
}) => {
  return (
    <BarChartCard
      title="Weekly Engagement"
      primaryStat="4.5h Avg"
      subtitle="Last 7 days"
      deltaText="-1.5%"
      className={cn(className)}
    >
      <div className="h-40 min-h-[10rem] md:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeklyEngagementData}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              stroke="#16a34a"
              strokeOpacity={0.1}
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.4)",
                padding: "6px 10px",
                fontSize: 12,
              }}
              cursor={{ fill: "rgba(34,197,94,0.12)" }}
            />
            <Bar
              dataKey="hours"
              radius={[6, 6, 0, 0]}
              fill="#22c55e"
              maxBarSize={26}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </BarChartCard>
  );
};

export default WeeklyEngagementCard;
