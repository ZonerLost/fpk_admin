import React from "react";
import Button, { type ButtonProps } from "./Button";
import { cn } from "../utils/cn";

type ToolbarTone = "default" | "success" | "warning";

type ToolbarButtonProps = Omit<ButtonProps, "variant" | "children"> & {
  label: React.ReactNode;
  icon?: React.ReactNode;
  tone?: ToolbarTone;
};

const toneClasses: Record<ToolbarTone, string> = {
  default: "border-white/10 bg-transparent text-slate-100 hover:bg-white/5",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/15",
  warning: "border-amber-400/25 bg-amber-400/10 text-amber-100 hover:bg-amber-400/15",
};

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  label,
  icon,
  tone = "default",
  className,
  ...rest
}) => {
  return (
    <Button
      variant="secondary"
      className={cn(
        "h-10 whitespace-nowrap rounded-full border px-4 text-sm font-semibold inline-flex items-center gap-2",
        toneClasses[tone],
        className
      )}
      {...rest}
    >
      <span className="inline-flex items-center gap-2">
        {icon ? <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span> : null}
        <span>{label}</span>
      </span>
    </Button>
  );
};

export default ToolbarButton;
