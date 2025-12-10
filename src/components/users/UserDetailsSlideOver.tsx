import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import Badge from "../../shared/data-display/Badge";
import Avatar from "../../shared/data-display/Avatar";
import Button from "../../shared/inputs/Button";
import TagPill from "../../shared/data-display/TagPill";
import type { UserItem } from "./types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: UserItem | null;
};

const UserDetailsSlideOver: React.FC<Props> = ({ isOpen, onClose, user }) => {
  if (!user) {
    return (
      <SlideOver
        isOpen={isOpen}
        onClose={onClose}
        title="User Details"
        description="No user selected."
        footer={
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        }
      >
        <div className="text-sm text-slate-300">Select a user to view details.</div>
      </SlideOver>
    );
  }

  const statusVariant = user.role === "Registered" ? "success" : "warning";
  const proLabel = user.proStatus === "None" ? "—" : user.proStatus;

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      description="Full view of user profile and subscription state."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3">
          <Avatar
            src={user.avatarUrl}
            name={user.name}
            size="lg"
            variant="circle"
          />
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-white">
              {user.name}
            </div>
            <div className="truncate text-xs text-slate-400">
              {user.email || user.phone || "N/A"}
            </div>
          </div>
        </div>

        {/* Key info grid */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-white/5 p-3">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              User ID
            </div>
            <div className="mt-1 text-sm font-medium text-slate-100">
              {user.userId}
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/5 p-3">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              Country
            </div>
            <div className="mt-1 text-sm font-medium text-slate-100">
              {user.country}
            </div>
            <div className="mt-1 text-[10px] text-slate-500">
              Preferably from App Store / Play Store country.
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/5 p-3">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              Status
            </div>
            <div className="mt-2">
              <Badge variant={statusVariant}>{user.role}</Badge>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/5 p-3">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              Pro
            </div>
            <div className="mt-2">
              <TagPill className="bg-black/20">{proLabel}</TagPill>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/5 p-3">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              XP Points
            </div>
            <div className="mt-1 text-sm font-medium text-slate-100">
              {user.xpPoints.toLocaleString()} XP
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/5 p-3">
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              Last Active
            </div>
            <div className="mt-1 text-sm font-medium text-slate-100">
              {user.lastActive}
            </div>
          </div>
        </div>
      </div>
    </SlideOver>
  );
};

export default UserDetailsSlideOver;
