import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import Button from "../../shared/inputs/Button";

const NotificationsSettingsSection: React.FC = () => {
  const [provider, setProvider] = React.useState<"app" | "braze">("braze");
  const [releaseReminders, setReleaseReminders] = React.useState(true);
  const [surveyReminders, setSurveyReminders] = React.useState(false);

  const handleSave = () => {
    console.log("Notification settings", { provider, releaseReminders, surveyReminders });
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Notifications"
        subtitle="High-level configuration. Detailed orchestration can be handled in-app or via Braze."
        className="bg-[#04130d]"
      >
        <div className="space-y-3 text-xs text-slate-200 md:text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" name="provider" checked={provider === "app"} onChange={() => setProvider("app")} />
            <span>App-native notifications</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" name="provider" checked={provider === "braze"} onChange={() => setProvider("braze")} />
            <span>Braze (recommended)</span>
          </label>
        </div>

        <div className="mt-4 space-y-3 text-xs text-slate-200 md:text-sm">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={releaseReminders}
              onChange={(e) => setReleaseReminders(e.target.checked)}
              className="h-4 w-4 rounded border border-white/20 bg-black/40"
            />
            <span>Weekly release reminders</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={surveyReminders}
              onChange={(e) => setSurveyReminders(e.target.checked)}
              className="h-4 w-4 rounded border border-white/20 bg-black/40"
            />
            <span>Survey reminders (optional)</span>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </div>
      </SectionCard>
    </div>
  );
};

export default NotificationsSettingsSection;

