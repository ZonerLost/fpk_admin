import React from "react";
import SectionCard from "../../../../../shared/layout/SectionCard";
import TextField from "../../../../../shared/inputs/TextField";
import type { CountryPricingRow, PricingSource } from "../types";

type Props = {
  pricingSource: PricingSource;
  rows: CountryPricingRow[];
  onChangeRow: (id: string, patch: Partial<CountryPricingRow>) => void;
};

const CountryConfigTable: React.FC<Props> = ({ pricingSource, rows, onChangeRow }) => {
  const showPrices = pricingSource === "manual";

  return (
    <SectionCard
      title="Plans & Pricing by Country"
      subtitle="Keep localization here (languages/currency/timezone). Pricing columns are optional (manual mode)."
      className="bg-[#04130d]"
    >
      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
        <p className="text-xs text-slate-300 md:text-sm">
          Timezone here drives local releases. If you don’t need manual pricing, keep “Managed by App Stores”.
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
              {showPrices && (
                <>
                  <th className="px-4 py-3">Monthly</th>
                  <th className="px-4 py-3">6 months</th>
                  <th className="px-4 py-3">12 months</th>
                </>
              )}
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
                    onChange={(e) => onChangeRow(row.id, { country: e.target.value })}
                  />
                </td>
                <td className="px-4 py-3">
                  <TextField
                    label="Default language"
                    hideLabel
                    value={row.defaultLanguage}
                    onChange={(e) => onChangeRow(row.id, { defaultLanguage: e.target.value })}
                  />
                </td>
                <td className="px-4 py-3">
                  <TextField
                    label="Languages offered"
                    hideLabel
                    value={row.languagesOffered}
                    onChange={(e) => onChangeRow(row.id, { languagesOffered: e.target.value })}
                  />
                </td>
                <td className="px-4 py-3">
                  <TextField
                    label="Currency"
                    hideLabel
                    value={row.currency}
                    onChange={(e) => onChangeRow(row.id, { currency: e.target.value })}
                  />
                </td>
                <td className="px-4 py-3">
                  <TextField
                    label="Timezone"
                    hideLabel
                    value={row.timezone}
                    onChange={(e) => onChangeRow(row.id, { timezone: e.target.value })}
                  />
                </td>

                {showPrices && (
                  <>
                    <td className="px-4 py-3">
                      <TextField
                        label="Monthly"
                        hideLabel
                        value={row.costMonthly ?? ""}
                        onChange={(e) => onChangeRow(row.id, { costMonthly: e.target.value })}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <TextField
                        label="6 months"
                        hideLabel
                        value={row.cost6Months ?? ""}
                        onChange={(e) => onChangeRow(row.id, { cost6Months: e.target.value })}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <TextField
                        label="12 months"
                        hideLabel
                        value={row.cost12Months ?? ""}
                        onChange={(e) => onChangeRow(row.id, { cost12Months: e.target.value })}
                      />
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!showPrices && (
        <div className="mt-3 text-xs text-slate-400">
          Pricing is managed by stores. These columns are hidden to avoid manual work.
        </div>
      )}
    </SectionCard>
  );
};

export default CountryConfigTable;
