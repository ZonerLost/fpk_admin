import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import { cn } from "../../shared/utils/cn";

type CountryItem = {
  code: string; // ISO (e.g. "GB")
  name: string;
  currency: string; // e.g. "GBP"
  enabled: boolean;
  isDefault?: boolean;
};

type LanguageItem = {
  code: string; // e.g. "en"
  label: string; // e.g. "English"
  enabled: boolean;
  isDefault?: boolean;
};

const STORAGE_KEY = "settings:countries-languages:v1";

// sensible defaults (edit as per your product)
const DEFAULT_COUNTRIES: CountryItem[] = [
  { code: "GB", name: "United Kingdom", currency: "GBP", enabled: true, isDefault: true },
  { code: "US", name: "United States", currency: "USD", enabled: true },
  { code: "AE", name: "United Arab Emirates", currency: "AED", enabled: true },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", enabled: false },
  { code: "PK", name: "Pakistan", currency: "PKR", enabled: false },
];

const DEFAULT_LANGUAGES: LanguageItem[] = [
  { code: "en", label: "English", enabled: true, isDefault: true },
  { code: "ar", label: "Arabic", enabled: true },
  { code: "ur", label: "Urdu", enabled: false },
];

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function ensureSingleDefault<T extends { enabled: boolean; isDefault?: boolean }>(
  items: T[],
  fallbackIndex = 0,
): T[] {
  if (items.length === 0) return items;

  const enabled = items.filter((x) => x.enabled);
  if (enabled.length === 0) {
    const safeIndex = Math.max(0, Math.min(items.length - 1, fallbackIndex));
    return items.map((x, i) => ({
      ...x,
      enabled: i === safeIndex,
      isDefault: i === safeIndex,
    }));
  }

  const hasDefaultEnabled = enabled.some((x) => x.isDefault);
  if (hasDefaultEnabled) {
    // ensure only one default
    let found = false;
    return items.map((x) => {
      if (!x.enabled) return { ...x, isDefault: false };
      if (x.isDefault && !found) {
        found = true;
        return { ...x, isDefault: true };
      }
      return { ...x, isDefault: false };
    });
  }

  // no enabled default -> assign fallback among enabled
  const fallback = enabled[Math.min(fallbackIndex, enabled.length - 1)];
  return items.map((x) => ({
    ...x,
    isDefault: x.enabled && x === fallback,
  }));
}

function useCountriesLanguagesSettings() {
  const [countries, setCountries] = React.useState<CountryItem[]>(DEFAULT_COUNTRIES);
  const [languages, setLanguages] = React.useState<LanguageItem[]>(DEFAULT_LANGUAGES);
  const [dirty, setDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  // load once
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const parsed = safeParse<{ countries: CountryItem[]; languages: LanguageItem[] }>(
      window.localStorage.getItem(STORAGE_KEY),
    );
    if (!parsed) return;

    const nextCountries = ensureSingleDefault(parsed.countries ?? DEFAULT_COUNTRIES);
    const nextLanguages = ensureSingleDefault(parsed.languages ?? DEFAULT_LANGUAGES);

    setCountries(nextCountries);
    setLanguages(nextLanguages);
  }, []);

  const updateCountries = (updater: (prev: CountryItem[]) => CountryItem[]) => {
    setCountries((prev) => {
      const next = ensureSingleDefault(updater(prev));
      return next;
    });
    setDirty(true);
  };

  const updateLanguages = (updater: (prev: LanguageItem[]) => LanguageItem[]) => {
    setLanguages((prev) => {
      const next = ensureSingleDefault(updater(prev));
      return next;
    });
    setDirty(true);
  };

  const setCountryEnabled = (code: string, enabled: boolean) => {
    updateCountries((prev) =>
      prev.map((c) => (c.code === code ? { ...c, enabled } : c)),
    );
  };

  const setDefaultCountry = (code: string) => {
    updateCountries((prev) =>
      prev.map((c) =>
        c.code === code
          ? { ...c, enabled: true, isDefault: true }
          : { ...c, isDefault: false },
      ),
    );
  };

  const setLanguageEnabled = (code: string, enabled: boolean) => {
    updateLanguages((prev) =>
      prev.map((l) => (l.code === code ? { ...l, enabled } : l)),
    );
  };

  const setDefaultLanguage = (code: string) => {
    updateLanguages((prev) =>
      prev.map((l) =>
        l.code === code
          ? { ...l, enabled: true, isDefault: true }
          : { ...l, isDefault: false },
      ),
    );
  };

  const save = async () => {
    if (typeof window === "undefined") return;
    setSaving(true);
    try {
      // Later: replace this with real API call:
      // await api.put("/settings/localization", { countries, languages })
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ countries, languages }));
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setCountries(ensureSingleDefault(DEFAULT_COUNTRIES));
    setLanguages(ensureSingleDefault(DEFAULT_LANGUAGES));
    setDirty(true);
  };

  return {
    countries,
    languages,
    dirty,
    saving,
    setCountryEnabled,
    setDefaultCountry,
    setLanguageEnabled,
    setDefaultLanguage,
    save,
    reset,
  };
}

function PillButton({
  children,
  onClick,
  disabled,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold transition",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary"
          ? "bg-emerald-500 text-black hover:brightness-110"
          : "bg-white/5 text-slate-200 hover:bg-white/10",
      )}
    >
      {children}
    </button>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "h-10 w-full rounded-xl bg-black/20 px-3 text-sm text-slate-100 outline-none ring-1 ring-white/10",
        "placeholder:text-slate-400 focus:ring-emerald-500/40",
      )}
    />
  );
}
function Toggle({
  checked,
  onChange,
  disabled,
  label,
  className,
  invert = false, // optional: if you ever want ON position to be the opposite
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  invert?: boolean;
}) {
  // Standard: OFF left, ON right
  // If invert=true: OFF right, ON left
  const knobTranslate = invert
    ? checked
      ? "translate-x-0"
      : "translate-x-[22px]"
    : checked
      ? "translate-x-[22px]"
      : "translate-x-0";

  return (
    <label
      className={cn(
        "inline-flex items-center",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className,
      )}
    >
      <span className="sr-only">{label ?? "Toggle"}</span>

      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="peer sr-only"
      />

      {/* Track */}
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200",
          "bg-white/10 ring-1 ring-white/10",
          "peer-checked:bg-emerald-500",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/40",
          "peer-disabled:opacity-60",
        )}
      >
        {/* Knob */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-[2px] top-[2px] h-6 w-6 rounded-full bg-white",
            "shadow-sm transition-transform duration-200 ease-out",
            // subtle outline like your screenshot
            "ring-1 ring-black/20",
            checked && "ring-2 ring-emerald-200/70",
            knobTranslate,
          )}
        />
      </span>
    </label>
  );
}

function DefaultRadio({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label?: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <span className="sr-only">{label ?? "Set default"}</span>
      <input type="radio" checked={checked} onChange={onChange} className="h-4 w-4 accent-emerald-500" />
    </label>
  );
}

const CountriesLanguagesSettingsSection: React.FC = () => {
  const {
    countries,
    languages,
    dirty,
    saving,
    setCountryEnabled,
    setDefaultCountry,
    setLanguageEnabled,
    setDefaultLanguage,
    save,
    reset,
  } = useCountriesLanguagesSettings();

  const [countryQ, setCountryQ] = React.useState("");
  const [languageQ, setLanguageQ] = React.useState("");

  const filteredCountries = React.useMemo(() => {
    const q = countryQ.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => `${c.name} ${c.code} ${c.currency}`.toLowerCase().includes(q));
  }, [countries, countryQ]);

  const filteredLanguages = React.useMemo(() => {
    const q = languageQ.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter((l) => `${l.label} ${l.code}`.toLowerCase().includes(q));
  }, [languages, languageQ]);

  const enabledCountryCount = React.useMemo(() => countries.filter((c) => c.enabled).length, [countries]);
  const enabledLanguageCount = React.useMemo(() => languages.filter((l) => l.enabled).length, [languages]);

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <SectionCard className="bg-[#04130d]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Countries & Languages</h3>
            <p className="mt-1 text-sm text-slate-300">
              Enable/disable supported regions and languages, and set defaults used across the app.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PillButton variant="ghost" onClick={reset} disabled={saving}>
              Reset
            </PillButton>
            <PillButton onClick={save} disabled={saving || !dirty}>
              {saving ? "Saving..." : dirty ? "Save Changes" : "Saved"}
            </PillButton>
          </div>
        </div>
      </SectionCard>

      {/* Countries */}
      <SectionCard className="bg-[#04130d]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">Countries</h4>
            <p className="mt-1 text-sm text-slate-300">
              Control which countries appear in signup, billing, pricing, and checkout.
            </p>
          </div>
          <div className="w-full md:w-[360px]">
            <SearchInput value={countryQ} onChange={setCountryQ} placeholder="Search countries (name, code, currency)..." />
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/10">
          <div className="grid grid-cols-12 bg-black/20 px-4 py-3 text-xs font-semibold text-slate-300">
            <div className="col-span-5">Country</div>
            <div className="col-span-3">Currency</div>
            <div className="col-span-2">Default</div>
            <div className="col-span-2 text-right">Enabled</div>
          </div>

          <div className="divide-y divide-white/10">
            {filteredCountries.map((c) => (
              <div key={c.code} className="grid grid-cols-12 items-center px-4 py-3">
                <div className="col-span-5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-white/5 px-2 py-1 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
                      {c.code}
                    </span>
                    <span className="truncate text-sm font-medium text-white">{c.name}</span>
                  </div>
                </div>

                <div className="col-span-3 text-sm text-slate-200">{c.currency}</div>

                <div className="col-span-2">
                  <DefaultRadio
                    checked={!!c.isDefault}
                    onChange={() => setDefaultCountry(c.code)}
                    label={`Set ${c.name} as default`}
                  />
                </div>

                <div className="col-span-2 flex justify-end">
                  <Toggle
                    checked={c.enabled}
                    onChange={(nextEnabled) => setCountryEnabled(c.code, nextEnabled)}
                    disabled={saving || (c.enabled && enabledCountryCount === 1)}
                    label={`Enable ${c.name}`}
                  />
                </div>
              </div>
            ))}

            {filteredCountries.length === 0 && (
              <div className="px-4 py-6 text-sm text-slate-300">No countries found.</div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Languages */}
      <SectionCard className="bg-[#04130d]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">Languages</h4>
            <p className="mt-1 text-sm text-slate-300">
              Control language options shown in the UI and set the default language.
            </p>
          </div>
          <div className="w-full md:w-[360px]">
            <SearchInput value={languageQ} onChange={setLanguageQ} placeholder="Search languages (label, code)..." />
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/10">
          <div className="grid grid-cols-12 bg-black/20 px-4 py-3 text-xs font-semibold text-slate-300">
            <div className="col-span-6">Language</div>
            <div className="col-span-2">Code</div>
            <div className="col-span-2">Default</div>
            <div className="col-span-2 text-right">Enabled</div>
          </div>

          <div className="divide-y divide-white/10">
            {filteredLanguages.map((l) => (
              <div key={l.code} className="grid grid-cols-12 items-center px-4 py-3">
                <div className="col-span-6 min-w-0">
                  <span className="truncate text-sm font-medium text-white">{l.label}</span>
                </div>

                <div className="col-span-2">
                  <span className="rounded-lg bg-white/5 px-2 py-1 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
                    {l.code}
                  </span>
                </div>

                <div className="col-span-2">
                  <DefaultRadio
                    checked={!!l.isDefault}
                    onChange={() => setDefaultLanguage(l.code)}
                    label={`Set ${l.label} as default`}
                  />
                </div>

                <div className="col-span-2 flex justify-end">
                  <Toggle
                    checked={l.enabled}
                    onChange={(nextEnabled) => setLanguageEnabled(l.code, nextEnabled)}
                    disabled={saving || (l.enabled && enabledLanguageCount === 1)}
                    label={`Enable ${l.label}`}
                  />
                </div>
              </div>
            ))}

            {filteredLanguages.length === 0 && (
              <div className="px-4 py-6 text-sm text-slate-300">No languages found.</div>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default CountriesLanguagesSettingsSection;
