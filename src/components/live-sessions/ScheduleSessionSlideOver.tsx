import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import TextField from "../../shared/inputs/TextField";
import ToggleChips, {
  type ToggleOption,
} from "../../shared/inputs/ToggleChips";
import Button from "../../shared/inputs/Button";
import type { SessionItem } from "./types";

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
  const [host, setHost] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [sessionType, setSessionType] = React.useState("Live Training");
  const [thumbnailUrl, setThumbnailUrl] = React.useState("");
  const [description, setDescription] = React.useState("");

  const resetForm = () => {
    setTitle("");
    setHost("");
    setDate("");
    setTime("");
    setSessionType("Live Training");
    setThumbnailUrl("");
    setDescription("");
  };

  const handleSubmit = () => {
    if (!title.trim() || !host.trim() || !date || !time) return;

    onCreate({
      title: title.trim(),
      host: `${host.trim()} (${sessionType})`,
      date,
      time,
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
      description="Plan a new live training session for your academy."
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
          label="Session Title"
          placeholder="Dribbling Masterclass"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
              onChange={setSessionType}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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
