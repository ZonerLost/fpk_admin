export const ACADEMY_COUNTRIES = ["USA", "UK", "Germany", "France", "Spain", "Pakistan"] as const;
export const ACADEMY_LANGUAGES = ["EN", "DE", "FR", "ES", "UR"] as const;

export const COUNTRY_TIMEZONES: Record<string, string> = {
  USA: "America/New_York", // default (you can refine later by state)
  UK: "Europe/London",
  Germany: "Europe/Berlin",
  France: "Europe/Paris",
  Spain: "Europe/Madrid",
  Pakistan: "Asia/Karachi",
};

export const BUCKET_OPTIONS = ["All", "currentWeek", "past"] as const;

export const BUCKET_LABELS: Record<string, string> = {
  All: "All",
  currentWeek: "Current Week",
  past: "Past Weeks",
};
