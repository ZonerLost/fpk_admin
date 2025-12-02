import React from "react";
import { cn } from "../utils/cn";

type SelectPillProps = {
  label: string;      // e.g. "Week"
  valueLabel: string; // e.g. "All"
  onClick?: () => void;
  active?: boolean;
  className?: string;
};

const SelectPill: React.FC<SelectPillProps> = ({
  label,
  valueLabel,
  onClick,
  active,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors md:text-sm",
        active
          ? "border-amber-400 bg-amber-500/10 text-amber-200"
          : "border-white/10 bg-[#24201a] text-slate-200 hover:bg-white/5",
        className
      )}
    >
      <span className="text-slate-400">{label}:</span>
      <span>{valueLabel}</span>
      <span className="text-slate-400">▾</span>
    </button>
  );
};

export default SelectPill;
