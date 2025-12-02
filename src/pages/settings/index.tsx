import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import { cn } from "../../shared/utils/cn";

import GeneralSettingsSection from "../../components/settings/GeneralSettingsSection";
import ContentReleaseSettingsSection from "../../components/settings/ContentReleaseSettingsSection";
import PricingSettingsSection from "../../components/settings/PricingSettingsSection";
import LocalizationSettingsSection from "../../components/settings/LocalizationSettingsSection";
import NotificationsSettingsSection from "../../components/settings/NotificationsSettingsSection";
import GamificationSettingsSection from "../../components/settings/GamificationSettingsSection";
import AdminRolesSettingsSection from "../../components/settings/AdminRolesSettingsSection";
import IntegrationsSettingsSection from "../../components/settings/IntegrationsSettingsSection";

const SETTINGS_TABS = [
  "General",
  "Content & Release",
  "Plans & Pricing",
  "Localization & Legal",
  "Notifications",
  "Gamification",
  "Admin & Security",
  "Integrations",
] as const;

type SettingsTab = (typeof SETTINGS_TABS)[number];

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("General");

  return (
    <PageShell>
      <PageHeader
        title="Settings"
        subtitle="Configure Admin console, content rules, localization, and security."
      />

      {/* Tabs */}
      <div className="mt-4 flex flex-wrap gap-2 rounded-2xl bg-[#04130d] p-2 text-xs md:text-sm">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-full px-3 py-1.5 font-medium transition",
              activeTab === tab
                ? "bg-emerald-500 text-black shadow-sm"
                : "bg-transparent text-slate-300 hover:bg-white/10"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active section */}
      <div className="mt-6 space-y-6">
        {activeTab === "General" && <GeneralSettingsSection />}
        {activeTab === "Content & Release" && (
          <ContentReleaseSettingsSection />
        )}
        {activeTab === "Plans & Pricing" && <PricingSettingsSection />}
        {activeTab === "Localization & Legal" && (
          <LocalizationSettingsSection />
        )}
        {activeTab === "Notifications" && <NotificationsSettingsSection />}
        {activeTab === "Gamification" && <GamificationSettingsSection />}
        {activeTab === "Admin & Security" && (
          <AdminRolesSettingsSection />
        )}
        {activeTab === "Integrations" && <IntegrationsSettingsSection />}
      </div>
    </PageShell>
  );
};

export default SettingsPage;
