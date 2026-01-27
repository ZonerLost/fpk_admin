import React from "react";
import SectionCard from "../../../../../shared/layout/SectionCard";
import Button from "../../../../../shared/inputs/Button";

import type { FaqItem } from "../types";
type Props = {
  faqs: FaqItem[];
  onChange: (next: FaqItem[]) => void;
};

const FaqManualEditor: React.FC<Props> = () => {
  return (
    <SectionCard
      title="FAQ (Manual)"
      subtitle="Use this only if you don’t want doc-based FAQs."
      className="bg-[#04130d]"
    >
      <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs text-slate-300">
        Move your existing manual FAQ CRUD UI into this component (same code you shared).
        Doc-based FAQs is recommended for long lists.
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="secondary" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
          (Manual editor lives here)
        </Button>
      </div>
    </SectionCard>
  );
};

export default FaqManualEditor;
