import { getTimeZoneForCountry } from "../../../shared/constants/locale";
import type { AcademyContentItem } from "../types/types";

export function inferTimezone(country: string): string {
  return getTimeZoneForCountry(country) ?? "UTC";
}

export function nextAcademyContentId(existing: string[], prefix = "AC"): string {
  let max = 0;

  for (const id of existing) {
    if (!id?.startsWith(prefix)) continue;
    const n = Number(id.slice(prefix.length));
    if (!Number.isNaN(n)) {
      max = Math.max(max, n);
    }
  }

  const next = max + 1;
  return `${prefix}${String(next).padStart(5, "0")}`;
}

function safeDateLabel(yyyyMmDd: string): string {
  try {
    const [y, m, d] = yyyyMmDd.split("-").map(Number);
    // noon prevents timezone shifting issues for date-only formatting
    const dt = new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0);
    return dt.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return yyyyMmDd;
  }
}

function to12h(hhmm: string): string {
  try {
    const [hRaw, mRaw] = hhmm.split(":").map(Number);
    const h = hRaw ?? 0;
    const m = mRaw ?? 0;
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = ((h + 11) % 12) + 1;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  } catch {
    return hhmm;
  }
}

/**
 * releaseDate + releaseTime are stored as "local time for that country".
 * This helper formats a friendly label and appends the timezone hint.
 */
export function formatReleaseLabel(opts: {
  releaseDate?: string;
  releaseTime?: string;
  timezone?: string;
}): string {
  const dateLabel = opts.releaseDate ? safeDateLabel(opts.releaseDate) : "—";
  const timeLabel = opts.releaseTime ? to12h(opts.releaseTime) : "—";
  const tz = opts.timezone ? ` (${opts.timezone})` : "";
  return `${dateLabel} - ${timeLabel}${tz}`;
}

export function downloadCsv(filename: string, rows: string[][]): void {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function prettyUtcDate(yyyyMmDd: string): string {
  try {
    const [y, m, d] = yyyyMmDd.split("-").map(Number);
    const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
    return dt.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return yyyyMmDd;
  }
}

export function formatReleaseDisplay(country: string, date: string, time: string): string {
  const tz = getTimeZoneForCountry(country);
  return `${prettyUtcDate(date)} \u00b7 ${time} (local, ${tz})`;
}

/**
 * Enforce: only one per (week,country,language) can have freeForRegistered=true.
 * If the incoming item is freeForRegistered, we auto-disable others in that group.
 */
export function applyFreeForRegisteredUniqueness(
  items: AcademyContentItem[],
  incoming: AcademyContentItem
): AcademyContentItem[] {
  if (!incoming.freeForRegistered) return items;

  return items.map((it) => {
    const sameGroup =
      it.week === incoming.week &&
      it.country === incoming.country &&
      it.language === incoming.language;

    if (!sameGroup) return it;
    if (it.id === incoming.id) return it;

    return { ...it, freeForRegistered: false };
  });
}
