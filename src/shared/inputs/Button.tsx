import React from "react";
import { cn } from "../utils/cn";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-500 text-black hover:bg-emerald-400 active:bg-emerald-500",
  secondary:
    "bg-transparent text-slate-100 border border-white/20 hover:bg-white/5",
  danger: "bg-red-500 text-white hover:bg-red-400 active:bg-red-500",
  ghost:
    "bg-transparent text-slate-100 hover:bg-white/5 border border-transparent",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  type = "button",
  children,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:ring-offset-0",
        variantClasses[variant],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
};

export default Button;
