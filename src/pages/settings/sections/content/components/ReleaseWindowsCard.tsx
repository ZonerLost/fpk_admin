import React from "react";
import SectionCard from "../../../../../shared/layout/SectionCard";
import TextField from "../../../../../shared/inputs/TextField";
import Button from "../../../../../shared/inputs/Button";
import type { ReleaseWindowKind, ReleaseWindow } from "../types";

type Props = {
  windows: ReleaseWindow[];
  onAdd: (kind: ReleaseWindowKind, label: string) => void;
  onToggleActive: (id: string) => void;
  onRemove: (id: string) => void;
  onActivateAllInactive: () => void;
  onUpload: (windowId: string) => void; // hook to open upload modal later
};

const ReleaseWindowsCard: React.FC<Props> = ({
  windows,
  onAdd,
  onToggleActive,
  onRemove,
  onActivateAllInactive,
  onUpload,
}) => {
  const [kind, setKind] = React.useState<ReleaseWindowKind>("Month");
  const [label, setLabel] = React.useState("");

  const add = () => {
    onAdd(kind, label);
    setLabel("");
  };

  return (
    <SectionCard
      title="Release Windows"
      subtitle="Add Months/Weeks where you can upload videos/docs and activate leftover slots."
      className="bg-[#04130d]"
    >
      <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
        <p className="text-xs text-amber-100 md:text-sm">
          This matches the client request: manage Month/Week slots here instead of listing all countries/timezones.
        </p>
      </div>

      {/* Add window */}
      <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:grid-cols-3">
        <div>
          <label className="text-xs font-medium text-slate-200 md:text-sm">Type</label>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as ReleaseWindowKind)}
            className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none"
          >
            <option value="Month" className="bg-black">Month</option>
            <option value="Week" className="bg-black">Week</option>
          </select>
        </div>

        <TextField
          label="Label"
          placeholder="e.g. Month 3, Week 10"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <div className="flex items-end">
          <Button variant="primary" onClick={add} disabled={!label.trim()} className="w-full rounded-lg">
            Add
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-400">
          Total windows: <span className="text-slate-100">{windows.length}</span>
        </div>
        <Button
          variant="secondary"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
          onClick={onActivateAllInactive}
        >
          Activate all inactive
        </Button>
      </div>

      {/* Windows list */}
      <div className="mt-4 space-y-2">
        {windows.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs text-slate-400">
            No windows yet. Add a Month or Week to start uploading content.
          </div>
        ) : (
          windows.map((w) => (
            <div
              key={w.id}
              className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-100">{w.label}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">
                    {w.kind}
                  </span>
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      w.active ? "bg-emerald-500/15 text-emerald-200" : "bg-white/5 text-slate-300",
                    ].join(" ")}
                  >
                    {w.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  Items uploaded: <span className="text-slate-100">{w.itemsCount ?? 0}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:justify-end">
                <Button
                  variant="secondary"
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                  onClick={() => onToggleActive(w.id)}
                >
                  {w.active ? "Deactivate" : "Activate"}
                </Button>

                <Button
                  variant="secondary"
                  className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100 hover:bg-emerald-500/15"
                  onClick={() => onUpload(w.id)}
                >
                  Upload
                </Button>

                <Button
                  variant="secondary"
                  className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-xs text-rose-200 hover:bg-white/10"
                  onClick={() => onRemove(w.id)}
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

export default ReleaseWindowsCard;
