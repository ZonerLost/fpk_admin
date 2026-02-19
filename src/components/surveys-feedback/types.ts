export type SubmissionType = "WeeklySurvey" | "AskQuestion";
export type SurveysFeedbackTab = SubmissionType | "SurveyBuilder";

export type SubmissionUserType = "Pro" | "Registered" | "Unregistered";

export type SubmissionSort = "created_desc" | "created_asc";

export type SurveyResponseType = "multipleChoice" | "freeForm" | "both";

/** NEW */
export type AskQuestionStatus = "answered" | "unanswered";

export type SubmissionUser = {
  userId: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  country: string;
  language: string;
  accountStatus: "Registered" | "PRO_1M" | "PRO_6M" | "PRO_12M";
  registrationStatus: "Registered" | "Unregistered";
  planStatus: "Pro" | "Free";
};

export type WeeklySurveyBreakdown = {
  option: string;
  count: number;
  percent: number;
};

type SubmissionBase = {
  id: string;
  createdAt: string;
  type: SubmissionType;
  user: SubmissionUser;
};

export type WeeklySurveySubmission = SubmissionBase & {
  type: "WeeklySurvey";
  weeklySurvey: {
    week: number;
    question: string;
    responseType: SurveyResponseType;
    options: string[];
    selectedOptions: string[];
    freeFormAnswer?: string;
    breakdown?: WeeklySurveyBreakdown[];
  };
  askQuestion?: never;
};

export type AskQuestionSubmission = SubmissionBase & {
  type: "AskQuestion";
  askQuestion: {
    question: string;
    message: string;

    /** NEW */
    status: AskQuestionStatus;
    tags: string[];

    /** NEW: optional admin reply */
    answer?: string;
    answeredAt?: string;
  };
  weeklySurvey?: never;
};

export type SubmissionItem = WeeklySurveySubmission | AskQuestionSubmission;
export type WeeklySurveyResponseRow = WeeklySurveySubmission;
export type AskQuestionRow = AskQuestionSubmission;

/** NEW */
export type AskStatusFilter = "All" | "Answered" | "Unanswered";

export type SurveysFeedbackFiltersState = {
  country: string;
  language: string;
  type: "All" | SubmissionType;
  userType: "All" | SubmissionUserType;
  sort: SubmissionSort;

  /**NEW: only relevant for AskQuestion */
  askStatus: AskStatusFilter;

  /** NEW: only relevant for AskQuestion */
  tags: string[];
};

export type WeeklySurveyDefinition = {
  id: string;
  createdAt: string;
  week: number;
  country: string;
  language: string;
  responseType: SurveyResponseType;
  question: string;
  options: string[];
};
export type SurveyVariant = WeeklySurveyDefinition;

export type WeeklySurveyDefinitionDraft = Omit<WeeklySurveyDefinition, "id" | "createdAt">;

export const SUBMISSION_TYPE_OPTIONS: readonly SubmissionType[] = [
  "WeeklySurvey",
  "AskQuestion",
] as const;

export const SUBMISSION_USER_TYPE_OPTIONS: readonly SubmissionUserType[] = [
  "Pro",
  "Registered",
  "Unregistered",
] as const;

export function getSubmissionUserType(user: SubmissionUser): SubmissionUserType {
  if (user.registrationStatus === "Unregistered") return "Unregistered";
  if (user.planStatus === "Pro") return "Pro";
  return "Registered";
}

export function submissionTypeLabel(type: SubmissionType) {
  return type === "WeeklySurvey" ? "Weekly Survey" : "Ask a Question";
}
