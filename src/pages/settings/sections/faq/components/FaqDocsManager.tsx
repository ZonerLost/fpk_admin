import React from "react";
import SectionCard from "../../../../../shared/layout/SectionCard";
import TextField from "../../../../../shared/inputs/TextField";
import Button from "../../../../../shared/inputs/Button";
import Badge from "../../../../../shared/data-display/Badge";
import { COUNTRY_OPTIONS, LANGUAGE_OPTIONS } from "../../../../../shared/constants/locale";
import type { FaqDoc } from "../types";

type Props = {
  docs: FaqDoc[];
  onChange: (next: FaqDoc[]) => void;
};

function sortDocs(a: FaqDoc, b: FaqDoc) {
  if (a.language === "EN" && b.language !== "EN") return -1;
  if (a.language !== "EN" && b.language === "EN") return 1;
  if (a.language !== b.language) return a.language.localeCompare(b.language);
  if (a.country !== b.country) return a.country.localeCompare(b.country);
  return a.title.localeCompare(b.title);
}

const FaqDocsManager: React.FC<Props> = ({ docs, onChange }) => {
  const [newLang, setNewLang] = React.useState("EN");
  const [newCountry, setNewCountry] = React.useState("All");
  const [newTitle, setNewTitle] = React.useState("");
  const [newUrl, setNewUrl] = React.useState("");

  const add = () => {
    if (!newTitle.trim()) return;
    const next: FaqDoc = {
      id: `doc-${Date.now()}`,
      language: newLang,
      country: newCountry,
      title: newTitle.trim(),
      docUrl: newUrl.trim() || undefined,
      updatedAt: "Just now",
    };
    onChange([next, ...docs]);
    setNewTitle("");
    setNewUrl("");
    setNewLang("EN");
    setNewCountry("All");
  };

  const update = (id: string, patch: Partial<FaqDoc>) => {
    onChange(docs.map((d) => (d.id === id ? { ...d, ...patch, updatedAt: "Just now" } : d)));
  };

  const remove = (id: string) => onChange(docs.filter((d) => d.id !== id));

  const uploadFile = (id: string, file: File | null) => {
    if (!file) return;
    update(id, { fileName: file.name });
    // ✅ production: upload to backend/S3 and store docUrl
  };

  const visible = docs.slice().sort(sortDocs);

  return (
    <SectionCard
      title="FAQ Docs (Recommended)"
      subtitle="Instead of manually managing many FAQs, upload/link a document per language/country (like privacy docs)."
      className="bg-[#04130d]"
    >
      {/* Add new doc mapping */}
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">Language</label>
            <select
              value={newLang}
              onChange={(e) => setNewLang(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none"
            >
              {LANGUAGE_OPTIONS.filter((x) => x !== "All").map((l) => (
                <option key={l} value={l} className="bg-black">{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">Country</label>
            <select
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none"
            >
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c} value={c} className="bg-black">{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 grid gap-3">
          <TextField
            label="Title"
            placeholder="e.g. FAQ (EN) - Global"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <TextField
            label="Doc URL (optional)"
            placeholder="https://.../faq-en.html (or pdf)"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            hint="Best practice: host a single HTML doc per language/country. Backend can serve it."
          />
          <div className="flex justify-end">
            <Button variant="primary" onClick={add} disabled={!newTitle.trim()} className="rounded-lg">
              Add doc mapping
            </Button>
          </div>
        </div>
      </div>

      {/* Existing docs */}
      <div className="mt-5 space-y-3">
        {visible.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs text-slate-400">
            No FAQ docs configured.
          </div>
        ) : (
          visible.map((d) => (
            <div key={d.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="neutral">{d.language}</Badge>
                <Badge variant="neutral">{d.country === "All" ? "All countries" : d.country}</Badge>
                <span className="text-[10px] text-slate-500">Updated: {d.updatedAt}</span>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <TextField
                  label="Title"
                  value={d.title}
                  onChange={(e) => update(d.id, { title: e.target.value })}
                />

                <TextField
                  label="Doc URL"
                  value={d.docUrl ?? ""}
                  onChange={(e) => update(d.id, { docUrl: e.target.value })}
                  hint={d.fileName ? `Uploaded: ${d.fileName}` : "Upload a file or paste a link"}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.html,.htm,.txt"
                    onChange={(e) => uploadFile(d.id, e.target.files?.[0] ?? null)}
                  />
                  Upload doc
                </label>

                <Button
                  variant="secondary"
                  className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-xs text-rose-200 hover:bg-white/10"
                  onClick={() => remove(d.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
};

export default FaqDocsManager;
