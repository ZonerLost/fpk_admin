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
import { downloadCsv } from "./downloadCsv";
import type { Timeframe } from "./DashboardFiltersBar";

type Props = {
  className?: string;
  timeframe: Timeframe;
  range: number;
  countriesLabel: string;
};

const mockData = [
  { label: "P1", registered: 120, pro: 12, monthly: 8, six: 3, twelve: 1 },
  { label: "P2", registered: 140, pro: 14, monthly: 9, six: 3, twelve: 2 },
  { label: "P3", registered: 180, pro: 16, monthly: 10, six: 4, twelve: 2 },
  { label: "P4", registered: 210, pro: 20, monthly: 14, six: 4, twelve: 2 },
  { label: "P5", registered: 260, pro: 25, monthly: 17, six: 5, twelve: 3 },
];

const NewCustomersCard: React.FC<Props> = ({
  className,
  timeframe,
  range,
  countriesLabel,
}) => {
  const subtitle = `New customers · ${countriesLabel} · ${timeframe} · last ${range}`;

  const handleDownload = () => {
    downloadCsv("new-customers.csv", mockData);
  };

  return (
    <LineChartCard
      title="New Customers"
      primaryStat="(mock)"
      subtitle={subtitle}
      deltaText="—"
      className={cn(className)}
    >
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleDownload}
          className="mb-2 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200 hover:bg-white/10"
        >
          Download data
        </button>
      </div>

      <div className="h-40 min-h-[10rem] md:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#16a34a" strokeOpacity={0.15} vertical={false} />
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
            <Line type="monotone" dataKey="registered" stroke="#22c55e" strokeWidth={2.4} dot={false} />
            <Line type="monotone" dataKey="pro" stroke="#fbbf24" strokeWidth={2.0} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-300 md:grid-cols-5">
        <span>Registered</span>
        <span>Pro</span>
        <span>Pro Monthly</span>
        <span>Pro 6M</span>
        <span>Pro 12M</span>
      </div>
    </LineChartCard>
  );
};

export default NewCustomersCard;
