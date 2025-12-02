export interface SessionItem {
  id: string;
  title: string;
  host: string;
  date: string;      // ISO date: "2024-10-28"
  time: string;      // "16:00"
  thumbnailUrl?: string;
  description?: string;
}

export interface RecordingItem {
  id: string;
  title: string;
  host: string;
  date: string;      // "2024-10-02"
  duration: string;  // "45 mins"
  views: string;     // "1.2K"
  access: string;    // "Live", "Recorded", etc (optional)
}
