import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";

const GamificationSettingsSection: React.FC = () => {
  const [pointsLearn, setPointsLearn] = React.useState("10");
  const [pointsTrain, setPointsTrain] = React.useState("20");
  const [pointsLive, setPointsLive] = React.useState("30");

  const [level1, setLevel1] = React.useState("0");
  const [level2, setLevel2] = React.useState("1000");
  const [level3, setLevel3] = React.useState("5000");
  const [level4, setLevel4] = React.useState("15000");

  const handleSave = () => {
    console.log("Gamification settings", {
      pointsLearn,
      pointsTrain,
      pointsLive,
      thresholds: [level1, level2, level3, level4],
    });
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Points Rules"
        subtitle="Adjust how many XP points players earn for each activity."
        className="bg-[#04130d]"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <TextField
            label="Points: Complete Learn session"
            type="number"
            min={0}
            value={pointsLearn}
            onChange={(e) => setPointsLearn(e.target.value)}
          />
          <TextField
            label="Points: Complete Train session"
            type="number"
            min={0}
            value={pointsTrain}
            onChange={(e) => setPointsTrain(e.target.value)}
          />
          <TextField
            label="Points: Attend live session"
            type="number"
            min={0}
            value={pointsLive}
            onChange={(e) => setPointsLive(e.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="League Thresholds"
        subtitle="Define XP thresholds for each league or level."
        className="bg-[#04130d]"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <TextField
            label="Level 1 starts at"
            type="number"
            min={0}
            value={level1}
            onChange={(e) => setLevel1(e.target.value)}
          />
          <TextField
            label="Level 2 starts at"
            type="number"
            value={level2}
            onChange={(e) => setLevel2(e.target.value)}
          />
          <TextField
            label="Level 3 starts at"
            type="number"
            value={level3}
            onChange={(e) => setLevel3(e.target.value)}
          />
          <TextField
            label="Level 4 starts at"
            type="number"
            value={level4}
            onChange={(e) => setLevel4(e.target.value)}
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

export default GamificationSettingsSection;
