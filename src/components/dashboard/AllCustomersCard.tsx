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
import { downloadCsv } from "./downloadCsv";
import type { Timeframe } from "./DashboardFiltersBar";

type Props = {
  className?: string;
  timeframe: Timeframe;
  range: number;
  countriesLabel: string;
};

const mockData = [
  { label: "P1", registered: 10000, pro: 800, monthly: 420, six: 230, twelve: 150 },
  { label: "P2", registered: 10300, pro: 820, monthly: 440, six: 225, twelve: 155 },
  { label: "P3", registered: 10650, pro: 850, monthly: 460, six: 230, twelve: 160 },
  { label: "P4", registered: 11020, pro: 900, monthly: 500, six: 240, twelve: 160 },
];

const AllCustomersCard: React.FC<Props> = ({
  className,
  timeframe,
  range,
  countriesLabel,
}) => {
  const subtitle = `All customers · ${countriesLabel} · ${timeframe} · last ${range}`;

  return (
    <BarChartCard
      title="All Customers"
      primaryStat="(mock)"
      subtitle={subtitle}
      deltaText="—"
      className={cn(className)}
    >
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => downloadCsv("all-customers.csv", mockData)}
          className="mb-2 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200 hover:bg-white/10"
        >
          Download data
        </button>
      </div>

      <div className="h-40 min-h-[10rem] md:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#16a34a" strokeOpacity={0.1} vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.4)",
                padding: "6px 10px",
                fontSize: 12,
              }}
            />
            <Bar dataKey="registered" radius={[6, 6, 0, 0]} fill="#22c55e" maxBarSize={28} />
            <Bar dataKey="pro" radius={[6, 6, 0, 0]} fill="#fbbf24" maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </BarChartCard>
  );
};

export default AllCustomersCard;
