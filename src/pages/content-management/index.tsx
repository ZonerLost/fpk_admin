/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import TableToolbar from "../../shared/tables/TableToolbar";
import SearchBar from "../../shared/inputs/SearchBar";
import Button from "../../shared/inputs/Button";
import ConfirmDialog from "../../shared/overlay/ConfirmDialog";
import { downloadCsv } from "../../shared/utils/downloadCsv";
import { isContentId } from "../../shared/utils/contentId";

import ContentFiltersBar, { type ContentFiltersState } from "../../components/contentManagement/ContentFiltersBar";
import AddContentSlideOver from "../../components/contentManagement/AddContentSlideOver";
import ContentGroupSection from "../../components/contentManagement/ContentGroupSection";

import type { ContentItem } from "../../components/contentManagement/types";
import { FiSearch, FiPlus } from "react-icons/fi";

const MAX_ONSCREEN = 5000;
const DISPLAY_LIMIT_OPTIONS = [100, 500, 1000, 5000] as const;

const initialContent: ContentItem[] = [
  {
    id: "1",
    contentId: "TR00001",
    groupKey: "m1_w4_dribbling_A",
    title: "Advanced Dribbling Drills (EN)",
    thumbnailUrl: "https://picsum.photos/seed/dribbling/400/250",
    thumbnailSourceType: "url",
    type: "Video",
    category: "Technik",
    purpose: "train_content",
    month: 1,
    week: 4,
    positionInWeek: 1,
    access: "Pro",
    isFreeForEveryone: false,
    isFreeForRegistered: false,
    isAcademyFreeForRegistered: false,
    country: "USA",
    language: "EN",
    tags: ["Dribbling", "Agility"],
    status: "published",
    sourceType: "link",
    sourceUrl: "https://example.com/video1",
    isDeletable: true,
  },
  {
    id: "2",
    contentId: "TR00002",
    groupKey: "m1_w4_dribbling_A",
    title: "Advanced Dribbling Drills (DE)",
    thumbnailUrl: "https://picsum.photos/seed/dribbling/400/250",
    thumbnailSourceType: "url",
    type: "Video",
    category: "Technik",
    purpose: "train_content",
    month: 1,
    week: 4,
    positionInWeek: 1,
    access: "Pro",
    isFreeForEveryone: false,
    isFreeForRegistered: false,
    isAcademyFreeForRegistered: false,
    country: "Germany",
    language: "DE",
    tags: ["Dribbling", "Agility"],
    status: "published",
    sourceType: "link",
    sourceUrl: "https://example.com/video1-de",
    isDeletable: true,
  },
  {
    id: "3",
    contentId: "AC00001",
    title: "Weekly Mindset Survey",
    thumbnailUrl: "https://picsum.photos/seed/survey/400/250",
    thumbnailSourceType: "url",
    type: "Survey",
    category: "Mindset",
    purpose: "academy_content",
    month: 2,
    week: 1,
    positionInWeek: 2,
    access: "All",
    isFreeForEveryone: false,
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
  },
  {
    id: "4",
    contentId: "LR00001",
    title: "Intro Asset - Learn Section",
    thumbnailUrl: "https://picsum.photos/seed/intro/400/250",
    thumbnailSourceType: "file",
    thumbnailFileName: "intro-thumb.png",
    type: "Video",
    category: "Fitness",
    purpose: "intro_asset",
    month: 1,
    week: 1,
    positionInWeek: 1,
    access: "All",
    isFreeForEveryone: true,
    isFreeForRegistered: true,
    isAcademyFreeForRegistered: false,
    country: "UK",
    language: "EN",
    tags: ["Intro"],
    status: "published",
    sourceType: "file",
    fileName: "intro.mp4",
    isDeletable: false,
  },
  {
    id: "5",
    contentId: "LR00002",
    title: "Learn Thumbnail Pack A",
    thumbnailUrl: "https://picsum.photos/seed/thumbs/400/250",
    thumbnailSourceType: "url",
    type: "Image",
    category: "Tactic",
    purpose: "learn_thumbnail",
    month: 1,
    week: 2,
    positionInWeek: 1,
    access: "All",
    isFreeForEveryone: false,
    isFreeForRegistered: true,
    isAcademyFreeForRegistered: true,
    country: "USA",
    language: "EN",
    tags: ["Thumbnails"],
    status: "draft",
    sourceType: "file",
    fileName: "thumb_pack.zip",
    isDeletable: true,
  },
];

function hasAnyFilterSelected(f: ContentFiltersState) {
  return Object.values(f).some((v) => v !== "All");
}

const ContentManagementPage: React.FC = () => {
  const [search, setSearch] = React.useState("");

  // Draft filters user is editing
  const [filtersDraft, setFiltersDraft] = React.useState<ContentFiltersState>({
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

  // Applied filters (drive loading + filtering)
  const [filtersApplied, setFiltersApplied] = React.useState<ContentFiltersState | null>(null);

  const [items, setItems] = React.useState<ContentItem[]>([]);

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ContentItem | null>(null);

  const [replaceWarningOpen, setReplaceWarningOpen] = React.useState(false);
  const [pendingEditItem, setPendingEditItem] = React.useState<ContentItem | null>(null);

  const [groupBy, setGroupBy] = React.useState<"none" | "week" | "month">("month");

  const [displayLimit, setDisplayLimit] = React.useState<(typeof DISPLAY_LIMIT_OPTIONS)[number]>(500);

  const handleFiltersChange = (partial: Partial<ContentFiltersState>) => {
    setFiltersDraft((prev) => ({ ...prev, ...partial }));
  };

  const applyFilters = () => {
    if (!hasAnyFilterSelected(filtersDraft)) return;

    setFiltersApplied(filtersDraft);

    // ✅ in production: fetch here using filtersDraft as query params
    // For now we load mock data only after filters are applied
    if (items.length === 0) {
      setItems(initialContent);
    }
  };

  const clearFilters = () => {
    setFiltersDraft({
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
    setFiltersApplied(null);
    setItems([]); // simulate "not loaded until filters apply"
    setSearch("");
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
    if (!filtersApplied) return [];

    return items.filter((item) => {
      const s = search.trim().toLowerCase();

      if (s) {
        const matches =
          item.title.toLowerCase().includes(s) ||
          item.groupKey?.toLowerCase().includes(s) ||
          item.tags.some((t) => t.toLowerCase().includes(s)) ||
          item.contentId.toLowerCase().includes(s) ||
          (isContentId(s) && item.contentId.toLowerCase() === s);

        if (!matches) return false;
      }

      // Status
      if (filtersApplied.status !== "All") {
        if (filtersApplied.status === "Published" && item.status !== "published") return false;
        if (filtersApplied.status === "Scheduled" && item.status !== "scheduled") return false;
        if (filtersApplied.status === "Draft" && item.status !== "draft") return false;
      }

      // Type
      if (filtersApplied.type !== "All" && item.type !== filtersApplied.type) return false;

      // Category
      if (filtersApplied.category !== "All" && item.category !== filtersApplied.category) return false;

      // Purpose
      if (filtersApplied.purpose !== "All" && item.purpose !== filtersApplied.purpose) return false;

      // Access
      if (filtersApplied.access !== "All" && item.access !== filtersApplied.access) return false;

      // Month + week
      if (filtersApplied.month !== "All" && String(item.month) !== filtersApplied.month) return false;
      if (filtersApplied.week !== "All" && String(item.week) !== filtersApplied.week) return false;

      // Country + language
      if (filtersApplied.country !== "All" && item.country !== filtersApplied.country) return false;
      if (filtersApplied.language !== "All" && item.language !== filtersApplied.language) return false;

      return true;
    });
  }, [items, search, filtersApplied]);

  const limitedItems = React.useMemo(() => {
    const cap = Math.min(displayLimit, MAX_ONSCREEN);
    return filteredItems.slice(0, cap);
  }, [filteredItems, displayLimit]);

  const overHardCap = filteredItems.length > MAX_ONSCREEN;
  const overDisplayLimit = filteredItems.length > limitedItems.length;

  const grouped = React.useMemo(() => {
    const base = limitedItems;

    if (groupBy === "none") return { "All Content": base };

    const map: Record<string, ContentItem[]> = {};
    base.forEach((item) => {
      const key = groupBy === "week" ? `Week ${item.week}` : `Month ${item.month}`;
      map[key] = map[key] ? [...map[key], item] : [item];
    });

    Object.keys(map).forEach((k) => {
      map[k] = map[k].sort((a, b) => a.month - b.month || a.week - b.week || a.positionInWeek - b.positionInWeek);
    });

    return map;
  }, [limitedItems, groupBy]);

  const handleEditClick = (item: ContentItem) => {
    if (item.type === "Video") {
      setPendingEditItem(item);
      setReplaceWarningOpen(true);
      return;
    }
    setEditingItem(item);
    setIsAddOpen(true);
  };

  const handleDownload = () => {
    const rows = limitedItems.map((x) => ({
      contentId: x.contentId,
      title: x.title,
      type: x.type,
      category: x.category,
      purpose: x.purpose,
      month: x.month,
      week: x.week,
      positionInWeek: x.positionInWeek,
      country: x.country,
      language: x.language,
      access: x.access,
      status: x.status,
      publishAt: x.publishAt ?? "",
      isFreeForEveryone: x.isFreeForEveryone ? "yes" : "no",
      isFreeForRegistered: x.isFreeForRegistered ? "yes" : "no",
      isAcademyFreeForRegistered: x.isAcademyFreeForRegistered ? "yes" : "no",
      tags: (x.tags ?? []).join("|"),
      sourceType: x.sourceType,
      sourceUrl: x.sourceUrl ?? "",
      fileName: x.fileName ?? "",
      groupKey: x.groupKey ?? "",
    }));

    downloadCsv("content-management-export.csv", rows);
  };

  const canApply = hasAnyFilterSelected(filtersDraft);

  return (
    <>
      <ConfirmDialog
        isOpen={replaceWarningOpen}
        title="Replace existing content?"
        description="Updating a video over an existing one will replace the current version. Continue?"
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
          subtitle="Manage all content assets and metadata."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" className="rounded-full" onClick={applyFilters} disabled={!canApply}>
                 Apply Filters
              </Button>

              <Button variant="secondary" className="rounded-full" onClick={clearFilters}>
                Clear
              </Button>

              <Button
                variant="secondary"
                className="rounded-full"
                onClick={() =>
                  setGroupBy((prev) => (prev === "month" ? "week" : prev === "week" ? "none" : "month"))
                }
              >
                Group: {groupBy.toUpperCase()}
              </Button>

              <Button
                variant="secondary"
                className="rounded-full"
                onClick={handleDownload}
                disabled={!filtersApplied || limitedItems.length === 0}
              >
                 Download
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
                  placeholder="Search by Content ID, title, groupKey or tag..."
                  leftIcon={<FiSearch />}
                  className="h-11 bg-[#3a3023]"
                />
              }
              filters={<ContentFiltersBar filters={filtersDraft} onChange={handleFiltersChange} />}
            />
          </div>

          {!filtersApplied ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
              <div className="text-base font-semibold text-white">Select filters to load content</div>
              <p className="mt-2 text-slate-300">
                To avoid loading too many records, this page requires filters first.
              </p>
              <p className="mt-1 text-slate-400 text-xs">
                Tip: choose Month/Week, Country, Language, Type, etc. then click <b>Apply Filters</b>.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-slate-300">
                  Results: <span className="text-slate-100">{filteredItems.length}</span>{" "}
                  {overHardCap && (
                    <span className="ml-2 text-amber-200">
                      (Hard cap {MAX_ONSCREEN}; refine filters for full set)
                    </span>
                  )}
                  {overDisplayLimit && !overHardCap && (
                    <span className="ml-2 text-amber-200">
                      (Showing first {limitedItems.length}; increase display limit)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">Max rows:</span>
                  <select
                    value={displayLimit}
                    onChange={(e) => setDisplayLimit(Number(e.target.value) as any)}
                    className="h-9 rounded-lg border border-white/15 bg-black/30 px-2.5 text-xs text-slate-100 outline-none"
                  >
                    {DISPLAY_LIMIT_OPTIONS.map((n) => (
                      <option key={n} value={n} className="bg-black">
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
            </>
          )}
        </div>
      </PageShell>

      <AddContentSlideOver
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        existingItems={items.length ? items : initialContent}
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
