import React from "react";
import { cn } from "../utils/cn";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  pill?: boolean;
  className?: string;
};

const variantClass: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/60",
  warning: "bg-amber-500/15 text-amber-300 border-amber-500/60",
  danger: "bg-red-500/15 text-red-300 border-red-500/60",
  info: "bg-sky-500/15 text-sky-300 border-sky-500/60",
  neutral: "bg-slate-500/10 text-slate-200 border-slate-500/40",
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  pill = true,
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-0.5 text-xs font-medium",
        pill ? "rounded-full" : "rounded-md",
        variantClass[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
