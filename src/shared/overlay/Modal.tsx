import React from "react";
import { cn } from "../utils/cn";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

const sizeClass: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-xl",
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer,
  size = "md",
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          "w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#07130f] p-5 text-slate-100 shadow-2xl",
          "sm:p-6",
          sizeClass[size]
        )}
      >
        {(title || icon) && (
          <div className="mb-4 flex items-center gap-3">
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                {icon}
              </div>
            )}
            {title && (
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            )}
          </div>
        )}

        <div className="text-sm text-slate-100">{children}</div>

        {footer && (
          <div className="mt-5 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
