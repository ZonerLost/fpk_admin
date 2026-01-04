export type SessionType = "Live Training" | "Q&A" | "Webinar";

export interface SessionItem {
  id: string;
  title: string;
  displayTitle?: string;
  releaseLabel?: string;
  host: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  sessionType: SessionType;
  week: number;
  country: string;
  language: string;
  thumbnailUrl?: string;
  description?: string;
}

export type RecordingBucket = "currentWeek" | "past";
export type AccessLevel = "Pro" | "Registered" | "All";

export interface AcademyContentItem {
  id: string;
  contentId: string;
  title: string;
  displayTitle?: string;
  host: string;
  releaseDate: string; // YYYY-MM-DD (local to the country)
  releaseTime: string; // HH:mm (local to the country)
  week: number;
  position: number;
  country: string;
  language: string;
  bucket: RecordingBucket;
  access: AccessLevel;
  freeForRegistered?: boolean;
  thumbnailUrl?: string;
  duration?: string;
  views?: string;
  description?: string;
  tags?: string[];
  assetUrl?: string;
}

export interface RecordingItem extends AcademyContentItem {
  releaseLabel?: string;
  date?: string; // legacy: YYYY-MM-DD
  time?: string; // legacy: HH:mm
  timezone?: string;
  isFreeForRegistered?: boolean; // legacy naming
}

export type SurveyResponseType = "multipleChoice" | "freeForm" | "both";

export interface SurveyVariant {
  id: string;
  week: number;
  country: string;
  language: string;
  question: string;
  responsesCount: number;

  /** Preferred naming */
  responseType?: SurveyResponseType;
  options?: string[];

  /** Legacy naming kept for compatibility */
  responseMode?: "multiple_choice" | "free_form" | "both";
  multipleChoiceOptions?: string[];
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
