import * as React from "react";
import type { FaqDoc, FaqItem } from "../types";

const seedFaqs: FaqItem[] = [
  {
    id: "faq-en-1",
    language: "EN",
    country: "All",
    question: "How does the weekly content release work?",
    answer: "Train & Learn releases weekly based on the settings schedule. Academy releases per video.",
    updatedAt: "Just now",
  },
];

const seedDocs: FaqDoc[] = [
  {
    id: "doc-en-all",
    language: "EN",
    country: "All",
    title: "FAQ (EN) - Global",
    docUrl: "",
    fileName: "",
    updatedAt: "Just now",
  },
];

export function useFaqSettings() {
  const [mode, setMode] = React.useState<"docs" | "manual">("docs");

  const [faqs, setFaqs] = React.useState<FaqItem[]>(seedFaqs);
  const [docs, setDocs] = React.useState<FaqDoc[]>(seedDocs);

  const saveAll = async () => {
    // ✅ production: POST to backend
    console.log("SAVE FAQ:", { mode, faqs, docs });
  };

  return {
    mode,
    setMode,
    faqs,
    setFaqs,
    docs,
    setDocs,
    saveAll,
  };
}
