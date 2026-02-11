export type FeedbackType = "weeklySurvey" | "askQuestion";

export type FeedbackStatus = "open" | "resolved";

export type FeedbackUserType = "Pro" | "Registered" | "Unregistered";

export type FeedbackSort = "created_desc" | "created_asc" | "status_open_first";

export type SurveyFeedbackUser = {
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

export type SurveySummaryOption = {
  option: string;
  count: number;
  percent: number;
};

type SurveyFeedbackBase = {
  id: string;
  createdAt: string; // ISO
  type: FeedbackType;
  title: string;
  status: FeedbackStatus;
  user: SurveyFeedbackUser;
};

export type WeeklySurveyFeedbackItem = SurveyFeedbackBase & {
  type: "weeklySurvey";
  weeklySurvey: {
    week: number;
    localeCountry: string;
    localeLanguage: string;
    question: string;
    selectedOptions: string[];
    freeFormAnswer?: string;
    totalResponses: number;
    responsesSummary: SurveySummaryOption[];
  };
  askQuestion?: never;
};

export type AskQuestionFeedbackItem = SurveyFeedbackBase & {
  type: "askQuestion";
  askQuestion: {
    message: string;
  };
  weeklySurvey?: never;
};

export type SurveyFeedbackItem = WeeklySurveyFeedbackItem | AskQuestionFeedbackItem;

export type SurveyFeedbackFiltersState = {
  country: string;
  language: string;
  type: "All" | FeedbackType;
  userType: "All" | FeedbackUserType;
  status: "All" | FeedbackStatus;
  sort: FeedbackSort;
};

export const FEEDBACK_TYPE_OPTIONS: readonly FeedbackType[] = ["weeklySurvey", "askQuestion"] as const;

export const FEEDBACK_USER_TYPE_OPTIONS: readonly FeedbackUserType[] = [
  "Pro",
  "Registered",
  "Unregistered",
] as const;

export const FEEDBACK_STATUS_OPTIONS: readonly FeedbackStatus[] = ["open", "resolved"] as const;

export function getFeedbackUserType(user: SurveyFeedbackUser): FeedbackUserType {
  if (user.registrationStatus === "Unregistered") return "Unregistered";
  if (user.planStatus === "Pro") return "Pro";
  return "Registered";
}
