import * as React from "react";
import { COUNTRY_CATALOG } from "../../../../../shared/constants/locale";
import type { CountryPricingRow, MembershipFeatureRow, PricingSource } from "../types";

const initialCountryRows: CountryPricingRow[] = COUNTRY_CATALOG.map((c) => ({
  id: c.id,
  country: c.country,
  defaultLanguage: c.languages[0] ?? "EN",
  languagesOffered: c.languages.join(", "),
  currency: c.currency,
  timezone: c.timeZone,
  costMonthly: "",
  cost6Months: "",
  cost12Months: "",
}));

const initialMembershipRows: MembershipFeatureRow[] = [
  { id: "pro_1m", label: "PRO 1M", months: 1, historicMonths: 2, chatbotAccess: false, downloadableVideos: 10 },
  { id: "pro_6m", label: "PRO 6M", months: 6, historicMonths: 6, chatbotAccess: false, downloadableVideos: 20 },
  { id: "pro_12m", label: "PRO 12M", months: 12, historicMonths: 12, chatbotAccess: true, downloadableVideos: 30 },
];

export function usePricingSettings() {
  const [pricingSource, setPricingSource] = React.useState<PricingSource>("appStores");
  const [rows, setRows] = React.useState<CountryPricingRow[]>(initialCountryRows);
  const [features, setFeatures] = React.useState<MembershipFeatureRow[]>(initialMembershipRows);

  const updateRow = (id: string, patch: Partial<CountryPricingRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const toggleFeature = (id: MembershipFeatureRow["id"], key: "chatbotAccess") => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: !f[key] } : f)));
  };

  const updateNumber = (
    id: MembershipFeatureRow["id"],
    key: "downloadableVideos" | "historicMonths",
    value: string
  ) => {
    const num = Number(value);
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, [key]: Number.isFinite(num) ? Math.max(0, Math.floor(num)) : f[key] }
          : f
      )
    );
  };

  const syncFromStores = async () => {
    // ✅ production: call backend which reads App Store / Play Console pricing & updates
    console.log("SYNC pricing from stores...");
  };

  const save = async () => {
    // ✅ production:
    // await http.post("/admin/settings/pricing", { pricingSource, rows, features });
    console.log("SAVE Pricing:", { pricingSource, rows, features });
  };

  return {
    pricingSource,
    setPricingSource,
    rows,
    updateRow,
    features,
    toggleFeature,
    updateNumber,
    syncFromStores,
    save,
  };
}
