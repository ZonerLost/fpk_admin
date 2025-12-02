import React from "react";
import { cn } from "../utils/cn";

export type KeyValue = {
  label: string;
  value: React.ReactNode;
};

type KeyValueListProps = {
  items: KeyValue[];
  dense?: boolean;
  className?: string;
};

const KeyValueList: React.FC<KeyValueListProps> = ({
  items,
  dense,
  className,
}) => {
  return (
    <dl className={cn("space-y-2 text-xs md:text-sm", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "flex items-baseline justify-between gap-3 border-b border-white/5 pb-2 last:border-b-0 last:pb-0",
            dense && "pb-1"
          )}
        >
          <dt className="text-slate-400">{item.label}</dt>
          <dd className="text-right font-medium text-slate-100">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default KeyValueList;
