import React from "react";
import DonutCard from "../../shared/charts/DonutCard";
import { cn } from "../../shared/utils/cn";

type ContentConsumptionCardProps = {
  className?: string;
};

const ContentConsumptionCard: React.FC<ContentConsumptionCardProps> = ({
  className,
}) => {
  return (
    <DonutCard
      title="Content Consumption"
      percentage={89}
      centerLabel="Watched"
      legend={[
        { label: "Tutorials" },
        { label: "Live" },
        { label: "Matches" },
        { label: "Drills" },
      ]}
      className={cn(className)}
    />
  );
};

export default ContentConsumptionCard;
