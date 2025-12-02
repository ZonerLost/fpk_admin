import React from "react";
import SectionCard from "../layout/SectionCard";
import { cn } from "../utils/cn";

type BarChartCardProps = {
  title: string;
  primaryStat: string;
  subtitle?: string;
  deltaText?: string;
  children?: React.ReactNode;
  className?: string;
};

const BarChartCard: React.FC<BarChartCardProps> = ({
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
          <span className="text-xs font-medium text-red-400">
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
            Bar chart goes here
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default BarChartCard;
