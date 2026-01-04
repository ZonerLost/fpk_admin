export type CountryId =
  | "DE"
  | "AT"
  | "CH"
  | "US"
  | "CA"
  | "UK"
  | "ZA"
  | "AU"
  | "NG"
  | "KE"
  | "TR"
  | "RO"
  | "PL"
  | "UA"
  | "CN"
  | "JP"
  | "KR"
  | "MX";

export type LanguageCode = "EN" | "DE" | "ES" | "FR" | "TR" | "RO" | "PL" | "UK" | "ZH" | "JA" | "KO";

export type CountryCatalogItem = {
  id: CountryId;
  /** Display name used in UI (your app uses "Germany", "USA", "UK" etc) */
  country: string;

  /** Default language shown in app/store by default (per your pricing matrix requirement) */
  defaultLanguage: LanguageCode;

  /** Languages offered in the app for this country */
  languages: LanguageCode[];

  /**
   * IANA timezone used for "local time" releases.
   * Example: Germany 4pm -> Europe/Berlin 16:00 local.
   */
  timezone: string;

  /** Optional UI helpers */
  currency?: string;
};

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  EN: "English",
  DE: "German",
  ES: "Spanish",
  FR: "French",
  TR: "Turkish",
  RO: "Romanian",
  PL: "Polish",
  UK: "Ukrainian",
  ZH: "Chinese",
  JA: "Japanese",
  KO: "Korean",
};

export const COUNTRY_CATALOG: CountryCatalogItem[] = [
  // Europe (German market cluster)
  {
    id: "DE",
    country: "Germany",
    defaultLanguage: "DE",
    languages: ["DE", "EN"],
    timezone: "Europe/Berlin",
    currency: "EUR",
  },
  {
    id: "AT",
    country: "Austria",
    defaultLanguage: "DE",
    languages: ["DE", "EN"],
    timezone: "Europe/Vienna",
    currency: "EUR",
  },
  {
    id: "CH",
    country: "Switzerland",
    defaultLanguage: "DE",
    languages: ["DE", "EN", "FR"],
    timezone: "Europe/Zurich",
    currency: "CHF",
  },

  // North America
  {
    id: "US",
    country: "USA",
    defaultLanguage: "EN",
    languages: ["EN"],
    timezone: "America/New_York",
    currency: "USD",
  },
  {
    id: "CA",
    country: "Canada",
    defaultLanguage: "EN",
    languages: ["EN", "FR"],
    timezone: "America/Toronto",
    currency: "CAD",
  },

  // UK
  {
    id: "UK",
    country: "UK",
    defaultLanguage: "EN",
    languages: ["EN"],
    timezone: "Europe/London",
    currency: "GBP",
  },

  // Africa
  {
    id: "ZA",
    country: "South Africa",
    defaultLanguage: "EN",
    languages: ["EN"],
    timezone: "Africa/Johannesburg",
    currency: "ZAR",
  },
  {
    id: "NG",
    country: "Nigeria",
    defaultLanguage: "EN",
    languages: ["EN"],
    timezone: "Africa/Lagos",
    currency: "NGN",
  },
  {
    id: "KE",
    country: "Kenya",
    defaultLanguage: "EN",
    languages: ["EN"],
    timezone: "Africa/Nairobi",
    currency: "KES",
  },

  // Oceania
  {
    id: "AU",
    country: "Australia",
    defaultLanguage: "EN",
    languages: ["EN"],
    timezone: "Australia/Sydney",
    currency: "AUD",
  },

  // Turkey / Romania / Poland / Ukraine (as in your pricing list)
  {
    id: "TR",
    country: "Turkey",
    defaultLanguage: "TR",
    languages: ["TR", "EN"],
    timezone: "Europe/Istanbul",
    currency: "TRY",
  },
  {
    id: "RO",
    country: "Romania",
    defaultLanguage: "RO",
    languages: ["RO", "TR"],
    timezone: "Europe/Bucharest",
    currency: "RON",
  },
  {
    id: "PL",
    country: "Poland",
    defaultLanguage: "PL",
    languages: ["PL", "EN"],
    timezone: "Europe/Warsaw",
    currency: "PLN",
  },
  {
    id: "UA",
    country: "Ukraine",
    defaultLanguage: "UK",
    languages: ["UK", "EN"],
    timezone: "Europe/Kyiv",
    currency: "UAH",
  },

  // Asia
  {
    id: "CN",
    country: "China",
    defaultLanguage: "ZH",
    languages: ["ZH", "EN"],
    timezone: "Asia/Shanghai",
    currency: "CNY",
  },
  {
    id: "JP",
    country: "Japan",
    defaultLanguage: "JA",
    languages: ["JA", "EN"],
    timezone: "Asia/Tokyo",
    currency: "JPY",
  },
  {
    id: "KR",
    country: "South Korea",
    defaultLanguage: "KO",
    languages: ["KO", "EN"],
    timezone: "Asia/Seoul",
    currency: "KRW",
  },

  // LATAM
  {
    id: "MX",
    country: "Mexico",
    defaultLanguage: "ES",
    languages: ["ES", "EN"],
    timezone: "America/Mexico_City",
    currency: "MXN",
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

export function getCountryByName(country: string): CountryCatalogItem | null {
  const c = COUNTRY_CATALOG.find((x) => x.country === country);
  return c ?? null;
}

export function getTimezoneForCountry(country: string, fallback = "UTC"): string {
  return getCountryByName(country)?.timezone ?? fallback;
}

export function getLanguagesForCountry(country: string): LanguageCode[] {
  return getCountryByName(country)?.languages ?? ["EN"];
}

export function isValidCountryName(country: string): boolean {
  return !!getCountryByName(country);
}

export function isValidLanguageCode(code: string): code is LanguageCode {
  return Object.prototype.hasOwnProperty.call(LANGUAGE_LABELS, code);
}
