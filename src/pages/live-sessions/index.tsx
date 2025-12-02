import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import Button from "../../shared/inputs/Button";
import UpcomingSessionsGrid from "../../components/live-sessions/UpcomingSessionsGrid";
import AcademyRecordingsTable from "../../components/live-sessions/AcademyRecordingsTable";
import PerformanceOverview from "../../components/live-sessions/PerformanceOverview";
// import MonthlyCalendarCard from "../../components/live-sessions/MonthlyCalendarCard";
import ScheduleSessionSlideOver from "../../components/live-sessions/ScheduleSessionSlideOver";
import type { RecordingItem, SessionItem } from "../../components/live-sessions/types";

const initialSessions: SessionItem[] = [
  {
    id: "1",
    title: "Dribbling Masterclass",
    host: "John Doe",
    date: "2024-10-28",
    time: "16:00",
    thumbnailUrl: "https://picsum.photos/seed/dribbling-live/400/250",
    description: "High-intensity dribbling drills and ball control.",
  },
  {
    id: "2",
    title: "Tactical Analysis",
    host: "Jane Smith",
    date: "2024-10-30",
    time: "18:00",
    thumbnailUrl: "https://picsum.photos/seed/tactics-live/400/250",
    description: "Breakdown of modern attacking/defensive patterns.",
  },
];


const initialRecordings: RecordingItem[] = [
  {
    id: "r1",
    title: "Shooting Technique 101",
    host: "David Villa",
    date: "2024-10-02",
    duration: "45 mins",
    views: "1.2K",
    access: "All",
  },
  {
    id: "r2",
    title: "Defensive Positioning",
    host: "Carles Puyol",
    date: "2024-09-28",
    duration: "60 mins",
    views: "2.5K",
    access: "Pro",
  },
  {
    id: "r3",
    title: "Goalkeeping Basics",
    host: "Iker Casillas",
    date: "2024-09-15",
    duration: "30 mins",
    views: "890",
    access: "Basic",
  },
];

const LiveSessionsPage: React.FC = () => {
  const [sessions, setSessions] = React.useState<SessionItem[]>(initialSessions);
  const [recordings] = React.useState<RecordingItem[]>(initialRecordings);
  const [isScheduleOpen, setIsScheduleOpen] = React.useState(false);

  const handleCreateSession = (payload: Omit<SessionItem, "id">) => {
    const newSession: SessionItem = {
      id: Date.now().toString(),
      ...payload,
    };
    setSessions((prev) => [newSession, ...prev]);
  };


  return (
    <>
      <PageShell>
        <PageHeader
          title="Live Sessions & Academy"
          subtitle="Manage live training sessions and academy video content."
          actions={
            <Button
              variant="primary"
              className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
              onClick={() => setIsScheduleOpen(true)}
            >
              + Schedule New Session
            </Button>
          }
        />

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Left column: upcoming + recordings */}
          <div className="space-y-5 lg:col-span-2">
            <UpcomingSessionsGrid sessions={sessions} />
            <AcademyRecordingsTable recordings={recordings} />
          </div>

          {/* Right column: calendar + performance overview */}
          <div className="space-y-5">
            {/* <MonthlyCalendarCard
              month={9}  // October (0-based)
              year={2024}
              sessionDates={sessionDates}
            /> */}
            <PerformanceOverview />
          </div>
        </div>
      </PageShell>

      <ScheduleSessionSlideOver
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onCreate={(payload: Omit<SessionItem, "id">) => {
          handleCreateSession(payload);
          setIsScheduleOpen(false);
        }}
      />
    </>
  );
};

export default LiveSessionsPage;
