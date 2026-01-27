import React from "react";
import SectionCard from "../../../../../shared/layout/SectionCard";
import Button from "../../../../../shared/inputs/Button";
import type { PricingSource } from "../types";

type Props = {
  value: PricingSource;
  onChange: (v: PricingSource) => void;
  onSync: () => void;
  onSave: () => void;
};

const PricingSourceCard: React.FC<Props> = ({ value, onChange, onSync, onSave }) => {
  return (
    <SectionCard
      title="Pricing Source"
      subtitle="Client question: pricing might be set by App Stores. Choose your source of truth."
      className="bg-[#04130d]"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => onChange("appStores")}
          className={[
            "rounded-2xl border p-4 text-left transition",
            value === "appStores"
              ? "border-emerald-400/30 bg-emerald-500/10"
              : "border-white/10 bg-black/20 hover:bg-white/5",
          ].join(" ")}
        >
          <div className="text-sm font-semibold text-slate-100">Managed by App Stores</div>
          <div className="mt-1 text-xs text-slate-400">
            Prices are read-only here. Use “Sync billing” from stores via backend.
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange("manual")}
          className={[
            "rounded-2xl border p-4 text-left transition",
            value === "manual"
              ? "border-amber-400/30 bg-amber-500/10"
              : "border-white/10 bg-black/20 hover:bg-white/5",
          ].join(" ")}
        >
          <div className="text-sm font-semibold text-slate-100">Manual Override</div>
          <div className="mt-1 text-xs text-slate-400">
            Enable editable price columns (Monthly / 6M / 12M).
          </div>
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="secondary"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
          onClick={onSync}
        >
          Sync from stores
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </SectionCard>
  );
};

export default PricingSourceCard;
