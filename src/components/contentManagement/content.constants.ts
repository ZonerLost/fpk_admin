import type { ToggleOption } from "../../shared/inputs/ToggleChips";
import type {ContentPurpose } from "./types";

export const COUNTRIES = ["USA", "UK", "Germany", "France", "Spain", "Pakistan"] as const;
export const LANGUAGES = ["EN", "DE", "FR", "ES", "UR"] as const;

export const MONTH_OPTIONS = ["All", ...Array.from({ length: 48 }, (_, i) => String(i + 1))];
export const WEEK_OPTIONS = ["All", ...Array.from({ length: 12 }, (_, i) => String(i + 1))];

export const TYPE_OPTIONS: ToggleOption[] = [
  { value: "Video", label: "Video" },
  { value: "PDF", label: "PDF" },
  { value: "Image", label: "Image" },
  { value: "Survey", label: "Survey" },
];

export const CATEGORY_OPTIONS: ToggleOption[] = [
  { value: "Mindset", label: "Mindset" },
  { value: "Tactic", label: "Tactic" },
  { value: "Technik", label: "Technik" },
  { value: "Fitness", label: "Fitness" },
];

export const PURPOSE_OPTIONS: ToggleOption[] = [
  { value: "learn_thumbnail", label: "Learn Thumbnail" },
  { value: "intro_asset", label: "Intro Asset" },
  { value: "learn_content", label: "Learn Content" },
  { value: "train_content", label: "Train Content" },
  { value: "academy_content", label: "Academy Content" },
];

export const ACCESS_OPTIONS: ToggleOption[] = [
  { value: "Pro", label: "Pro" },
  { value: "Basic", label: "Basic" },
  { value: "All", label: "All" },
];

export const STATUS_OPTIONS: ToggleOption[] = [
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
  { value: "draft", label: "Draft" },
];

export const SOURCE_TYPE_OPTIONS: ToggleOption[] = [
  { value: "link", label: "Upload Link" },
  { value: "file", label: "Upload File" },
];

export const THUMBNAIL_SOURCE_OPTIONS: ToggleOption[] = [
  { value: "url", label: "Thumbnail URL" },
  { value: "file", label: "Upload Thumbnail" },
];

export function normalizePurposeLabel(purpose: ContentPurpose) {
  switch (purpose) {
    case "learn_thumbnail":
      return "Learn Thumbnail";
    case "intro_asset":
      return "Intro Asset";
    case "learn_content":
      return "Learn Content";
    case "train_content":
      return "Train Content";
    case "academy_content":
      return "Academy Content";
    default:
      return purpose;
  }
}
