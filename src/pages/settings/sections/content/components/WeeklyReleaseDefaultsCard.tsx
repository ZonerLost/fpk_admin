import React from "react";
import SectionCard from "../../../../../shared/layout/SectionCard";
import TextField from "../../../../../shared/inputs/TextField";
import Button from "../../../../../shared/inputs/Button";
import type { ReleaseDay } from "../types";

const RELEASE_DAYS: ReleaseDay[] = [
  "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
];

type Props = {
  trainLearnEnabled: boolean;
  releaseDay: ReleaseDay;
  releaseTimeLocal: string;
  onToggleEnabled: (v: boolean) => void;
  onChangeDay: (day: ReleaseDay) => void;
  onChangeTime: (time: string) => void;
  onSave: () => void;
};

const WeeklyReleaseDefaultsCard: React.FC<Props> = ({
  trainLearnEnabled,
  releaseDay,
  releaseTimeLocal,
  onToggleEnabled,
  onChangeDay,
  onChangeTime,
  onSave,
}) => {
  return (
    <SectionCard
      title="Weekly Release Defaults"
      subtitle="Applies to Train & Learn pre-uploaded content. Academy release is set per video."
      className="bg-[#04130d]"
    >
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3">
        <p className="text-xs text-emerald-100 md:text-sm">
          Train & Learn release schedule is global. Country/timezone behavior comes from your country configuration
          (Plans & Pricing tab). If Train & Learn is disabled, nothing auto-releases.
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-3">
        <div>
          <div className="text-sm font-semibold text-slate-100">Train & Learn schedule</div>
          <div className="text-xs text-slate-400">Enable/disable automatic weekly releases.</div>
        </div>

        <button
          type="button"
          onClick={() => onToggleEnabled(!trainLearnEnabled)}
          className={[
            "relative h-7 w-12 rounded-full border transition",
            trainLearnEnabled
              ? "border-emerald-400/30 bg-emerald-500/20"
              : "border-white/15 bg-white/5",
          ].join(" ")}
          aria-pressed={trainLearnEnabled}
        >
          <span
            className={[
              "absolute top-0.5 h-6 w-6 rounded-full transition",
              trainLearnEnabled ? "left-5 bg-emerald-300" : "left-0.5 bg-slate-300",
            ].join(" ")}
          />
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <div>
          <label className="text-xs font-medium text-slate-200 md:text-sm">Release Day</label>
          <select
            value={releaseDay}
            disabled={!trainLearnEnabled}
            onChange={(e) => onChangeDay(e.target.value as ReleaseDay)}
            className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring disabled:opacity-50 md:text-sm"
          >
            {RELEASE_DAYS.map((day) => (
              <option key={day} value={day} className="bg-black">
                {day}
              </option>
            ))}
          </select>
        </div>

        <TextField
          label="Default Release Time (Local)"
          type="time"
          value={releaseTimeLocal}
          onChange={(e) => onChangeTime(e.target.value)}
          hint="Client suggestion: Sunday 00:00"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </SectionCard>
  );
};

export default WeeklyReleaseDefaultsCard;
