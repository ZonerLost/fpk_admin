import React from "react";
import { cn } from "../utils/cn";

type AvatarVariant = "circle" | "rounded";

type AvatarProps = {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  variant?: AvatarVariant;
  className?: string;
};

const sizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  variant = "circle",
  className,
}) => {
  const initials =
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "?";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center bg-slate-700 text-xs font-semibold text-white",
        sizeClasses[size],
        variant === "circle" ? "rounded-full" : "rounded-xl",
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            "h-full w-full object-cover",
            variant === "circle" ? "rounded-full" : "rounded-xl"
          )}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
