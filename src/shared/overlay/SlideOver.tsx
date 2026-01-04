import React from "react";
import { cn } from "../utils/cn";

type SlideOverProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: "right" | "left";
  widthClassName?: string; // override width if needed
  contentClassName?: string; // custom classes for scrollable body
};

const SlideOver: React.FC<SlideOverProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  position = "right",
  widthClassName,
  contentClassName,
}) => {
  // Lock background scroll while the slide-over is open
  React.useEffect(() => {
    if (!isOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/70"
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          "flex h-full w-full max-w-3xl flex-col bg-[#111212] text-slate-100 shadow-2xl transition-transform duration-200",
          position === "right"
            ? "ml-auto translate-x-0"
            : "mr-auto translate-x-0",
          widthClassName ?? "md:max-w-2xl"
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="border-b border-white/10 px-5 py-4">
            {title && (
              <h2 className="text-lg font-semibold text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-xs text-slate-400 md:text-sm">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Body */}
        <div className={cn("flex-1 overflow-y-auto px-5 py-4", contentClassName)}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-white/10 px-5 py-3">
            <div className="flex flex-col gap-2 md:flex-row md:justify-end">
              {footer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideOver;
