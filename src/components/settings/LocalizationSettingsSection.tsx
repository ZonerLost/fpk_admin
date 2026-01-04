import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";
import { COUNTRY_CATALOG } from "../../shared/constants/locale";

type LegalDocRow = {
  id: string;
  country: string;
  language: string;
  privacyPolicyUrl: string;
  termsUrl: string;
};

function buildSeedRows(): LegalDocRow[] {
  const rows: LegalDocRow[] = [];
  for (const c of COUNTRY_CATALOG) {
    for (const lang of c.languages) {
      rows.push({
        id: `${c.id}-${lang}`,
        country: c.country,
        language: lang,
        privacyPolicyUrl: "",
        termsUrl: "",
      });
    }
  }
  return rows;
}

const LocalizationSettingsSection: React.FC = () => {
  const [rows, setRows] = React.useState<LegalDocRow[]>(buildSeedRows());

  const updateRow = (id: string, patch: Partial<LegalDocRow>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const handleSave = () => {
    console.log("Legal docs by locale", rows);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Legal Documents by Country & Language"
        subtitle="Pre-filled with all supported countries to avoid missing any locale."
        className="bg-[#04130d]"
      >
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3">
          <p className="text-xs text-emerald-100 md:text-sm">
            Critical: ensure backend + app locale mapping enforces correct URLs per country/language.
          </p>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-xs text-slate-100 md:text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Privacy Policy URL</th>
                <th className="px-4 py-3">Terms & Conditions URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row) => (
                <tr key={row.id} className="bg-black/20">
                  <td className="px-4 py-3">{row.country}</td>
                  <td className="px-4 py-3">{row.language}</td>
                  <td className="px-4 py-3">
                    <TextField
                      label="Privacy URL"
                      hideLabel
                      placeholder="https://..."
                      value={row.privacyPolicyUrl}
                      onChange={(e) => updateRow(row.id, { privacyPolicyUrl: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TextField
                      label="Terms URL"
                      hideLabel
                      placeholder="https://..."
                      value={row.termsUrl}
                      onChange={(e) => updateRow(row.id, { termsUrl: e.target.value })}
                    />
                  </td>
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

export default LocalizationSettingsSection;

