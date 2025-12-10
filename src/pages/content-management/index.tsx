import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import TableToolbar from "../../shared/tables/TableToolbar";
import SearchBar from "../../shared/inputs/SearchBar";
import Button from "../../shared/inputs/Button";
import ConfirmDialog from "../../shared/overlay/ConfirmDialog";

import ContentFiltersBar, {
  type ContentFiltersState,
} from "../../components/contentManagement/ContentFiltersBar";

import AddContentSlideOver from "../../components/contentManagement/AddContentSlideOver";
import ContentGroupSection from "../../components/contentManagement/ContentGroupSection";

import type { ContentItem } from "../../components/contentManagement/types";
import { FiSearch, FiPlus } from "react-icons/fi";

const initialContent: ContentItem[] = [
  {
    id: "1",
    groupKey: "wk4_dribbling_A",
    title: "Advanced Dribbling Drills (EN)",
    thumbnailUrl: "https://picsum.photos/seed/dribbling/400/250",
    type: "Train",
    category: "Technique",
    week: 4,
    positionInWeek: 1,
    access: "Pro",
    isFreeForRegistered: false,
    isAcademyFreeForRegistered: false,
    country: "USA",
    language: "EN",
    tags: ["Dribbling", "Agility"],
    status: "published",
    sourceType: "link",
    sourceUrl: "https://example.com/video1",
    isDeletable: true,
    purpose: "content",
  },
  {
    id: "2",
    groupKey: "wk4_dribbling_A",
    title: "Advanced Dribbling Drills (DE)",
    thumbnailUrl: "https://picsum.photos/seed/dribbling/400/250",
    type: "Train",
    category: "Technique",
    week: 4,
    positionInWeek: 1,
    access: "Pro",
    isFreeForRegistered: false,
    isAcademyFreeForRegistered: false,
    country: "Germany",
    language: "DE",
    tags: ["Dribbling", "Agility"],
    status: "published",
    sourceType: "link",
    sourceUrl: "https://example.com/video1-de",
    isDeletable: true,
    purpose: "content",
  },
  {
    id: "3",
    title: "Weekly Mindset Survey",
    thumbnailUrl: "https://picsum.photos/seed/survey/400/250",
    type: "Survey",
    category: "Survey",
    week: 5,
    positionInWeek: 2,
    access: "All",
    isFreeForRegistered: true,
    isAcademyFreeForRegistered: true,
    country: "USA",
    language: "EN",
    tags: ["Mindset", "Survey"],
    status: "scheduled",
    publishAt: "2025-12-12T10:00",
    sourceType: "link",
    sourceUrl: "https://example.com/survey",
    isDeletable: true,
    purpose: "content",
  },
  {
    id: "4",
    title: "Intro Video - Learn Section",
    thumbnailUrl: "https://picsum.photos/seed/intro/400/250",
    type: "Learn",
    category: "Lifestyle",
    week: 1,
    positionInWeek: 1,
    access: "All",
    isFreeForRegistered: true,
    isAcademyFreeForRegistered: false,
    country: "UK",
    language: "EN",
    tags: ["Intro"],
    status: "published",
    sourceType: "file",
    fileName: "intro.mp4",
    isDeletable: false, // ✅ locked example
    purpose: "intro_asset",
  },
  {
    id: "5",
    title: "Learn Thumbnail Pack A",
    thumbnailUrl: "https://picsum.photos/seed/thumbs/400/250",
    type: "Learn",
    category: "Tactic",
    week: 2,
    positionInWeek: 1,
    access: "All",
    isFreeForRegistered: true,
    isAcademyFreeForRegistered: true,
    country: "USA",
    language: "EN",
    tags: ["Thumbnails"],
    status: "draft",
    sourceType: "file",
    fileName: "thumb_pack.zip",
    isDeletable: true,
    purpose: "learn_thumbnail",
  },
];

const ContentManagementPage: React.FC = () => {
  const [search, setSearch] = React.useState("");

  const [filters, setFilters] = React.useState<ContentFiltersState>({
    month: "All",
    week: "All",
    type: "All",
    category: "All",
    purpose: "All",
    language: "All",
    country: "All",
    access: "All",
    status: "All",
  });

  const [items, setItems] = React.useState<ContentItem[]>(initialContent);

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ContentItem | null>(null);

  // Replace warning dialog
  const [replaceWarningOpen, setReplaceWarningOpen] = React.useState(false);
  const [pendingEditItem, setPendingEditItem] = React.useState<ContentItem | null>(null);

  // Grouping mode
  const [groupBy, setGroupBy] = React.useState<"none" | "week" | "month">("week");

  const handleFiltersChange = (partial: Partial<ContentFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleCreateContent = (payload: Omit<ContentItem, "id">) => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      ...payload,
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const handleUpdateContent = (id: string, payload: Omit<ContentItem, "id">) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...payload } : x)));
  };

  const handleDeleteContent = (item: ContentItem) => {
    if (item.isDeletable === false) return;
    setItems((prev) => prev.filter((x) => x.id !== item.id));
  };

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const s = search.trim().toLowerCase();
      if (
        s &&
        !(
          item.title.toLowerCase().includes(s) ||
          item.tags.some((t) => t.toLowerCase().includes(s))
        )
      ) {
        return false;
      }

      // Status filter
      if (filters.status !== "All") {
        if (filters.status === "Published" && item.status !== "published") return false;
        if (filters.status === "Scheduled" && item.status !== "scheduled") return false;
        if (filters.status === "Draft" && item.status !== "draft") return false;
      }

      // Type filter
      if (filters.type !== "All" && item.type !== filters.type) return false;

      // Category filter
      if (filters.category !== "All" && item.category !== filters.category) return false;

      // Purpose filter
      if (filters.purpose !== "All" && (item.purpose ?? "content") !== filters.purpose)
        return false;

      // Access filter
      if (filters.access !== "All") {
        const normalized =
          filters.access === "All Access" ? "All" : filters.access;
        if (item.access !== normalized) return false;
      }

      // Week filter
      if (filters.week !== "All" && String(item.week) !== filters.week) return false;

      // Month filter (mock mapping: month = ceil(week/4))
      if (filters.month !== "All") {
        const month = Math.ceil(item.week / 4);
        if (String(month) !== filters.month) return false;
      }

      // Country + language
      if (filters.country !== "All" && item.country !== filters.country) return false;
      if (filters.language !== "All" && item.language !== filters.language) return false;

      return true;
    });
  }, [items, search, filters]);

  // Grouped views
  const grouped = React.useMemo(() => {
    if (groupBy === "none") return { "All Content": filteredItems };

    const map: Record<string, ContentItem[]> = {};
    filteredItems.forEach((item) => {
      const key =
        groupBy === "week"
          ? `Week ${item.week}`
          : `Month ${Math.ceil(item.week / 4)}`;

      map[key] = map[key] ? [...map[key], item] : [item];
    });

    // Sort inside groups by position
    Object.keys(map).forEach((k) => {
      map[k] = map[k].sort(
        (a, b) => a.week - b.week || a.positionInWeek - b.positionInWeek
      );
    });

    return map;
  }, [filteredItems, groupBy]);

  const handleEditClick = (item: ContentItem) => {
    // Show replace warning if it's a video-like type
    if (item.type === "Train" || item.type === "Learn" || item.type === "Live") {
      setPendingEditItem(item);
      setReplaceWarningOpen(true);
      return;
    }
    setEditingItem(item);
    setIsAddOpen(true);
  };

  return (
    <>
      {/* Replace warning */}
      <ConfirmDialog
        isOpen={replaceWarningOpen}
        title="Replace existing content?"
        description="If you upload or update a new video over an existing one, this will replace the current version. Continue?"
        confirmLabel="Continue"
        cancelLabel="Cancel"
        onCancel={() => {
          setReplaceWarningOpen(false);
          setPendingEditItem(null);
        }}
        onConfirm={() => {
          setReplaceWarningOpen(false);
          setEditingItem(pendingEditItem);
          setPendingEditItem(null);
          setIsAddOpen(true);
        }}
      />

      <PageShell>
        <PageHeader
          title="Content Management"
          subtitle="Manage videos, docs, Academy content, surveys, thumbnails, and intro assets."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              {/* Group toggle */}
              <Button
                variant="secondary"
                className="rounded-full"
                onClick={() =>
                  setGroupBy((prev) =>
                    prev === "week" ? "month" : prev === "month" ? "none" : "week"
                  )
                }
              >
                Group: {groupBy.toUpperCase()}
              </Button>

              <Button
                variant="primary"
                leftIcon={<FiPlus />}
                onClick={() => {
                  setEditingItem(null);
                  setIsAddOpen(true);
                }}
                className="rounded-full bg-amber-400 text-black hover:bg-amber-300"
              >
                Add New Content
              </Button>
            </div>
          }
        />

        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
            <TableToolbar
              className="space-y-3"
              search={
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Search by title or tag..."
                  leftIcon={<FiSearch />}
                  className="h-11 bg-[#3a3023]"
                />
              }
              filters={
                <ContentFiltersBar filters={filters} onChange={handleFiltersChange} />
              }
            />
          </div>

          {/* Grouped sections */}
          <div className="space-y-4">
            {Object.entries(grouped).map(([groupTitle, groupItems]) => (
              <ContentGroupSection
                key={groupTitle}
                title={groupTitle}
                items={groupItems}
                onEdit={handleEditClick}
                onDelete={handleDeleteContent}
              />
            ))}
          </div>
        </div>
      </PageShell>

      {/* Add/Edit SlideOver */}
      <AddContentSlideOver
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreate={(payload) => {
          handleCreateContent(payload);
          setIsAddOpen(false);
        }}
        onUpdate={(id, payload) => {
          handleUpdateContent(id, payload);
          setIsAddOpen(false);
        }}
        initialItem={editingItem}
      />
    </>
  );
};

export default ContentManagementPage;
