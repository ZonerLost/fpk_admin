import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";

import DashboardStatsRow from "../../components/dashboard/DashboardStatsRow";
import DashboardFiltersBar, { type Timeframe } from "../../components/dashboard/DashboardFiltersBar";
import NewCustomersCard from "../../components/dashboard/NewCustomers";
import AllCustomersCard from "../../components/dashboard/AllCustomersCard";
import ActiveUsersCard from "../../components/dashboard/ActiveUserCard";
import ContentPopularityCard, { type ContentListLimit } from "../../components/dashboard/ContentPopularityCard";
import AcquisitionFunnelCard from "../../components/dashboard/AcquisitionFunnelCard";

const COUNTRIES = ["US", "UK", "CA", "AU", "PK"];

const DashboardPage: React.FC = () => {
  // Global-ish filters for dashboard metrics
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

  // content popularity list length filter
  const [contentListLimit, setContentListLimit] = React.useState<ContentListLimit>(20);

  const countriesLabel = React.useMemo(() => {
    return selectedCountries.length === 0 ? "All countries" : selectedCountries.join(", ");
  }, [selectedCountries]);

  return (
    <PageShell>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Customer growth, subscriptions, engagement, and content performance."
      />

      {/* Global filters */}
      <div className="mt-5">
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

      {/* Stats */}
      <div className="mt-4">
        <DashboardStatsRow />
      </div>

      {/* Cards grid (mobile 1 col, tablet 2 col where useful) */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <NewCustomersCard timeframe={timeframe} range={range} countriesLabel={countriesLabel} />
        <AllCustomersCard timeframe={timeframe} range={range} countriesLabel={countriesLabel} />
      </div>

      {/* Active users */}
      <div className="mt-6">
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
      <div className="mt-6">
        <ContentPopularityCard
          countriesLabel={countriesLabel}
          contentType={contentType}
          onChangeContentType={setContentType}
          listLimit={contentListLimit}
          onChangeListLimit={setContentListLimit}
          locale="ENG"
        />
      </div>

      {/* Funnel */}
      <div className="mt-6">
        <AcquisitionFunnelCard />
      </div>
    </PageShell>
  );
};

export default DashboardPage;
