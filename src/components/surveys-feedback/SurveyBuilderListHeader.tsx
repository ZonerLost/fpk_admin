import React from "react";

const DESKTOP_GRID_CLASS =
  "md:grid-cols-[160px_minmax(0,2fr)_minmax(0,1.5fr)_160px_44px]";

const SurveyBuilderListHeader: React.FC = () => {
  return (
    <div
      className={`hidden items-center gap-3 border-b border-white/10 bg-black/30 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-300 md:grid ${DESKTOP_GRID_CLASS}`}
    >
      <div className="min-w-0">Type / Language</div>
      <div className="min-w-0">Question</div>
      <div className="min-w-0">Options</div>
      <div className="min-w-0">Created</div>
      <div className="text-right">Action</div>
    </div>
  );
};

export default SurveyBuilderListHeader;
