import React from "react";
import { usePricingSettings } from "./hooks/usePricingSettings";
import PricingSourceCard from "./components/PricingSourceCard";
import CountryConfigTable from "./components/CountryConfigTable";
// import MembershipFeaturesTable from "./components/MembershipFeaturesTable";

const PricingSettingsSection: React.FC = () => {
  const {
    pricingSource,
    setPricingSource,
    rows,
    updateRow,
    // features,
    // toggleFeature,
    // updateNumber,
    syncFromStores,
    save,
  } = usePricingSettings();

  return (
    <div className="space-y-6">
      <PricingSourceCard value={pricingSource} onChange={setPricingSource} onSync={syncFromStores} onSave={save} />
      <CountryConfigTable pricingSource={pricingSource} rows={rows} onChangeRow={updateRow} />
      {/* <MembershipFeaturesTable features={features} onToggle={toggleFeature} onNumberChange={updateNumber} onSave={save} /> */}
    </div>
  );
};

export default PricingSettingsSection;
