import React from "react";
import { cn } from "../utils/cn";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode; // filter / download icons etc.
  className?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  leftIcon,
  rightSlot,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex w-full items-center rounded-full bg-[#24201a] px-4 py-2 text-sm text-slate-100 shadow-inner shadow-black/50",
        className
      )}
    >
      {leftIcon && (
        <span className="mr-3 flex items-center text-slate-400">
          {leftIcon}
        </span>
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none md:text-sm"
        placeholder={placeholder}
      />
      {rightSlot && (
        <div className="ml-3 flex items-center gap-2">{rightSlot}</div>
      )}
    </div>
  );
};

export default SearchBar;
