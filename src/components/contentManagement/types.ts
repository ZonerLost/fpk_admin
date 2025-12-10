export type ContentStatus = "published" | "scheduled" | "draft";

export type ContentType =
  | "Train"
  | "Learn"
  | "Live"
  | "Doc"
  | "Survey"; 

export type ContentCategory =
  | "Mindset"
  | "Lifestyle"
  | "Tactic"
  | "Technique"
  | "Survey"; 

export type ContentAccess = "Pro" | "Basic" | "All";

export type ContentSourceType = "link" | "file";

/**
 * Purpose helps answer:
 * - Learn section thumbnails (small repeating thumbnails)
 * - Intro videos / images
 * - Normal content
 */
export type ContentPurpose = "content" | "learn_thumbnail" | "intro_asset";

export interface ContentItem {
  id: string;

  /** Used to group language variants of the same content */
  groupKey?: string;

  title: string;

  /** Where the asset is visually represented */
  thumbnailUrl: string;

  type: ContentType;
  category: ContentCategory;

  /** Week-based release structure */
  week: number;

  /** Position inside the week: e.g., Week 1 #1, #2 ... */
  positionInWeek: number;

  /** Access control */
  access: ContentAccess;

  /** Free content flags requested by client */
  isFreeForRegistered: boolean;
  isAcademyFreeForRegistered: boolean;

  /** Country + language selection */
  country: string; // For now single country
  language: string; // For now single language

  /** Publishing state */
  status: ContentStatus;
  publishAt?: string; // ISO - only relevant for scheduled

  /** Tags */
  tags: string[];

  /** Upload mode */
  sourceType: ContentSourceType;
  sourceUrl?: string; // if link
  fileName?: string; // if file

  /** Deletion guard */
  isDeletable?: boolean; // false = locked/core content

  /** Purpose for thumbnails / intro assets */
  purpose?: ContentPurpose;
}
