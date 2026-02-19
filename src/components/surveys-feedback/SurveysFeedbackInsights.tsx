import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import Badge from "../../shared/data-display/Badge";
import type { AskQuestionRow } from "./types";

type Props = {
  rows: AskQuestionRow[];
};

function topN(map: Record<string, number>, n = 6) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([label, count]) => ({ label, count }));
}

function buildCounts(rows: AskQuestionRow[]) {
  const byTag: Record<string, number> = {};
  const byCountry: Record<string, number> = {};
  const byLanguage: Record<string, number> = {};
  let answered = 0;

  rows.forEach((r) => {
    if (r.askQuestion.status === "answered") answered += 1;
    (r.askQuestion.tags || []).forEach((t) => {
      byTag[t] = (byTag[t] || 0) + 1;
    });
    byCountry[r.user.country] = (byCountry[r.user.country] || 0) + 1;
    byLanguage[r.user.language] = (byLanguage[r.user.language] || 0) + 1;
  });

  return {
    total: rows.length,
    answered,
    unanswered: Math.max(0, rows.length - answered),
    byTag,
    byCountry,
    byLanguage,
  };
}

const BarList: React.FC<{ title: string; items: Array<{ label: string; count: number }> }> = ({
  title,
  items,
}) => {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{title}</p>
        <Badge variant="neutral">{items.reduce((s, i) => s + i.count, 0)}</Badge>
      </div>
      <div className="mt-3 space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">No data</p>
        ) : (
          items.map((item) => {
            const pct = Math.round((item.count / max) * 100);
            return (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-24 truncate text-xs text-slate-300" title={item.label}>
                  {item.label}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-full bg-emerald-500/50" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-10 text-right text-xs text-slate-300">{item.count}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const SurveysFeedbackInsights: React.FC<Props> = ({ rows }) => {
  const stats = React.useMemo(() => buildCounts(rows), [rows]);

  const answeredPct =
    stats.total === 0 ? 0 : Math.round((stats.answered / stats.total) * 100);

  const topTags = React.useMemo(() => topN(stats.byTag, 6), [stats.byTag]);
  const topCountries = React.useMemo(() => topN(stats.byCountry, 6), [stats.byCountry]);
  const topLanguages = React.useMemo(() => topN(stats.byLanguage, 6), [stats.byLanguage]);

  return (
    <SectionCard className="bg-[#04130d]" contentClassName="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Questions Insights</p>
          <p className="mt-1 text-xs text-slate-400">
            Answered vs unanswered + distribution by tags, country, and language.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">Total: {stats.total}</Badge>
          <Badge variant="success">Answered: {stats.answered}</Badge>
          <Badge variant="warning">Unanswered: {stats.unanswered}</Badge>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            Answered ratio
          </p>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{answeredPct}% answered</span>
              <span>{stats.answered}/{stats.total}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-emerald-500/50"
                style={{ width: `${answeredPct}%` }}
              />
            </div>

            <div className="mt-3 text-xs text-slate-400">
              Tip: Use the “Status” filter to review unanswered first.
            </div>
          </div>
        </div>

        <BarList title="Top Tags" items={topTags} />
        <BarList title="Top Countries" items={topCountries} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <BarList title="Top Languages" items={topLanguages} />
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            What this enables in the app
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li>• Route to the right coach by tag (Training/Learn/Equipment…)</li>
            <li>• Show unanswered queue for weekly sessions</li>
            <li>• Post the “answer” back to user as a notification / Q&A item</li>
          </ul>
        </div>
      </div>
    </SectionCard>
  );
};

export default SurveysFeedbackInsights;
