import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import ActivityItem from "../../shared/data-display/ActivityItem";
import {
  FiUserPlus,
  FiCreditCard,
  FiMessageCircle,
  FiUpload,
} from "react-icons/fi";
import { cn } from "../../shared/utils/cn";

type ActivityFeedCardProps = {
  className?: string;
};

const ActivityFeedCard: React.FC<ActivityFeedCardProps> = ({
  className,
}) => {
  const items = [
    {
      icon: <FiUserPlus />,
      title: "New Registration: Alex Taylor",
      description: "Signed up for a free account.",
      timeAgo: "5 mins ago",
      tone: "success" as const,
    },
    {
      icon: <FiUserPlus />,
      title: "New Subscription: Jane Doe",
      description: "Upgraded to the Pro plan.",
      timeAgo: "1 hour ago",
      tone: "success" as const,
    },
    {
      icon: <FiCreditCard />,
      title: "Failed Payment: Mike Ross",
      description: "Payment for monthly subscription failed.",
      timeAgo: "3 hours ago",
      tone: "danger" as const,
    },
    {
      icon: <FiMessageCircle />,
      title: "New Message from Sara Lee",
      description: '"Having trouble with the latest drills"',
      timeAgo: "Yesterday",
      tone: "info" as const,
    },
    {
      icon: <FiUpload />,
      title: "New Video Uploaded",
      description: '"Advanced Dribbling Techniques" is now live.',
      timeAgo: "2 days ago",
      tone: "success" as const,
    },
  ];

  return (
    <SectionCard
      title="Activity Feed"
      className={cn("min-w-0", className)}
      contentClassName="space-y-3"
    >
      {items.map((item, idx) => (
        <ActivityItem
          key={idx}
          icon={item.icon}
          title={item.title}
          description={item.description}
          timeAgo={item.timeAgo}
          tone={item.tone}
        />
      ))}
    </SectionCard>
  );
};

export default ActivityFeedCard;
