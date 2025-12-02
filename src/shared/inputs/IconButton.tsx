import React from "react";
import { cn } from "../utils/cn";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "subtle";
}

const IconButton: React.FC<IconButtonProps> = ({
  className,
  variant = "default",
  type = "button",
  children,
  ...rest
}) => {
  const base =
    "inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/70";

  const variantClass =
    variant === "default"
      ? "bg-slate-900/70 hover:bg-slate-800"
      : variant === "ghost"
      ? "bg-transparent hover:bg-white/10"
      : "bg-white/5 hover:bg-white/10";

  return (
    <button
      type={type}
      className={cn(base, variantClass, className)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default IconButton;
