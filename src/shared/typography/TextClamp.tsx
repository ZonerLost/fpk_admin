import React from "react";
import { cn } from "../utils/cn";

type TextClampProps = {
  lines?: number;
  className?: string;
  children: React.ReactNode;
};

const TextClamp: React.FC<TextClampProps> = ({
  lines = 1,
  className,
  children,
}) => {
  return (
    <span
      className={cn("block min-w-0", className)}
      style={{
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: lines,
        overflow: "hidden",
        whiteSpace: "normal",
        overflowWrap: "anywhere",
      }}
    >
      {children}
    </span>
  );
};

export default TextClamp;
