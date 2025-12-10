
import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";

type CountryPricingRow = {
  id: string;
  country: string;
  defaultLanguage: string;
  languagesOffered: string;
  currency: string;
  costMonthly: string;
  cost6Months: string;
  cost12Months: string;
};

type MembershipFeatureRow = {
  id: string;
  label: string;
  months: number;
  historicContent: boolean;
  chatbotAccess: boolean;
  downloadableVideos: number;
};

const initialCountryRows: CountryPricingRow[] = [
  { id: "de", country: "Germany", defaultLanguage: "German", languagesOffered: "German, English", currency: "EUR", costMonthly: "€X", cost6Months: "", cost12Months: "" },
  { id: "at", country: "Austria", defaultLanguage: "German", languagesOffered: "German, English", currency: "EUR", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "ch", country: "Switzerland", defaultLanguage: "German", languagesOffered: "German, English", currency: "CHF", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "us", country: "USA", defaultLanguage: "English", languagesOffered: "English", currency: "USD", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "ca", country: "Canada", defaultLanguage: "English", languagesOffered: "English", currency: "CAD", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "uk", country: "UK", defaultLanguage: "English", languagesOffered: "English", currency: "GBP", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "za", country: "South Africa", defaultLanguage: "English", languagesOffered: "English", currency: "ZAR", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "au", country: "Australia", defaultLanguage: "English", languagesOffered: "English", currency: "AUD", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "ng", country: "Nigeria", defaultLanguage: "English", languagesOffered: "English", currency: "NGN", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "ke", country: "Kenya", defaultLanguage: "English", languagesOffered: "English", currency: "KES", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "tr", country: "Turkey", defaultLanguage: "Turkish", languagesOffered: "Turkish, English", currency: "TRY", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "ro", country: "Romania", defaultLanguage: "Romanian", languagesOffered: "Romanian, Turkish", currency: "RON", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "pl", country: "Poland", defaultLanguage: "Polish", languagesOffered: "Polish, English", currency: "PLN", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "ua", country: "Ukraine", defaultLanguage: "Ukrainian", languagesOffered: "Ukrainian, English", currency: "UAH", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "cn", country: "China", defaultLanguage: "Chinese", languagesOffered: "Chinese, English", currency: "CNY", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "jp", country: "Japan", defaultLanguage: "Japanese", languagesOffered: "Japanese, English", currency: "JPY", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "kr", country: "South Korea", defaultLanguage: "Korean", languagesOffered: "Korean, English", currency: "KRW", costMonthly: "", cost6Months: "", cost12Months: "" },
  { id: "mx", country: "Mexico", defaultLanguage: "Spanish", languagesOffered: "Spanish, English", currency: "MXN", costMonthly: "", cost6Months: "", cost12Months: "" },
];

const initialMembershipRows: MembershipFeatureRow[] = [
  {
    id: "monthly",
    label: "Monthly",
    months: 1,
    historicContent: false,
    chatbotAccess: false,
    downloadableVideos: 10,
  },
  {
    id: "six",
    label: "6 months",
    months: 6,
    historicContent: false,
    chatbotAccess: false,
    downloadableVideos: 20,
  },
  {
    id: "annual",
    label: "Annual",
    months: 12,
    historicContent: true,
    chatbotAccess: true,
    downloadableVideos: 30,
  },
];

const PricingSettingsSection: React.FC = () => {
  const [rows, setRows] = React.useState<CountryPricingRow[]>(initialCountryRows);
  const [features, setFeatures] =
    React.useState<MembershipFeatureRow[]>(initialMembershipRows);

  const updateRow = (id: string, patch: Partial<CountryPricingRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const toggleFeature = (id: string, key: "historicContent" | "chatbotAccess") => {
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, [key]: !f[key] } : f
      )
    );
  };

  const updateDownloadLimit = (id: string, value: string) => {
    const num = Number(value);
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, downloadableVideos: Number.isFinite(num) ? Math.max(0, num) : f.downloadableVideos }
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
        subtitle="This matrix also powers country dropdowns across the admin console."
        className="bg-[#04130d]"
      >
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-300 md:text-sm">
            Prices can vary by country. Default language and offered languages are defined here
            (moved from Localization per updated requirements).
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
                <th className="px-4 py-3">Cost monthly</th>
                <th className="px-4 py-3">Cost 6 months</th>
                <th className="px-4 py-3">Cost 12 months</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row) => (
                <tr key={row.id} className="bg-black/20">
                  <td className="px-4 py-3">
                    <TextField
                      label="Country"
                      hideLabel
                      value={row.country}
                      onChange={(e) => updateRow(row.id, { country: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TextField
                      label="Default language"
                      hideLabel
                      value={row.defaultLanguage}
                      onChange={(e) =>
                        updateRow(row.id, { defaultLanguage: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TextField
                      label="Languages offered"
                      hideLabel
                      value={row.languagesOffered}
                      onChange={(e) =>
                        updateRow(row.id, { languagesOffered: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TextField
                      label="Currency"
                      hideLabel
                      value={row.currency}
                      onChange={(e) => updateRow(row.id, { currency: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TextField
                      label="Monthly"
                      hideLabel
                      value={row.costMonthly}
                      onChange={(e) => updateRow(row.id, { costMonthly: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TextField
                      label="6 months"
                      hideLabel
                      value={row.cost6Months}
                      onChange={(e) => updateRow(row.id, { cost6Months: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TextField
                      label="12 months"
                      hideLabel
                      value={row.cost12Months}
                      onChange={(e) => updateRow(row.id, { cost12Months: e.target.value })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard
        title="Membership Length Features"
        subtitle="Define what each subscription length unlocks. Bot is visible but disabled under 12-month subscriptions."
        className="bg-[#04130d]"
      >
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-xs text-slate-100 md:text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Length</th>
                <th className="px-4 py-3">Historic content</th>
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
                    <input
                      type="checkbox"
                      checked={f.historicContent}
                      onChange={() => toggleFeature(f.id, "historicContent")}
                      className="h-4 w-4 rounded border border-white/20 bg-black/40"
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
                      onChange={(e) => updateDownloadLimit(f.id, e.target.value)}
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
