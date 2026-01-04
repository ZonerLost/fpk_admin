import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import TableToolbar from "../../shared/tables/TableToolbar";
import SearchBar from "../../shared/inputs/SearchBar";
import SectionCard from "../../shared/layout/SectionCard";
import Button from "../../shared/inputs/Button";

import AcademyContentTable from "../../components/Academy-Sessions/AcademyContentTable";
import PerformanceOverview from "../../components/Academy-Sessions/PerformanceOverview";
import AddAcademyContentSlideOver from "../../components/Academy-Sessions/AddAcedemyContentSliderOver";
import RecordingDetailsSlideOver from "../../components/Academy-Sessions/RecordingDetailsSlideOver";
import CurrentWeekSurveyCard from "../../components/Academy-Sessions/surveyManage/CurrentWeekSurveyCard";
import FreeFormPostsCard from "../../components/Academy-Sessions/FreeFormPostsCard";
import AcademyFiltersBar, {
  type AcademyFiltersState,
} from "../../components/Academy-Sessions/filter-Academy/AcademyFiltersBar";
import SurveyManagerSlideOver, {
  type SurveyVariantDraft,
  type SurveyVariant as SlideOverSurveyVariant,
} from "../../components/Academy-Sessions/surveyManage/SurveyManagerSlideOver";

import type {
  RecordingItem,
  WeeklySurvey,
  FreeFormPost,
} from "../../components/Academy-Sessions/types/types";

import { inferTimezone, formatReleaseLabel } from "../../components/Academy-Sessions/utils/academy.utils";

import { FiSearch } from "react-icons/fi";

/* ------------------------------ DEMO DATA ------------------------------ */

const initialContent: RecordingItem[] = [
  {
    id: "r1-en",
    contentId: "AC00001",
    title: "Passing Technique",
    displayTitle: "How to improve your passing skills",
    country: "Germany",
    language: "EN",
    week: 4,
    position: 1,
    access: "All",
    isFreeForRegistered: true,
    releaseDate: "2026-01-12",
    releaseTime: "16:00",
    timezone: inferTimezone("Germany"),
    bucket: "currentWeek",
    views: "1.2K",
    duration: "45 mins",
    host: "David Villa",
    tags: ["Technique"],
    description: "Core passing mechanics and real-game drills.",
    thumbnailUrl: "https://picsum.photos/seed/passing/400/250",
  },
  {
    id: "r1-de",
    contentId: "AC00002",
    title: "Passing Technique",
    displayTitle: "So verbesserst du dein Passspiel",
    country: "Germany",
    language: "DE",
    week: 4,
    position: 1,
    access: "All",
    isFreeForRegistered: false,
    releaseDate: "2026-01-12",
    releaseTime: "16:00",
    timezone: inferTimezone("Germany"),
    bucket: "currentWeek",
    views: "980",
    duration: "45 mins",
    host: "David Villa",
    tags: ["Technique"],
    thumbnailUrl: "https://picsum.photos/seed/passing/400/250",
  },
  {
    id: "r2",
    contentId: "AC00003",
    title: "Defensive Positioning",
    displayTitle: "Defensive Positioning",
    country: "USA",
    language: "EN",
    week: 3,
    position: 2,
    access: "Pro",
    isFreeForRegistered: false,
    releaseDate: "2025-12-28",
    releaseTime: "16:00",
    timezone: inferTimezone("USA"),
    bucket: "past",
    views: "2.5K",
    duration: "60 mins",
    host: "Carles Puyol",
    tags: ["Tactic"],
    thumbnailUrl: "https://picsum.photos/seed/defense/400/250",
  },
];

const currentWeekSurveySeed: WeeklySurvey = {
  id: "s1",
  week: 4,
  variants: [
    {
      id: "s1-de-en",
      week: 4,
      country: "Germany",
      language: "EN",
      question: "Which drill helped you most this week?",
      responseMode: "both",
      multipleChoiceOptions: ["Passing under pressure", "First touch", "Positioning"],
      responsesCount: 128,
    },
    {
      id: "s1-de-de",
      week: 4,
      country: "Germany",
      language: "DE",
      question: "Welche Übung hat dir diese Woche am meisten geholfen?",
      responseMode: "multiple_choice",
      multipleChoiceOptions: ["Passspiel", "Erster Kontakt", "Positionierung"],
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
const MAX_ONSCREEN = 5000;

const AcedamySessionsPage: React.FC = () => {
  const [search, setSearch] = React.useState("");

  const [filters, setFilters] = React.useState<AcademyFiltersState>({
    country: "All",
    language: "All",
    bucket: "All",
  });

  const [items, setItems] = React.useState<RecordingItem[]>(initialContent);
  const [freeFormPosts] = React.useState<FreeFormPost[]>(freeFormPostsSeed);

  const [survey, setSurvey] = React.useState<WeeklySurvey>(currentWeekSurveySeed);
  const [editingSurveyVariant, setEditingSurveyVariant] = React.useState<SlideOverSurveyVariant | null>(null);

  const [isAddOpen, setIsAddOpen] = React.useState(false);

  // View content
  const [selected, setSelected] = React.useState<RecordingItem | null>(null);
  const [isViewOpen, setIsViewOpen] = React.useState(false);

  // Survey manager
  const [surveyOpen, setSurveyOpen] = React.useState(false);

  const handleFiltersChange = (partial: Partial<AcademyFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleCreate = (payload: Omit<RecordingItem, "id">) => {
    const newItem: RecordingItem = {
      id: Date.now().toString(),
      ...payload,
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const handleView = (row: RecordingItem) => {
    setSelected(row);
    setIsViewOpen(true);
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((r) => r.id !== id));
    setIsViewOpen(false);
  };

  const handleSaveSurveyVariant = (draft: SurveyVariantDraft) => {
    setSurvey((prev) => {
      if (editingSurveyVariant) {
        return {
          ...prev,
          week: draft.week,
          variants: prev.variants.map((v) =>
            v.id === editingSurveyVariant.id
              ? { ...v, ...draft, responsesCount: v.responsesCount }
              : v
          ),
        };
      }

      const next: SlideOverSurveyVariant = {
        id: `sv-${Date.now()}`,
        responsesCount: 0,
        ...draft,
      };

      return {
        ...prev,
        week: draft.week,
        variants: [next, ...prev.variants],
      };
    });

    setEditingSurveyVariant(null);
    setSurveyOpen(false);
  };

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter((x) => {
      if (filters.country !== "All" && x.country !== filters.country) return false;
      if (filters.language !== "All" && x.language !== filters.language) return false;

      if (!q) return true;

      const haystack = [
        x.contentId,
        x.title,
        x.displayTitle,
        x.country,
        x.language,
        x.access,
        formatReleaseLabel({ releaseDate: x.releaseDate, releaseTime: x.releaseTime, timezone: x.timezone }),
        ...(x.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [items, search, filters]);

  const currentWeekRows = filtered.filter((x) => x.bucket === "currentWeek");
  const pastRows = filtered.filter((x) => x.bucket === "past");

  const showCurrent = filters.bucket === "All" || filters.bucket === "currentWeek";
  const showPast = filters.bucket === "All" || filters.bucket === "past";

  const currentWeekPage = currentWeekRows.slice(0, Math.min(PAGE_SIZE, MAX_ONSCREEN));
  const pastPage = pastRows.slice(0, Math.min(PAGE_SIZE, MAX_ONSCREEN));

  return (
    <>
      <PageShell>
        <PageHeader
          title="Academy Sessions"
          subtitle="Manage weekly recording releases, surveys, and posts by country and language."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                className="rounded-full border border-white/10 bg-transparent"
                onClick={() => {
                  setEditingSurveyVariant(null);
                  setSurveyOpen(true);
                }}
              >
                Manage Survey
              </Button>

              <Button
                variant="primary"
                className="rounded-full bg-emerald-500 text-black hover:bg-emerald-400"
                onClick={() => setIsAddOpen(true)}
              >
                + Add Academy Content
              </Button>
            </div>
          }
        />

        {/* Search + filters */}
        <SectionCard className="mt-4 bg-[#04130d]" contentClassName="space-y-4">
          <TableToolbar
            search={
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by content ID, title, country, language..."
                leftIcon={<FiSearch />}
                className="bg-[#071810]"
              />
            }
            filters={<AcademyFiltersBar filters={filters} onChange={handleFiltersChange} />}
          />
        </SectionCard>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {/* Left */}
          <div className="space-y-5 min-w-0 lg:col-span-2 xl:col-span-3">
            {showCurrent && (
              <AcademyContentTable
                title="Academy Content List — Current Week"
                subtitle="Table view scales better across many countries & languages."
                rows={currentWeekPage}
                onView={handleView}
                onRemove={handleRemove}
              />
            )}

            {showPast && (
              <AcademyContentTable
                title="Academy Content List — Past Weeks"
                subtitle="Use filters above to narrow by country and language."
                rows={pastPage}
                onView={handleView}
                onRemove={handleRemove}
              />
            )}

            <CurrentWeekSurveyCard
              survey={survey}
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

      {/* Add Academy Content */}
      <AddAcademyContentSlideOver
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        existingContentIds={items.map((x) => x.contentId)}
        existingItems={items}
        onCreate={(payload) => {
          handleCreate(payload);
          setIsAddOpen(false);
        }}
      />

      {/* View */}
      <RecordingDetailsSlideOver
        isOpen={isViewOpen}
        recording={selected}
        onClose={() => setIsViewOpen(false)}
        onRemove={handleRemove}
      />

      {/* Survey manager */}
      <SurveyManagerSlideOver
        isOpen={surveyOpen}
        onClose={() => {
          setSurveyOpen(false);
          setEditingSurveyVariant(null);
        }}
        editing={editingSurveyVariant}
        defaultCountry={filters.country !== "All" ? filters.country : undefined}
        defaultLanguage={filters.language !== "All" ? filters.language : undefined}
        onSave={handleSaveSurveyVariant}
      />
    </>
  );
};

export default AcedamySessionsPage;
