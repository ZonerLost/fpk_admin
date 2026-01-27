export type ReleaseDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type ReleaseWindowKind = "Month" | "Week";

export type ReleaseWindow = {
  id: string;
  kind: ReleaseWindowKind;
  label: string; // e.g. "Month 1", "Week 12"
  active: boolean;

  // optional metadata (for backend use later)
  startDate?: string; // ISO date
  endDate?: string; // ISO date

  // UI signals
  itemsCount?: number;
};

export type ContentReleaseSettings = {
  trainLearnEnabled: boolean;
  releaseDay: ReleaseDay;
  releaseTimeLocal: string; // "HH:mm"
  excludedCountries: string[];
  windows: ReleaseWindow[];
};
