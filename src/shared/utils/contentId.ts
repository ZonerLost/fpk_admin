export type ContentIdPrefix = "TR" | "LR" | "AC";
export type ContentLocale = "ENG" | "GER" | string;

/** Train/Learn/Academy mapping comes from PURPOSE (not file type). */
export type ContentPurposeIdKey =
  | "train_content"
  | "learn_content"
  | "academy_content"
  | "learn_thumbnail"
  | "intro_asset";

/**
 * PURPOSE -> prefix
 * (keeps your original logic exactly)
 */
export function prefixFromPurpose(purpose: ContentPurposeIdKey): ContentIdPrefix {
  if (purpose === "train_content") return "TR";
  if (purpose === "learn_content") return "LR";
  if (purpose === "academy_content") return "AC";

  // thumbnails / intro assets defaults (same as your file)
  if (purpose === "learn_thumbnail") return "LR";
  return "AC";
}

/**
 * UI/contentType -> prefix
 * (keeps your second-file mapping logic)
 * Adjust cases to match your backend categories.
 */
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

/**
 * Bare ID (your original): TR00001
 */
export function formatContentId(prefix: ContentIdPrefix, seq: number, locale?: ContentLocale) {
  const n = String(Math.max(0, seq)).padStart(5, "0");
  return locale ? `${prefix}${n}(${locale})` : `${prefix}${n}`;
}

/**
 * Localized ID (your other file): TR00001(ENG)
 * Default locale = "ENG" (same as your second file)
 */
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

/**
 * Returns sequence for BOTH:
 * - TR00001
 * - TR00001(ENG)
 */
export function parseContentSequence(contentId?: string | null): number | null {
  if (!contentId) return null;
  const s = contentId.trim();

  const m1 = s.match(BARE_ID_RE);
  if (m1) return Number(m1[2]);

  const m2 = s.match(LOCALE_ID_RE);
  if (m2) return Number(m2[2]);

  return null;
}

/**
 * Parse full parts (prefix/seq/locale).
 * locale will be null for bare IDs.
 */
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

/**
 * Your original validator (strict bare only): TR00001
 */
export function isContentId(s: string) {
  return BARE_ID_RE.test(s.trim());
}

/**
 * New validator for localized IDs: TR00001(ENG)
 */
export function isContentIdWithLocale(s: string) {
  return LOCALE_ID_RE.test(s.trim());
}

/**
 * Convenience: accepts either bare or localized.
 */
export function isAnyContentId(s: string) {
  const t = s.trim();
  return BARE_ID_RE.test(t) || LOCALE_ID_RE.test(t);
}
