import React from "react";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import TableToolbar from "../../shared/tables/TableToolbar";
import SearchBar from "../../shared/inputs/SearchBar";
import Button from "../../shared/inputs/Button";
import ContentTable from "../../components/contentManagement/ContentTable";
import ContentFiltersBar, {
  type ContentFiltersState,
} from "../../components/contentManagement/ContentFiltersBar";
import AddContentSlideOver from "../../components/contentManagement/AddContentSlideOver";
import type { ContentItem } from "../../components/contentManagement/types";
import { FiSearch, FiPlus } from "react-icons/fi";

const initialContent: ContentItem[] = [
  {
    id: "1",
    title: "Advanced Dribbling Drills",
    thumbnailUrl: "https://picsum.photos/seed/dribbling/400/250",
    type: "Train",
    week: 4,
    access: "Pro",
    tags: ["Dribbling", "Agility"],
    status: "published",
  },
  {
    id: "2",
    title: "Tactical Formations 101",
    thumbnailUrl: "https://picsum.photos/seed/tactics/400/250",
    type: "Learn",
    week: 2,
    access: "All",
    tags: ["Tactics"],
    status: "published",
  },
  {
    id: "3",
    title: "Live Q&A with Coach Mike",
    thumbnailUrl: "https://picsum.photos/seed/live-session/400/250",
    type: "Live",
    week: 5,
    access: "Pro",
    tags: ["Q&A"],
    status: "scheduled",
  },
  {
    id: "4",
    title: "Pre-Match Nutrition Guide",
    thumbnailUrl: "https://picsum.photos/seed/nutrition/400/250",
    type: "Doc",
    week: 1,
    access: "Basic",
    tags: ["Nutrition"],
    status: "draft",
  },
  {
    id: "5",
    title: "Shooting Accuracy",
    thumbnailUrl: "https://picsum.photos/seed/shooting/400/250",
    type: "Train",
    week: 3,
    access: "Basic",
    tags: ["Shooting", "Finishing"],
    status: "published",
  },
];


const ContentManagementPage: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<ContentFiltersState>({
    week: "All",
    type: "All",
    language: "All",
    country: "All",
    access: "All",
    status: "All",
  });

  const [items, setItems] = React.useState<ContentItem[]>(initialContent);
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  const handleFiltersChange = (partial: Partial<ContentFiltersState>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFilters((prev: any) => ({ ...prev, ...partial }));
  };

  const handleCreateContent = (payload: Omit<ContentItem, "id">) => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      ...payload,
    };
    setItems((prev) => [newItem, ...prev]);
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

      if (filters.status !== "All") {
        if (filters.status === "Published" && item.status !== "published")
          return false;
        if (filters.status === "Scheduled" && item.status !== "scheduled")
          return false;
        if (filters.status === "Draft" && item.status !== "draft") return false;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (filters.type !== "All" && item.type !== (filters.type as any))
        return false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (filters.access !== "All" && item.access !== (filters.access as any))
        return false;

      // week/language/country filters can be wired later as needed
      return true;
    });
  }, [items, search, filters]);

  return (
    <>
      <PageShell>
        <PageHeader
          title="Content Management"
          subtitle="Manage all videos, documents, images, and recordings for the GDS Sports."
          actions={
            <Button
              variant="primary"
              leftIcon={<FiPlus />}
              onClick={() => setIsAddOpen(true)}
              className="rounded-full bg-amber-400 text-black hover:bg-amber-300"
            >
              Add New Content
            </Button>
          }
        />

        <div className="mt-4 space-y-4">
          <TableToolbar
            search={
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search by title or tag..."
                leftIcon={<FiSearch />}
                className="bg-[#3a3023]"
              />
            }
            filters={
              <ContentFiltersBar
                filters={filters}
                onChange={handleFiltersChange}
              />
            }
          />

          <ContentTable items={filteredItems} />
        </div>
      </PageShell>

      {/* Modal / slide-over for Add New Content */}
      <AddContentSlideOver
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreate={(payload: Omit<ContentItem, "id">) => {
          handleCreateContent(payload);
          setIsAddOpen(false);
        }}
      />
    </>
  );
};

export default ContentManagementPage;
