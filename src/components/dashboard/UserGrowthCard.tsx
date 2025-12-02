import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import LineChartCard from "../../shared/charts/LineChartCard";
import { cn } from "../../shared/utils/cn";

type UserGrowthCardProps = {
  className?: string;
};

const userGrowthData = [
  { week: "Wk1", users: 9000 },
  { week: "Wk2", users: 10000 },
  { week: "Wk3", users: 11200 },
  { week: "Wk4", users: 12456 },
];

const UserGrowthCard: React.FC<UserGrowthCardProps> = ({ className }) => {
  return (
    <LineChartCard
      title="User Growth"
      primaryStat="12,456"
      subtitle="Last 30 days"
      deltaText="+5.2%"
      className={cn(className)}
    >
      <div className="h-40 min-h-[10rem] md:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={userGrowthData}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid
              stroke="#16a34a"
              strokeOpacity={0.15}
              vertical={false}
            />
            <XAxis
              dataKey="week"
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
              cursor={{ stroke: "#22c55e", strokeOpacity: 0.25 }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </LineChartCard>
  );
};

export default UserGrowthCard;
