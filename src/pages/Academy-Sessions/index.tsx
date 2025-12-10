import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import TableToolbar from "../../shared/tables/TableToolbar";
import SearchBar from "../../shared/inputs/SearchBar";
import SectionCard from "../../shared/layout/SectionCard";
import Button from "../../shared/inputs/Button";

import UpcomingSessionsGrid from "../../components/Academy-Sessions/UpcomingSessionsGrid";
import AcademyRecordingsTable from "../../components/Academy-Sessions/AcademyRecordingsTable";
import PerformanceOverview from "../../components/Academy-Sessions/PerformanceOverview";
import ScheduleSessionSlideOver from "../../components/Academy-Sessions/ScheduleSessionSlideOver";
import RecordingDetailsSlideOver from "../../components/Academy-Sessions/RecordingDetailsSlideOver";
import SessionDetailsSlideOver from "../../components/Academy-Sessions/SessionDetailsSlideOver";
import CurrentWeekSurveyCard from "../../components/Academy-Sessions/CurrentWeekSurveyCard";
import FreeFormPostsCard from "../../components/Academy-Sessions/FreeFormPostsCard";
import AcademyFiltersBar, {
  type AcademyFiltersState,
} from "../../components/Academy-Sessions/AcademyFiltersBar";

import type {
  RecordingItem,
  SessionItem,
  WeeklySurvey,
  FreeFormPost,
} from "../../components/Academy-Sessions/types";

import { FiSearch } from "react-icons/fi";

/* ------------------------------ DEMO DATA ------------------------------ */

const initialSessions: SessionItem[] = [
  {
    id: "1",
    title: "Dribbling Masterclass",
    displayTitle: "How to improve your dribbling skills",
    releaseLabel: "Release Tue Oct 28, 4:00pm CET",
    host: "John Doe",
    date: "2024-10-28",
    time: "16:00",
    sessionType: "Live Training",
    week: 4,
    country: "Germany",
    language: "EN",
    thumbnailUrl: "https://picsum.photos/seed/dribbling-live/400/250",
    description: "High-intensity dribbling drills and ball control.",
  },
  {
    id: "1-de",
    title: "Dribbling Masterclass",
    displayTitle: "So verbesserst du dein Dribbling",
    releaseLabel: "Release Di 28. Okt, 16:00 CET",
    host: "John Doe",
    date: "2024-10-28",
    time: "16:00",
    sessionType: "Live Training",
    week: 4,
    country: "Germany",
    language: "DE",
    thumbnailUrl: "https://picsum.photos/seed/dribbling-live/400/250",
    description: "High-intensity dribbling drills and ball control.",
  },
  {
    id: "2",
    title: "Tactical Analysis",
    displayTitle: "Breaking down tactical patterns",
    releaseLabel: "Release Thu Oct 30, 6:00pm CET",
    host: "Jane Smith",
    date: "2024-10-30",
    time: "18:00",
    sessionType: "Webinar",
    week: 5,
    country: "USA",
    language: "EN",
    thumbnailUrl: "https://picsum.photos/seed/tactics-live/400/250",
    description: "Breakdown of modern attacking/defensive patterns.",
  },
];

const initialRecordings: RecordingItem[] = [
  {
    id: "r1-en",
    title: "Passing Technique",
    displayTitle: "How to improve your passing skills",
    releaseLabel: "Release Mon Oct 21, 6:00pm CET",
    host: "David Villa",
    date: "2024-10-02",
    duration: "45 mins",
    views: "1.2K",
    access: "All",
    week: 4,
    position: 1,
    country: "Germany",
    language: "EN",
    bucket: "currentWeek",
    tags: ["Technique"],
    description: "Core passing mechanics and real-game drills.",
  },
  {
    id: "r1-de",
    title: "Passing Technique",
    displayTitle: "So verbesserst du dein Passspiel",
    releaseLabel: "Release Mo 21. Okt, 18:00 CET",
    host: "David Villa",
    date: "2024-10-02",
    duration: "45 mins",
    views: "980",
    access: "All",
    week: 4,
    position: 1,
    country: "Germany",
    language: "DE",
    bucket: "currentWeek",
    tags: ["Technique"],
    description: "Core passing mechanics and real-game drills.",
  },
  {
    id: "r2",
    title: "Defensive Positioning",
    displayTitle: "Defensive Positioning",
    releaseLabel: "Release Week 3",
    host: "Carles Puyol",
    date: "2024-09-28",
    duration: "60 mins",
    views: "2.5K",
    access: "Pro",
    week: 3,
    position: 2,
    country: "USA",
    language: "EN",
    bucket: "past",
    tags: ["Tactic"],
  },
];

const currentWeekSurvey: WeeklySurvey = {
  id: "s1",
  week: 4,
  variants: [
    {
      id: "s1-de-en",
      country: "Germany",
      language: "EN",
      question: "Which drill helped you most this week?",
      responsesCount: 128,
    },
    {
      id: "s1-de-de",
      country: "Germany",
      language: "DE",
      question: "Welche Übung hat dir diese Woche am meisten geholfen?",
      responsesCount: 94,
    },
  ],
};

const freeFormPostsSeed: FreeFormPost[] = [
  {
    id: "p1",
    country: "Germany",
    language: "EN",
    title: "Coach’s Note",
    body: "This week focus on short-range passing under pressure.",
    updatedAt: "Updated today",
  },
  {
    id: "p1-de",
    country: "Germany",
    language: "DE",
    title: "Hinweis des Trainers",
    body: "Diese Woche liegt der Fokus auf kurzen Pässen unter Druck.",
    updatedAt: "Heute aktualisiert",
  },
];

/* ------------------------------ PAGE ------------------------------ */

const PAGE_SIZE = 10;

const AcedamySessionsPage: React.FC = () => {
  const [search, setSearch] = React.useState("");

  const [filters, setFilters] = React.useState<AcademyFiltersState>({
    country: "All",
    language: "All",
    bucket: "All",
  });

  const [sessions, setSessions] = React.useState<SessionItem[]>(initialSessions);
  const [recordings, setRecordings] =
    React.useState<RecordingItem[]>(initialRecordings);

  const [freeFormPosts] =
    React.useState<FreeFormPost[]>(freeFormPostsSeed);

  const [isScheduleOpen, setIsScheduleOpen] = React.useState(false);

  // Recording View
  const [selectedRecording, setSelectedRecording] =
    React.useState<RecordingItem | null>(null);
  const [isRecordingViewOpen, setIsRecordingViewOpen] =
    React.useState(false);

  // ✅ NEW: Session View
  const [selectedSession, setSelectedSession] =
    React.useState<SessionItem | null>(null);
  const [isSessionViewOpen, setIsSessionViewOpen] =
    React.useState(false);

  const handleFiltersChange = (partial: Partial<AcademyFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleCreateSession = (payload: Omit<SessionItem, "id">) => {
    const newSession: SessionItem = {
      id: Date.now().toString(),
      ...payload,
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const handleViewRecording = (row: RecordingItem) => {
    setSelectedRecording(row);
    setIsRecordingViewOpen(true);
  };

  const handleRemoveRecording = (id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
    setIsRecordingViewOpen(false);
  };

  // ✅ NEW
  const handleViewSession = (row: SessionItem) => {
    setSelectedSession(row);
    setIsSessionViewOpen(true);
  };

  const filteredSessions = React.useMemo(() => {
    const q = search.trim().toLowerCase();

    return sessions.filter((s) => {
      if (filters.country !== "All" && s.country !== filters.country)
        return false;
      if (filters.language !== "All" && s.language !== filters.language)
        return false;

      if (!q) return true;

      const haystack = [
        s.title,
        s.displayTitle,
        s.host,
        s.country,
        s.language,
        s.sessionType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [sessions, search, filters]);

  const filteredRecordings = React.useMemo(() => {
    const q = search.trim().toLowerCase();

    return recordings.filter((r) => {
      if (filters.country !== "All" && r.country !== filters.country)
        return false;
      if (filters.language !== "All" && r.language !== filters.language)
        return false;

      if (filters.bucket !== "All") {
        if (filters.bucket === "currentWeek" && r.bucket !== "currentWeek")
          return false;
        if (filters.bucket === "past" && r.bucket !== "past")
          return false;
      }

      if (!q) return true;

      const haystack = [
        r.title,
        r.displayTitle,
        r.host,
        r.country,
        r.language,
        ...(r.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [recordings, search, filters]);

  const paginatedRecordings = filteredRecordings.slice(0, PAGE_SIZE);

  return (
    <>
      <PageShell>
        <PageHeader
          title="Academy Sessions"
          subtitle="Manage live sessions, academy content, current-week surveys, and free-form posts by country and language."
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

        {/* Search + filters */}
        <SectionCard
          className="mt-4 bg-[#04130d]"
          contentClassName="space-y-4"
        >
          <TableToolbar
            search={
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search sessions, recordings, tags..."
                leftIcon={<FiSearch />}
                className="bg-[#071810]"
              />
            }
            filters={
              <AcademyFiltersBar
                filters={filters}
                onChange={handleFiltersChange}
              />
            }
          />
        </SectionCard>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {/* Left */}
          <div className="space-y-5 min-w-0 lg:col-span-2 xl:col-span-3">
            {/* ✅ UPDATED with onView */}
            <UpcomingSessionsGrid
              sessions={filteredSessions}
              onView={handleViewSession}
            />

            <AcademyRecordingsTable
              recordings={paginatedRecordings}
              onView={handleViewRecording}
              onRemove={handleRemoveRecording}
            />

            <CurrentWeekSurveyCard
              survey={currentWeekSurvey}
              activeCountry={filters.country}
              activeLanguage={filters.language}
            />

            <FreeFormPostsCard
              posts={freeFormPosts}
              activeCountry={filters.country}
              activeLanguage={filters.language}
            />
          </div>

          {/* Right */}
          <div className="space-y-5 min-w-0">
            <PerformanceOverview />
          </div>
        </div>
      </PageShell>

      {/* Schedule */}
      <ScheduleSessionSlideOver
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onCreate={(payload) => {
          handleCreateSession(payload);
          setIsScheduleOpen(false);
        }}
      />

      {/* Recording View */}
      <RecordingDetailsSlideOver
        isOpen={isRecordingViewOpen}
        recording={selectedRecording}
        onClose={() => setIsRecordingViewOpen(false)}
        onRemove={handleRemoveRecording}
      />

      {/* ✅ NEW: Session View */}
      <SessionDetailsSlideOver
        isOpen={isSessionViewOpen}
        session={selectedSession}
        onClose={() => setIsSessionViewOpen(false)}
      />
    </>
  );
};

export default AcedamySessionsPage;
