import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";

const GeneralSettingsSection: React.FC = () => {
  const [appName, setAppName] = React.useState("");
  const [tagline, setTagline] = React.useState(
    ""
  );
  const [companyName, setCompanyName] = React.useState("");
  const [supportEmail, setSupportEmail] = React.useState(
    ""
  );
  const [supportUrl, setSupportUrl] = React.useState(
    ""
  );
  const [primaryColor, setPrimaryColor] = React.useState("#00ff5a");
  const [accentColor, setAccentColor] = React.useState("#facc15");

  const handleSave = () => {
    console.log("General settings", {
      appName,
      tagline,
      companyName,
      supportEmail,
      supportUrl,
      primaryColor,
      accentColor,
    });
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Brand & App"
        subtitle="Update how Zonerlost appears in the admin console and player app."
        className="bg-[#04130d]"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="App Name"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />
          <TextField
            label="Tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Primary Accent Color
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-9 w-9 cursor-pointer rounded-md border border-white/20 bg-transparent"
              />
              <span className="text-xs text-slate-300 md:text-sm">
                {primaryColor}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-200 md:text-sm">
              Secondary Accent Color
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-9 w-9 cursor-pointer rounded-md border border-white/20 bg-transparent"
              />
              <span className="text-xs text-slate-300 md:text-sm">
                {accentColor}
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Organization & Support"
        subtitle="Control how players and partners contact your team."
        className="bg-[#04130d]"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <TextField
            label="Support Email"
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextField
            label="Support URL"
            value={supportUrl}
            onChange={(e) => setSupportUrl(e.target.value)}
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

export default GeneralSettingsSection;
