import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import TextField from "../../shared/inputs/TextField";
import ToggleChips, { type ToggleOption } from "../../shared/inputs/ToggleChips";
import Button from "../../shared/inputs/Button";
import type { AccountStatus, RegistrationStatus, UserItem } from "./types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: UserItem | null;
  onUpdate: (id: string, updates: Partial<Omit<UserItem, "id">>) => void;
};

const registrationOptions: ToggleOption[] = [
  { value: "Registered", label: "Registered" },
  { value: "Unregistered", label: "Unregistered" },
];

const accountStatusOptions: ToggleOption[] = [
  { value: "Registered", label: "Registered" },
  { value: "PRO_1M", label: "PRO 1M" },
  { value: "PRO_6M", label: "PRO 6M" },
  { value: "PRO_12M", label: "PRO 12M" },
];

const verifiedOptions: ToggleOption[] = [
  { value: "yes", label: "Verified" },
  { value: "no", label: "Not verified" },
];

const EditUserSlideOver: React.FC<Props> = ({ isOpen, onClose, user, onUpdate }) => {
  const [userId, setUserId] = React.useState("USR-0000");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [language, setLanguage] = React.useState("");

  const [registrationStatus, setRegistrationStatus] = React.useState<RegistrationStatus>("Registered");
  const [emailVerified, setEmailVerified] = React.useState<boolean>(false);
  const [accountStatus, setAccountStatus] = React.useState<AccountStatus>("Registered");

  const [xpPoints, setXpPoints] = React.useState("0");
  const [avatarUrl, setAvatarUrl] = React.useState("");

  React.useEffect(() => {
    if (!user || !isOpen) return;

    setUserId(user.userId || "USR-0000");
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setCountry(user.country || "");
    setLanguage(user.language || "");

    setRegistrationStatus(user.registrationStatus);
    setEmailVerified(Boolean(user.emailVerified));
    setAccountStatus(user.accountStatus);

    setXpPoints(String(user.xpPoints ?? 0));
    setAvatarUrl(user.avatarUrl || "");
  }, [user, isOpen]);

  // Unregistered users should not be PRO (keep consistent)
  React.useEffect(() => {
    if (registrationStatus === "Unregistered" && accountStatus !== "Registered") {
      setAccountStatus("Registered");
    }
  }, [registrationStatus, accountStatus]);

  const handleSubmit = () => {
    if (!user) return;
    if (!name.trim()) return;

    onUpdate(user.id, {
      userId: userId.trim() || user.userId,
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      country: country.trim() || "Unknown",
      language: language.trim() || user.language,
      registrationStatus,
      emailVerified,
      accountStatus,
      xpPoints: Number(xpPoints) || 0,
      avatarUrl: avatarUrl.trim() || undefined,
    });

    onClose();
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User"
      description="Update profile + account status (Registered / PRO plans)."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!name.trim() || !user}>
            Save Changes
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <TextField label="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
          <TextField label="Language" value={language} onChange={(e) => setLanguage(e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">Registration</label>
            <div className="mt-2">
              <ToggleChips options={registrationOptions} value={registrationStatus} onChange={(v) => setRegistrationStatus(v as RegistrationStatus)} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">Email verification</label>
            <div className="mt-2">
              <ToggleChips options={verifiedOptions} value={emailVerified ? "yes" : "no"} onChange={(v) => setEmailVerified(v === "yes")} />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-200 md:text-sm">Account Status</label>
          <div className="mt-2">
            <ToggleChips options={accountStatusOptions} value={accountStatus} onChange={(v) => setAccountStatus(v as AccountStatus)} />
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Client spec: Registered / PRO 1M / PRO 6M / PRO 12M
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="XP Points" type="number" min={0} value={xpPoints} onChange={(e) => setXpPoints(e.target.value)} />
          <TextField label="Avatar URL" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
        </div>
      </div>
    </SlideOver>
  );
};

export default EditUserSlideOver;
