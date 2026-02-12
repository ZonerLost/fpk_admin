import React from "react";
import SectionCard from "../../shared/layout/SectionCard";
import SurveyBuilderListHeader from "./SurveyBuilderListHeader";
import SurveyBuilderListRow from "./SurveyBuilderListRow";
import SurveyVariantDetailsModal from "./SurveyVariantDetailsModal";
import { type SurveyVariant } from "./types";

type Props = {
  rows: SurveyVariant[];
  onEdit: (row: SurveyVariant) => void;
  onRemove: (row: SurveyVariant) => void;
  onViewResponses: (row: SurveyVariant) => void;
};

const SurveyBuilderList: React.FC<Props> = ({
  rows,
  onEdit,
  onRemove,
  onViewResponses,
}) => {
  const [selectedVariant, setSelectedVariant] = React.useState<SurveyVariant | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  const openDetails = React.useCallback((row: SurveyVariant) => {
    setSelectedVariant(row);
    setIsDetailsOpen(true);
  }, []);

  const closeDetails = React.useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  React.useEffect(() => {
    if (!selectedVariant) return;
    const isStillPresent = rows.some((item) => item.id === selectedVariant.id);
    if (!isStillPresent) {
      setSelectedVariant(null);
      setIsDetailsOpen(false);
    }
  }, [rows, selectedVariant]);

  const handleEdit = React.useCallback(() => {
    if (!selectedVariant) return;
    onEdit(selectedVariant);
    closeDetails();
  }, [selectedVariant, onEdit, closeDetails]);

  const handleDelete = React.useCallback(() => {
    if (!selectedVariant) return;
    onRemove(selectedVariant);
    closeDetails();
  }, [selectedVariant, onRemove, closeDetails]);

  const handleViewResponses = React.useCallback(() => {
    if (!selectedVariant) return;
    onViewResponses(selectedVariant);
    closeDetails();
  }, [selectedVariant, onViewResponses, closeDetails]);

  return (
    <>
      <SectionCard className="overflow-x-hidden bg-[#04130d]" contentClassName="overflow-x-hidden p-0">
        <div className="w-full overflow-x-hidden">
          <SurveyBuilderListHeader />
          {rows.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">No survey variants found.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {rows.map((row) => (
                <SurveyBuilderListRow key={row.id} row={row} onOpenDetails={openDetails} />
              ))}
            </div>
          )}
        </div>
      </SectionCard>

      <SurveyVariantDetailsModal
        isOpen={isDetailsOpen}
        variant={selectedVariant}
        onClose={closeDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewResponses={handleViewResponses}
      />
    </>
  );
};

export default SurveyBuilderList;
