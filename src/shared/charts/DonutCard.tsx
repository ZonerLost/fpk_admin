import React from "react";
import SectionCard from "../layout/SectionCard";
import { cn } from "../utils/cn";

type DonutLegendItem = {
  label: string;
};

type DonutCardProps = {
  title: string;
  percentage: number; // 0-100
  centerLabel?: string; // e.g. "Watched"
  legend?: DonutLegendItem[];
  children?: React.ReactNode; // optional real chart
  className?: string;
};

const DonutCard: React.FC<DonutCardProps> = ({
  title,
  percentage,
  centerLabel = "Watched",
  legend,
  children,
  className,
}) => {
  return (
    <SectionCard
      title={title}
      className={cn("flex flex-col gap-4", className)}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center justify-center">
          {children ? (
            children
          ) : (
            // Simple fake donut using CSS for now
            <div className="relative flex h-32 w-32 items-center justify-center">
              <div className="h-full w-full rounded-full border-8 border-emerald-500/80 border-t-slate-800 border-l-slate-800" />
              <div className="absolute h-20 w-20 rounded-full bg-[#060e0c]" />
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-bold text-white">
                  {percentage}%
                </span>
                <span className="text-xs text-slate-400">
                  {centerLabel}
                </span>
              </div>
            </div>
          )}
        </div>
        {legend && (
          <div className="flex-1 space-y-2 text-xs text-slate-300">
            {legend.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  );
};

export default DonutCard;
