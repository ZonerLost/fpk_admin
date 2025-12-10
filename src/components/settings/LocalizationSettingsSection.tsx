import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";

type LegalDocRow = {
  id: string;
  country: string;
  language: string;
  privacyPolicyUrl: string;
  termsUrl: string;
};

const seedRows: LegalDocRow[] = [
  {
    id: "de-en",
    country: "Germany",
    language: "EN",
    privacyPolicyUrl: "",
    termsUrl: "",
  },
  {
    id: "de-de",
    country: "Germany",
    language: "DE",
    privacyPolicyUrl: "",
    termsUrl: "",
  },
  {
    id: "us-en",
    country: "USA",
    language: "EN",
    privacyPolicyUrl: "",
    termsUrl: "",
  },
];

const LocalizationSettingsSection: React.FC = () => {
  const [rows, setRows] = React.useState<LegalDocRow[]>(seedRows);

  const updateRow = (id: string, patch: Partial<LegalDocRow>) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  };

  const addRow = () => {
    const id = `row-${Date.now()}`;
    setRows((prev) => [
      ...prev,
      {
        id,
        country: "New Country",
        language: "EN",
        privacyPolicyUrl: "",
        termsUrl: "",
      },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    console.log("Legal docs by locale", rows);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Legal Documents by Country & Language"
        subtitle="Link Privacy Policy and Terms & Conditions for each app-store country and language version."
        className="bg-[#04130d]"
      >
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3">
          <p className="text-xs text-emerald-100 md:text-sm">
            This is a critical requirement. Ensure backend enforcement and app-side
            locale mapping when wiring APIs.
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
                <th className="px-4 py-3 w-24">Actions</th>
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
                      label="Language"
                      hideLabel
                      value={row.language}
                      onChange={(e) =>
                        updateRow(row.id, { language: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TextField
                      label="Privacy URL"
                      hideLabel
                      placeholder="https://..."
                      value={row.privacyPolicyUrl}
                      onChange={(e) =>
                        updateRow(row.id, { privacyPolicyUrl: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <TextField
                      label="Terms URL"
                      hideLabel
                      placeholder="https://..."
                      value={row.termsUrl}
                      onChange={(e) =>
                        updateRow(row.id, { termsUrl: e.target.value })
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="secondary"
                      className="rounded-lg border border-white/10 bg-transparent px-3 py-1 text-xs hover:bg-white/10"
                      onClick={() => removeRow(row.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="secondary"
            className="rounded-lg border border-white/10 bg-transparent hover:bg-white/10"
            onClick={addRow}
          >
            + Add Locale Row
          </Button>

          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </SectionCard>
    </div>
  );
};

export default LocalizationSettingsSection;
