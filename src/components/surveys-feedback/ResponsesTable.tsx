import React from "react";
import SubmissionsTable from "./SubmissionsTable";
import { type WeeklySurveyResponseRow } from "./types";

type Props = {
  rows: WeeklySurveyResponseRow[];
  onView: (row: WeeklySurveyResponseRow) => void;
};

const ResponsesTable: React.FC<Props> = ({ rows, onView }) => {
  return (
    <SubmissionsTable
      mode="WeeklySurvey"
      rows={rows}
      onView={(row) => {
        if (row.type === "WeeklySurvey") onView(row);
      }}
    />
  );
};

export default ResponsesTable;
