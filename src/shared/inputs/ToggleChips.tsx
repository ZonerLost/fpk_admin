import React from "react";
import { cn } from "../utils/cn";

export type ToggleOption = {
  value: string;
  label: string;
};

type ToggleChipsProps = {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

const ToggleChips: React.FC<ToggleChipsProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn("inline-flex flex-wrap gap-2", className)}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors md:text-sm",
              active
                ? "bg-emerald-500 text-black"
                : "bg-[#24201a] text-slate-200 hover:bg-white/10"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default ToggleChips;
