import React from "react";
import { type SurveysFeedbackTab } from "./types";

type Props = {
  activeTab: SurveysFeedbackTab;
  onChange: (next: SurveysFeedbackTab) => void;
};

const tabs: Array<{ id: SurveysFeedbackTab; label: string }> = [
  { id: "WeeklySurvey", label: "Weekly Survey Responses" },
  { id: "AskQuestion", label: "Ask a Question" },
  { id: "SurveyBuilder", label: "Survey Builder" },
];

const SurveysFeedbackTabs: React.FC<Props> = ({ activeTab, onChange }) => {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-black/20 p-1">
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={
              "rounded-full px-4 py-2 text-xs font-semibold transition-colors md:text-sm " +
              (active
                ? "bg-emerald-500 text-black"
                : "text-slate-200 hover:bg-white/10")
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default SurveysFeedbackTabs;
