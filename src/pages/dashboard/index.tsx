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

import {
  type CustomerSegment,
  effectiveSegments,
  parseSegmentsParam,
  serializeSegmentsParam,
} from "../../components/dashboard/customerSegments";
import { buildCustomerDashboardRequestUrl } from "../../components/dashboard/dashboardQuery";

const COUNTRIES = ["US", "UK", "CA", "AU", "PK"]; // later: load from API
const LANGUAGES = ["English", "Arabic", "Spanish", "French", "German", "Italian",  "Portuguese", "Russian", "Chinese"]; // later: load from API

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

const DashboardPage: React.FC = () => {
  // Global filters
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([]);
  const [periodMode, setPeriodMode] = React.useState<PeriodMode>("relative");
  const [timeframe, setTimeframe] = React.useState<Timeframe>("weekly");
  const [range, setRange] = React.useState<number>(4);

  const [dateRange, setDateRange] = React.useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 28);
    return { startDate: iso(start), endDate: iso(end) };
  });

  // [] means "All customer types", same behavior as countries.
  const [selectedSegments, setSelectedSegments] = React.useState<CustomerSegment[]>(
    () => parseSegmentsParam(new URLSearchParams(window.location.search).get("segments"))
  );

  const effectiveSelectedSegments = React.useMemo(
    () => effectiveSegments(selectedSegments),
    [selectedSegments]
  );

  // Keep URL in sync with selectedSegments without navigation.
  React.useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (selectedSegments.length === 0) sp.delete("segments");
    else sp.set("segments", serializeSegmentsParam(selectedSegments));

    const qs = sp.toString();
    const nextUrl = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash || ""}`;
    window.history.replaceState({}, "", nextUrl);
  }, [selectedSegments]);

  const countriesLabel = React.useMemo(() => {
    return selectedCountries.length === 0 ? "All countries" : selectedCountries.join(", ");
  }, [selectedCountries]);
  const languagesLabel = React.useMemo(() => {
    return selectedLanguages.length === 0 ? "All languages" : selectedLanguages.join(", ");
  }, [selectedLanguages]);

  const customerKpisRequestUrl = React.useMemo(
    () =>
      buildCustomerDashboardRequestUrl("/api/dashboard/customer-kpis", {
        periodMode,
        timeframe,
        range,
        dateRange,
        selectedCountries,
        selectedSegments,
        selectedLanguages,
      }),
    [
      periodMode,
      timeframe,
      range,
      dateRange,
      selectedCountries,
      selectedSegments,
      selectedLanguages,
    ]
  );
  const newCustomersRequestUrl = React.useMemo(
    () =>
      buildCustomerDashboardRequestUrl("/api/dashboard/new-customers", {
        periodMode,
        timeframe,
        range,
        dateRange,
        selectedCountries,
        selectedSegments,
        selectedLanguages,
      }),
    [
      periodMode,
      timeframe,
      range,
      dateRange,
      selectedCountries,
      selectedSegments,
      selectedLanguages,
    ]
  );
  const allCustomersRequestUrl = React.useMemo(
    () =>
      buildCustomerDashboardRequestUrl("/api/dashboard/all-customers", {
        periodMode,
        timeframe,
        range,
        dateRange,
        selectedCountries,
        selectedSegments,
        selectedLanguages,
      }),
    [
      periodMode,
      timeframe,
      range,
      dateRange,
      selectedCountries,
      selectedSegments,
      selectedLanguages,
    ]
  );

  // Active Users compare
  const [primaryMetric, setPrimaryMetric] = React.useState<"dau" | "wau" | "mau">("dau");
  const [compareMetric, setCompareMetric] = React.useState<"none" | "dau" | "wau" | "mau">("none");

  // Content popularity filters (client requested)
  const [contentMode, setContentMode] = React.useState<PopularityMode>("top");
  const [contentSource, setContentSource] = React.useState<ContentSource>("all");
  const [contentCategory, setContentCategory] = React.useState<ContentCategory>("all");
  const [contentWeeks, setContentWeeks] = React.useState<number>(4);
  const [contentSearch, setContentSearch] = React.useState<string>("");
  const [contentListLimit, setContentListLimit] = React.useState<ContentListLimit>(20);

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
          languages={LANGUAGES}
          selectedLanguages={selectedLanguages}
          onChangeLanguages={setSelectedLanguages}
          selectedSegments={selectedSegments}
          onChangeSegments={setSelectedSegments}
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

      {/*  KPI row now driven by segments */}
      <div className="mt-4">
        <DashboardStatsRow
          selectedSegments={effectiveSelectedSegments}
          requestUrl={customerKpisRequestUrl}
        />
      </div>

      {/*  Customer charts now driven by segments */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <NewCustomersCard
          timeframe={timeframe}
          range={range}
          countriesLabel={countriesLabel}
          languagesLabel={languagesLabel}
          selectedSegments={effectiveSelectedSegments}
          requestUrl={newCustomersRequestUrl}
        />
        <AllCustomersCard
          timeframe={timeframe}
          range={range}
          countriesLabel={countriesLabel}
          languagesLabel={languagesLabel}
          selectedSegments={effectiveSelectedSegments}
          requestUrl={allCustomersRequestUrl}
        />
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
