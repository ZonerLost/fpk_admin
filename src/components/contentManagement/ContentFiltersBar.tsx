import React from "react";
import SelectPill from "../../shared/inputs/SelectPill";

export type ContentFiltersState = {
  week: string;
  type: string;
  language: string;
  country: string;
  access: string;
  status: string;
};

type Props = {
  filters: ContentFiltersState;
  onChange: (partial: Partial<ContentFiltersState>) => void;
};

const ContentFiltersBar: React.FC<Props> = ({ filters, onChange }) => {
  // For now, pills just cycle through some values so UI feels alive.
  const cycleValues = (key: keyof ContentFiltersState, values: string[]) => {
    const current = filters[key];
    const idx = values.indexOf(current);
    const next = values[(idx + 1) % values.length];
    onChange({ [key]: next });
  };

  return (
    <div className="flex flex-wrap gap-2 text-xs md:text-sm">
      <SelectPill
        label="Week"
        valueLabel={filters.week}
        onClick={() => cycleValues("week", ["All", "1", "2", "3", "4", "5"])}
      />
      <SelectPill
        label="Type"
        valueLabel={filters.type}
        onClick={() =>
          cycleValues("type", ["All", "Train", "Learn", "Live", "Doc"])
        }
      />
      <SelectPill
        label="Language"
        valueLabel={filters.language}
        onClick={() =>
          cycleValues("language", ["All", "EN", "ES", "FR", "DE"])
        }
      />
      <SelectPill
        label="Country"
        valueLabel={filters.country}
        onClick={() =>
          cycleValues("country", ["All", "USA", "UK", "ES", "FR"])
        }
      />
      <SelectPill
        label="Access"
        valueLabel={filters.access}
        onClick={() =>
          cycleValues("access", ["All", "Pro", "Basic"])
        }
      />
      <SelectPill
        label="Status"
        valueLabel={filters.status}
        onClick={() =>
          cycleValues("status", ["All", "Published", "Scheduled", "Draft"])
        }
      />
    </div>
  );
};

export default ContentFiltersBar;
