import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";

type Plan = {
  id: string;
  name: string;
  basePrice: string;
  currency: string;
  isFree: boolean;
};

const PricingSettingsSection: React.FC = () => {
  const [plans, setPlans] = React.useState<Plan[]>([
    {
      id: "basic",
      name: "Basic",
      basePrice: "0",
      currency: "USD",
      isFree: true,
    },
    {
      id: "pro",
      name: "Pro",
      basePrice: "9.99",
      currency: "USD",
      isFree: false,
    },
  ]);

  const updatePlan = (id: string, patch: Partial<Plan>) => {
    setPlans((prev) =>
      prev.map((plan) => (plan.id === id ? { ...plan, ...patch } : plan))
    );
  };

  const handleSave = () => {
    console.log("Pricing settings", plans);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Plans & Pricing"
        subtitle="Configure default monthly pricing for Basic and Pro tiers."
        className="bg-[#04130d]"
      >
        <div className="space-y-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 md:text-base">
                    {plan.name} Plan
                  </h3>
                  <p className="text-xs text-slate-400 md:text-sm">
                    {plan.isFree
                      ? "Free tier used for trials and basic access."
                      : "Premium tier with full content access and advanced features."}
                  </p>
                </div>

                <div className="mt-3 grid gap-3 text-xs md:mt-0 md:grid-cols-3 md:text-sm">
                  <TextField
                    label="Price"
                    type="number"
                    step="0.01"
                    value={plan.basePrice}
                    disabled={plan.isFree}
                    onChange={(e) =>
                      updatePlan(plan.id, {
                        basePrice: e.target.value,
                      })
                    }
                  />
                  <TextField
                    label="Currency"
                    value={plan.currency}
                    onChange={(e) =>
                      updatePlan(plan.id, {
                        currency: e.target.value,
                      })
                    }
                  />
                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      checked={plan.isFree}
                      onChange={(e) =>
                        updatePlan(plan.id, {
                          isFree: e.target.checked,
                          basePrice: e.target.checked
                            ? "0"
                            : plan.basePrice,
                        })
                      }
                      className="h-4 w-4 rounded border border-white/20 bg-black/40"
                    />
                    <span className="text-xs text-slate-200">
                      Free plan
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Country Pricing (Preview)"
        subtitle="Optional override prices for specific countries. (Static placeholder – wire to backend later.)"
        className="bg-[#04130d]"
      >
        <p className="text-xs text-slate-400 md:text-sm">
          You can later expand this section into a full table per country (UK,
          Spain, Norway, etc.) with specific prices and currencies.
        </p>
      </SectionCard>
    </div>
  );
};

export default PricingSettingsSection;
