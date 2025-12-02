export type ContentStatus = "published" | "scheduled" | "draft";
export type ContentType = "Train" | "Learn" | "Live" | "Doc";

export interface ContentItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  type: ContentType;
  week: number;
  access: "Pro" | "Basic" | "All";
  tags: string[];
  status: ContentStatus;
}
