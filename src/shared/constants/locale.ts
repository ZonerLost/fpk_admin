export type LocaleLanguage =
  | "EN"
  | "DE"
  | "ES"
  | "FR"
  | "TR"
  | "RO"
  | "PL"
  | "UA"
  | "ZH"
  | "JA"
  | "KO";

export type CountryConfig = {
  id: string;
  country: string;
  languages: LocaleLanguage[];
  currency: string;
  /** IANA timezone. NOTE: some countries have multiple timezones; pick the business default. */
  timeZone: string;
};

export const COUNTRY_CATALOG: CountryConfig[] = [
  { id: "de", country: "Germany", languages: ["DE", "EN"], currency: "EUR", timeZone: "Europe/Berlin" },
  { id: "at", country: "Austria", languages: ["DE", "EN"], currency: "EUR", timeZone: "Europe/Vienna" },
  { id: "ch", country: "Switzerland", languages: ["DE", "EN", "FR"], currency: "CHF", timeZone: "Europe/Zurich" },

  { id: "us", country: "USA", languages: ["EN", "ES"], currency: "USD", timeZone: "America/New_York" },
  { id: "ca", country: "Canada", languages: ["EN", "FR"], currency: "CAD", timeZone: "America/Toronto" },
  { id: "uk", country: "UK", languages: ["EN"], currency: "GBP", timeZone: "Europe/London" },

  { id: "za", country: "South Africa", languages: ["EN"], currency: "ZAR", timeZone: "Africa/Johannesburg" },
  { id: "au", country: "Australia", languages: ["EN"], currency: "AUD", timeZone: "Australia/Sydney" },
  { id: "ng", country: "Nigeria", languages: ["EN"], currency: "NGN", timeZone: "Africa/Lagos" },
  { id: "ke", country: "Kenya", languages: ["EN"], currency: "KES", timeZone: "Africa/Nairobi" },

  { id: "tr", country: "Turkey", languages: ["TR", "EN"], currency: "TRY", timeZone: "Europe/Istanbul" },
  { id: "ro", country: "Romania", languages: ["RO", "TR"], currency: "RON", timeZone: "Europe/Bucharest" },
  { id: "pl", country: "Poland", languages: ["PL", "EN"], currency: "PLN", timeZone: "Europe/Warsaw" },
  { id: "ua", country: "Ukraine", languages: ["UA", "EN"], currency: "UAH", timeZone: "Europe/Kyiv" },

  { id: "cn", country: "China", languages: ["ZH", "EN"], currency: "CNY", timeZone: "Asia/Shanghai" },
  { id: "jp", country: "Japan", languages: ["JA", "EN"], currency: "JPY", timeZone: "Asia/Tokyo" },
  { id: "kr", country: "South Korea", languages: ["KO", "EN"], currency: "KRW", timeZone: "Asia/Seoul" },
  { id: "mx", country: "Mexico", languages: ["ES", "EN"], currency: "MXN", timeZone: "America/Mexico_City" },
];

export const COUNTRY_OPTIONS = ["All", ...COUNTRY_CATALOG.map((c) => c.country)] as const;

export const LANGUAGE_OPTIONS = [
  "All",
  ...Array.from(
    new Set(COUNTRY_CATALOG.flatMap((c) => c.languages))
  ).sort(),
] as const;

export function getCountryConfig(country: string): CountryConfig | undefined {
  return COUNTRY_CATALOG.find((c) => c.country === country);
}

export function getTimeZoneForCountry(country: string): string {
  return getCountryConfig(country)?.timeZone ?? "UTC";
}
