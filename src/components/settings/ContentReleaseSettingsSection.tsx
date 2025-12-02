import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";

const RELEASE_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ContentReleaseSettingsSection: React.FC = () => {
  const [releaseDay, setReleaseDay] = React.useState("Monday");
  const [releaseTime, setReleaseTime] = React.useState("18:00");
  const [timezone, setTimezone] = React.useState("Europe/London");

  const [basicWeeklyLimitEnabled, setBasicWeeklyLimitEnabled] =
    React.useState(true);
  const [basicMaxWeeks, setBasicMaxWeeks] = React.useState("4");
  const [proArchiveEnabled, setProArchiveEnabled] = React.useState(true);

  const handleSave = () => {
    console.log("Content & release settings", {
      releaseDay,
      releaseTime,
      timezone,
      basicWeeklyLimitEnabled,
      basicMaxWeeks,
      proArchiveEnabled,
    });
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Weekly Release Engine"
        subtitle="Control when new content becomes available each week."
        className="bg-[#04130d]"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Release Day
            </label>
            <select
              value={releaseDay}
              onChange={(e) => setReleaseDay(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              {RELEASE_DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <TextField
            label="Release Time"
            type="time"
            value={releaseTime}
            onChange={(e) => setReleaseTime(e.target.value)}
          />

          <TextField
            label="Default Timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Access & Archive Rules"
        subtitle="Configure what Basic and Pro users can see each week."
        className="bg-[#04130d]"
      >
        <div className="space-y-4">
          <label className="flex items-start gap-3 text-xs text-slate-200 md:text-sm">
            <input
              type="checkbox"
              checked={basicWeeklyLimitEnabled}
              onChange={(e) =>
                setBasicWeeklyLimitEnabled(e.target.checked)
              }
              className="mt-1 h-4 w-4 rounded border border-white/20 bg-black/40"
            />
            <span>
              Limit Basic users to a weekly set of content (1 Learn, 1
              Train, 1 Live).
            </span>
          </label>

          {basicWeeklyLimitEnabled && (
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Max weeks of history for Basic users"
                type="number"
                min={1}
                value={basicMaxWeeks}
                onChange={(e) => setBasicMaxWeeks(e.target.value)}
              />
            </div>
          )}

          <label className="flex items-start gap-3 text-xs text-slate-200 md:text-sm">
            <input
              type="checkbox"
              checked={proArchiveEnabled}
              onChange={(e) =>
                setProArchiveEnabled(e.target.checked)
              }
              className="mt-1 h-4 w-4 rounded border border-white/20 bg-black/40"
            />
            <span>Allow Pro users to access the full content archive.</span>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </SectionCard>
    </div>
  );
};

export default ContentReleaseSettingsSection;
