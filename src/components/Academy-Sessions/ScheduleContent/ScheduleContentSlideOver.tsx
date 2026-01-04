/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import SlideOver from "../../../shared/overlay/SlideOver";
import TextField from "../../../shared/inputs/TextField";
import Button from "../../../shared/inputs/Button";
import { COUNTRY_CATALOG, getTimeZoneForCountry } from "../../../shared/constants/locale";
import type { AcademyContentItem, AccessLevel, RecordingBucket } from "../types/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: Omit<AcademyContentItem, "id">) => void;
};

const ACCESS: AccessLevel[] = ["Pro", "All"];
const BUCKETS: RecordingBucket[] = ["currentWeek", "past"];

const firstCountry = COUNTRY_CATALOG[0]?.country ?? "Germany";
const firstLang = COUNTRY_CATALOG[0]?.languages?.[0] ?? "EN";

const ScheduleContentSlideOver: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  // Locale FIRST (requested)
  const [country, setCountry] = React.useState(firstCountry);
  const [language, setLanguage] = React.useState(String(firstLang));

  // Required IDs
  const [contentId, setContentId] = React.useState("");

  // Release (LOCAL)
  const [releaseDate, setReleaseDate] = React.useState("");
  const [releaseTime, setReleaseTime] = React.useState("");

  // Week/pos
  const [week, setWeek] = React.useState("1");
  const [position, setPosition] = React.useState("1");

  // Content meta
  const [title, setTitle] = React.useState("");
  const [displayTitle, setDisplayTitle] = React.useState("");
  const [host, setHost] = React.useState("");

  const [access, setAccess] = React.useState<AccessLevel>("Pro");
  const [freeForRegistered, setFreeForRegistered] = React.useState(false);

  const [bucket, setBucket] = React.useState<RecordingBucket>("currentWeek");

  const [thumbnailUrl, setThumbnailUrl] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [tags, setTags] = React.useState("");

  const tz = getTimeZoneForCountry(country);

  // Keep language options synced to country
  const countryConfig = COUNTRY_CATALOG.find((c) => c.country === country);
  const languageOptions = countryConfig?.languages?.length
    ? countryConfig.languages.map(String)
    : ["EN"];

  React.useEffect(() => {
    if (!languageOptions.includes(language)) {
      setLanguage(languageOptions[0] ?? "EN");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  React.useEffect(() => {
    if (access !== "Pro") setFreeForRegistered(false);
  }, [access]);

  const reset = () => {
    setCountry(firstCountry);
    setLanguage(String(firstLang));
    setContentId("");
    setReleaseDate("");
    setReleaseTime("");
    setWeek("1");
    setPosition("1");
    setTitle("");
    setDisplayTitle("");
    setHost("");
    setAccess("Pro");
    setFreeForRegistered(false);
    setBucket("currentWeek");
    setThumbnailUrl("");
    setDuration("");
    setDescription("");
    setTags("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const canSave =
    contentId.trim() &&
    title.trim() &&
    host.trim() &&
    releaseDate &&
    releaseTime &&
    Number(week) > 0 &&
    Number(position) > 0;

  const handleSubmit = () => {
    if (!canSave) return;

    onCreate({
      contentId: contentId.trim(),
      title: title.trim(),
      displayTitle: displayTitle.trim() || undefined,
      host: host.trim(),

      releaseDate,
      releaseTime,

      week: Number(week) || 1,
      position: Number(position) || 1,

      country,
      language,

      bucket,
      access,

      freeForRegistered: access === "Pro" ? freeForRegistered : false,

      thumbnailUrl: thumbnailUrl.trim() || undefined,
      duration: duration.trim() || undefined,
      description: description.trim() || undefined,
      tags: tags.trim()
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
    });

    reset();
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={handleClose}
      title="Schedule Weekly Content"
      description={`Release time is LOCAL for the selected country (${tz}). If you set 16:00, it releases at 16:00 in that country.`}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!canSave}>
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Locale first */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              {COUNTRY_CATALOG.map((c) => (
                <option key={c.id} value={c.country} className="bg-black">
                  {c.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              {languageOptions.map((l) => (
                <option key={l} value={l} className="bg-black">
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content ID */}
        <TextField
          label="Content ID"
          placeholder="e.g. W04-DE-EN-01"
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
          hint="Shown in admin and can be used to reference this item in support/logs."
        />

        {/* Release (Local) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Release Date (Local)"
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
          <TextField
            label="Release Time (Local)"
            type="time"
            value={releaseTime}
            onChange={(e) => setReleaseTime(e.target.value)}
            hint={`Local timezone: ${tz}`}
          />
        </div>

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
            hint="Order within the week for this country/language."
          />
        </div>

        <TextField
          label="Internal Title"
          placeholder="Passing Technique"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Display Title (localized)"
          placeholder='e.g. "How to improve your passing skills"'
          value={displayTitle}
          onChange={(e) => setDisplayTitle(e.target.value)}
          hint="Optional override shown to end users for this country/language."
        />

        <TextField
          label="Host"
          placeholder="Coach name"
          value={host}
          onChange={(e) => setHost(e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">Bucket</label>
            <select
              value={bucket}
              onChange={(e) => setBucket(e.target.value as any)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              {BUCKETS.map((b) => (
                <option key={b} value={b} className="bg-black">
                  {b === "currentWeek" ? "Current Week" : "Past Weeks"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">Access</label>
            <select
              value={access}
              onChange={(e) => setAccess(e.target.value as any)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-100 outline-none ring-emerald-500/40 focus:ring md:text-sm"
            >
              {ACCESS.map((a) => (
                <option key={a} value={a} className="bg-black">
                  {a}
                </option>
              ))}
            </select>

            {access === "Pro" && (
              <label className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={freeForRegistered}
                  onChange={(e) => setFreeForRegistered(e.target.checked)}
                  className="h-4 w-4 rounded border border-white/20 bg-black/40"
                />
                <span>
                  Free for Registered users (only one per week for this country/language)
                </span>
              </label>
            )}
          </div>
        </div>

        <TextField
          label="Thumbnail URL"
          placeholder="https://…"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          hint="Optional. If empty, a gradient placeholder will be used."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Duration"
            placeholder="45 mins"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <TextField
            label="Tags (comma-separated)"
            placeholder="Technique, Passing"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <TextField
          label="Short Description"
          placeholder="Add a short description for this weekly release…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </SlideOver>
  );
};

export default ScheduleContentSlideOver;
