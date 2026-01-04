import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import TextField from "../../shared/inputs/TextField";
import ToggleChips, { type ToggleOption } from "../../shared/inputs/ToggleChips";
import Button from "../../shared/inputs/Button";

import type { RecordingItem, AccessLevel, RecordingBucket } from "./types/types";
import { ACADEMY_COUNTRIES, ACADEMY_LANGUAGES } from "./academy.constants";
import { inferTimezone, nextAcademyContentId } from "./utils/academy.utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;

  existingContentIds: string[];
  existingItems: RecordingItem[];

  onCreate: (payload: Omit<RecordingItem, "id">) => void;
};

const accessOptions: ToggleOption[] = [
  { value: "All", label: "All" },
  { value: "Registered", label: "Registered" },
  { value: "Pro", label: "Pro" },
];

const bucketOptions: ToggleOption[] = [
  { value: "currentWeek", label: "Current Week" },
  { value: "past", label: "Past Weeks" },
];

const AddAcademyContentSlideOver: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreate,
  existingContentIds,
  existingItems,
}) => {
  const [contentId, setContentId] = React.useState("");
  const [country, setCountry] = React.useState("Germany");
  const [language, setLanguage] = React.useState("EN");

  const [title, setTitle] = React.useState("");
  const [displayTitle, setDisplayTitle] = React.useState("");

  const [week, setWeek] = React.useState("1");
  const [position, setPosition] = React.useState("1");

  const [access, setAccess] = React.useState<AccessLevel>("All");
  const [isFreeForRegistered, setIsFreeForRegistered] = React.useState(false);

  const [releaseDate, setReleaseDate] = React.useState("");
  const [releaseTime, setReleaseTime] = React.useState("");

  const [bucket, setBucket] = React.useState<RecordingBucket>("currentWeek");

  const [thumbnailUrl, setThumbnailUrl] = React.useState("");
  const [description, setDescription] = React.useState("");

  const timezone = React.useMemo(() => inferTimezone(country), [country]);

  React.useEffect(() => {
    if (!isOpen) return;
    // auto-generate on open
    setContentId(nextAcademyContentId(existingContentIds, "AC"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const reset = () => {
    setContentId(nextAcademyContentId(existingContentIds, "AC"));
    setCountry("Germany");
    setLanguage("EN");
    setTitle("");
    setDisplayTitle("");
    setWeek("1");
    setPosition("1");
    setAccess("All");
    setIsFreeForRegistered(false);
    setReleaseDate("");
    setReleaseTime("");
    setBucket("currentWeek");
    setThumbnailUrl("");
    setDescription("");
  };

  const hasFreeConflict = React.useMemo(() => {
    if (!isFreeForRegistered) return false;
    const w = Number(week) || 1;
    return existingItems.some(
      (x) =>
        x.week === w &&
        x.isFreeForRegistered &&
        x.bucket === "currentWeek" // only enforce on current week list
    );
  }, [existingItems, isFreeForRegistered, week]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    if (!releaseDate || !releaseTime) return;
    if (hasFreeConflict) return;

    onCreate({
      contentId: contentId.trim(),
      country,
      language,

      title: title.trim(),
      displayTitle: displayTitle.trim() || undefined,

      week: Number(week) || 1,
      position: Number(position) || 1,

      access,
      isFreeForRegistered,

      releaseDate,
      releaseTime,
      timezone,

      bucket,

      thumbnailUrl: thumbnailUrl.trim() || undefined,
      description: description.trim() || undefined,

      // demo defaults
      tags: [],
      views: "0",
      duration: "—",
      host: "—",
    });

    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Academy Content"
      description="Create a weekly recording release (no live events). Release time is local to the selected country."
      contentClassName="no-scrollbar"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!title.trim() || !releaseDate || !releaseTime || hasFreeConflict}
          >
            Save Content
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Country + Language FIRST */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              {ACADEMY_COUNTRIES.map((c) => (
                <option key={c} value={c} className="bg-black">
                  {c}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-slate-400">
              Timezone: <span className="text-slate-200">{timezone}</span>
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              {ACADEMY_LANGUAGES.map((l) => (
                <option key={l} value={l} className="bg-black">
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TextField
          label="Content ID"
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
          hint="Auto-generated (AC00001…). Backend should own this long-term."
        />

        <TextField
          label="Internal Title"
          placeholder="Passing Technique"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Display Title (optional)"
          placeholder="How to improve your passing skills"
          value={displayTitle}
          onChange={(e) => setDisplayTitle(e.target.value)}
          hint="Localized title shown to users for this country/language."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Week"
            type="number"
            min={1}
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          />
          <TextField
            label="Position"
            type="number"
            min={1}
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            hint="Position inside week (#1, #2, …)"
          />
        </div>

        {/* Access */}
        <div>
          <label className="text-xs font-medium text-slate-200 md:text-sm">
            Access
          </label>
          <div className="mt-2">
            <ToggleChips
              options={accessOptions}
              value={access}
              onChange={(v) => setAccess(v as AccessLevel)}
            />
          </div>
        </div>

        {/* Free for registered */}
        <div className="rounded-xl border border-white/5 bg-white/5 p-3">
          <label className="flex items-center gap-2 text-xs text-slate-200">
            <input
              type="checkbox"
              checked={isFreeForRegistered}
              onChange={(e) => setIsFreeForRegistered(e.target.checked)}
            />
            Free for Registered (weekly slot)
          </label>
          {hasFreeConflict && (
            <p className="mt-2 text-[11px] text-amber-200">
              There is already a “Free for Registered” item for Week {week}. Only
              one is allowed per week.
            </p>
          )}
        </div>

        {/* Release date/time (LOCAL) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Release Date (local)"
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
          <TextField
            label="Release Time (local)"
            type="time"
            value={releaseTime}
            onChange={(e) => setReleaseTime(e.target.value)}
            hint={`Released at this time in ${country} (${timezone}).`}
          />
        </div>

        {/* List placement */}
        <div>
          <label className="text-xs font-medium text-slate-200 md:text-sm">
            List Placement
          </label>
          <div className="mt-2">
            <ToggleChips
              options={bucketOptions}
              value={bucket}
              onChange={(v) => setBucket(v as RecordingBucket)}
            />
          </div>
        </div>

        <TextField
          label="Thumbnail URL (optional)"
          placeholder="https://…"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
        />

        <TextField
          label="Short Description (optional)"
          placeholder="Add a short description…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </SlideOver>
  );
};

export default AddAcademyContentSlideOver;
