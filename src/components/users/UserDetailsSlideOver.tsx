import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import Badge from "../../shared/data-display/Badge";
import Avatar from "../../shared/data-display/Avatar";
import Button from "../../shared/inputs/Button";
import type { SupportAction, UserItem } from "./types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: UserItem | null;

  onSupportAction: (userId: string, action: SupportAction) => Promise<void> | void;
};

function fmtDateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }).format(d);
}

function statusLabel(u: UserItem) {
  if (u.registrationStatus === "Unregistered") return "Unregistered";
  if (u.accountStatus === "Registered") return "Registered";
  if (u.accountStatus === "PRO_1M") return "PRO 1M";
  if (u.accountStatus === "PRO_6M") return "PRO 6M";
  return "PRO 12M";
}

function statusVariant(u: UserItem) {
  if (u.registrationStatus === "Unregistered") return "warning";
  if (u.accountStatus === "Registered") return "success";
  return "info";
}

const UserDetailsSlideOver: React.FC<Props> = ({ isOpen, onClose, user, onSupportAction }) => {
  if (!user) {
    return (
      <SlideOver
        isOpen={isOpen}
        onClose={onClose}
        title="User Details"
        description="No user selected."
        footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
      >
        <div className="text-sm text-slate-300">Select a user to view details.</div>
      </SlideOver>
    );
  }

  const ev = user.evidence ?? {};

  const run = async (action: SupportAction) => {
    await onSupportAction(user.id, action);
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      description="Support console view: account status, evidence, and actions."
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3">
          <Avatar src={user.avatarUrl} name={user.name} size="lg" variant="circle" />
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-white">{user.name}</div>
            <div className="truncate text-xs text-slate-400">{user.email || user.phone || "N/A"}</div>
            <div className="mt-2">
              <Badge variant={statusVariant(user)}>{statusLabel(user)}</Badge>
            </div>
          </div>
        </div>

        {/* Key info */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <InfoCard label="User ID" value={user.userId} />
          <InfoCard label="Country" value={user.country} />
          <InfoCard label="Language" value={user.language} />

          <InfoCard label="Joined Date" value={fmtDate(user.joinedAt)} />
          <InfoCard label="Registration status" value={user.registrationStatus} />
          <InfoCard label="Email verified" value={user.emailVerified ? "Yes" : "No"} />

          <InfoCard label="Plan status" value={user.planStatus} />
          <InfoCard label="Subscription state" value={user.subscriptionState} />
          <InfoCard label="XP Points" value={`${user.xpPoints.toLocaleString()} XP`} />

          <InfoCard label="Last Active" value={user.lastActiveLabel} />
        </div>

        {/* Support actions */}
        <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
          <div className="text-xs font-semibold text-slate-200">Support actions</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <ActionBtn onClick={() => run("resend_verification")}>Resend verification</ActionBtn>
            <ActionBtn onClick={() => run("reset_password")}>Reset password</ActionBtn>
            <ActionBtn onClick={() => run("sync_billing")}>Sync billing</ActionBtn>
            <ActionBtn onClick={() => run("grant_pro_timebound")}>Grant Pro (time-bound)</ActionBtn>
            <ActionBtn onClick={() => run("revoke_sessions")}>Revoke sessions</ActionBtn>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            These actions should call backend admin endpoints (never Braze/Stripe directly from frontend).
          </div>
        </div>

        {/* Evidence */}
        <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
          <div className="text-xs font-semibold text-slate-200">Evidence</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <InfoCard label="Last login" value={fmtDateTime(ev.lastLoginAt)} />
            <InfoCard label="Last active" value={fmtDateTime(ev.lastActiveAt)} />
            <InfoCard label="Last payment" value={fmtDateTime(ev.lastPaymentAt)} />
            <InfoCard label="Last error" value={fmtDateTime(ev.lastErrorAt)} />
            <InfoCard label="Audit logs" value={String(ev.auditLogCount ?? 0)} />
          </div>
        </div>

        {/* Membership history */}
        <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
          <div className="text-xs font-semibold text-slate-200">Membership history</div>
          <div className="mt-3 overflow-x-auto rounded-xl border border-white/5">
            <table className="min-w-full text-left text-[11px]">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-3 py-2">Plan</th>
                  <th className="px-3 py-2">State</th>
                  <th className="px-3 py-2">Start</th>
                  <th className="px-3 py-2">End</th>
                </tr>
              </thead>
              <tbody>
                {(user.membershipHistory ?? []).map((m) => (
                  <tr key={m.id} className="border-t border-white/5">
                    <td className="px-3 py-2 text-slate-100">{m.status.replace("_", " ")}</td>
                    <td className="px-3 py-2 text-slate-200">{m.subscriptionState}</td>
                    <td className="px-3 py-2 text-slate-200">{fmtDate(m.startedAt)}</td>
                    <td className="px-3 py-2 text-slate-400">{fmtDate(m.endedAt)}</td>
                  </tr>
                ))}
                {(user.membershipHistory ?? []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-slate-400">
                      No membership history
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment history */}
        <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
          <div className="text-xs font-semibold text-slate-200">Payment history</div>
          <div className="mt-3 overflow-x-auto rounded-xl border border-white/5">
            <table className="min-w-full text-left text-[11px]">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Paid at</th>
                  <th className="px-3 py-2">Ref</th>
                </tr>
              </thead>
              <tbody>
                {(user.paymentHistory ?? []).map((p) => (
                  <tr key={p.id} className="border-t border-white/5">
                    <td className="px-3 py-2 text-slate-100">
                      {p.amount.toFixed(2)} {p.currency}
                    </td>
                    <td className="px-3 py-2 text-slate-200">{p.status}</td>
                    <td className="px-3 py-2 text-slate-200">{fmtDateTime(p.paidAt)}</td>
                    <td className="px-3 py-2 text-slate-400">{p.providerRef ?? "—"}</td>
                  </tr>
                ))}
                {(user.paymentHistory ?? []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-slate-400">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SlideOver>
  );
};

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-3">
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-medium text-slate-100">{value || "—"}</div>
    </div>
  );
}

function ActionBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-slate-100 hover:bg-white/10"
    >
      {children}
    </button>
  );
}

export default UserDetailsSlideOver;
