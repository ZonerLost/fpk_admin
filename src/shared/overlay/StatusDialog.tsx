import React from "react";
import Modal from "./Modal";
import Button from "../inputs/Button";

export type StatusVariant = "success" | "error" | "warning";

type StatusDialogProps = {
  isOpen: boolean;
  variant: StatusVariant;
  title: string;
  message: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  onClose: () => void;
};

const variantIconMap: Record<StatusVariant, { symbol: string; color: string }> =
  {
    success: { symbol: "✔", color: "text-emerald-400" },
    error: { symbol: "!", color: "text-red-400" },
    warning: { symbol: "!", color: "text-amber-300" },
  };

const StatusDialog: React.FC<StatusDialogProps> = ({
  isOpen,
  variant,
  title,
  message,
  primaryAction,
  secondaryAction,
  onClose,
}) => {
  const iconCfg = variantIconMap[variant];
  const primaryVariant =
    variant === "error" ? "danger" : "primary";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={
        <span className={`${iconCfg.color} text-xl`}>
          {iconCfg.symbol}
        </span>
      }
      size="sm"
      footer={
        <>
          {secondaryAction && (
            <Button
              variant="secondary"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
          <Button
            variant={primaryVariant}
            onClick={
              primaryAction ? primaryAction.onClick : onClose
            }
          >
            {primaryAction?.label ?? "OK"}
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-200">{message}</p>
    </Modal>
  );
};

export default StatusDialog;
