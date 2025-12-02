import React from "react";

export type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
      <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-500/40 bg-[#031610] p-5 shadow-2xl shadow-emerald-900/30">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-50">
            {title}
          </h3>
          {description ? (
            <p className="text-sm text-slate-200">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-emerald-500/30 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-red-400"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
