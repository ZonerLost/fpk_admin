export type CustomerSegment =
  | "registered"
  | "pro_monthly"
  | "pro_6_month"
  | "pro_12_month";

export const CUSTOMER_SEGMENTS: readonly CustomerSegment[] = [
  "registered",
  "pro_monthly",
  "pro_6_month",
  "pro_12_month",
] as const;

export const SEGMENT_META: Record<
  CustomerSegment,
  { label: string; short: string; stroke: string; fill: string }
> = {
  registered: {
    label: "Registered",
    short: "Registered",
    stroke: "#22c55e",
    fill: "#22c55e",
  },
  pro_monthly: {
    label: "Pro Monthly",
    short: "Monthly",
    stroke: "#fbbf24",
    fill: "#fbbf24",
  },
  pro_6_month: {
    label: "Pro 6 Month",
    short: "6-Month",
    stroke: "#60a5fa",
    fill: "#60a5fa",
  },
  pro_12_month: {
    label: "Pro 12 Month",
    short: "12-Month",
    stroke: "#a78bfa",
    fill: "#a78bfa",
  },
};

//  UI state: [] means "All" (same as countries)
// This returns a de-duplicated selected array (can be empty).
export function uniqSegments(selected: CustomerSegment[]) {
  return Array.from(new Set(selected));
}

//  Data usage: if empty => treat as all
export function effectiveSegments(selected: CustomerSegment[]) {
  const uniq = uniqSegments(selected);
  return uniq.length === 0 ? [...CUSTOMER_SEGMENTS] : uniq;
}

// Backward-compatible alias used by existing dashboard modules.
export function normalizeSegments(selected: CustomerSegment[]) {
  return effectiveSegments(selected);
}

// = Subtitle/labels
export function segmentsSummary(selected: CustomerSegment[]) {
  const uniq = uniqSegments(selected);
  if (uniq.length === 0) return "All customer types";
  return uniq.map((s) => SEGMENT_META[s].label).join(", ");
}

export function parseSegmentsParam(raw: string | null): CustomerSegment[] {
  if (!raw) return [];
  const parts = raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  if (parts.length === 0) return [];

  // Any invalid value means treat query as "All".
  if (parts.some((p) => !(CUSTOMER_SEGMENTS as readonly string[]).includes(p))) {
    return [];
  }

  return Array.from(new Set(parts)) as CustomerSegment[];
}

export function serializeSegmentsParam(arr: CustomerSegment[]): string {
  return uniqSegments(arr).join(",");
}
