import React from "react";

type Props = {
  label: string;
  value: string[];
  options: string[];
  onChange: (next: string[]) => void;
  helperText?: string;
};

const CountryMultiSelect: React.FC<Props> = ({ label, value, options, onChange, helperText }) => {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");

  const visible = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter((c) => c.toLowerCase().includes(s));
  }, [q, options]);

  const toggle = (country: string) => {
    const has = value.includes(country);
    onChange(has ? value.filter((x) => x !== country) : [...value, country]);
  };

  const clear = () => onChange([]);

  return (
    <div className="relative">
      <label className="text-xs font-medium text-slate-200 md:text-sm">{label}</label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-2 flex h-10 w-full items-center justify-between rounded-lg border border-white/15 bg-black/20 px-3 text-left text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
      >
        <span className="truncate">
          {value.length === 0 ? "None" : `${value.length} selected`}
        </span>
        <span className="text-slate-400">{open ? "▲" : "▼"}</span>
      </button>

      {helperText && <p className="mt-1 text-[11px] text-slate-400">{helperText}</p>}

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-[#071810] shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 p-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search country..."
              className="h-9 w-full rounded-lg border border-white/15 bg-black/30 px-3 text-xs text-slate-100 outline-none"
            />
            <button
              type="button"
              onClick={clear}
              className="h-9 shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-slate-200 hover:bg-white/10"
            >
              Clear
            </button>
          </div>

          <div className="max-h-56 overflow-auto p-2">
            {visible.length === 0 ? (
              <div className="p-3 text-xs text-slate-400">No countries found.</div>
            ) : (
              visible.map((c) => {
                const checked = value.includes(c);
                return (
                  <label
                    key={c}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs text-slate-200 hover:bg-white/5"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(c)}
                      className="h-4 w-4 rounded border border-white/20 bg-black/40"
                    />
                    <span className="truncate">{c}</span>
                  </label>
                );
              })
            )}
          </div>

          <div className="border-t border-white/10 p-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-9 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-slate-200 hover:bg-white/10"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryMultiSelect;
