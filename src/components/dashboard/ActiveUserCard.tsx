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
  userType: "all" | "registered" | "pro";
  planType: "all" | "monthly" | "6m" | "12m";
  onChangeUserType: (v: Props["userType"]) => void;
  onChangePlanType: (v: Props["planType"]) => void;
};

const mockData = [
  { label: "P1", active: 520 },
  { label: "P2", active: 610 },
  { label: "P3", active: 580 },
  { label: "P4", active: 690 },
  { label: "P5", active: 740 },
];

const ActiveUsersCard: React.FC<Props> = ({
  className,
  timeframe,
  range,
  countriesLabel,
  userType,
  planType,
  onChangeUserType,
  onChangePlanType,
}) => {
  const subtitle = `Active users · ${countriesLabel} · ${timeframe} · last ${range}`;

  return (
    <LineChartCard
      title="Active Users"
      primaryStat="DAU/WAU/MAU (mock)"
      subtitle={subtitle}
      deltaText="—"
      className={cn(className)}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "registered", "pro"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChangeUserType(t)}
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-medium capitalize",
                userType === t
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                  : "border-white/10 text-slate-300 hover:bg-white/5"
              )}
            >
              {t}
            </button>
          ))}

          {(["all", "monthly", "6m", "12m"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChangePlanType(p)}
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-medium uppercase",
                planType === p
                  ? "border-amber-400/60 bg-amber-400/10 text-amber-200"
                  : "border-white/10 text-slate-300 hover:bg-white/5"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => downloadCsv("active-users.csv", mockData)}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200 hover:bg-white/10"
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
            <Line type="monotone" dataKey="active" stroke="#22c55e" strokeWidth={2.4} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-[11px] text-slate-400">
        * DAU/WAU/MAU should be computed by backend per timeframe.
      </div>
    </LineChartCard>
  );
};

export default ActiveUsersCard;
