export type ContentIdPrefix = "TR" | "LR" | "AC";
export type ContentLocale = "ENG" | "GER" | string;

/** Train/Learn/Academy mapping comes from PURPOSE (not file type). */
export type ContentPurposeIdKey =
  | "train_content"
  | "learn_content"
  | "academy_content"
  | "learn_thumbnail"
  | "intro_asset";

export function prefixFromPurpose(purpose: ContentPurposeIdKey): ContentIdPrefix {
  if (purpose === "train_content") return "TR";
  if (purpose === "learn_content") return "LR";
  if (purpose === "academy_content") return "AC";

  // thumbnails / intro assets defaults (same as your file)
  if (purpose === "learn_thumbnail") return "LR";
  return "AC";
}

export function prefixFromContentType(contentType: string): ContentIdPrefix {
  switch (contentType) {
    case "tactic":
    case "drill":
      return "TR";
    case "match":
      return "LR";
    case "live":
      return "AC";
    default:
      return "TR";
  }
}

/* -------------------------------------------------------------------------- */
/* Formatting                                                                  */
/* -------------------------------------------------------------------------- */

export function formatContentId(prefix: ContentIdPrefix, seq: number, locale?: ContentLocale) {
  const n = String(Math.max(0, seq)).padStart(5, "0");
  return locale ? `${prefix}${n}(${locale})` : `${prefix}${n}`;
}

export function formatContentIdWithLocale(
  prefix: ContentIdPrefix,
  seq: number,
  locale: ContentLocale = "ENG"
) {
  return formatContentId(prefix, seq, locale);
}

/* -------------------------------------------------------------------------- */
/* Parsing & Validation                                                        */
/* -------------------------------------------------------------------------- */

const BARE_ID_RE = /^(TR|LR|AC)(\d{5})$/i;
const LOCALE_ID_RE = /^(TR|LR|AC)(\d{5})\(([^)]+)\)$/i;


export function parseContentSequence(contentId?: string | null): number | null {
  if (!contentId) return null;
  const s = contentId.trim();

  const m1 = s.match(BARE_ID_RE);
  if (m1) return Number(m1[2]);

  const m2 = s.match(LOCALE_ID_RE);
  if (m2) return Number(m2[2]);

  return null;
}
export function parseContentIdParts(contentId?: string | null): {
  prefix: ContentIdPrefix;
  seq: number;
  locale: string | null;
} | null {
  if (!contentId) return null;
  const s = contentId.trim();

  const m1 = s.match(BARE_ID_RE);
  if (m1) {
    return {
      prefix: m1[1].toUpperCase() as ContentIdPrefix,
      seq: Number(m1[2]),
      locale: null,
    };
  }

  const m2 = s.match(LOCALE_ID_RE);
  if (m2) {
    return {
      prefix: m2[1].toUpperCase() as ContentIdPrefix,
      seq: Number(m2[2]),
      locale: m2[3],
    };
  }

  return null;
}


export function isContentId(s: string) {
  return BARE_ID_RE.test(s.trim());
}


export function isContentIdWithLocale(s: string) {
  return LOCALE_ID_RE.test(s.trim());
}


export function isAnyContentId(s: string) {
  const t = s.trim();
  return BARE_ID_RE.test(t) || LOCALE_ID_RE.test(t);
}
