import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";

type NotificationTypeKey =
  | "weeklyRelease"
  | "liveReminder"
  | "upgradePrompt"
  | "reengagement";

type NotificationConfig = {
  enabled: boolean;
  sendTime: string; // "18:00"
};

const NotificationsSettingsSection: React.FC = () => {
  const [types, setTypes] = React.useState<
    Record<NotificationTypeKey, NotificationConfig>
  >({
    weeklyRelease: { enabled: true, sendTime: "18:00" },
    liveReminder: { enabled: true, sendTime: "15:00" },
    upgradePrompt: { enabled: true, sendTime: "19:00" },
    reengagement: { enabled: true, sendTime: "10:00" },
  });

  const [quietStart, setQuietStart] = React.useState("22:00");
  const [quietEnd, setQuietEnd] = React.useState("07:00");

  const updateType = (
    key: NotificationTypeKey,
    patch: Partial<NotificationConfig>
  ) => {
    setTypes((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  };

  const handleSave = () => {
    console.log("Notification settings", { types, quietStart, quietEnd });
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="User Notifications"
        subtitle="Choose which automated messages Zonerlost sends to players."
        className="bg-[#04130d]"
      >
        <div className="space-y-4 text-xs md:text-sm">
          {(
            [
              ["weeklyRelease", "Weekly content release reminder"],
              ["liveReminder", "Live session reminder"],
              ["upgradePrompt", "Upgrade to Pro prompts"],
              ["reengagement", "Re-engagement nudges (inactive users)"],
            ] as [NotificationTypeKey, string][]
          ).map(([key, label]) => {
            const cfg = types[key];
            return (
              <div
                key={key}
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/20 p-3 md:flex-row md:items-center md:justify-between"
              >
                <label className="flex flex-1 items-start gap-3">
                  <input
                    type="checkbox"
                    checked={cfg.enabled}
                    onChange={(e) =>
                      updateType(key, { enabled: e.target.checked })
                    }
                    className="mt-1 h-4 w-4 rounded border border-white/20 bg-black/40"
                  />
                  <span className="text-slate-200">{label}</span>
                </label>

                <div className="w-full md:w-40">
                  <TextField
                    label="Send at"
                    type="time"
                    hideLabel
                    value={cfg.sendTime}
                    onChange={(e) =>
                      updateType(key, { sendTime: e.target.value })
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard
        title="Quiet Hours"
        subtitle="Avoid sending push notifications late at night."
        className="bg-[#04130d]"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Do not send before"
            type="time"
            value={quietEnd}
            onChange={(e) => setQuietEnd(e.target.value)}
          />
          <TextField
            label="Do not send after"
            type="time"
            value={quietStart}
            onChange={(e) => setQuietStart(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </SectionCard>
    </div>
  );
};

export default NotificationsSettingsSection;
