import React from "react";
import { cn } from "../utils/cn";

export interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /** Optional right-side content in the header (e.g. calendar arrows) */
  trailing?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  trailing,
  children,
  className,
  contentClassName,
}) => {
  const hasHeader = title || subtitle || trailing;

  return (
    <section
      className={cn(
        "rounded-2xl bg-slate-900/80 p-4 shadow-sm ring-1 ring-white/5",
        "md:p-5",
        "min-w-0",
        className
      )}
    >
      {hasHeader && (
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            {title && (
              <h2 className="text-sm font-semibold text-slate-50 md:text-base">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 md:text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {trailing && (
            <div className="flex-shrink-0">
              {trailing}
            </div>
          )}
        </div>
      )}

      <div className={cn("mt-1", contentClassName)}>{children}</div>
    </section>
  );
};

export default SectionCard;
