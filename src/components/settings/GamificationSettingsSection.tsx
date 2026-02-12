import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";

type BadgeDef = {
  id: string;
  name: string;
  rule: string;
  iconUrl: string;
};

const GamificationSettingsSection: React.FC = () => {
  const [pointsLearn, setPointsLearn] = React.useState("10");
  const [pointsTrain, setPointsTrain] = React.useState("20");
  const [pointsWeekly, setPointsWeekly] = React.useState("30");

  const [badges, setBadges] = React.useState<BadgeDef[]>([
    { id: "b1", name: "Consistency Starter", rule: "Complete 3 weekly releases in a week", iconUrl: "" },
    { id: "b2", name: "Weekend Warrior", rule: "Complete 2 sessions on weekends", iconUrl: "" },
  ]);
  const updateBadge = (id: string, patch: Partial<BadgeDef>) => {
    setBadges((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const addBadge = () => {
    setBadges((prev) => [
      ...prev,
      { id: `b-${Date.now()}`, name: "New Badge", rule: "", iconUrl: "" },
    ]);
  };

  const removeBadge = (id: string) => {
    setBadges((prev) => prev.filter((b) => b.id !== id));
  };

  const handleSave = () => {
    console.log("Gamification settings", { pointsLearn, pointsTrain, pointsWeekly, badges });
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Points Rules" subtitle="Adjust how many XP points players earn." className="bg-[#04130d]">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <TextField label="Points: Complete Learn session" type="number" min={0} value={pointsLearn} onChange={(e) => setPointsLearn(e.target.value)} />
          <TextField label="Points: Complete Train session" type="number" min={0} value={pointsTrain} onChange={(e) => setPointsTrain(e.target.value)} />
          <TextField label="Points: Watch weekly release" type="number" min={0} value={pointsWeekly} onChange={(e) => setPointsWeekly(e.target.value)} />
        </div>
      </SectionCard>

      <SectionCard title="Badges" subtitle="Define badge rules and attach icons (URL for now)." className="bg-[#04130d]">
        <div className="space-y-3">
          {badges.map((b) => (
            <div key={b.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <TextField label="Badge name" value={b.name} onChange={(e) => updateBadge(b.id, { name: e.target.value })} />
                <TextField label="Rule/definition" value={b.rule} onChange={(e) => updateBadge(b.id, { rule: e.target.value })} />
                <TextField label="Icon URL" placeholder="https://..." value={b.iconUrl} onChange={(e) => updateBadge(b.id, { iconUrl: e.target.value })} />
              </div>

              <div className="mt-3 flex justify-end">
                <Button
                  variant="secondary"
                  className="rounded-lg border border-white/10 bg-transparent hover:bg-white/10"
                  onClick={() => removeBadge(b.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button variant="secondary" className="rounded-lg border border-white/10 bg-transparent hover:bg-white/10" onClick={addBadge}>
            + Add Badge
          </Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </div>
      </SectionCard>
    </div>
  );
};

export default GamificationSettingsSection;
