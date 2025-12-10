import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";

import DashboardStatsRow from "../../components/dashboard/DashboardStatsRow";
import DashboardFiltersBar, {
  type Timeframe,
} from "../../components/dashboard/DashboardFiltersBar";
import NewCustomersCard from "../../components/dashboard/NewCustomers";
import AllCustomersCard from "../../components/dashboard/AllCustomersCard";
import ActiveUsersCard from "../../components/dashboard/ActiveUserCard";
import ContentPopularityCard from "../../components/dashboard/ContentPopularityCard";
import AcquisitionFunnelCard from "../../components/dashboard/AcquisitionFunnelCard";

const COUNTRIES = ["US", "UK", "CA", "AU", "PK"];

const DashboardPage: React.FC = () => {
  // Global-ish filters for customer metrics
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([]);
  const [timeframe, setTimeframe] = React.useState<Timeframe>("weekly");
  const [range, setRange] = React.useState<number>(4);

  // Active users extra filters
  const [activeUserType, setActiveUserType] =
    React.useState<"all" | "registered" | "pro">("all");
  const [activePlanType, setActivePlanType] =
    React.useState<"all" | "monthly" | "6m" | "12m">("all");

  // Content filters
  const [contentType, setContentType] =
    React.useState<"all" | "tactic" | "drill" | "match" | "live">("all");

  const countriesLabel =
    selectedCountries.length === 0 ? "All countries" : selectedCountries.join(", ");

  return (
    <PageShell>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Customer growth, subscriptions, engagement, and content performance."
      />

      {/* Summary stats (Registered/Pro + plan splits) */}
      <DashboardStatsRow />

      {/* Filters bar used by the main analytics blocks */}
      <div className="mt-6">
        <DashboardFiltersBar
          title="Global Dashboard Filters"
          countries={COUNTRIES}
          selectedCountries={selectedCountries}
          onChangeCountries={setSelectedCountries}
          timeframe={timeframe}
          onChangeTimeframe={setTimeframe}
          range={range}
          onChangeRange={setRange}
        />
      </div>

      {/* New customers + All customers */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NewCustomersCard
          timeframe={timeframe}
          range={range}
          countriesLabel={countriesLabel}
        />
        <AllCustomersCard
          timeframe={timeframe}
          range={range}
          countriesLabel={countriesLabel}
        />
      </div>

      {/* Active users */}
      <div className="mt-6 grid grid-cols-1 gap-4">
        <ActiveUsersCard
          timeframe={timeframe}
          range={range}
          countriesLabel={countriesLabel}
          userType={activeUserType}
          planType={activePlanType}
          onChangeUserType={setActiveUserType}
          onChangePlanType={setActivePlanType}
        />
      </div>

      {/* Content popularity */}
      <div className="mt-6 grid grid-cols-1 gap-4">
        <ContentPopularityCard
          countriesLabel={countriesLabel}
          contentType={contentType}
          onChangeContentType={setContentType}
        />
      </div>

      {/* Acquisition tracking / funnel preview */}
      <div className="mt-6">
        <AcquisitionFunnelCard />
      </div>
    </PageShell>
  );
};

export default DashboardPage;
