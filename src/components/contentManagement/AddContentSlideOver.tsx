import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import TextField from "../../shared/inputs/TextField";
import ToggleChips, {
  type ToggleOption,
} from "../../shared/inputs/ToggleChips";
import Button from "../../shared/inputs/Button";
import type { ContentItem, ContentType, ContentStatus } from "./types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: Omit<ContentItem, "id">) => void;
};

const typeOptions: ToggleOption[] = [
  { value: "Train", label: "Train" },
  { value: "Learn", label: "Learn" },
  { value: "Live", label: "Live" },
  { value: "Doc", label: "Doc" },
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

const AddContentSlideOver: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = React.useState("");
  const [thumbnailUrl, setThumbnailUrl] = React.useState("");
  const [week, setWeek] = React.useState("1");
  const [type, setType] = React.useState<ContentType>("Train");
  const [access, setAccess] =
    React.useState<ContentItem["access"]>("Pro");
  const [status, setStatus] =
    React.useState<ContentStatus>("published");
  const [tagsInput, setTagsInput] = React.useState("");

  const resetForm = () => {
    setTitle("");
    setThumbnailUrl("");
    setWeek("1");
    setType("Train");
    setAccess("Pro");
    setStatus("published");
    setTagsInput("");
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onCreate({
      title: title.trim(),
      thumbnailUrl:
        thumbnailUrl.trim() || "/images/content/placeholder.jpg",
      type,
      week: Number(week) || 1,
      access,
      tags,
      status,
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
      title="Add New Content"
      description="Create a new piece of content for the GDS sports app."
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!title.trim()}
          >
            Save Content
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <TextField
          label="Title"
          placeholder="Enter content title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Thumbnail URL"
          placeholder="https://…"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          hint="Optional. If empty, a placeholder will be used."
        />

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
              Access
            </label>
            <div className="mt-2">
              <ToggleChips
                options={accessOptions}
                value={access}
                onChange={(v) =>
                  setAccess(v as ContentItem["access"])
                }
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Week"
            type="number"
            min={1}
            value={week}
            onChange={(e) => setWeek(e.target.value)}
          />
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Status
            </label>
            <div className="mt-2">
              <ToggleChips
                options={statusOptions}
                value={status}
                onChange={(v) =>
                  setStatus(v as ContentStatus)
                }
              />
            </div>
          </div>
        </div>

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
