import type {
  DateRange,
  PeriodMode,
  Timeframe,
} from "./DashboardFiltersBar";
import {
  serializeSegmentsParam,
  type CustomerSegment,
} from "./customerSegments";

type CustomerDashboardQueryInput = {
  periodMode: PeriodMode;
  timeframe: Timeframe;
  range: number;
  dateRange: DateRange;
  selectedCountries: string[];
  selectedSegments: CustomerSegment[];
  selectedLanguages: string[];
};

function uniqueNonEmpty(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean))
  );
}

function setCsvParam(sp: URLSearchParams, key: string, values: string[]) {
  const list = uniqueNonEmpty(values);
  if (list.length > 0) {
    sp.set(key, list.join(","));
  }
}

export function buildCustomerDashboardQuery(
  input: CustomerDashboardQueryInput
) {
  const sp = new URLSearchParams();

  sp.set("periodMode", input.periodMode);
  sp.set("timeframe", input.timeframe);

  if (input.periodMode === "relative") {
    sp.set("range", String(input.range));
  } else {
    if (input.dateRange.startDate) sp.set("startDate", input.dateRange.startDate);
    if (input.dateRange.endDate) sp.set("endDate", input.dateRange.endDate);
  }

  setCsvParam(sp, "countries", input.selectedCountries);
  setCsvParam(sp, "languages", input.selectedLanguages);

  if (input.selectedSegments.length > 0) {
    sp.set("segments", serializeSegmentsParam(input.selectedSegments));
  }

  return sp.toString();
}

export function buildCustomerDashboardRequestUrl(
  pathname: string,
  input: CustomerDashboardQueryInput
) {
  const query = buildCustomerDashboardQuery(input);
  if (!query) return pathname;
  return `${pathname}?${query}`;
}
