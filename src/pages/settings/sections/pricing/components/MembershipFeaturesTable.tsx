import React from "react";
import SectionCard from "../../../../../shared/layout/SectionCard";
import TextField from "../../../../../shared/inputs/TextField";
import Button from "../../../../../shared/inputs/Button";
import type { MembershipFeatureRow } from "../types";

type Props = {
  features: MembershipFeatureRow[];
  onToggle: (id: MembershipFeatureRow["id"], key: "chatbotAccess") => void;
  onNumberChange: (
    id: MembershipFeatureRow["id"],
    key: "downloadableVideos" | "historicMonths",
    value: string
  ) => void;
  onSave: () => void;
};

const MembershipFeaturesTable: React.FC<Props> = ({ features, onToggle, onNumberChange, onSave }) => {
  return (
    <SectionCard
      title="Membership Length Features"
      subtitle="Controls historic content window and feature access."
      className="bg-[#04130d]"
    >
      <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
        <p className="text-xs text-amber-100 md:text-sm">
          Backend rule: “Earned content” access must persist even after cancelation/expiry/plan switch.
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-xs text-slate-100 md:text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Length</th>
              <th className="px-4 py-3">Historic content (months)</th>
              <th className="px-4 py-3">Chat bot access</th>
              <th className="px-4 py-3">Downloadable videos</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {features.map((f) => (
              <tr key={f.id} className="bg-black/20">
                <td className="px-4 py-3 font-medium">{f.label}</td>
                <td className="px-4 py-3">{f.months} months</td>
                <td className="px-4 py-3">
                  <TextField
                    label="Historic months"
                    hideLabel
                    type="number"
                    min={0}
                    value={String(f.historicMonths)}
                    onChange={(e) => onNumberChange(f.id, "historicMonths", e.target.value)}
                    hint="0 = none"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={f.chatbotAccess}
                    onChange={() => onToggle(f.id, "chatbotAccess")}
                    className="h-4 w-4 rounded border border-white/20 bg-black/40"
                  />
                </td>
                <td className="px-4 py-3">
                  <TextField
                    label="Download limit"
                    hideLabel
                    type="number"
                    min={0}
                    value={String(f.downloadableVideos)}
                    onChange={(e) => onNumberChange(f.id, "downloadableVideos", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </SectionCard>
  );
};

export default MembershipFeaturesTable;
