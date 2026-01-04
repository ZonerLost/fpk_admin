import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import TableToolbar from "../../shared/tables/TableToolbar";
import SearchBar from "../../shared/inputs/SearchBar";
import SectionCard from "../../shared/layout/SectionCard";
import Button from "../../shared/inputs/Button";
import { FiSearch } from "react-icons/fi";

import AcademyFiltersBar, {
  type AcademyFiltersState,
} from "../../components/Academy-Sessions/filter-Academy/AcademyFiltersBar";

import AcademyContentTable from "../../components/Academy-Sessions/AcademyContentTable";
import ContentDetailsSlideOver from "../../components/Academy-Sessions/ContentDetailsSlideOver";
import ScheduleContentSlideOver from "../../components/Academy-Sessions/ScheduleContent/ScheduleContentSlideOver";
import SurveyManagerCard from "../../components/Academy-Sessions/surveyManage/SurveyManagerCard";
import FreeFormPostsCard from "../../components/Academy-Sessions/FreeFormPostsCard";
import PerformanceOverview from "../../components/Academy-Sessions/PerformanceOverview";

import type {
  AcademyContentItem,
  SurveyVariant,
  FreeFormPost,
} from "../../components/Academy-Sessions/types/types";

import { applyFreeForRegisteredUniqueness } from "../../components/Academy-Sessions/utils/academy.utils";

/* ------------------------------ DEMO DATA ------------------------------ */

const initialContent: AcademyContentItem[] = [
  {
    id: "c1-de-en",
    contentId: "W04-DE-EN-01",
    title: "Dribbling Masterclass",
    displayTitle: "How to improve your dribbling skills",
    host: "John Doe",
    releaseDate: "2026-01-12",
    releaseTime: "16:00",
    week: 4,
    position: 1,
    country: "Germany",
    language: "EN",
    bucket: "currentWeek",
    access: "Pro",
    freeForRegistered: true,
    thumbnailUrl: "https://picsum.photos/seed/dribbling/400/250",
    description: "High-intensity dribbling drills and ball control.",
    tags: ["Technique"],
  },
  {
    id: "c1-de-de",
    contentId: "W04-DE-DE-01",
    title: "Dribbling Masterclass",
    displayTitle: "So verbesserst du dein Dribbling",
    host: "John Doe",
    releaseDate: "2026-01-12",
    releaseTime: "16:00",
    week: 4,
    position: 1,
    country: "Germany",
    language: "DE",
    bucket: "currentWeek",
    access: "Pro",
    freeForRegistered: false,
    thumbnailUrl: "https://picsum.photos/seed/dribbling2/400/250",
    description: "High-intensity dribbling drills and ball control.",
    tags: ["Technik"],
  },
  {
    id: "c2-us-en",
    contentId: "W04-US-EN-02",
    title: "Passing Technique",
    displayTitle: "How to improve your passing skills",
    host: "David Villa",
    releaseDate: "2026-01-12",
    releaseTime: "16:00",
    week: 4,
    position: 2,
    country: "USA",
    language: "EN",
    bucket: "currentWeek",
    access: "Pro",
    freeForRegistered: false,
    thumbnailUrl: "https://picsum.photos/seed/passing/400/250",
    duration: "45 mins",
    views: "1.2K",
    tags: ["Technique"],
    description: "Core passing mechanics and real-game drills.",
  },
  {
    id: "c-past-1",
    contentId: "W03-US-EN-01",
    title: "Defensive Positioning",
    displayTitle: "Defensive Positioning",
    host: "Carles Puyol",
    releaseDate: "2025-12-28",
    releaseTime: "16:00",
    week: 3,
    position: 1,
    country: "USA",
    language: "EN",
    bucket: "past",
    access: "Pro",
    freeForRegistered: false,
    duration: "60 mins",
    views: "2.5K",
    tags: ["Tactic"],
  },
];

const initialSurveyVariants: SurveyVariant[] = [
  {
    id: "sv-1-de-en",
    week: 4,
    country: "Germany",
    language: "EN",
    question: "Which drill helped you most this week?",
    responseType: "both",
    options: ["Dribbling ladder", "1v1 shielding", "Cone slalom"],
    responsesCount: 128,
  },
  {
    id: "sv-1-de-de",
    week: 4,
    country: "Germany",
    language: "DE",
    question: "Welche Übung hat dir diese Woche am meisten geholfen?",
    responseType: "multipleChoice",
    options: ["Dribbling Leiter", "1v1 Abschirmung", "Hütchen Slalom"],
    responsesCount: 94,
  },
];

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

const PAGE_SIZE_PAST = 10;

const AcedamySessionsPage: React.FC = () => {
  const [search, setSearch] = React.useState("");

  const [filters, setFilters] = React.useState<AcademyFiltersState>({
    country: "All",
    language: "All",
    bucket: "All",
  });

  const [content, setContent] = React.useState<AcademyContentItem[]>(
    initialContent
  );

  const [surveyVariants, setSurveyVariants] = React.useState<SurveyVariant[]>(
    initialSurveyVariants
  );

  const [freeFormPosts] = React.useState<FreeFormPost[]>(freeFormPostsSeed);

  const [isScheduleOpen, setIsScheduleOpen] = React.useState(false);

  const [selected, setSelected] = React.useState<AcademyContentItem | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const handleFiltersChange = (partial: Partial<AcademyFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const matchesFiltersAndSearch = React.useCallback(
    (row: AcademyContentItem) => {
      if (filters.country !== "All" && row.country !== filters.country)
        return false;
      if (filters.language !== "All" && row.language !== filters.language)
        return false;
      if (filters.bucket !== "All" && row.bucket !== filters.bucket) return false;

      const q = search.trim().toLowerCase();
      if (!q) return true;

      const haystack = [
        row.contentId,
        row.title,
        row.displayTitle,
        row.host,
        row.country,
        row.language,
        ...(row.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    },
    [filters, search]
  );

  const currentWeekRows = React.useMemo(() => {
    return content
      .filter((c) => c.bucket === "currentWeek")
      .filter(matchesFiltersAndSearch)
      .sort((a, b) => (a.week !== b.week ? b.week - a.week : a.position - b.position));
  }, [content, matchesFiltersAndSearch]);

  const pastRows = React.useMemo(() => {
    return content
      .filter((c) => c.bucket === "past")
      .filter(matchesFiltersAndSearch)
      .sort((a, b) => (a.week !== b.week ? b.week - a.week : a.position - b.position));
  }, [content, matchesFiltersAndSearch]);

  const paginatedPast = pastRows.slice(0, PAGE_SIZE_PAST);

  const handleCreateContent = (payload: Omit<AcademyContentItem, "id">) => {
    const next: AcademyContentItem = {
      id: `content-${Date.now()}`,
      ...payload,
    };

    setContent((prev) => {
      const updated = [next, ...prev];
      // enforce uniqueness if freeForRegistered is enabled
      return applyFreeForRegisteredUniqueness(updated, next);
    });
  };

  const handleView = (row: AcademyContentItem) => {
    setSelected(row);
    setDetailsOpen(true);
  };

  const handleRemove = (id: string) => {
    setContent((prev) => prev.filter((x) => x.id !== id));
    setDetailsOpen(false);
  };

  return (
    <>
      <PageShell>
        <PageHeader
          title="Academy Content"
          subtitle="Manage weekly release content, surveys, and admin posts by country and language."
          actions={
            <Button
              variant="primary"
              className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
              onClick={() => setIsScheduleOpen(true)}
            >
              + Schedule Weekly Content
            </Button>
          }
        />

        {/* Search + filters */}
        <SectionCard className="mt-4 bg-[#04130d]" contentClassName="space-y-4">
          <TableToolbar
            search={
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search content ID, titles, hosts, tags..."
                leftIcon={<FiSearch />}
                className="bg-[#071810]"
              />
            }
            filters={
              <AcademyFiltersBar filters={filters} onChange={handleFiltersChange} />
            }
          />
        </SectionCard>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {/* Left */}
          <div className="space-y-5 min-w-0 lg:col-span-2 xl:col-span-3">
            <AcademyContentTable
              title="Academy Content List - Current Week"
              subtitle="This replaces the large tile view to keep the page scalable across countries/languages."
              rows={currentWeekRows}
              onView={handleView}
              onRemove={handleRemove}
            />

            <AcademyContentTable
              title="Academy Content List - Past Weeks"
              subtitle="Filter by country and language above."
              rows={paginatedPast}
              onView={handleView}
              onRemove={handleRemove}
            />

            <SurveyManagerCard
              variants={surveyVariants}
              setVariants={setSurveyVariants}
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
      <ScheduleContentSlideOver
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onCreate={(payload) => {
          handleCreateContent(payload);
          setIsScheduleOpen(false);
        }}
      />

      {/* Details */}
      <ContentDetailsSlideOver
        isOpen={detailsOpen}
        item={selected}
        onClose={() => setDetailsOpen(false)}
        onRemove={handleRemove}
      />
    </>
  );
};

export default AcedamySessionsPage;
