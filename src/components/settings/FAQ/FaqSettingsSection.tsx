import React from "react";
import SectionCard from "../../../shared/layout/SectionCard";
import TextField from "../../../shared/inputs/TextField";
import Button from "../../../shared/inputs/Button";
import Badge from "../../../shared/data-display/Badge";
import { COUNTRY_OPTIONS, LANGUAGE_OPTIONS } from "../../../shared/constants/locale";

type FaqItem = {
  id: string;
  language: string; // EN first, then translations
  country: string; // "All" or specific country
  question: string;
  answer: string;
  updatedAt: string;
};

const seedFaqs: FaqItem[] = [
  {
    id: "faq-en-1",
    language: "EN",
    country: "All",
    question: "How does the weekly content release work?",
    answer: "New content is released weekly at the configured release time (interpreted in each country’s local timezone).",
    updatedAt: "Just now",
  },
  {
    id: "faq-en-2",
    language: "EN",
    country: "All",
    question: "How is my country determined?",
    answer: "Country should originate from the app store where the app was downloaded to ensure consistent localization and pricing.",
    updatedAt: "Just now",
  },
];

const sortFaqs = (a: FaqItem, b: FaqItem) => {
  if (a.language === "EN" && b.language !== "EN") return -1;
  if (a.language !== "EN" && b.language === "EN") return 1;
  if (a.language !== b.language) return a.language.localeCompare(b.language);
  return a.question.localeCompare(b.question);
};

const FaqSettingsSection: React.FC = () => {
  const [faqs, setFaqs] = React.useState<FaqItem[]>(seedFaqs);

  // list filters
  const [filterLang, setFilterLang] = React.useState("All");
  const [filterCountry, setFilterCountry] = React.useState("All");

  // add form
  const [newLang, setNewLang] = React.useState("EN");
  const [newCountry, setNewCountry] = React.useState("All");
  const [newQuestion, setNewQuestion] = React.useState("");
  const [newAnswer, setNewAnswer] = React.useState("");

  // edit
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<Partial<FaqItem>>({});

  const visibleFaqs = React.useMemo(() => {
    return faqs
      .slice()
      .sort(sortFaqs)
      .filter((f) => {
        if (filterLang !== "All" && f.language !== filterLang) return false;
        if (filterCountry !== "All" && f.country !== filterCountry) return false;
        return true;
      });
  }, [faqs, filterLang, filterCountry]);

  const startEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setDraft({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = () => {
    if (!editingId) return;
    const q = String(draft.question ?? "").trim();
    const a = String(draft.answer ?? "").trim();
    if (!q || !a) return;

    setFaqs((prev) =>
      prev.map((f) =>
        f.id === editingId
          ? {
              ...f,
              language: String(draft.language ?? f.language),
              country: String(draft.country ?? f.country),
              question: q,
              answer: a,
              updatedAt: "Just now",
            }
          : f
      )
    );
    cancelEdit();
  };

  const deleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    if (editingId === id) cancelEdit();
  };

  const addFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const next: FaqItem = {
      id: `faq-${Date.now()}`,
      language: newLang,
      country: newCountry,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      updatedAt: "Just now",
    };

    setFaqs((prev) => [next, ...prev]);
    setNewQuestion("");
    setNewAnswer("");
    setNewLang("EN");
    setNewCountry("All");
  };

  const handleSaveAll = () => {
    console.log("FAQ saved", faqs);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="FAQ"
        subtitle="FAQs are localized by language, with optional country-specific visibility."
        className="bg-[#04130d]"
      >
        {/* Filters */}
        <div className="flex flex-wrap gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="min-w-[180px] flex-1">
            <label className="text-xs font-medium text-slate-200 md:text-sm">Filter Language</label>
            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l} value={l} className="bg-black">
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[180px] flex-1">
            <label className="text-xs font-medium text-slate-200 md:text-sm">Filter Country</label>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c} value={c} className="bg-black">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add new */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
          <h4 className="text-sm font-semibold text-slate-100">Add new FAQ</h4>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-200 md:text-sm">Language</label>
              <select
                value={newLang}
                onChange={(e) => setNewLang(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
              >
                {LANGUAGE_OPTIONS.filter((x) => x !== "All").map((l) => (
                  <option key={l} value={l} className="bg-black">
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-200 md:text-sm">Display in Country</label>
              <select
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c} className="bg-black">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 grid gap-3">
            <TextField
              label="Question"
              placeholder="Enter FAQ question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <div>
              <label className="text-xs font-medium text-slate-200 md:text-sm">Answer</label>
              <textarea
                rows={4}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Enter FAQ answer..."
                className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={addFaq}
                disabled={!newQuestion.trim() || !newAnswer.trim()}
                className="rounded-lg"
              >
                Add FAQ
              </Button>
            </div>
          </div>
        </div>

        {/* Existing */}
        <div className="mt-5 space-y-3">
          {visibleFaqs.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400 md:text-sm">
                No FAQs match the current filters.
              </p>
            </div>
          )}

          {visibleFaqs.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral">{item.language}</Badge>
                  <Badge variant="neutral">
                    {item.country === "All" ? "All countries" : `Only: ${item.country}`}
                  </Badge>
                  <span className="text-[10px] text-slate-500">
                    Updated: {item.updatedAt}
                  </span>
                </div>

                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    {!isEditing ? (
                      <>
                        <h5 className="text-sm font-semibold text-slate-100">
                          {item.question}
                        </h5>
                        <p className="mt-1 text-xs text-slate-300 md:text-sm">
                          {item.answer}
                        </p>
                      </>
                    ) : (
                      <div className="grid gap-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="text-xs font-medium text-slate-200 md:text-sm">Language</label>
                            <select
                              value={String(draft.language ?? item.language)}
                              onChange={(e) => setDraft((p) => ({ ...p, language: e.target.value }))}
                              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
                            >
                              {LANGUAGE_OPTIONS.filter((x) => x !== "All").map((l) => (
                                <option key={l} value={l} className="bg-black">
                                  {l}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-medium text-slate-200 md:text-sm">
                              Display in Country
                            </label>
                            <select
                              value={String(draft.country ?? item.country)}
                              onChange={(e) => setDraft((p) => ({ ...p, country: e.target.value }))}
                              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
                            >
                              {COUNTRY_OPTIONS.map((c) => (
                                <option key={c} value={c} className="bg-black">
                                  {c}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <TextField
                          label="Question"
                          value={String(draft.question ?? "")}
                          onChange={(e) => setDraft((p) => ({ ...p, question: e.target.value }))}
                        />
                        <div>
                          <label className="text-xs font-medium text-slate-200 md:text-sm">
                            Answer
                          </label>
                          <textarea
                            rows={4}
                            value={String(draft.answer ?? "")}
                            onChange={(e) => setDraft((p) => ({ ...p, answer: e.target.value }))}
                            className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {!isEditing ? (
                      <>
                        <Button
                          variant="secondary"
                          className="rounded-lg border border-white/10 bg-transparent px-3 py-1 text-xs hover:bg-white/10"
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="secondary"
                          className="rounded-lg border border-white/10 bg-transparent px-3 py-1 text-xs text-rose-200 hover:bg-white/10"
                          onClick={() => deleteFaq(item.id)}
                        >
                          Delete
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          className="rounded-lg border border-white/10 bg-transparent px-3 py-1 text-xs hover:bg-white/10"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          className="rounded-lg px-3 py-1 text-xs"
                          onClick={saveEdit}
                          disabled={!String(draft.question ?? "").trim() || !String(draft.answer ?? "").trim()}
                        >
                          Save
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSaveAll}>
            Save Changes
          </Button>
        </div>
      </SectionCard>
    </div>
  );
};

export default FaqSettingsSection;
