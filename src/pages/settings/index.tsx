import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import SectionCard from "../../shared/layout/SectionCard";
import { cn } from "../../shared/utils/cn";

import FaqSettingsSection from "../../components/settings/FAQ/FaqSettingsSection";
import ContentReleaseSettingsSection from "../../components/settings/ContentReleaseSetting/ContentReleaseSettingsSection";
import PricingSettingsSection from "../../components/settings/Pricing-Settings/PricingSettingsSection";
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

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("Content & Release");

  if (currentAdminRole !== "super") {
    return (
      <PageShell>
        <PageHeader title="Settings" subtitle="Restricted area" />
        <SectionCard className="mt-4 bg-[#04130d]">
          <p className="text-xs text-slate-300 md:text-sm">
            Only <span className="font-semibold">Super Admin</span> can access Settings.
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

      <div className="mt-4 flex items-center gap-2 overflow-x-auto whitespace-nowrap rounded-full bg-[#04130d] p-2 text-xs md:text-sm scrollbar-thin md:overflow-visible">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full px-4 text-xs font-semibold transition md:h-11 md:px-5 md:text-sm",
              activeTab === tab
                ? "bg-emerald-500 text-black shadow-sm"
                : "bg-transparent text-slate-300 hover:bg-white/10"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-6 min-w-0">
        {activeTab === "Content & Release" && <ContentReleaseSettingsSection />}
        {activeTab === "Plans & Pricing" && <PricingSettingsSection />}
        {activeTab === "Legal" && <LocalizationSettingsSection />}
        {activeTab === "Notifications" && <NotificationsSettingsSection />}
        {activeTab === "Gamification" && <GamificationSettingsSection />}
        {activeTab === "Admin & Security" && <AdminRolesSettingsSection />}
        {activeTab === "Integrations" && <IntegrationsSettingsSection />}
        {activeTab === "FAQ" && <FaqSettingsSection />}
      </div>
    </PageShell>
  );
};

export default SettingsPage;

