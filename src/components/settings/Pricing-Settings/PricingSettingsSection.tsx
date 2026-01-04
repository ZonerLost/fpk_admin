import React from "react";
import SectionCard from "../../../shared/layout/SectionCard";
import TextField from "../../../shared/inputs/TextField";
import Button from "../../../shared/inputs/Button";
import { COUNTRY_CATALOG } from "../../../shared/constants/locale";

type CountryPricingRow = {
  id: string;
  country: string;
  defaultLanguage: string;
  languagesOffered: string;
  currency: string;
  timezone: string;
  costMonthly: string;
  cost6Months: string;
  cost12Months: string;
};

type MembershipFeatureRow = {
  id: string;
  label: string;
  months: number;

  /** How many months of historic content are unlocked by this plan (0 = none) */
  historicMonths: number;

  chatbotAccess: boolean;
  downloadableVideos: number;
};

const initialCountryRows: CountryPricingRow[] = COUNTRY_CATALOG.map((c) => ({
  id: c.id,
  country: c.country,
  defaultLanguage: c.languages[0] ?? "EN",
  languagesOffered: c.languages.join(", "),
  currency: c.currency,
  timezone: c.timeZone,
  costMonthly: "",
  cost6Months: "",
  cost12Months: "",
}));

const initialMembershipRows: MembershipFeatureRow[] = [
  { id: "monthly", label: "Monthly", months: 1, historicMonths: 2, chatbotAccess: false, downloadableVideos: 10 },
  { id: "six", label: "6 months", months: 6, historicMonths: 6, chatbotAccess: false, downloadableVideos: 20 },
  { id: "annual", label: "Annual", months: 12, historicMonths: 12, chatbotAccess: true, downloadableVideos: 30 },
];

const PricingSettingsSection: React.FC = () => {
  const [rows, setRows] = React.useState<CountryPricingRow[]>(initialCountryRows);
  const [features, setFeatures] = React.useState<MembershipFeatureRow[]>(initialMembershipRows);

  const updateRow = (id: string, patch: Partial<CountryPricingRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const toggleFeature = (id: string, key: "chatbotAccess") => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: !f[key] } : f)));
  };

  const updateNumber = (id: string, key: "downloadableVideos" | "historicMonths", value: string) => {
    const num = Number(value);
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, [key]: Number.isFinite(num) ? Math.max(0, Math.floor(num)) : f[key] }
          : f
      )
    );
  };

  const handleSave = () => {
    console.log("Country pricing matrix", rows);
    console.log("Membership features", features);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Plans & Pricing by Country"
        subtitle="Defines currency, languages offered, and timezone used for local releases."
        className="bg-[#04130d]"
      >
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-300 md:text-sm">
            Timezone here drives the “Local Time Zone” release behavior (content scheduled at 16:00 releases at 16:00 in that country).
          </p>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-xs text-slate-100 md:text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Default language</th>
                <th className="px-4 py-3">Languages offered</th>
                <th className="px-4 py-3">Currency</th>
                <th className="px-4 py-3">Timezone</th>
                <th className="px-4 py-3">Monthly</th>
                <th className="px-4 py-3">6 months</th>
                <th className="px-4 py-3">12 months</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row) => (
                <tr key={row.id} className="bg-black/20">
                  <td className="px-4 py-3">
                    <TextField label="Country" hideLabel value={row.country} onChange={(e) => updateRow(row.id, { country: e.target.value })} />
                  </td>
                  <td className="px-4 py-3">
                    <TextField label="Default language" hideLabel value={row.defaultLanguage} onChange={(e) => updateRow(row.id, { defaultLanguage: e.target.value })} />
                  </td>
                  <td className="px-4 py-3">
                    <TextField label="Languages offered" hideLabel value={row.languagesOffered} onChange={(e) => updateRow(row.id, { languagesOffered: e.target.value })} />
                  </td>
                  <td className="px-4 py-3">
                    <TextField label="Currency" hideLabel value={row.currency} onChange={(e) => updateRow(row.id, { currency: e.target.value })} />
                  </td>
                  <td className="px-4 py-3">
                    <TextField label="Timezone" hideLabel value={row.timezone} onChange={(e) => updateRow(row.id, { timezone: e.target.value })} />
                  </td>
                  <td className="px-4 py-3">
                    <TextField label="Monthly" hideLabel value={row.costMonthly} onChange={(e) => updateRow(row.id, { costMonthly: e.target.value })} />
                  </td>
                  <td className="px-4 py-3">
                    <TextField label="6 months" hideLabel value={row.cost6Months} onChange={(e) => updateRow(row.id, { cost6Months: e.target.value })} />
                  </td>
                  <td className="px-4 py-3">
                    <TextField label="12 months" hideLabel value={row.cost12Months} onChange={(e) => updateRow(row.id, { cost12Months: e.target.value })} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="Membership Length Features"
        subtitle="Controls historic content window and feature access."
        className="bg-[#04130d]"
      >
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
          <p className="text-xs text-amber-100 md:text-sm">
            Backend note (required): once a user earns access to content, that access must persist even after subscription ends,
            cancelation, plan switch, or renewal changes. “Earned content” should not be removed later.
          </p>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-xs text-slate-100 md:text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Length</th>
                <th className="px-4 py-3">Historic content (months)</th>
                <th className="px-4 py-3">Chat bot access</th>
                <th className="px-4 py-3">Downloadable videos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {features.map((f) => (
                <tr key={f.id} className="bg-black/20">
                  <td className="px-4 py-3 font-medium">{f.label}</td>
                  <td className="px-4 py-3">{f.months} months</td>
                  <td className="px-4 py-3">
                    <TextField
                      label="Historic months"
                      hideLabel
                      type="number"
                      min={0}
                      value={String(f.historicMonths)}
                      onChange={(e) => updateNumber(f.id, "historicMonths", e.target.value)}
                      hint="0 = none"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={f.chatbotAccess}
                      onChange={() => toggleFeature(f.id, "chatbotAccess")}
                      className="h-4 w-4 rounded border border-white/20 bg-black/40"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TextField
                      label="Download limit"
                      hideLabel
                      type="number"
                      min={0}
                      value={String(f.downloadableVideos)}
                      onChange={(e) => updateNumber(f.id, "downloadableVideos", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </SectionCard>
    </div>
  );
};

export default PricingSettingsSection;

