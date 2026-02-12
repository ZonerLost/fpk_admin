export type ContentStatus = "published" | "scheduled" | "draft";

/** File type */
export type ContentType = "PDF" | "Image" | "Video" | "Survey";

/** Category taxonomy */
export type ContentCategory = "Mindset" | "Tactic" | "Technik" | "Fitness";

/** Access control */
export type ContentAccess = "Pro" | "Basic" | "All";

/** Upload mode for main content */
export type ContentSourceType = "link" | "file";

/** Thumbnail source */
export type ThumbnailSourceType = "url" | "file";

export type ContentPurpose =
  | "learn_thumbnail"
  | "intro_asset"
  | "learn_content"
  | "train_content"
  | "academy_content";

export interface ContentItem {
  id: string;

  /** Unique identifier like TR00001 / LR00001 / AC00001 */
  contentId: string;

  /** Used to group language variants of the same content */
  groupKey?: string;

  title: string;

  /** Visual thumbnail */
  thumbnailUrl: string;

  /** Optional thumbnail upload metadata (backend later) */
  thumbnailSourceType?: ThumbnailSourceType;
  thumbnailFileName?: string;

  type: ContentType;
  category: ContentCategory;
  purpose: ContentPurpose;

  /** Program structure */
  month: number; // 1..48
  week: number; // 1..12
  positionInWeek: number;

  /** Access control */
  access: ContentAccess;

  /** Free content flags */
  isFreeForRegistered: boolean;
  isAcademyFreeForRegistered: boolean;

  /**  New: no-hurdle onboarding (typically Month 1 / Week 1) */
  isFreeForEveryone?: boolean;

  /** Country + language */
  country: string;
  language: string;

  /** Publishing */
  status: ContentStatus;
  publishAt?: string;

  /** Tags */
  tags: string[];

  /** Upload mode */
  sourceType: ContentSourceType;
  sourceUrl?: string;
  fileName?: string;

  /** Deletion guard */
  isDeletable?: boolean;
}
