import React from "react";
import { useContentReleaseSettings } from "../hooks/useContentReleaseSettings";
import WeeklyReleaseDefaultsCard from "../components/WeeklyReleaseDefaultsCard";
import CountryAvailabilityCard from "../components/CountryAvailabilityCard";
import ReleaseWindowsCard from "../components/ReleaseWindowsCard";

const ContentReleaseSettingsSection: React.FC = () => {
  const { state, actions, meta } = useContentReleaseSettings();

  const handleUpload = (windowId: string) => {
    //  production: open modal and upload videos/docs to this window
    console.log("UPLOAD for window:", windowId);
  };

  return (
    <div className="space-y-6">
      <WeeklyReleaseDefaultsCard
        trainLearnEnabled={state.trainLearnEnabled}
        releaseDay={state.releaseDay}
        releaseTimeLocal={state.releaseTimeLocal}
        onToggleEnabled={actions.setTrainLearnEnabled}
        onChangeDay={actions.setReleaseDay}
        onChangeTime={actions.setReleaseTimeLocal}
        onSave={actions.save}
      />

      <CountryAvailabilityCard
        excludedCountries={state.excludedCountries}
        countryOptions={meta.countryOptions}
        onChangeExcluded={actions.setExcludedCountries}
        onSave={actions.save}
      />

      <ReleaseWindowsCard
        windows={state.windows}
        onAdd={actions.addWindow}
        onToggleActive={actions.toggleWindow}
        onRemove={actions.removeWindow}
        onActivateAllInactive={actions.activateAllInactive}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default ContentReleaseSettingsSection;
