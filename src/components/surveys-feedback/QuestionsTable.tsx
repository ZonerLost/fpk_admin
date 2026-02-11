import React from "react";
import SubmissionsTable from "./SubmissionsTable";
import { type AskQuestionRow } from "./types";

type Props = {
  rows: AskQuestionRow[];
  onView: (row: AskQuestionRow) => void;
};

const QuestionsTable: React.FC<Props> = ({ rows, onView }) => {
  return (
    <SubmissionsTable
      mode="AskQuestion"
      rows={rows}
      onView={(row) => {
        if (row.type === "AskQuestion") onView(row);
      }}
    />
  );
};

export default QuestionsTable;
