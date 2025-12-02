import React from "react";
import SectionCard from "../layout/SectionCard";
import { cn } from "../utils/cn";

type LineChartCardProps = {
  title: string;
  primaryStat: string;
  subtitle?: string;
  deltaText?: string;
  children?: React.ReactNode; // actual chart
  className?: string;
};

const LineChartCard: React.FC<LineChartCardProps> = ({
  title,
  primaryStat,
  subtitle,
  deltaText,
  children,
  className,
}) => {
  return (
    <SectionCard
      className={cn("flex flex-col gap-4", className)}
      contentClassName="flex-1 flex flex-col gap-4"
      title={title}
      subtitle={subtitle}
      headerRight={
        deltaText && (
          <span className="text-xs font-medium text-emerald-400">
            {deltaText}
          </span>
        )
      }
    >
      <div className="text-2xl font-bold text-white md:text-3xl">
        {primaryStat}
      </div>
      <div className="flex-1">
        {children ?? (
          <div className="flex h-32 items-center justify-center text-xs text-slate-500">
            Chart goes here
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default LineChartCard;
