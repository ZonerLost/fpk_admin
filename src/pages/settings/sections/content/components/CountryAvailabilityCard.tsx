import React from "react";
import SectionCard from "../../../../../shared/layout/SectionCard";
import Button from "../../../../../shared/inputs/Button";
import CountryMultiSelect from "./CountryMultiSelect";

type Props = {
  excludedCountries: string[];
  countryOptions: string[];
  onChangeExcluded: (v: string[]) => void;
  onSave: () => void;
};

const CountryAvailabilityCard: React.FC<Props> = ({
  excludedCountries,
  countryOptions,
  onChangeExcluded,
  onSave,
}) => {
  return (
    <SectionCard
      title="Country Availability"
      subtitle="Control where Train & Learn content is allowed to release."
      className="bg-[#04130d]"
    >
      <div className="rounded-xl border border-white/10 bg-black/20 p-3">
        <p className="text-xs text-slate-300 md:text-sm">
          If you don’t want content to release to certain countries, exclude them here.
          (Backend should enforce this at release time.)
        </p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <CountryMultiSelect
          label="Excluded countries"
          value={excludedCountries}
          options={countryOptions}
          onChange={onChangeExcluded}
          helperText="These countries will not receive Train & Learn releases."
        />

        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="text-xs font-semibold text-slate-200">Preview</div>
          <div className="mt-2 text-xs text-slate-300">
            {excludedCountries.length === 0 ? (
              <span className="text-emerald-200">No exclusions (global release)</span>
            ) : (
              <span>
                Excluding:{" "}
                <span className="text-slate-100">
                  {excludedCountries.slice(0, 6).join(", ")}
                  {excludedCountries.length > 6 ? ` +${excludedCountries.length - 6} more` : ""}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </SectionCard>
  );
};

export default CountryAvailabilityCard;
