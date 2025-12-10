import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  updatedAt: string;
};

const seedFaqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "How does the weekly content release work?",
    answer:
      "New content is released weekly based on your configured release defaults. Access to content is managed manually through the Content Management console.",
    updatedAt: "Just now",
  },
  {
    id: "faq-2",
    question: "How is my country determined?",
    answer:
      "Country should originate from the app store where the app was downloaded. This ensures consistent localization and pricing behavior across the app.",
    updatedAt: "Just now",
  },
  {
    id: "faq-3",
    question: "What is the difference between Registered and Unregistered users?",
    answer:
      "Registered users have created an account in the app. Unregistered users may exist in analytics or pre-registration flows but should not have Pro status data until they register.",
    updatedAt: "Just now",
  },
  {
    id: "faq-4",
    question: "What does Pro membership include?",
    answer:
      "Pro access is determined by your membership length rules and manual content access decisions. The exact features may vary by country and subscription duration.",
    updatedAt: "Just now",
  },
];

const GeneralSettingsSection: React.FC = () => {
  // FAQ list
  const [faqs, setFaqs] = React.useState<FaqItem[]>(seedFaqs);

  // Add form state
  const [newQuestion, setNewQuestion] = React.useState("");
  const [newAnswer, setNewAnswer] = React.useState("");

  // Edit state
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draftQuestion, setDraftQuestion] = React.useState("");
  const [draftAnswer, setDraftAnswer] = React.useState("");

  const startEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setDraftQuestion(item.question);
    setDraftAnswer(item.answer);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftQuestion("");
    setDraftAnswer("");
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (!draftQuestion.trim() || !draftAnswer.trim()) return;

    setFaqs((prev) =>
      prev.map((f) =>
        f.id === editingId
          ? {
              ...f,
              question: draftQuestion.trim(),
              answer: draftAnswer.trim(),
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
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      updatedAt: "Just now",
    };

    setFaqs((prev) => [next, ...prev]);
    setNewQuestion("");
    setNewAnswer("");
  };

  const handleSaveAll = () => {
    // Placeholder for backend integration
    console.log("FAQ settings saved", faqs);
  };

  return (
    <div className="space-y-6">
      {/* ✅ FAQ SECTION ONLY */}
      <SectionCard
        title="FAQ"
        subtitle="Manage the frequently asked questions shown to users. This replaces General brand settings."
        className="bg-[#04130d]"
      >
        {/* Add new FAQ */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <h4 className="text-sm font-semibold text-slate-100">
            Add new FAQ
          </h4>

          <div className="mt-3 grid gap-3">
            <TextField
              label="Question"
              placeholder="Enter FAQ question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />

            {/* Using native textarea to avoid assuming TextField supports multiline */}
            <div>
              <label className="text-xs font-medium text-slate-200 md:text-sm">
                Answer
              </label>
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

        {/* Existing FAQs */}
        <div className="mt-5 space-y-3">
          {faqs.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400 md:text-sm">
                No FAQs yet. Add your first one above.
              </p>
            </div>
          )}

          {faqs.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    {!isEditing ? (
                      <>
                        <h5 className="text-sm font-semibold text-slate-100">
                          {item.question}
                        </h5>
                        <p className="mt-1 text-xs text-slate-300 md:text-sm">
                          {item.answer}
                        </p>
                        <p className="mt-2 text-[10px] text-slate-500">
                          Updated: {item.updatedAt}
                        </p>
                      </>
                    ) : (
                      <div className="grid gap-3">
                        <TextField
                          label="Question"
                          value={draftQuestion}
                          onChange={(e) => setDraftQuestion(e.target.value)}
                        />

                        <div>
                          <label className="text-xs font-medium text-slate-200 md:text-sm">
                            Answer
                          </label>
                          <textarea
                            rows={4}
                            value={draftAnswer}
                            onChange={(e) => setDraftAnswer(e.target.value)}
                            className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
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
                          disabled={!draftQuestion.trim() || !draftAnswer.trim()}
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

        {/* Save all */}
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSaveAll}>
            Save Changes
          </Button>
        </div>
      </SectionCard>

    
     
    </div>
  );
};

export default GeneralSettingsSection;
