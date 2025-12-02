import React from "react";
import SlideOver from "../../shared/overlay/SlideOver";
import TextField from "../../shared/inputs/TextField";
import ToggleChips, {
  type ToggleOption,
} from "../../shared/inputs/ToggleChips";
import Button from "../../shared/inputs/Button";
import type { SubscriptionStatus, UserItem, UserRole } from "./types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: Omit<UserItem, "id">) => void;
};

const roleOptions: ToggleOption[] = [
  { value: "Pro", label: "Pro" },
  { value: "Basic", label: "Basic" },
  { value: "Unregistered", label: "Unregistered" },
];

const subscriptionOptions: ToggleOption[] = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const AddUserSlideOver: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [userId, setUserId] = React.useState("USR-0000");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [role, setRole] = React.useState<UserRole>("Pro");
  const [subscription, setSubscription] =
    React.useState<SubscriptionStatus>("Active");
  const [xpPoints, setXpPoints] = React.useState("0");
  const [avatarUrl, setAvatarUrl] = React.useState("");

  const resetForm = () => {
    setUserId("USR-0000");
    setName("");
    setEmail("");
    setPhone("");
    setCountry("");
    setRole("Pro");
    setSubscription("Active");
    setXpPoints("0");
    setAvatarUrl("");
  };

  const handleSubmit = () => {
    if (!name.trim()) return;

    onCreate({
      userId: userId.trim() || "USR-0000",
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      country: country.trim() || "Unknown",
      role,
      subscription,
      xpPoints: Number(xpPoints) || 0,
      avatarUrl: avatarUrl.trim() || undefined,
      lastActive: "just now",
    });

    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New User"
      description="Create a new user profile and assign role, subscription, and XP."
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Save User
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <TextField
          label="User ID"
          placeholder="USR-8421"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          hint="Optional. If left as default, you can generate this from backend."
        />

        <TextField
          label="Full Name"
          placeholder="Enter user's full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Email"
            placeholder="user@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Phone"
            placeholder="+1 555 555 5555"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <TextField
          label="Country"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Role
            </label>
            <div className="mt-2">
              <ToggleChips
                options={roleOptions}
                value={role}
                onChange={(v) => setRole(v as UserRole)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Subscription
            </label>
            <div className="mt-2">
              <ToggleChips
                options={subscriptionOptions}
                value={subscription}
                onChange={(v) =>
                  setSubscription(v as SubscriptionStatus)
                }
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="XP Points"
            type="number"
            min={0}
            value={xpPoints}
            onChange={(e) => setXpPoints(e.target.value)}
          />
          <TextField
            label="Avatar URL"
            placeholder="https://…"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            hint="Optional. If empty, initials will be used."
          />
        </div>
      </div>
    </SlideOver>
  );
};

export default AddUserSlideOver;
