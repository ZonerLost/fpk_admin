/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";

import type {
  ContentItem,
  ContentType,
  ContentStatus,
  ContentAccess,
  ContentCategory,
  ContentSourceType,
  ContentPurpose,
  ThumbnailSourceType,
} from "./types";

import {
  COUNTRIES,
  LANGUAGES,
  TYPE_OPTIONS,
  CATEGORY_OPTIONS,
  ACCESS_OPTIONS,
  STATUS_OPTIONS,
  SOURCE_TYPE_OPTIONS,
  PURPOSE_OPTIONS,
  THUMBNAIL_SOURCE_OPTIONS,
} from "./content.constants";

import {
  formatContentId,
  prefixFromPurpose,
  parseContentSequence,
} from "../../shared/utils/contentId";

type Props = {
  isOpen: boolean;
  onClose: () => void;

  /** Create mode */
  onCreate: (payload: Omit<ContentItem, "id">) => void;

  /** Optional edit mode */
  onUpdate?: (id: string, payload: Omit<ContentItem, "id">) => void;

  /** If provided => edit mode */
  initialItem?: ContentItem | null;

  /** Used to generate the next contentId safely on UI (backend should be source of truth). */
  existingItems: ContentItem[];
};

type SelectOption = { value: string; label: string };

function toSelectOptions(input: any): SelectOption[] {
  if (!input) return [];

  // string[]
  if (Array.isArray(input) && typeof input[0] === "string") {
    return (input as string[]).map((v) => ({ value: v, label: v }));
  }

  // ToggleChips option shape: { value, label }
  if (Array.isArray(input) && typeof input[0] === "object") {
    return (input as any[]).map((x) => ({
      value: String(x.value ?? x.id ?? x.key ?? x),
      label: String(x.label ?? x.name ?? x.value ?? x),
    }));
  }

  return [];
}

function SelectField(props: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  hint?: string;
  disabled?: boolean;
}) {
  const id = props.id ?? `select-${props.label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-xs font-medium text-slate-200 md:text-sm"
      >
        {props.label}
      </label>

      <select
        id={id}
        value={props.value}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.value)}
        className={[
          "w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none",
          "ring-emerald-500/40 focus:ring md:text-sm",
          props.disabled ? "opacity-70" : "",
        ].join(" ")}
      >
        {props.options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-black">
            {opt.label}
          </option>
        ))}
      </select>

      {!!props.hint && <p className="text-[10px] text-slate-400">{props.hint}</p>}
    </div>
  );
}

function nextSeqForPrefix(items: ContentItem[], prefix: "TR" | "LR" | "AC") {
  let max = 0;
  for (const x of items) {
    const id = x.contentId?.toUpperCase();
    if (!id?.startsWith(prefix)) continue;
    const seq = parseContentSequence(id);
    if (seq && seq > max) max = seq;
  }
  return max + 1;
}

const AddContentSlideOver: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  initialItem,
  existingItems,
}) => {
  const isEdit = !!initialItem;

  const purposeOptions = React.useMemo(() => toSelectOptions(PURPOSE_OPTIONS), []);
  const typeOptions = React.useMemo(() => toSelectOptions(TYPE_OPTIONS), []);
  const categoryOptions = React.useMemo(() => toSelectOptions(CATEGORY_OPTIONS), []);
  const accessOptions = React.useMemo(() => toSelectOptions(ACCESS_OPTIONS), []);
  const statusOptions = React.useMemo(() => toSelectOptions(STATUS_OPTIONS), []);
  const sourceTypeOptions = React.useMemo(() => toSelectOptions(SOURCE_TYPE_OPTIONS), []);
  const thumbSourceOptions = React.useMemo(() => toSelectOptions(THUMBNAIL_SOURCE_OPTIONS), []);
  const countryOptions = React.useMemo(() => toSelectOptions(COUNTRIES), []);
  const languageOptions = React.useMemo(() => toSelectOptions(LANGUAGES), []);

  const [contentId, setContentId] = React.useState("");

  const [title, setTitle] = React.useState("");
  const [groupKey, setGroupKey] = React.useState("");

  const [thumbnailUrl, setThumbnailUrl] = React.useState("");
  const [thumbnailSourceType, setThumbnailSourceType] =
    React.useState<ThumbnailSourceType>("url");
  const [thumbnailFileName, setThumbnailFileName] = React.useState("");

  const [month, setMonth] = React.useState("1");
  const [week, setWeek] = React.useState("1");
  const [positionInWeek, setPositionInWeek] = React.useState("1");

  const [type, setType] = React.useState<ContentType>("Video");
  const [category, setCategory] = React.useState<ContentCategory>("Tactic");
  const [purpose, setPurpose] = React.useState<ContentPurpose>("train_content");

  const [access, setAccess] = React.useState<ContentAccess>("Pro");
  const [status, setStatus] = React.useState<ContentStatus>("published");
  const [publishAt, setPublishAt] = React.useState("");

  const [country, setCountry] = React.useState<string>("USA");
  const [language, setLanguage] = React.useState<string>("EN");

  const [isFreeForRegistered, setIsFreeForRegistered] = React.useState(false);
  const [isAcademyFreeForRegistered, setIsAcademyFreeForRegistered] =
    React.useState(false);
  const [isFreeForEveryone, setIsFreeForEveryone] = React.useState(false);

  const [sourceType, setSourceType] = React.useState<ContentSourceType>("link");
  const [sourceUrl, setSourceUrl] = React.useState("");
  const [fileName, setFileName] = React.useState("");

  const [tagsInput, setTagsInput] = React.useState("");

  const resetForm = () => {
    setContentId("");

    setTitle("");
    setGroupKey("");

    setThumbnailUrl("");
    setThumbnailSourceType("url");
    setThumbnailFileName("");

    setMonth("1");
    setWeek("1");
    setPositionInWeek("1");

    setType("Video");
    setCategory("Tactic");
    setPurpose("train_content");

    setAccess("Pro");
    setStatus("published");
    setPublishAt("");

    setCountry("USA");
    setLanguage("EN");

    setIsFreeForRegistered(false);
    setIsAcademyFreeForRegistered(false);
    setIsFreeForEveryone(false);

    setSourceType("link");
    setSourceUrl("");
    setFileName("");

    setTagsInput("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const generateContentId = React.useCallback(
    (p: ContentPurpose) => {
      const prefix = prefixFromPurpose(p);
      const seq = nextSeqForPrefix(existingItems, prefix);
      return formatContentId(prefix, seq);
    },
    [existingItems]
  );

  // Prefill on edit / initial open
  React.useEffect(() => {
    if (!isOpen) return;

    if (initialItem) {
      setContentId(initialItem.contentId ?? "");
      setTitle(initialItem.title ?? "");
      setGroupKey(initialItem.groupKey ?? "");

      setThumbnailUrl(initialItem.thumbnailUrl ?? "");
      setThumbnailSourceType(initialItem.thumbnailSourceType ?? "url");
      setThumbnailFileName(initialItem.thumbnailFileName ?? "");

      setMonth(String(initialItem.month ?? 1));
      setWeek(String(initialItem.week ?? 1));
      setPositionInWeek(String(initialItem.positionInWeek ?? 1));

      setType(initialItem.type ?? "Video");
      setCategory(initialItem.category ?? "Tactic");
      setPurpose(initialItem.purpose ?? "train_content");

      setAccess(initialItem.access ?? "Pro");
      setStatus(initialItem.status ?? "published");
      setPublishAt(initialItem.publishAt ?? "");

      setCountry(initialItem.country ?? "USA");
      setLanguage(initialItem.language ?? "EN");

      setIsFreeForRegistered(!!initialItem.isFreeForRegistered);
      setIsAcademyFreeForRegistered(!!initialItem.isAcademyFreeForRegistered);
      setIsFreeForEveryone(!!initialItem.isFreeForEveryone);

      setSourceType(initialItem.sourceType ?? "link");
      setSourceUrl(initialItem.sourceUrl ?? "");
      setFileName(initialItem.fileName ?? "");

      setTagsInput((initialItem.tags ?? []).join(", "));
    } else {
      resetForm();
      setContentId(generateContentId("train_content"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialItem?.id]);

  // Auto-regenerate contentId in create mode when PURPOSE changes
  React.useEffect(() => {
    if (!isOpen) return;
    if (isEdit) return;

    const id = generateContentId(purpose);
    setContentId(id);
  }, [purpose, isEdit, isOpen, generateContentId]);

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
  };

  const handleThumbPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFileName(file.name);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    if (!contentId.trim()) return;
    if (status === "scheduled" && !publishAt) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Omit<ContentItem, "id"> = {
      contentId: contentId.trim(),
      groupKey: groupKey.trim() || undefined,
      title: title.trim(),

      thumbnailUrl: thumbnailUrl.trim() || "/images/content/placeholder.jpg",
      thumbnailSourceType,
      thumbnailFileName:
        thumbnailSourceType === "file" ? thumbnailFileName || undefined : undefined,

      type,
      category,
      purpose,

      month: Number(month) || 1,
      week: Number(week) || 1,
      positionInWeek: Number(positionInWeek) || 1,

      access,
      isFreeForRegistered,
      isAcademyFreeForRegistered,
      isFreeForEveryone,

      country,
      language,

      status,
      publishAt: status === "scheduled" ? publishAt : undefined,

      tags,

      sourceType,
      sourceUrl: sourceType === "link" ? sourceUrl.trim() || undefined : undefined,
      fileName: sourceType === "file" ? fileName || undefined : undefined,

      isDeletable: true,
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
          !contentId.trim() ||
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
      description="Create or update content for the app."
      contentClassName="no-scrollbar"
      footer={footer}
    >
      <div className="space-y-4">
        <TextField
          label="Content ID"
          value={contentId}
          onChange={() => undefined}
          hint="Auto-generated from Purpose (TR/LR/AC). Backend should validate uniqueness."
          disabled
        />

        <TextField
          label="Title"
          placeholder="Enter content title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Group Key (for language versions)"
          placeholder="e.g. tactics_month2_week1_videoA"
          value={groupKey}
          onChange={(e) => setGroupKey(e.target.value)}
          hint="Use the same Group Key to link multiple language versions of the same content."
        />

        {/* Purpose + Type + Category */}
        <div className="grid gap-4 md:grid-cols-3">
          <SelectField
            label="Purpose"
            value={purpose}
            options={purposeOptions}
            onChange={(v) => setPurpose(v as ContentPurpose)}
          />
          <SelectField
            label="Type"
            value={type}
            options={typeOptions}
            onChange={(v) => setType(v as ContentType)}
          />
          <SelectField
            label="Category"
            value={category}
            options={categoryOptions}
            onChange={(v) => setCategory(v as ContentCategory)}
          />
        </div>

        {/* Thumbnail */}
        <div className="rounded-xl border border-white/5 bg-white/5 p-3">
          <div className="text-xs font-medium text-slate-200 md:text-sm">
            Thumbnail
          </div>

          <div className="mt-3">
            <SelectField
              label="Thumbnail Source"
              value={thumbnailSourceType}
              options={thumbSourceOptions}
              onChange={(v) => setThumbnailSourceType(v as ThumbnailSourceType)}
            />
          </div>

          {thumbnailSourceType === "url" ? (
            <div className="mt-3">
              <TextField
                label="Thumbnail URL"
                placeholder="https://…"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                hint="Optional. If empty, placeholder will be used."
              />
            </div>
          ) : (
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-200 md:text-sm">
                Upload Thumbnail
              </label>
              <input
                type="file"
                className="mt-2 w-full text-xs text-slate-300"
                onChange={handleThumbPick}
              />
              {thumbnailFileName && (
                <div className="mt-2 text-[11px] text-emerald-200">
                  Selected: {thumbnailFileName}
                </div>
              )}
              <p className="mt-1 text-[10px] text-slate-400">
                For now we store file name in UI. Backend upload can be added later.
              </p>
            </div>
          )}
        </div>

        {/* Country + Language */}
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Country"
            value={country}
            options={countryOptions}
            onChange={setCountry}
          />
          <SelectField
            label="Language"
            value={language}
            options={languageOptions}
            onChange={setLanguage}
          />
        </div>

        {/* Access + Free flags */}
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Access"
            value={access}
            options={accessOptions}
            onChange={(v) => setAccess(v as ContentAccess)}
          />

          <div className="space-y-2 rounded-xl border border-white/5 bg-white/5 p-3">
            <label className="flex items-center gap-2 text-xs text-slate-200">
              <input
                type="checkbox"
                checked={isFreeForEveryone}
                onChange={(e) => setIsFreeForEveryone(e.target.checked)}
              />
              Free for everyone (onboarding)
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-200">
              <input
                type="checkbox"
                checked={isFreeForRegistered}
                onChange={(e) => setIsFreeForRegistered(e.target.checked)}
              />
              Free for registered users
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-200">
              <input
                type="checkbox"
                checked={isAcademyFreeForRegistered}
                onChange={(e) => setIsAcademyFreeForRegistered(e.target.checked)}
              />
              Free for registered (Academy)
            </label>

            <p className="text-[10px] text-slate-400">
              “Free for everyone” is typically Month 1 / Week 1 to reduce friction.
            </p>
          </div>
        </div>

        {/* Month + Week + Position */}
        <div className="grid gap-4 md:grid-cols-3">
          <TextField
            label="Month (1-48)"
            type="number"
            min={1}
            max={48}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <TextField
            label="Week (1-12)"
            type="number"
            min={1}
            max={12}
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          />
          <TextField
            label="Position"
            type="number"
            min={1}
            value={positionInWeek}
            onChange={(e) => setPositionInWeek(e.target.value)}
            hint="Within week ordering"
          />
        </div>

        {/* Status + Schedule */}
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Status"
            value={status}
            options={statusOptions}
            onChange={(v) => setStatus(v as ContentStatus)}
          />

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
              Publish date only required when Scheduled.
            </div>
          )}
        </div>

        {/* Source type */}
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField
            label="Upload Type"
            value={sourceType}
            options={sourceTypeOptions}
            onChange={(v) => setSourceType(v as ContentSourceType)}
          />

          {/* Keep the right side visually aligned */}
          <div className="hidden md:block" />
        </div>

        {sourceType === "link" && (
          <TextField
            label={type === "Survey" ? "Survey Link" : "Content Link"}
            placeholder="https://…"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
          />
        )}

        {sourceType === "file" && (
          <div className="rounded-xl border border-white/5 bg-white/5 p-3">
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Upload File
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
              For now we store file name in UI. Backend upload will be added later.
            </p>
          </div>
        )}

        <TextField
          label="Tags"
          placeholder="comma separated…"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          hint="Separate tags with commas."
        />
      </div>
    </SlideOver>
  );
};

export default AddContentSlideOver;
