import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import Button from "../../shared/inputs/Button";
import Badge from "../../shared/data-display/Badge";
import type { WeeklySurvey, SurveyVariant } from "./types";

type Props = {
  survey: WeeklySurvey;
  activeCountry: string; // "All" or specific
  activeLanguage: string; // "All" or specific
};

const downloadCsv = (filename: string, rows: string[][]) => {
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const CurrentWeekSurveyCard: React.FC<Props> = ({
  survey,
  activeCountry,
  activeLanguage,
}) => {
  const visibleVariants = survey.variants.filter((v) => {
    if (activeCountry !== "All" && v.country !== activeCountry) return false;
    if (activeLanguage !== "All" && v.language !== activeLanguage) return false;
    return true;
  });

  const handleDownload = (variant: SurveyVariant) => {
    // Demo rows (replace with API results later)
    downloadCsv(
      `survey_week${survey.week}_${variant.country}_${variant.language}.csv`,
      [
        ["Question", "Country", "Language", "Responses"],
        [variant.question, variant.country, variant.language, String(variant.responsesCount)],
      ]
    );
  };

  return (
    <SectionCard
      title={`Current Week Survey (Week ${survey.week})`}
      subtitle="Localized survey variants per country & language. Download results per variant."
      className="bg-[#04130d]"
      contentClassName="space-y-3"
    >
      {visibleVariants.length === 0 && (
        <div className="text-xs text-slate-400">
          No survey variants match the current filters.
        </div>
      )}

      {visibleVariants.map((v) => (
        <div
          key={v.id}
          className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/3 p-3 md:flex-row md:items-center md:justify-between"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="neutral">{v.country}</Badge>
              <Badge variant="neutral">{v.language}</Badge>
              <Badge variant="neutral">{v.responsesCount} responses</Badge>
            </div>
            <div className="mt-2 text-sm font-medium text-white">
              {v.question}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="secondary"
              className="rounded-full border border-white/10 bg-transparent px-3 py-1 text-xs"
              onClick={() => handleDownload(v)}
            >
              Download Results
            </Button>
          </div>
        </div>
      ))}
    </SectionCard>
  );
};

export default CurrentWeekSurveyCard;
