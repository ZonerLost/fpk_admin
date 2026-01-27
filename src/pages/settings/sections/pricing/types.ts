export type PricingSource = "appStores" | "manual";

export type CountryPricingRow = {
  id: string;
  country: string;
  defaultLanguage: string;
  languagesOffered: string;
  currency: string;
  timezone: string;

  // optional: only used when pricingSource = "manual"
  costMonthly?: string;
  cost6Months?: string;
  cost12Months?: string;
};

export type MembershipFeatureRow = {
  id: "pro_1m" | "pro_6m" | "pro_12m";
  label: string;
  months: 1 | 6 | 12;
  historicMonths: number;
  chatbotAccess: boolean;
  downloadableVideos: number;
};
