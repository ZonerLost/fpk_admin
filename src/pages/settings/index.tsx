/* eslint-disable react-hooks/refs */
import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import SectionCard from "../../shared/layout/SectionCard";
import { cn } from "../../shared/utils/cn";

import FaqSettingsSection from "../settings/sections/faq/components/FaqSettingsSection";
import ContentReleaseSettingsSection from "../settings/sections/content/components/ContentReleaseSettingsSection";
import PricingSettingsSection from "../settings/sections/pricing/PricingSettingsSection";
import LocalizationSettingsSection from "../../components/settings/LocalizationSettingsSection";
import NotificationsSettingsSection from "../../components/settings/NotificationsSettingsSection";
import GamificationSettingsSection from "../../components/settings/GamificationSettingsSection";
import AdminRolesSettingsSection from "../../components/settings/AdminRole/AdminRolesSettingsSection";
import IntegrationsSettingsSection from "../../components/settings/IntegrationsSettingsSection";

const SETTINGS_TABS = [
  "Content & Release",
  "Plans & Pricing",
  "Legal",
  "Notifications",
  "Gamification",
  "Admin & Security",
  "Integrations",
  "FAQ",
] as const;

type SettingsTab = (typeof SETTINGS_TABS)[number];

// demo-only guard
type AdminRoleId = "super" | "content-manager" | "support";
const currentAdminRole: AdminRoleId = "super";

/** query-string key */
const TAB_QS_KEY = "tab";

function normalizeTab(input: string | null): SettingsTab | null {
  if (!input) return null;
  // support both "FAQ" and "Faq" etc.
  const found = SETTINGS_TABS.find(
    (t) => t.toLowerCase() === input.toLowerCase(),
  );
  return found ?? null;
}

function setTabQuery(tab: SettingsTab) {
  const url = new URL(window.location.href);
  url.searchParams.set(TAB_QS_KEY, tab);
  window.history.replaceState({}, "", url.toString());
}

function getTabQuery(): SettingsTab | null {
  const url = new URL(window.location.href);
  return normalizeTab(url.searchParams.get(TAB_QS_KEY));
}

const KEEP_MOUNTED = false;

const TabButton = React.memo(function TabButton({
  tab,
  active,
  onClick,
  buttonRef,
}: {
  tab: SettingsTab;
  active: boolean;
  onClick: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}) {
  return (
    <button
      ref={buttonRef}
      key={tab}
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full px-4 text-xs font-semibold transition md:h-11 md:px-5 md:text-sm",
        active
          ? "bg-emerald-500 text-black shadow-sm"
          : "bg-transparent text-slate-300 hover:bg-white/10",
      )}
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
    >
      {tab}
    </button>
  );
});

const SettingsPage: React.FC = () => {
  const initial = React.useMemo(() => getTabQuery() ?? "Content & Release", []);
  const [activeTab, setActiveTab] = React.useState<SettingsTab>(initial);

  const tabsWrapRef = React.useRef<HTMLDivElement | null>(null);
  const tabBtnRefs = React.useRef<
    Record<SettingsTab, HTMLButtonElement | null>
  >({
    "Content & Release": null,
    "Plans & Pricing": null,
    Legal: null,
    Notifications: null,
    Gamification: null,
    "Admin & Security": null,
    Integrations: null,
    FAQ: null,
  });

  // keep URL in sync
  React.useEffect(() => {
    setTabQuery(activeTab);
  }, [activeTab]);

  // scroll active tab into view (smooth)
  React.useEffect(() => {
    const btn = tabBtnRefs.current[activeTab];
    btn?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeTab]);

  // handle back/forward browser nav (if user changes query)
  React.useEffect(() => {
    const handler = () => {
      const t = getTabQuery();
      if (t) setActiveTab(t);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const onKeyDownTabs = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = SETTINGS_TABS.indexOf(activeTab);
    if (idx < 0) return;

    const go = (nextIdx: number) => {
      const bounded = Math.max(0, Math.min(SETTINGS_TABS.length - 1, nextIdx));
      setActiveTab(SETTINGS_TABS[bounded]);
    };

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        go(idx + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        go(idx - 1);
        break;
      case "Home":
        e.preventDefault();
        go(0);
        break;
      case "End":
        e.preventDefault();
        go(SETTINGS_TABS.length - 1);
        break;
      default:
        break;
    }
  };

  if (currentAdminRole !== "super") {
    return (
      <PageShell>
        <PageHeader title="Settings" subtitle="Restricted area" />
        <SectionCard className="mt-4 bg-[#04130d]">
          <p className="text-xs text-slate-300 md:text-sm">
            Only <span className="font-semibold">Super Admin</span> can access
            Settings.
          </p>
        </SectionCard>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Settings"
        subtitle="Configure release defaults, pricing by country, legal docs, gamification, notifications, and admin security."
      />

      {/* Sticky tabs bar like the screenshots */}
      <div className="sticky top-0 z-20 -mx-2 mt-4 px-2 pt-2">
        <div
          ref={tabsWrapRef}
          className={cn(
            "flex items-center gap-2 overflow-x-auto whitespace-nowrap rounded-full bg-[#04130d] p-2 text-xs md:text-sm",
            "scrollbar-thin md:overflow-visible",
          )}
          role="tablist"
          aria-label="Settings Tabs"
          onKeyDown={onKeyDownTabs}
        >
          {SETTINGS_TABS.map((tab) => (
            <TabButton
              key={tab}
              tab={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              buttonRef={
                {
                  current: tabBtnRefs.current[tab],
                } as React.RefObject<HTMLButtonElement>
              }
            />
          ))}
        </div>
      </div>

      {/* Panels */}
      <div className="mt-6 min-w-0 space-y-6">
        {/* If KEEP_MOUNTED = false, only active tab renders (better perf).
            If true, all render but hidden (preserves state across tabs). */}

        {(KEEP_MOUNTED || activeTab === "Content & Release") && (
          <div
            className={cn(
              !KEEP_MOUNTED && "block",
              KEEP_MOUNTED && activeTab !== "Content & Release" && "hidden",
            )}
          >
            <ContentReleaseSettingsSection />
          </div>
        )}

        {(KEEP_MOUNTED || activeTab === "Plans & Pricing") && (
          <div
            className={cn(
              !KEEP_MOUNTED && "block",
              KEEP_MOUNTED && activeTab !== "Plans & Pricing" && "hidden",
            )}
          >
            <PricingSettingsSection />
          </div>
        )}

        {(KEEP_MOUNTED || activeTab === "Legal") && (
          <div
            className={cn(
              !KEEP_MOUNTED && "block",
              KEEP_MOUNTED && activeTab !== "Legal" && "hidden",
            )}
          >
            <LocalizationSettingsSection />
          </div>
        )}

        {(KEEP_MOUNTED || activeTab === "Notifications") && (
          <div
            className={cn(
              !KEEP_MOUNTED && "block",
              KEEP_MOUNTED && activeTab !== "Notifications" && "hidden",
            )}
          >
            <NotificationsSettingsSection />
          </div>
        )}

        {(KEEP_MOUNTED || activeTab === "Gamification") && (
          <div
            className={cn(
              !KEEP_MOUNTED && "block",
              KEEP_MOUNTED && activeTab !== "Gamification" && "hidden",
            )}
          >
            <GamificationSettingsSection />
          </div>
        )}

        {(KEEP_MOUNTED || activeTab === "Admin & Security") && (
          <div
            className={cn(
              !KEEP_MOUNTED && "block",
              KEEP_MOUNTED && activeTab !== "Admin & Security" && "hidden",
            )}
          >
            <AdminRolesSettingsSection />
          </div>
        )}

        {(KEEP_MOUNTED || activeTab === "Integrations") && (
          <div
            className={cn(
              !KEEP_MOUNTED && "block",
              KEEP_MOUNTED && activeTab !== "Integrations" && "hidden",
            )}
          >
            <IntegrationsSettingsSection />
          </div>
        )}

        {(KEEP_MOUNTED || activeTab === "FAQ") && (
          <div
            className={cn(
              !KEEP_MOUNTED && "block",
              KEEP_MOUNTED && activeTab !== "FAQ" && "hidden",
            )}
          >
            <FaqSettingsSection />
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default SettingsPage;
