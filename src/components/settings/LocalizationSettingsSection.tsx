import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";

type CountryLocale = {
  id: string;
  country: string;
  defaultLanguage: string;
  languages: string;
  currency: string;
};

const LocalizationSettingsSection: React.FC = () => {
  const [rows, setRows] = React.useState<CountryLocale[]>([
    {
      id: "no",
      country: "Norway",
      defaultLanguage: "Norwegian",
      languages: "Norwegian, English",
      currency: "NOK",
    },
    {
      id: "uk",
      country: "United Kingdom",
      defaultLanguage: "English",
      languages: "English",
      currency: "GBP",
    },
    {
      id: "es",
      country: "Spain",
      defaultLanguage: "Spanish",
      languages: "Spanish, English",
      currency: "EUR",
    },
  ]);

  const updateRow = (id: string, patch: Partial<CountryLocale>) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  };

  const handleSave = () => {
    console.log("Localization settings", rows);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Country & Language Matrix"
        subtitle="Define supported languages, currencies, and defaults per country."
        className="bg-[#04130d]"
      >
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-xs text-slate-100 md:text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Default Language</th>
                <th className="px-4 py-3">Languages Enabled</th>
                <th className="px-4 py-3">Currency</th>
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
                      onChange={(e) =>
                        updateRow(row.id, { country: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TextField
                      label="Default Language"
                      hideLabel
                      value={row.defaultLanguage}
                      onChange={(e) =>
                        updateRow(row.id, {
                          defaultLanguage: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TextField
                      label="Languages"
                      hideLabel
                      value={row.languages}
                      onChange={(e) =>
                        updateRow(row.id, { languages: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TextField
                      label="Currency"
                      hideLabel
                      value={row.currency}
                      onChange={(e) =>
                        updateRow(row.id, { currency: e.target.value })
                      }
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

      <SectionCard
        title="Legal Documents"
        subtitle="Track the latest Terms of Service & Privacy Policy versions per locale."
        className="bg-[#04130d]"
      >
        <p className="text-xs text-slate-400 md:text-sm">
          For MVP you can manually update legal copy in the app store / website.
          Later this card can evolve into a versioned list with upload support
          for each country and language.
        </p>
      </SectionCard>
    </div>
  );
};

export default LocalizationSettingsSection;
