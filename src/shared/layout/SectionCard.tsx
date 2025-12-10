import React from "react";
import { cn } from "../utils/cn";

export type SectionCardProps = {
  title?: string;
  subtitle?: string;
  className?: string;
  contentClassName?: string;
  children?: React.ReactNode;
  trailing?: React.ReactNode;
  /**
   * Backwards-compatible alias used by some chart cards.
   */
  headerRight?: React.ReactNode;
};

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  className,
  contentClassName,
  trailing,
  headerRight,
  children,
}) => {
  const rightContent = trailing ?? headerRight;

  return (
    <section
      className={cn(
        "rounded-2xl border border-white/5 bg-white/5 p-4",
        className
      )}
    >
      {(title || subtitle || rightContent) && (
        <div className="flex items-start justify-between gap-3">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-xs text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {rightContent && <div className="shrink-0">{rightContent}</div>}
        </div>
      )}

      <div className={cn("mt-3", contentClassName)}>{children}</div>
    </section>
  );
};

export default SectionCard;
