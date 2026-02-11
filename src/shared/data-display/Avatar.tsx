import React from "react";
import { cn } from "../utils/cn";

type AvatarVariant = "circle" | "rounded";
type AvatarSize = number | "sm" | "md" | "lg";

type AvatarProps = {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  className?: string;
};

const sizeMap: Record<Exclude<AvatarSize, number>, number> = {
  sm: 32,
  md: 40,
  lg: 48,
};

function resolveSize(size: AvatarSize | undefined) {
  if (typeof size === "number" && Number.isFinite(size) && size > 0) {
    return size;
  }
  if (size && typeof size !== "number") return sizeMap[size];
  return 40;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 40,
  variant = "circle",
  className,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const resolvedSize = resolveSize(size);

  React.useEffect(() => {
    setImgError(false);
  }, [src]);

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

  const showImage = Boolean(src) && !imgError;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full ring-1 ring-white/10 bg-white/5",
        variant === "rounded" && "rounded-xl",
        className
      )}
      style={{
        width: resolvedSize,
        height: resolvedSize,
        minWidth: resolvedSize,
        minHeight: resolvedSize,
      }}
    >
      {showImage ? (
        <img
          src={src ?? undefined}
          alt={name}
          className="block h-full w-full object-cover object-center"
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-100">
          {initials}
        </span>
      )}
    </div>
  );
};

export default Avatar;
