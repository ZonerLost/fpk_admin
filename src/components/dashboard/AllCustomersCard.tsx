import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Label,
} from "recharts";
import BarChartCard from "../../shared/charts/BarChartCard";
import { cn } from "../../shared/utils/cn";
import { downloadCsv } from "./downloadCsv";
import type { Timeframe } from "./DashboardFiltersBar";
import {
  SEGMENT_META,
  type CustomerSegment,
  segmentsSummary,
} from "./customerSegments";

type Props = {
  className?: string;
  timeframe: Timeframe;
  range: number;
  countriesLabel: string;
  languagesLabel: string;

  //  NEW
  selectedSegments: CustomerSegment[];
  requestUrl: string;
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

type Row = { label: string } & Record<
  "registered" | "pro_monthly" | "pro_6_month" | "pro_12_month",
  number
>;

const AllCustomersCard: React.FC<Props> = ({
  className,
  timeframe,
  range,
  countriesLabel,
  languagesLabel,
  selectedSegments,
  requestUrl,
}) => {
  const labels = React.useMemo(
    () => makeLabels(timeframe, Math.max(4, Math.min(range, 24))),
    [timeframe, range]
  );

  const data = React.useMemo<Row[]>(() => {
    return labels.map((label, idx) => {
      const registered = 10000 + idx * 450;
      const proMonthly = 540 + idx * 18;
      const pro6 = 271 + idx * 10;
      const pro12 = 170 + idx * 7;

      return {
        label,
        registered,
        pro_monthly: proMonthly,
        pro_6_month: pro6,
        pro_12_month: pro12,
      };
    });
  }, [labels]);

  const summary = segmentsSummary(selectedSegments);
  const subtitle = `All customers · ${countriesLabel} · ${languagesLabel} · ${timeframe} · last ${range} · ${summary}`;

  const last = data[data.length - 1];
  const primaryStat = React.useMemo(() => {
    if (!last) return "(mock)";
    const total = selectedSegments.reduce((sum, k) => sum + (last[k] ?? 0), 0);
    return `${compact.format(total)} (mock)`;
  }, [last, selectedSegments]);

  const csvRows = React.useMemo(() => {
    return data.map((r) => {
      const base: Record<string, string | number> = { label: r.label };
      selectedSegments.forEach((k) => {
        base[SEGMENT_META[k].label] = r[k];
      });
      return base;
    });
  }, [data, selectedSegments]);

  return (
    <BarChartCard
      title="All Customers"
      primaryStat={primaryStat}
      subtitle={subtitle}
      deltaText="—"
      className={cn(className)}
    >
      <div className="hidden" data-request-url={requestUrl} aria-hidden />

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => downloadCsv("all-customers.csv", csvRows)}
          className="mb-2 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200 hover:bg-white/10"
        >
          Download data
        </button>
      </div>

      <div className="h-40 min-h-[10rem] md:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 14, right: 16, bottom: 36, left: 34 }}
          >
            <CartesianGrid stroke="#16a34a" strokeOpacity={0.1} vertical={false} />

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
                value="Customers"
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

            {selectedSegments.map((seg) => (
              <Bar
                key={seg}
                dataKey={seg}
                name={SEGMENT_META[seg].label}
                radius={[6, 6, 0, 0]}
                fill={SEGMENT_META[seg].fill}
                maxBarSize={22}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-300">
        {selectedSegments.map((seg) => (
          <span key={seg}>{SEGMENT_META[seg].label}</span>
        ))}
      </div>
    </BarChartCard>
  );
};

export default AllCustomersCard;
