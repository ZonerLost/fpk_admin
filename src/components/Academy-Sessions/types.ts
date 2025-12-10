export type SessionType = "Live Training" | "Q&A" | "Webinar";

/**
 * "Bucket" lets admin decide if something is part of current week
 * content focus or moved to past recordings list.
 */
export type RecordingBucket = "currentWeek" | "past";

export type AccessLevel = "Pro" | "Registered" | "All";

export interface SessionItem {
  id: string;

  /** Internal/base title */
  title: string;

  /** Optional localized display title for this country/lang variant */
  displayTitle?: string;

  /**
   * Customizable release meta shown below the video (per country/lang)
   * Example: "Release Tue Jun 12, 6pm CET"
   */
  releaseLabel?: string;

  host: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  sessionType: SessionType;

  /** Helps align with week-based admin logic */
  week: number;

  /** Locale targeting */
  country: string;  // e.g. "Germany"
  language: string; // e.g. "EN", "DE"

  thumbnailUrl?: string;
  description?: string;
}

/**
 * Academy video content / recordings list (admin-side).
 * We treat each country+language version as its own row.
 */
export interface RecordingItem {
  id: string;

  /** Internal/base title */
  title: string;

  /** Optional localized display title */
  displayTitle?: string;

  /** Customizable release meta text */
  releaseLabel?: string;

  host: string;
  date: string;       // YYYY-MM-DD
  duration: string;   // "45 mins"
  views: string;      // "1.2K" (demo)
  access: AccessLevel;

  /** For collapsible/group logic later */
  week: number;

  /** Position inside week: #1, #2 etc */
  position: number;

  /** Locale targeting */
  country: string;
  language: string;

  /** Admin chooses whether it sits in current week or past recordings */
  bucket: RecordingBucket;

  /** Optional details shown in View modal */
  description?: string;
  tags?: string[];
  assetUrl?: string;
}

/** Survey models (simplified UI-first) */
export interface SurveyVariant {
  id: string;
  country: string;
  language: string;
  question: string;
  responsesCount: number;
}

export interface WeeklySurvey {
  id: string;
  week: number;
  variants: SurveyVariant[];
}

/** Free-form post models */
export interface FreeFormPost {
  id: string;
  country: string;
  language: string;
  title: string;
  body: string;
  updatedAt: string; // display-only
}
