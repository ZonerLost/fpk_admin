import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import Button from "../../shared/inputs/Button";
import { cn } from "../../shared/utils/cn";
import type { ContentItem } from "./types";
import ContentTable from "./ContentTable";

type Props = {
  title: string;
  items: ContentItem[];
  defaultOpen?: boolean;
  onEdit: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
  className?: string;
};

const ContentGroupSection: React.FC<Props> = ({
  title,
  items,
  defaultOpen = true,
  onEdit,
  onDelete,
  className,
}) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <SectionCard
      title={title}
      className={cn("min-w-0", className)}
      trailing={
        <Button
          variant="secondary"
          className="h-8 px-3 text-[11px]"
          onClick={() => setOpen((s) => !s)}
        >
          {open ? "Collapse" : "Expand"}
        </Button>
      }
      contentClassName={open ? "pt-3" : "hidden"}
    >
      <ContentTable items={items} onEdit={onEdit} onDelete={onDelete} />
    </SectionCard>
  );
};

export default ContentGroupSection;
