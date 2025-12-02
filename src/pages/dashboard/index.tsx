import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import DashboardStatsRow from "../../components/dashboard/DashboardStatsRow";
import UserGrowthCard from "../../components/dashboard/UserGrowthCard";
import WeeklyEngagementCard from "../../components/dashboard/WeeklyEngagementCard";
import ActivityFeedCard from "../../components/dashboard/ActivityFeedCard";
import ContentConsumptionCard from "../../components/dashboard/ContentConsumptionCard";

const DashboardPage: React.FC = () => {
  return (
    <PageShell>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Monitor users, content performance, and engagement at a glance."
      />

      {/* Top stats row */}
      <DashboardStatsRow />

      {/* Charts row */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <UserGrowthCard className="lg:col-span-2" />
        <WeeklyEngagementCard />
      </div>

      {/* Activity + donut */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ActivityFeedCard className="lg:col-span-2" />
        <ContentConsumptionCard />
      </div>
    </PageShell>
  );
};

export default DashboardPage;
