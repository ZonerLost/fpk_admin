import React from "react";
import { cn } from "../utils/cn";

type TagPillProps = {
  children: React.ReactNode;
  className?: string;
};

const TagPill: React.FC<TagPillProps> = ({ children, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[#24201a] px-3 py-1 text-xs font-medium text-slate-100",
        className
      )}
    >
      {children}
    </span>
  );
};

export default TagPill;
