// import React from "react";
// import PageShell from "../../shared/layout/PageShell";
// import PageHeader from "../../shared/layout/PageHeader";

// import DashboardStatsRow from "../../components/dashboard/DashboardStatsRow";
// import DashboardFiltersBar, { type Timeframe } from "../../components/dashboard/DashboardFiltersBar";
// import NewCustomersCard from "../../components/dashboard/NewCustomers";
// import AllCustomersCard from "../../components/dashboard/AllCustomersCard";
// import ActiveUsersCard from "../../components/dashboard/ActiveUserCard";
// import ContentPopularityCard, { type ContentListLimit } from "../../components/dashboard/ContentPopularityCard";
// import AcquisitionFunnelCard from "../../components/dashboard/AcquisitionFunnelCard";

// const COUNTRIES = ["US", "UK", "CA", "AU", "PK"];

// const DashboardPage: React.FC = () => {
//   // Global-ish filters for dashboard metrics
//   const [selectedCountries, setSelectedCountries] = React.useState<string[]>([]);
//   const [timeframe, setTimeframe] = React.useState<Timeframe>("weekly");
//   const [range, setRange] = React.useState<number>(4);

//   // Active users extra filters
//   const [activeUserType, setActiveUserType] =
//     React.useState<"all" | "registered" | "pro">("all");
//   const [activePlanType, setActivePlanType] =
//     React.useState<"all" | "monthly" | "6m" | "12m">("all");

//   // Content filters
//   const [contentType, setContentType] =
//     React.useState<"all" | "tactic" | "drill" | "match" | "live">("all");

//   // content popularity list length filter
//   const [contentListLimit, setContentListLimit] = React.useState<ContentListLimit>(20);

//   const countriesLabel = React.useMemo(() => {
//     return selectedCountries.length === 0 ? "All countries" : selectedCountries.join(", ");
//   }, [selectedCountries]);

//   return (
//     <PageShell>
//       <PageHeader
//         title="Dashboard Overview"
//         subtitle="Customer growth, subscriptions, engagement, and content performance."
//       />

//       {/* Global filters */}
//       <div className="mt-5">
//         <DashboardFiltersBar
//           title="Global Dashboard Filters"
//           countries={COUNTRIES}
//           selectedCountries={selectedCountries}
//           onChangeCountries={setSelectedCountries}
//           timeframe={timeframe}
//           onChangeTimeframe={setTimeframe}
//           range={range}
//           onChangeRange={setRange}
//         />
//       </div>

//       {/* Stats */}
//       <div className="mt-4">
//         <DashboardStatsRow />
//       </div>

//       {/* Cards grid (mobile 1 col, tablet 2 col where useful) */}
//       <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
//         <NewCustomersCard timeframe={timeframe} range={range} countriesLabel={countriesLabel} />
//         <AllCustomersCard timeframe={timeframe} range={range} countriesLabel={countriesLabel} />
//       </div>

//       {/* Active users */}
//       <div className="mt-6">
//         <ActiveUsersCard
//           timeframe={timeframe}
//           range={range}
//           countriesLabel={countriesLabel}
//           userType={activeUserType}
//           planType={activePlanType}
//           onChangeUserType={setActiveUserType}
//           onChangePlanType={setActivePlanType}
//         />
//       </div>

//       {/* Content popularity */}
//       <div className="mt-6">
//         <ContentPopularityCard
//           countriesLabel={countriesLabel}
//           contentType={contentType}
//           onChangeContentType={setContentType}
//           listLimit={contentListLimit}
//           onChangeListLimit={setContentListLimit}
//           locale="ENG"
//         />
//       </div>

//       {/* Funnel */}
//       <div className="mt-6">
//         <AcquisitionFunnelCard />
//       </div>
//     </PageShell>
//   );
// };

// export default DashboardPage;


import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";

import DashboardStatsRow from "../../components/dashboard/DashboardStatsRow";
import DashboardFiltersBar, {
  type Timeframe,
  type PeriodMode,
  type DateRange,
} from "../../components/dashboard/DashboardFiltersBar";

import NewCustomersCard from "../../components/dashboard/NewCustomers";
import AllCustomersCard from "../../components/dashboard/AllCustomersCard";
import ActiveUsersCard from "../../components/dashboard/ActiveUserCard";

import ContentPopularityCard, {
  type ContentListLimit,
  type PopularityMode,
  type ContentSource,
  type ContentCategory,
} from "../../components/dashboard/ContentPopularityCard";

import AcquisitionFunnelCard from "../../components/dashboard/AcquisitionFunnelCard";

const COUNTRIES = ["US", "UK", "CA", "AU", "PK"]; // later: load from API

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

const DashboardPage: React.FC = () => {
  // Global filters
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([]);
  const [periodMode, setPeriodMode] = React.useState<PeriodMode>("relative");
  const [timeframe, setTimeframe] = React.useState<Timeframe>("weekly");
  const [range, setRange] = React.useState<number>(4);

  const [dateRange, setDateRange] = React.useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 28);
    return { startDate: iso(start), endDate: iso(end) };
  });

  const countriesLabel = React.useMemo(() => {
    return selectedCountries.length === 0 ? "All countries" : selectedCountries.join(", ");
  }, [selectedCountries]);

  // Active Users compare
  const [primaryMetric, setPrimaryMetric] = React.useState<"dau" | "wau" | "mau">("dau");
  const [compareMetric, setCompareMetric] = React.useState<"none" | "dau" | "wau" | "mau">("none");

  // Content popularity filters (client requested)
  const [contentMode, setContentMode] = React.useState<PopularityMode>("top"); // ✅ top by default
  const [contentSource, setContentSource] = React.useState<ContentSource>("all");
  const [contentCategory, setContentCategory] = React.useState<ContentCategory>("all");
  const [contentWeeks, setContentWeeks] = React.useState<number>(4); // default 4 weeks to match screenshot
  const [contentSearch, setContentSearch] = React.useState<string>("");

  const [contentListLimit, setContentListLimit] = React.useState<ContentListLimit>(20); // ✅ Top 20 default

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
          periodMode={periodMode}
          onChangePeriodMode={setPeriodMode}
          timeframe={timeframe}
          onChangeTimeframe={setTimeframe}
          range={range}
          onChangeRange={setRange}
          dateRange={dateRange}
          onChangeDateRange={setDateRange}
        />
      </div>

      <div className="mt-4">
        <DashboardStatsRow />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <NewCustomersCard timeframe={timeframe} range={range} countriesLabel={countriesLabel} />
        <AllCustomersCard timeframe={timeframe} range={range} countriesLabel={countriesLabel} />
      </div>

      <div className="mt-6">
        <ActiveUsersCard
          timeframe={timeframe}
          range={range}
          countriesLabel={countriesLabel}
          primaryMetric={primaryMetric}
          compareMetric={compareMetric}
          onChangePrimaryMetric={setPrimaryMetric}
          onChangeCompareMetric={setCompareMetric}
        />
      </div>

      <div className="mt-6">
        <ContentPopularityCard
          countriesLabel={countriesLabel}
          mode={contentMode}
          onChangeMode={setContentMode}
          source={contentSource}
          onChangeSource={setContentSource}
          category={contentCategory}
          onChangeCategory={setContentCategory}
          weeks={contentWeeks}
          onChangeWeeks={setContentWeeks}
          search={contentSearch}
          onChangeSearch={setContentSearch}
          listLimit={contentListLimit}
          onChangeListLimit={setContentListLimit}
        />
      </div>

      <div className="mt-6">
        <AcquisitionFunnelCard />
      </div>
    </PageShell>
  );
};

export default DashboardPage;
