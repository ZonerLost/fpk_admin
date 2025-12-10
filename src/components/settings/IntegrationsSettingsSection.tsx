import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";

const IntegrationsSettingsSection: React.FC = () => {
  const [segmentKey, setSegmentKey] = React.useState("");
  const [mixpanelKey, setMixpanelKey] = React.useState("");
  const [sentryDsn, setSentryDsn] = React.useState("");

  const [iapAppleEnabled, setIapAppleEnabled] = React.useState(true);
  const [iapGoogleEnabled, setIapGoogleEnabled] = React.useState(true);

  const handleSave = () => {
    console.log("Integration settings", {
      segmentKey,
      mixpanelKey,
      sentryDsn,
      iapAppleEnabled,
      iapGoogleEnabled,
    });
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Analytics"
        subtitle="Configure the tools that receive events from the app."
        className="bg-[#04130d]"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Segment Write Key"
            value={segmentKey}
            onChange={(e) => setSegmentKey(e.target.value)}
          />
          <TextField
            label="Mixpanel Project Token"
            value={mixpanelKey}
            onChange={(e) => setMixpanelKey(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <TextField
            label="Sentry DSN"
            value={sentryDsn}
            onChange={(e) => setSentryDsn(e.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Billing & Payments"
        subtitle="We plan to use Apple App Store & Google Play internal payments."
        className="bg-[#04130d]"
      >
        <div className="space-y-3 text-xs text-slate-200 md:text-sm">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={iapAppleEnabled}
              onChange={(e) => setIapAppleEnabled(e.target.checked)}
              className="h-4 w-4 rounded border border-white/20 bg-black/40"
            />
            <span>Apple In-App Purchases enabled</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={iapGoogleEnabled}
              onChange={(e) => setIapGoogleEnabled(e.target.checked)}
              className="h-4 w-4 rounded border border-white/20 bg-black/40"
            />
            <span>Google Play Billing enabled</span>
          </label>
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-400 md:text-sm">
            This screen is a UI placeholder. Real product IDs, price tiers,
            and receipt validation should be configured in each store and
            enforced in backend services.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </SectionCard>
    </div>
  );
};

export default IntegrationsSettingsSection;
