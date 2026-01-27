import * as React from "react";
import type { ContentReleaseSettings, ReleaseWindow, ReleaseWindowKind } from "../types";
import { COUNTRY_OPTIONS } from "../../../../../shared/constants/locale";

function uid(prefix = "win") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const ALL_COUNTRIES = COUNTRY_OPTIONS.filter((c) => c !== "All");

const seedWindows: ReleaseWindow[] = [
  { id: "m1", kind: "Month", label: "Month 1", active: true, itemsCount: 12 },
  { id: "m2", kind: "Month", label: "Month 2", active: false, itemsCount: 0 },
  { id: "w1", kind: "Week", label: "Week 1", active: true, itemsCount: 3 },
];

export function useContentReleaseSettings() {
  const [state, setState] = React.useState<ContentReleaseSettings>({
    trainLearnEnabled: true,
    releaseDay: "Sunday",
    releaseTimeLocal: "00:00",
    excludedCountries: [],
    windows: seedWindows,
  });

  const setTrainLearnEnabled = (v: boolean) =>
    setState((p) => ({ ...p, trainLearnEnabled: v }));

  const setReleaseDay = (day: ContentReleaseSettings["releaseDay"]) =>
    setState((p) => ({ ...p, releaseDay: day }));

  const setReleaseTimeLocal = (t: string) =>
    setState((p) => ({ ...p, releaseTimeLocal: t }));

  const setExcludedCountries = (countries: string[]) =>
    setState((p) => ({ ...p, excludedCountries: countries }));

  const addWindow = (kind: ReleaseWindowKind, label: string) => {
    const clean = label.trim();
    if (!clean) return;

    setState((p) => ({
      ...p,
      windows: [
        ...p.windows,
        {
          id: uid(),
          kind,
          label: clean,
          active: false,
          itemsCount: 0,
        },
      ],
    }));
  };

  const toggleWindow = (id: string) => {
    setState((p) => ({
      ...p,
      windows: p.windows.map((w) => (w.id === id ? { ...w, active: !w.active } : w)),
    }));
  };

  const removeWindow = (id: string) => {
    setState((p) => ({ ...p, windows: p.windows.filter((w) => w.id !== id) }));
  };

  const activateAllInactive = () => {
    setState((p) => ({
      ...p,
      windows: p.windows.map((w) => (w.active ? w : { ...w, active: true })),
    }));
  };

  // helper
  const countryOptions = ALL_COUNTRIES;

  const save = async () => {
    // ✅ production: call backend endpoint
    // await http.post("/admin/settings/content-release", state);
    console.log("SAVE ContentReleaseSettings:", state);
  };

  return {
    state,
    actions: {
      setTrainLearnEnabled,
      setReleaseDay,
      setReleaseTimeLocal,
      setExcludedCountries,
      addWindow,
      toggleWindow,
      removeWindow,
      activateAllInactive,
      save,
    },
    meta: { countryOptions },
  };
}
