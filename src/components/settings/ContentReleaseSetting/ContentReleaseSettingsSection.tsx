import React from "react";
import SectionCard from "../../../shared/layout/SectionCard";
import TextField from "../../../shared/inputs/TextField";
import Button from "../../../shared/inputs/Button";
import { COUNTRY_CATALOG } from "../../../shared/constants/locale";

const RELEASE_DAYS = [
  "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday",
];

const ContentReleaseSettingsSection: React.FC = () => {
  const [releaseDay, setReleaseDay] = React.useState("Monday");
  const [releaseTime, setReleaseTime] = React.useState("18:00");

  const handleSave = () => {
    console.log("Weekly release defaults", { releaseDay, releaseTime });
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Weekly Release Defaults"
        subtitle="Release time is interpreted in each country’s local timezone."
        className="bg-[#04130d]"
      >
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3">
          <p className="text-xs text-emerald-100 md:text-sm">
            Local Time Zone rule: If you schedule content for Jan 12 at 16:00 for Germany,
            it releases at 16:00 in Germany’s timezone. Each country uses its configured IANA timezone.
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
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
            label="Default Release Time (Local)"
            type="time"
            value={releaseTime}
            onChange={(e) => setReleaseTime(e.target.value)}
            hint="This is a default suggestion; actual releases are scheduled per content item."
          />
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-xs text-slate-100 md:text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Timezone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {COUNTRY_CATALOG.map((c) => (
                <tr key={c.id} className="bg-black/20">
                  <td className="px-4 py-3">{c.country}</td>
                  <td className="px-4 py-3 text-slate-300">{c.timeZone}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
