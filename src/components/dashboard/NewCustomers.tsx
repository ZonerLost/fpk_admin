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

type Props = {
  className?: string;
  timeframe: Timeframe;
  range: number;
  countriesLabel: string;
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
        ? d.toISOString().slice(0, 10) // week-start-ish (approx)
        : tf === "monthly"
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        : String(d.getFullYear());

    labels.push(txt);
  }
  return labels;
}

const NewCustomersCard: React.FC<Props> = ({ className, timeframe, range, countriesLabel }) => {
  const subtitle = `New customers · ${countriesLabel} · ${timeframe} · last ${range}`;
  const labels = React.useMemo(() => makeLabels(timeframe, Math.max(4, Math.min(range, 24))), [timeframe, range]);

  const data = React.useMemo(() => {
    return labels.map((label, idx) => ({
      label,
      registered: 120 + idx * 35,
      pro: 12 + idx * 2,
    }));
  }, [labels]);

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
          onClick={() => downloadCsv("new-customers.csv", data)}
          className="mb-2 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200 hover:bg-white/10"
        >
          Download data
        </button>
      </div>

      <div className="h-40 min-h-[10rem] md:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, bottom: 24, left: 12 }}>
            <CartesianGrid stroke="#16a34a" strokeOpacity={0.15} vertical={false} />

            <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#9ca3af" tick={{ fontSize: 11 }}>
              <Label value="Date" position="insideBottom" offset={-16} fill="#9ca3af" />
            </XAxis>

            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="#9ca3af"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => compact.format(v)}
              width={46}
            >
              <Label value="Users" angle={-90} position="insideLeft" fill="#9ca3af" />
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

            <Line type="monotone" dataKey="registered" stroke="#22c55e" strokeWidth={2.4} dot={false} />
            <Line type="monotone" dataKey="pro" stroke="#fbbf24" strokeWidth={2.0} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-300 md:grid-cols-2">
        <span>Registered</span>
        <span>Pro</span>
      </div>
    </LineChartCard>
  );
};

export default NewCustomersCard;
