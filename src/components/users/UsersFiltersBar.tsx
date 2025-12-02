import React from "react";
import SelectPill from "../../shared/inputs/SelectPill";

export type UsersFiltersState = {
  role: string;
  country: string;
  subscription: string;
  lastActive: string;
};

type Props = {
  filters: UsersFiltersState;
  onChange: (partial: Partial<UsersFiltersState>) => void;
};

const UsersFiltersBar: React.FC<Props> = ({ filters, onChange }) => {
  // just cycle through demo values for now (you can replace with real dropdowns)
  const cycle = (key: keyof UsersFiltersState, values: string[]) => {
    const current = filters[key];
    const idx = values.indexOf(current);
    const next = values[(idx + 1) % values.length];
    onChange({ [key]: next });
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="flex flex-1 flex-wrap gap-2 text-xs md:text-sm">
        <SelectPill
          label="Role"
          valueLabel={filters.role}
          onClick={() =>
            cycle("role", ["All", "Pro", "Basic", "Unregistered"])
          }
        />
        <SelectPill
          label="Country"
          valueLabel={filters.country}
          onClick={() =>
            cycle("country", ["All", "Norway", "Spain", "Japan", "Brazil"])
          }
        />
        <SelectPill
          label="Subscription"
          valueLabel={filters.subscription}
          onClick={() =>
            cycle("subscription", ["All", "Active", "Inactive"])
          }
        />
        <SelectPill
          label="Last Active"
          valueLabel={filters.lastActive}
          onClick={() =>
            cycle("lastActive", [
              "All Time",
              "24h",
              "7 days",
              "30 days",
            ])
          }
        />
      </div>

      {/* right side is controlled in TableToolbar.actions (icons + Apply Filters) */}
    </div>
  );
};

export default UsersFiltersBar;
