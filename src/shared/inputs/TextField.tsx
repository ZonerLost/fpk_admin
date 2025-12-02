// src/shared/inputs/TextField.tsx
import React from "react";
import { cn } from "../utils/cn";

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: string;
  hint?: string;
  error?: string;
  /** Extra classes for the outer wrapper */
  wrapperClassName?: string;
  /** Extra classes for the input itself */
  className?: string;
  /** If true, render the label as sr-only (visually hidden) */
  hideLabel?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  hint,
  error,
  wrapperClassName,
  className,
  hideLabel,
  id: idProp,
  ...inputProps
}) => {
  const id = React.useId();
  const inputId = idProp ?? id;

  return (
    <div className={cn("flex flex-col gap-1", wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-xs font-medium text-slate-200 md:text-sm",
            hideLabel && "sr-only"
          )}
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        {...inputProps}
        className={cn(
          "w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:ring md:text-sm",
          className
        )}
      />

      {(hint || error) && (
        <p
          className={cn(
            "text-[11px] md:text-xs",
            error ? "text-red-400" : "text-slate-400"
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
};

export default TextField;
