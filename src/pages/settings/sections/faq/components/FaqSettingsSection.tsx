import React from "react";
import Button from "../../../../../shared/inputs/Button";
import { useFaqSettings } from "../hooks/useFaqSettings";
import FaqDocsManager from "../components/FaqDocsManager";
import FaqManualEditor from "../components/FaqManualEditor";

const FaqSettingsSection: React.FC = () => {
  const { mode, setMode, docs, setDocs, faqs, setFaqs, saveAll } = useFaqSettings();

  return (
    <div className="space-y-6">
      {/* Mode switch */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
        <div>
          <div className="text-sm font-semibold text-slate-100">FAQ Mode</div>
          <div className="text-xs text-slate-400">
            Best practice: doc-based FAQs per language/country (like privacy docs).
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setMode("docs")}
            className={[
              "rounded-full border px-4 py-2 text-xs font-semibold",
              mode === "docs"
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
            ].join(" ")}
          >
            Docs
          </Button>

          <Button
            variant="secondary"
            onClick={() => setMode("manual")}
            className={[
              "rounded-full border px-4 py-2 text-xs font-semibold",
              mode === "manual"
                ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
                : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
            ].join(" ")}
          >
            Manual
          </Button>

          <Button variant="primary" onClick={saveAll} className="rounded-full px-4 py-2 text-xs font-semibold">
            Save Changes
          </Button>
        </div>
      </div>

      {mode === "docs" ? (
        <FaqDocsManager docs={docs} onChange={setDocs} />
      ) : (
        <FaqManualEditor faqs={faqs} onChange={setFaqs} />
      )}
    </div>
  );
};

export default FaqSettingsSection;
