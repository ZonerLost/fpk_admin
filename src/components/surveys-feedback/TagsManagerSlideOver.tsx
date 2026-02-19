import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import Button from "../../shared/inputs/Button";
import TextField from "../../shared/inputs/TextField";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  onCreate: (name: string) => void;
  onDelete: (name: string) => void;
};

const TagsManagerSlideOver: React.FC<Props> = ({
  isOpen,
  onClose,
  tags,
  onCreate,
  onDelete,
}) => {
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    setName("");
    setError(null);
  }, [isOpen]);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return setError("Tag name is required.");
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      return setError("Tag already exists.");
    }
    onCreate(trimmed);
    setName("");
    setError(null);
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Tags"
      description="Create tags and organize Ask-a-Question submissions."
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold text-slate-200">Create a tag</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex-1">
              <TextField
                label="Tag name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Training, Equipment, General…"
                className="h-10"
                error={error || undefined}
              />
            </div>
            <Button
              variant="primary"
              className="h-10 rounded-full bg-emerald-500 px-4 text-sm font-semibold text-black hover:bg-emerald-400"
              onClick={handleCreate}
            >
              Add Tag
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold text-slate-200">Existing tags</p>

          {tags.length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">No tags yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/25 px-3 py-2"
                >
                  <span className="text-sm text-slate-100">{tag}</span>
                  <Button
                    variant="secondary"
                    className="h-9 rounded-full border border-red-400/30 bg-transparent px-3 text-xs font-semibold text-red-200 hover:bg-red-500/10"
                    onClick={() => onDelete(tag)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SlideOver>
  );
};

export default TagsManagerSlideOver;
