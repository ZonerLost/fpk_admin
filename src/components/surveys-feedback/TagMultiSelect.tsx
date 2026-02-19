import React from "react";
import { cn } from "../../shared/utils/cn";

type Props = {
  label?: string;
  options: string[];
  value: string[];
  placeholder?: string;
  onChange: (next: string[]) => void;
  className?: string;
};

const fieldClassName =
  "h-10 w-full rounded-lg border border-white/15 bg-black/30 px-2.5 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm";

const TagMultiSelect: React.FC<Props> = ({
  label,
  options,
  value,
  placeholder = "Select tags…",
  onChange,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((t) => t.toLowerCase().includes(q));
  }, [options, query]);

  const toggle = (tag: string) => {
    if (value.includes(tag)) onChange(value.filter((x) => x !== tag));
    else onChange([...value, tag]);
  };

  const summary =
    value.length === 0
      ? placeholder
      : value.length <= 2
      ? value.join(", ")
      : `${value.slice(0, 2).join(", ")} +${value.length - 2}`;

  return (
    <div ref={ref} className={cn("relative min-w-[180px] flex-1", className)}>
      {label ? (
        <label className="mb-1 block text-[11px] font-medium text-white/70 md:text-xs">
          {label}
        </label>
      ) : null}

      <button
        type="button"
        className={cn(fieldClassName, "text-left")}
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={cn(value.length ? "text-slate-100" : "text-slate-400")}>
          {summary}
        </span>
      </button>

      {open ? (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-[#06150f] shadow-xl">
          <div className="p-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-white/10 bg-black/30 px-2.5 text-xs text-slate-100 outline-none ring-emerald-500/30 focus:ring"
              placeholder="Search tags…"
            />
          </div>

          <div className="max-h-56 overflow-auto p-2 pt-0">
            {filtered.length === 0 ? (
              <p className="px-2 py-3 text-xs text-slate-400">No tags found.</p>
            ) : (
              <ul className="space-y-1">
                {filtered.map((tag) => {
                  const checked = value.includes(tag);
                  return (
                    <li key={tag}>
                      <button
                        type="button"
                        onClick={() => toggle(tag)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-xs transition-colors",
                          checked ? "bg-emerald-500/10 text-emerald-100" : "hover:bg-white/5 text-slate-200"
                        )}
                      >
                        <span className="truncate">{tag}</span>
                        <span className={cn("text-[11px]", checked ? "text-emerald-200" : "text-slate-500")}>
                          {checked ? "Selected" : "Select"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TagMultiSelect;
