import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import TextField from "../../shared/inputs/TextField";
import ToggleChips, { type ToggleOption } from "../../shared/inputs/ToggleChips";
import Button from "../../shared/inputs/Button";
import type { SessionItem, SessionType } from "./types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: Omit<SessionItem, "id">) => void;
};

const typeOptions: ToggleOption[] = [
  { value: "Live Training", label: "Live Training" },
  { value: "Q&A", label: "Q&A" },
  { value: "Webinar", label: "Webinar" },
];

const ScheduleSessionSlideOver: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = React.useState("");
  const [displayTitle, setDisplayTitle] = React.useState("");
  const [releaseLabel, setReleaseLabel] = React.useState("");

  const [host, setHost] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [sessionType, setSessionType] = React.useState<SessionType>("Live Training");

  const [week, setWeek] = React.useState("1");
  const [country, setCountry] = React.useState("Germany");
  const [language, setLanguage] = React.useState("EN");

  const [thumbnailUrl, setThumbnailUrl] = React.useState("");
  const [description, setDescription] = React.useState("");

  const resetForm = () => {
    setTitle("");
    setDisplayTitle("");
    setReleaseLabel("");
    setHost("");
    setDate("");
    setTime("");
    setSessionType("Live Training");
    setWeek("1");
    setCountry("Germany");
    setLanguage("EN");
    setThumbnailUrl("");
    setDescription("");
  };

  const handleSubmit = () => {
    if (!title.trim() || !host.trim() || !date || !time) return;

    onCreate({
      title: title.trim(),
      displayTitle: displayTitle.trim() || undefined,
      releaseLabel: releaseLabel.trim() || undefined,

      host: host.trim(),
      date,
      time,
      sessionType,

      week: Number(week) || 1,
      country: country.trim() || "Unknown",
      language: language.trim() || "EN",

      thumbnailUrl: thumbnailUrl.trim() || undefined,
      description: description.trim() || undefined,
    });

    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={handleClose}
      title="Schedule New Session"
      description="Plan a new live academy session localized by country and language."
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!title.trim() || !host.trim() || !date || !time}
          >
            Save Session
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <TextField
          label="Internal Title"
          placeholder="Dribbling Masterclass"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Display Title (localized)"
          placeholder='e.g., "How to improve your passing skills"'
          value={displayTitle}
          onChange={(e) => setDisplayTitle(e.target.value)}
          hint="Optional override shown to end users for this country/language."
        />

        <TextField
          label="Release Label (localized)"
          placeholder="Release Tuesday June 12, 6pm CET"
          value={releaseLabel}
          onChange={(e) => setReleaseLabel(e.target.value)}
          hint="Shown below the video (per country/language)."
        />

        <TextField
          label="Host"
          placeholder="John Doe"
          value={host}
          onChange={(e) => setHost(e.target.value)}
        />

        <div>
          <label className="text-xs font-medium text-slate-200 md:text-sm">
            Session Type
          </label>
          <div className="mt-2">
            <ToggleChips
              options={typeOptions}
              value={sessionType}
              onChange={(v) => setSessionType(v as SessionType)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <TextField
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <TextField
            label="Week"
            type="number"
            min={1}
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          />
          <TextField
            label="Country"
            placeholder="Germany"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <TextField
            label="Language"
            placeholder="EN"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>

        <TextField
          label="Thumbnail URL"
          placeholder="https://…"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          hint="Optional. If empty, a gradient placeholder will be used."
        />

        <TextField
          label="Short Description"
          placeholder="Add a short description for this session…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </SlideOver>
  );
};

export default ScheduleSessionSlideOver;
