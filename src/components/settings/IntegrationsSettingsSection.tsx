import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";

const IntegrationsSettingsSection: React.FC = () => {
  const [segmentKey, setSegmentKey] = React.useState("");
  const [mixpanelKey, setMixpanelKey] = React.useState("");
  const [sentryDsn, setSentryDsn] = React.useState("");
  const [stripePublicKey, setStripePublicKey] = React.useState("");
  const [fcmKey, setFcmKey] = React.useState("");

  const handleSave = () => {
    console.log("Integration settings", {
      segmentKey,
      mixpanelKey,
      sentryDsn,
      stripePublicKey,
      fcmKey,
    });
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Analytics"
        subtitle="Configure analytics tools that receive events from Zonerlost."
        className="bg-[#04130d]"
      >
        <div className="grid gap-4 md:grid-cols-2">
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
        subtitle="Front-end keys and status indicators for your payment provider."
        className="bg-[#04130d]"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Stripe Publishable Key"
            value={stripePublicKey}
            onChange={(e) => setStripePublicKey(e.target.value)}
          />
          <TextField
            label="FCM / Push Server Key"
            value={fcmKey}
            onChange={(e) => setFcmKey(e.target.value)}
          />
        </div>

        <p className="mt-3 text-xs text-slate-400 md:text-sm">
          Secret keys & webhooks should stay in server environment variables.
          This screen is just for non-sensitive public keys and integration
          status in the admin UI.
        </p>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </SectionCard>
    </div>
  );
};

export default IntegrationsSettingsSection;
