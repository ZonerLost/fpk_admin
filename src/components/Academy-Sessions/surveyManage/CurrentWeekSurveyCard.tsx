import React from "react";
import SectionCard from "../../../shared/layout/SectionCard";
import Button from "../../../shared/inputs/Button";
import Badge from "../../../shared/data-display/Badge";
import type { WeeklySurvey, SurveyVariant } from "../types/types";
import { downloadCsv } from "../utils/academy.utils";

type Props = {
  survey: WeeklySurvey;
  activeCountry: string;
  activeLanguage: string;
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
    const mode = variant.responseMode ?? variant.responseType ?? "—";
    downloadCsv(
      `survey_week${survey.week}_${variant.country}_${variant.language}.csv`,
      [
        ["Question", "Country", "Language", "Mode", "Responses"],
        [
          variant.question,
          variant.country,
          variant.language,
          mode,
          String(variant.responsesCount),
        ],
      ]
    );
  };

  return (
    <SectionCard
      title={`Survey (Week ${survey.week})`}
      subtitle="Survey variants are country + language specific. If no variant exists for a locale, the app should hide the survey for that locale."
      className="bg-[#04130d]"
      contentClassName="space-y-3"
    >
      {visibleVariants.length === 0 ? (
        <div className="text-xs text-slate-400">
          No survey variant matches the current filters. (This means the app should not show a survey for this locale.)
        </div>
      ) : (
        visibleVariants.map((v) => (
          <div
            key={v.id}
            className="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/3 p-3 md:flex-row md:items-center md:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="neutral">{v.country}</Badge>
                <Badge variant="neutral">{v.language}</Badge>
                <Badge variant="neutral">
                  {v.responseMode ?? v.responseType ?? "—"}
                </Badge>
                <Badge variant="neutral">{v.responsesCount} responses</Badge>
              </div>

              <div className="mt-2 text-sm font-medium text-white">{v.question}</div>

              {!!v.multipleChoiceOptions?.length && (
                <div className="mt-2 text-xs text-slate-300">
                  Options: {v.multipleChoiceOptions.join(", ")}
                </div>
              )}
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
        ))
      )}
    </SectionCard>
  );
};

export default CurrentWeekSurveyCard;
