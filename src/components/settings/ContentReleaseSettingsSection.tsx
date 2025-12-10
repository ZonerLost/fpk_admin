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

  const handleSave = () => {
    console.log("Content & release settings", {
      releaseDay,
      releaseTime,
      timezone,
    });
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Weekly Release Defaults"
        subtitle="Control when new weekly content is expected to go live. Access rules are managed manually in Content Management."
        className="bg-[#04130d]"
      >
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
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
                <option key={day} value={day} className="bg-black">
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

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </SectionCard>
    </div>
  );
};

export default ContentReleaseSettingsSection;
