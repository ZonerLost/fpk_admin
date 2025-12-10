import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import { cn } from "../../shared/utils/cn";

type Props = {
  className?: string;
};

const AcquisitionFunnelCard: React.FC<Props> = ({ className }) => {
  return (
    <SectionCard
      title="Acquisition & Funnel (Preview)"
      className={cn("min-w-0", className)}
      contentClassName="space-y-2"
    >
      <p className="text-xs text-slate-300">
        This section is best powered by Amplitude/Mixpanel unless backend provides
        structured funnel data.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Install / Visit", value: "—" },
          { label: "Registered", value: "—" },
          { label: "Activated", value: "—" },
          { label: "Pro", value: "—" },
        ].map((x) => (
          <div
            key={x.label}
            className="rounded-xl border border-white/5 bg-white/5 p-3"
          >
            <div className="text-[11px] text-slate-400">{x.label}</div>
            <div className="text-lg font-bold text-slate-100">{x.value}</div>
          </div>
        ))}
      </div>

      <div className="text-[11px] text-slate-500">
        * Add real funnel chart when event analytics backend is connected.
      </div>
    </SectionCard>
  );
};

export default AcquisitionFunnelCard;
