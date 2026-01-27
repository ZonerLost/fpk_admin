export type FaqItem = {
  id: string;
  language: string; // EN first, then translations
  country: string; // "All" or specific
  question: string;
  answer: string;
  updatedAt: string;
};

export type FaqDoc = {
  id: string;
  language: string;
  country: string; // "All" or specific
  title: string;
  docUrl?: string; // link to html/pdf
  fileName?: string; // uploaded file name (frontend preview)
  updatedAt: string;
};
