import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import TextField from "../../shared/inputs/TextField";
import ToggleChips, { type ToggleOption } from "../../shared/inputs/ToggleChips";
import Button from "../../shared/inputs/Button";
import type {
  ContentItem,
  ContentType,
  ContentStatus,
  ContentAccess,
  ContentCategory,
  ContentSourceType,
  ContentPurpose,
} from "./types";

type Props = {
  isOpen: boolean;
  onClose: () => void;

  /** Create mode */
  onCreate: (payload: Omit<ContentItem, "id">) => void;

  /** Optional edit mode */
  onUpdate?: (id: string, payload: Omit<ContentItem, "id">) => void;

  /** If provided => edit mode */
  initialItem?: ContentItem | null;
};

const typeOptions: ToggleOption[] = [
  { value: "Train", label: "Train" },
  { value: "Learn", label: "Learn" },
  { value: "Live", label: "Live" },
  { value: "Doc", label: "Doc" },
  { value: "Survey", label: "Survey" },
];

const categoryOptions: ToggleOption[] = [
  { value: "Mindset", label: "Mindset" },
  { value: "Lifestyle", label: "Lifestyle" },
  { value: "Tactic", label: "Tactic" },
  { value: "Technique", label: "Technique" },
  { value: "Survey", label: "Survey" },
];

const accessOptions: ToggleOption[] = [
  { value: "Pro", label: "Pro" },
  { value: "Basic", label: "Basic" },
  { value: "All", label: "All" },
];

const statusOptions: ToggleOption[] = [
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
  { value: "draft", label: "Draft" },
];

const sourceTypeOptions: ToggleOption[] = [
  { value: "link", label: "Upload Link" },
  { value: "file", label: "Upload File" },
];

const purposeOptions: ToggleOption[] = [
  { value: "content", label: "Normal Content" },
  { value: "learn_thumbnail", label: "Learn Thumbnails" },
  { value: "intro_asset", label: "Intro Assets" },
];

const COUNTRIES = ["USA", "UK", "Germany", "France", "Spain", "Pakistan"];
const LANGUAGES = ["EN", "DE", "FR", "ES", "UR"];

const AddContentSlideOver: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  initialItem,
}) => {
  const isEdit = !!initialItem;

  const [title, setTitle] = React.useState("");
  const [thumbnailUrl, setThumbnailUrl] = React.useState("");
  const [week, setWeek] = React.useState("1");
  const [positionInWeek, setPositionInWeek] = React.useState("1");

  const [type, setType] = React.useState<ContentType>("Train");
  const [category, setCategory] = React.useState<ContentCategory>("Tactic");
  const [access, setAccess] = React.useState<ContentAccess>("Pro");
  const [status, setStatus] = React.useState<ContentStatus>("published");
  const [publishAt, setPublishAt] = React.useState("");

  const [country, setCountry] = React.useState("USA");
  const [language, setLanguage] = React.useState("EN");

  const [isFreeForRegistered, setIsFreeForRegistered] = React.useState(false);
  const [isAcademyFreeForRegistered, setIsAcademyFreeForRegistered] =
    React.useState(false);

  const [sourceType, setSourceType] = React.useState<ContentSourceType>("link");
  const [sourceUrl, setSourceUrl] = React.useState("");
  const [fileName, setFileName] = React.useState("");

  const [purpose, setPurpose] = React.useState<ContentPurpose>("content");
  const [groupKey, setGroupKey] = React.useState("");

  const [tagsInput, setTagsInput] = React.useState("");

  // Prefill on edit
  React.useEffect(() => {
    if (!isOpen) return;

    if (initialItem) {
      setTitle(initialItem.title ?? "");
      setThumbnailUrl(initialItem.thumbnailUrl ?? "");
      setWeek(String(initialItem.week ?? 1));
      setPositionInWeek(String(initialItem.positionInWeek ?? 1));

      setType(initialItem.type ?? "Train");
      setCategory(initialItem.category ?? "Tactic");
      setAccess(initialItem.access ?? "Pro");
      setStatus(initialItem.status ?? "published");
      setPublishAt(initialItem.publishAt ?? "");

      setCountry(initialItem.country ?? "USA");
      setLanguage(initialItem.language ?? "EN");

      setIsFreeForRegistered(!!initialItem.isFreeForRegistered);
      setIsAcademyFreeForRegistered(!!initialItem.isAcademyFreeForRegistered);

      setSourceType(initialItem.sourceType ?? "link");
      setSourceUrl(initialItem.sourceUrl ?? "");
      setFileName(initialItem.fileName ?? "");

      setPurpose(initialItem.purpose ?? "content");
      setGroupKey(initialItem.groupKey ?? "");

      setTagsInput((initialItem.tags ?? []).join(", "));
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialItem?.id]);

  const resetForm = () => {
    setTitle("");
    setThumbnailUrl("");
    setWeek("1");
    setPositionInWeek("1");
    setType("Train");
    setCategory("Tactic");
    setAccess("Pro");
    setStatus("published");
    setPublishAt("");
    setCountry("USA");
    setLanguage("EN");
    setIsFreeForRegistered(false);
    setIsAcademyFreeForRegistered(false);
    setSourceType("link");
    setSourceUrl("");
    setFileName("");
    setPurpose("content");
    setGroupKey("");
    setTagsInput("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    // Scheduled requires a date
    if (status === "scheduled" && !publishAt) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Omit<ContentItem, "id"> = {
      groupKey: groupKey.trim() || undefined,
      title: title.trim(),
      thumbnailUrl: thumbnailUrl.trim() || "/images/content/placeholder.jpg",

      type,
      category,

      week: Number(week) || 1,
      positionInWeek: Number(positionInWeek) || 1,

      access,
      isFreeForRegistered,
      isAcademyFreeForRegistered,

      country,
      language,

      status,
      publishAt: status === "scheduled" ? publishAt : undefined,

      tags,

      sourceType,
      sourceUrl: sourceType === "link" ? sourceUrl.trim() || undefined : undefined,
      fileName: sourceType === "file" ? fileName || undefined : undefined,

      isDeletable: true,
      purpose,
    };

    if (isEdit && initialItem && onUpdate) {
      onUpdate(initialItem.id, payload);
    } else {
      onCreate(payload);
    }

    resetForm();
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={
          !title.trim() ||
          (status === "scheduled" && !publishAt) ||
          (sourceType === "link" && !sourceUrl.trim() && type !== "Survey") ||
          (sourceType === "file" && !fileName && type !== "Survey")
        }
      >
        {isEdit ? "Update Content" : "Save Content"}
      </Button>
    </>
  );

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Content" : "Add New Content"}
      description="Create or update content for the GDS Sports app."
      footer={footer}
    >
      <div className="space-y-4">
        {/* Title */}
        <TextField
          label="Title"
          placeholder="Enter content title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Group key for language variants */}
        <TextField
          label="Group Key (for language versions)"
          placeholder="e.g. tactics_week2_videoA"
          value={groupKey}
          onChange={(e) => setGroupKey(e.target.value)}
          hint="Use the same Group Key to link multiple language versions of the same content."
        />

        {/* Purpose */}
        <div>
          <label className="text-xs font-medium text-slate-200 md:text-sm">
            Purpose
          </label>
          <div className="mt-2">
            <ToggleChips
              options={purposeOptions}
              value={purpose}
              onChange={(v) => setPurpose(v as ContentPurpose)}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Learn thumbnails & intro assets can be managed here as special content types.
          </p>
        </div>

        {/* Thumbnail */}
        <TextField
          label="Thumbnail URL"
          placeholder="https://…"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          hint="Optional. If empty, a placeholder will be used."
        />

        {/* Type + Category */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Type
            </label>
            <div className="mt-2">
              <ToggleChips
                options={typeOptions}
                value={type}
                onChange={(v) => setType(v as ContentType)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Category
            </label>
            <div className="mt-2">
              <ToggleChips
                options={categoryOptions}
                value={category}
                onChange={(v) => setCategory(v as ContentCategory)}
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Category will drive the icon shown on top of the video.
            </p>
          </div>
        </div>

        {/* Country + Language */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Country
            </label>
            <div className="mt-2 flex flex-wrap gap-1">
              {COUNTRIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCountry(c)}
                  className={[
                    "rounded-full border px-3 py-1 text-[11px] font-medium",
                    country === c
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                      : "border-white/10 text-slate-300 hover:bg-white/5",
                  ].join(" ")}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Language
            </label>
            <div className="mt-2 flex flex-wrap gap-1">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLanguage(l)}
                  className={[
                    "rounded-full border px-3 py-1 text-[11px] font-medium",
                    language === l
                      ? "border-amber-400/60 bg-amber-400/10 text-amber-200"
                      : "border-white/10 text-slate-300 hover:bg-white/5",
                  ].join(" ")}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Access + Free toggles */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Access
            </label>
            <div className="mt-2">
              <ToggleChips
                options={accessOptions}
                value={access}
                onChange={(v) => setAccess(v as ContentAccess)}
              />
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-white/5 bg-white/5 p-3">
            <label className="flex items-center gap-2 text-xs text-slate-200">
              <input
                type="checkbox"
                checked={isFreeForRegistered}
                onChange={(e) => setIsFreeForRegistered(e.target.checked)}
              />
              Free for Registered users
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-200">
              <input
                type="checkbox"
                checked={isAcademyFreeForRegistered}
                onChange={(e) =>
                  setIsAcademyFreeForRegistered(e.target.checked)
                }
              />
              Free for Registered (Academy)
            </label>

            <p className="text-[10px] text-slate-400">
              Use these flags for the 1–2 weekly free videos rule.
            </p>
          </div>
        </div>

        {/* Week + Position */}
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Week"
            type="number"
            min={1}
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          />
          <TextField
            label="Position in Week"
            type="number"
            min={1}
            value={positionInWeek}
            onChange={(e) => setPositionInWeek(e.target.value)}
            hint="Shows as Week X #1, #2..."
          />
        </div>

        {/* Status + Schedule */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Status
            </label>
            <div className="mt-2">
              <ToggleChips
                options={statusOptions}
                value={status}
                onChange={(v) => setStatus(v as ContentStatus)}
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Draft = not visible to users. Scheduled = auto-publish at a future date.
            </p>
          </div>

          {status === "scheduled" ? (
            <TextField
              label="Publish At"
              type="datetime-local"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
              hint="Required for scheduled content."
            />
          ) : (
            <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-[11px] text-slate-400">
              Publish date is only required when status is Scheduled.
            </div>
          )}
        </div>

        {/* Source type */}
        <div>
          <label className="text-xs font-medium text-slate-200 md:text-sm">
            Upload Type
          </label>
          <div className="mt-2">
            <ToggleChips
              options={sourceTypeOptions}
              value={sourceType}
              onChange={(v) => setSourceType(v as ContentSourceType)}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Survey can be a URL to a survey tool or internal survey config later.
          </p>
        </div>

        {/* Link input */}
        {sourceType === "link" && (
          <TextField
            label={type === "Survey" ? "Survey Link" : "Content Link"}
            placeholder="https://…"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            hint="Backend will validate link types later."
          />
        )}

        {/* File input */}
        {sourceType === "file" && (
          <div className="rounded-xl border border-white/5 bg-white/5 p-3">
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              {type === "Survey" ? "Survey File (optional)" : "Upload File"}
            </label>
            <input
              type="file"
              className="mt-2 w-full text-xs text-slate-300"
              onChange={handleFilePick}
            />
            {fileName && (
              <div className="mt-2 text-[11px] text-emerald-200">
                Selected: {fileName}
              </div>
            )}
            <p className="mt-1 text-[10px] text-slate-400">
              For now we only store file name in UI. Backend upload will be added later.
            </p>
          </div>
        )}

        {/* Tags */}
        <TextField
          label="Tags"
          placeholder="Dribbling, Agility, Shooting…"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          hint="Separate tags with commas."
        />
      </div>
    </SlideOver>
  );
};

export default AddContentSlideOver;
