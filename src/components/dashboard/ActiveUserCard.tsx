import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import LineChartCard from "../../shared/charts/LineChartCard";
import { cn } from "../../shared/utils/cn";
import { downloadCsv } from "./downloadCsv";
import type { Timeframe } from "./DashboardFiltersBar";

type Metric = "dau" | "wau" | "mau";

type Props = {
  className?: string;
  timeframe: Timeframe;
  range: number;
  countriesLabel: string;

  primaryMetric: Metric;
  compareMetric: Metric | "none";
  onChangePrimaryMetric: (v: Metric) => void;
  onChangeCompareMetric: (v: Metric | "none") => void;
};

const compact = new Intl.NumberFormat(undefined, { notation: "compact" });

function makeLabels(tf: Timeframe, n: number) {
  const now = new Date();
  const labels: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    if (tf === "daily") d.setDate(now.getDate() - i);
    if (tf === "weekly") d.setDate(now.getDate() - i * 7);
    if (tf === "monthly") d.setMonth(now.getMonth() - i);
    if (tf === "yearly") d.setFullYear(now.getFullYear() - i);

    const txt =
      tf === "daily"
        ? d.toISOString().slice(0, 10)
        : tf === "weekly"
        ? d.toISOString().slice(0, 10)
        : tf === "monthly"
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        : String(d.getFullYear());

    labels.push(txt);
  }
  return labels;
}

function metricLabel(m: Metric) {
  if (m === "dau") return "DAU";
  if (m === "wau") return "WAU";
  return "MAU";
}

const ActiveUsersCard: React.FC<Props> = ({
  className,
  timeframe,
  range,
  countriesLabel,
  primaryMetric,
  compareMetric,
  onChangePrimaryMetric,
  onChangeCompareMetric,
}) => {
  const subtitle = `Active users · ${countriesLabel} · ${timeframe} · last ${range}`;

  const labels = React.useMemo(() => makeLabels(timeframe, Math.max(5, Math.min(range, 24))), [timeframe, range]);

  const data = React.useMemo(() => {
    return labels.map((label, idx) => ({
      label,
      dau: 520 + idx * 18,
      wau: 2100 + idx * 45,
      mau: 8200 + idx * 120,
    }));
  }, [labels]);

  const showCompare = compareMetric !== "none" && compareMetric !== primaryMetric;

  return (
    <LineChartCard
      title="Active Users"
      primaryStat={`${metricLabel(primaryMetric)}${showCompare ? ` vs ${metricLabel(compareMetric as Metric)}` : ""} (mock)`}
      subtitle={subtitle}
      deltaText="—"
      className={cn(className)}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            {(["dau", "wau", "mau"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onChangePrimaryMetric(m)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-medium",
                  primaryMetric === m
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                    : "border-white/10 text-slate-300 hover:bg-white/5"
                )}
              >
                {metricLabel(m)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <span className="ml-1 text-[11px] font-semibold text-slate-300">Compare:</span>
            {(["none", "dau", "wau", "mau"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onChangeCompareMetric(m)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-medium",
                  compareMetric === m
                    ? "border-amber-400/60 bg-amber-400/10 text-amber-200"
                    : "border-white/10 text-slate-300 hover:bg-white/5"
                )}
              >
                {m === "none" ? "Off" : metricLabel(m)}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => downloadCsv("active-users.csv", data)}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200 hover:bg-white/10"
        >
          Download data
        </button>
      </div>

      <div className="h-44 min-h-[11rem] md:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 14, right: 16, bottom: 36, left: 34 }}
          >
            <CartesianGrid stroke="#16a34a" strokeOpacity={0.15} vertical={false} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              stroke="#9ca3af"
              tick={{ fontSize: 11 }}
              tickMargin={8}
            >
              <Label value="Date" position="bottom" offset={12} fill="#9ca3af" />
            </XAxis>

            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="#9ca3af"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => compact.format(v)}
              width={60}
              tickMargin={8}
            >
              <Label
                value="Active users"
                angle={-90}
                position="left"
                offset={8}
                fill="#9ca3af"
              />
            </YAxis>

            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.4)",
                padding: "6px 10px",
                fontSize: 12,
              }}
            />

            <Line
              type="monotone"
              dataKey={primaryMetric}
              name={metricLabel(primaryMetric)}
              stroke="#22c55e"
              strokeWidth={2.4}
              dot={false}
            />

            {showCompare && (
              <Line
                type="monotone"
                dataKey={compareMetric as Metric}
                name={metricLabel(compareMetric as Metric)}
                stroke="#fbbf24"
                strokeWidth={2.2}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-[11px] text-slate-400">
        * DAU/WAU/MAU should be computed by backend per timeframe/range (or Date X → Date Y).
      </div>
    </LineChartCard>
  );
};

export default ActiveUsersCard;
