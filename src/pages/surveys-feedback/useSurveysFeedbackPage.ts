import React from "react";
import {
  COUNTRY_CATALOG,
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
} from "../../shared/constants/locale";
import {
  getSubmissionUserType,
  type AskQuestionRow,
  type AskQuestionStatus,
  type SubmissionItem,
  type SubmissionUser,
  type SurveyResponseType,
  type SurveyVariant,
  type SurveysFeedbackFiltersState,
  type SurveysFeedbackTab,
  type WeeklySurveyDefinitionDraft,
  type WeeklySurveyResponseRow,
} from "../../components/surveys-feedback/types";

const PAGE_SIZE_OPTIONS = [6, 10, 20, 50] as const;
const DEFAULT_PAGE_SIZE = 6;

const DEFAULT_TAGS = ["Training", "Learn", "General", "Equipment"] as const;

const INITIAL_FILTERS: SurveysFeedbackFiltersState = {
  country: "All",
  language: "All",
  type: "All",
  userType: "All",
  sort: "created_desc",

  /**  NEW */
  askStatus: "All",
  tags: [],
};

const NAMES = [
  "Alex Morgan",
  "Sofia Ramirez",
  "Liam Carter",
  "Emma Singh",
  "Noah Ali",
  "Mia Schmidt",
  "Ethan Costa",
  "Olivia Novak",
  "James Kim",
  "Ava Petrova",
] as const;

const ASK_QUESTIONS = [
  "Can I edit a submitted answer?",
  "How do weekly reminders work?",
  "Where can I change app language?",
  "Can I get survey notifications?",
] as const;

const ASK_MESSAGES = [
  "I submitted too quickly. Is it possible to update my weekly answer later?",
  "I did not receive this week's reminder notification. Can you check why?",
  "Please explain where I can set my preferred language for survey content.",
  "Could we get a reminder 24h before survey close for all users?",
] as const;

const WEEKLY_SURVEY_QUESTIONS: Array<{
  question: string;
  responseType: SurveyResponseType;
  options: string[];
}> = [
  {
    question: "Which drill helped you most this week?",
    responseType: "multipleChoice",
    options: ["Passing under pressure", "First touch", "Positioning", "Finishing"],
  },
  {
    question: "What should next week focus on?",
    responseType: "both",
    options: ["Defensive transitions", "Stamina", "Set pieces", "Ball control"],
  },
  {
    question: "How did this week's training affect your confidence?",
    responseType: "freeForm",
    options: [],
  },
];

const USER_STATUS_PRESETS: Array<
  Pick<SubmissionUser, "accountStatus" | "registrationStatus" | "planStatus">
> = [
  { accountStatus: "PRO_1M", registrationStatus: "Registered", planStatus: "Pro" },
  { accountStatus: "PRO_6M", registrationStatus: "Registered", planStatus: "Pro" },
  { accountStatus: "PRO_12M", registrationStatus: "Registered", planStatus: "Pro" },
  { accountStatus: "Registered", registrationStatus: "Registered", planStatus: "Free" },
  { accountStatus: "Registered", registrationStatus: "Unregistered", planStatus: "Free" },
];

const LOCALE_PAIRS = COUNTRY_CATALOG.flatMap((entry) =>
  entry.languages.map((language) => ({ country: entry.country, language }))
);

function pick<T>(values: readonly T[], index: number) {
  return values[index % values.length];
}

function buildEmail(name: string, index: number) {
  return `${name.toLowerCase().replace(/\s+/g, ".")}.${index + 1}@example.com`;
}

function makeBreakdown(options: string[], seed: number) {
  if (options.length === 0) return undefined;

  const counts = options.map((_, index) => 15 + ((seed * 7 + index * 13) % 75));
  const total = counts.reduce((sum, value) => sum + value, 0);

  return options.map((option, index) => ({
    option,
    count: counts[index],
    percent: Number(((counts[index] / total) * 100).toFixed(1)),
  }));
}

function makeMockSubmissions(total = 90): SubmissionItem[] {
  const now = Date.now();

  return Array.from({ length: total }).map((_, index) => {
    const name = pick(NAMES, index);
    const locale = pick(LOCALE_PAIRS, index);
    const profile = pick(USER_STATUS_PRESETS, index);

    const user: SubmissionUser = {
      userId: `USR-${String(3000 + index).padStart(5, "0")}`,
      name,
      email: index % 7 === 0 ? undefined : buildEmail(name, index),
      avatarUrl:
        index % 3 === 0
          ? `https://randomuser.me/api/portraits/${index % 2 === 0 ? "women" : "men"}/${(index % 70) + 1}.jpg`
          : undefined,
      country: locale.country,
      language: locale.language,
      accountStatus: profile.accountStatus,
      registrationStatus: profile.registrationStatus,
      planStatus: profile.planStatus,
    };

    const createdAt = new Date(now - index * 1000 * 60 * 60 * 4).toISOString();

    if (index % 3 === 0) {
      const status: AskQuestionStatus = index % 2 === 0 ? "unanswered" : "answered";
      const tags = index % 4 === 0 ? ["Training"] : index % 4 === 1 ? ["General"] : index % 4 === 2 ? ["Learn"] : ["Equipment"];

      return {
        id: `ask-${index + 1}`,
        createdAt,
        type: "AskQuestion",
        user,
        askQuestion: {
          question: pick(ASK_QUESTIONS, index),
          message: pick(ASK_MESSAGES, index),
          status,
          tags,
          answer:
            status === "answered"
              ? "Thanks — yes, you can update it until the weekly survey closes. If you already submitted, reopen the survey and tap “Edit Answer”."
              : undefined,
          answeredAt: status === "answered" ? createdAt : undefined,
        },
      };
    }

    const survey = pick(WEEKLY_SURVEY_QUESTIONS, index);
    const selectedOptions =
      survey.responseType === "freeForm" ? [] : [survey.options[index % survey.options.length]];

    return {
      id: `weekly-${index + 1}`,
      createdAt,
      type: "WeeklySurvey",
      user,
      weeklySurvey: {
        week: 4 + (index % 3),
        question: survey.question,
        responseType: survey.responseType,
        options: survey.options,
        selectedOptions,
        freeFormAnswer:
          survey.responseType === "freeForm" || survey.responseType === "both"
            ? "I would like more position-specific drills and a shorter warmup section."
            : undefined,
        breakdown: makeBreakdown(survey.options, index + 1),
      },
    };
  });
}

function makeMockSurveyDefinitions(total = 24): SurveyVariant[] {
  const now = Date.now();

  return Array.from({ length: total }).map((_, index) => {
    const locale = pick(LOCALE_PAIRS, index);
    const survey = pick(WEEKLY_SURVEY_QUESTIONS, index);

    return {
      id: `sv-${index + 1}`,
      createdAt: new Date(now - index * 1000 * 60 * 60 * 12).toISOString(),
      week: 1 + (index % 10),
      country: locale.country,
      language: locale.language,
      responseType: survey.responseType,
      question: survey.question,
      options: survey.responseType === "freeForm" ? [] : survey.options,
    };
  });
}

export function useSurveysFeedbackPage() {
  const [activeTab, setActiveTab] = React.useState<SurveysFeedbackTab>("WeeklySurvey");
  const [searchValue, setSearchValue] = React.useState("");
  const [filters, setFilters] = React.useState<SurveysFeedbackFiltersState>(INITIAL_FILTERS);

  const [submissions, setSubmissions] = React.useState<SubmissionItem[]>(() => makeMockSubmissions());
  const [surveyVariants, setSurveyVariants] = React.useState<SurveyVariant[]>(() => makeMockSurveyDefinitions());

  /**  NEW: tags catalog */
  const [tagCatalog, setTagCatalog] = React.useState<string[]>(() => [...DEFAULT_TAGS]);

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);

  const [selectedSubmission, setSelectedSubmission] = React.useState<SubmissionItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  const [isSurveyEditorOpen, setIsSurveyEditorOpen] = React.useState(false);
  const [editingSurvey, setEditingSurvey] = React.useState<SurveyVariant | null>(null);
  const [builderWeekFilter, setBuilderWeekFilter] = React.useState<number | "All">("All");

  /**  NEW */
  const [isTagsManagerOpen, setIsTagsManagerOpen] = React.useState(false);

  const search = searchValue;
  const setSearch = (value: string) => setSearchValue(value);

  const countryOptions = React.useMemo(() => [...COUNTRY_OPTIONS], []);

  const languageOptions = React.useMemo(() => {
    if (filters.country === "All") return [...LANGUAGE_OPTIONS];
    const config = COUNTRY_CATALOG.find((item) => item.country === filters.country);
    if (!config) return ["All"];
    return ["All", ...config.languages];
  }, [filters.country]);

  const weekOptions = React.useMemo(
    () => Array.from(new Set(surveyVariants.map((item) => item.week))).sort((a, b) => a - b),
    [surveyVariants]
  );

  const editorCountryOptions = React.useMemo(() => COUNTRY_CATALOG.map((item) => item.country), []);
  const editorLanguageOptions = React.useMemo(
    () => Array.from(new Set(COUNTRY_CATALOG.flatMap((item) => item.languages))),
    []
  );
  const editorCountryLanguageMap = React.useMemo(
    () => Object.fromEntries(COUNTRY_CATALOG.map((entry) => [entry.country, [...entry.languages]])),
    []
  );

  const handleTabChange = (nextTab: SurveysFeedbackTab) => {
    setActiveTab(nextTab);
    setFilters((prev) => ({
      ...prev,
      type: nextTab === "SurveyBuilder" ? "All" : nextTab,
    }));
  };

  const handleFiltersChange = (partial: Partial<SurveysFeedbackFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const clearFilters = () => {
    setFilters({
      ...INITIAL_FILTERS,
      type: activeTab === "SurveyBuilder" ? "All" : activeTab,
    });
    setBuilderWeekFilter("All");
    setSearchValue("");
  };

  React.useEffect(() => {
    if (!languageOptions.includes(filters.language)) {
      setFilters((prev) => ({ ...prev, language: "All" }));
    }
  }, [filters.language, languageOptions]);

  React.useEffect(() => {
    setPage(1);
  }, [
    searchValue,
    activeTab,
    filters.country,
    filters.language,
    filters.userType,
    filters.sort,
    filters.askStatus,
    filters.tags,
    builderWeekFilter,
  ]);

  const filteredSubmissions = React.useMemo(() => {
    if (activeTab === "SurveyBuilder") return [];

    const query = searchValue.trim().toLowerCase();

    let list = submissions.filter((item) => {
      if (item.type !== activeTab) return false;

      if (filters.country !== "All" && item.user.country !== filters.country) return false;
      if (filters.language !== "All" && item.user.language !== filters.language) return false;

      const uType = getSubmissionUserType(item.user);
      if (filters.userType !== "All" && uType !== filters.userType) return false;

      /** NEW: AskQuestion status + tag filtering */
      if (item.type === "AskQuestion") {
        if (filters.askStatus === "Answered" && item.askQuestion.status !== "answered") return false;
        if (filters.askStatus === "Unanswered" && item.askQuestion.status !== "unanswered") return false;

        if (filters.tags.length > 0) {
          const hasAny = filters.tags.some((t) => item.askQuestion.tags?.includes(t));
          if (!hasAny) return false;
        }
      }

      if (!query) return true;

      const text =
        item.type === "AskQuestion"
          ? `${item.askQuestion.question} ${item.askQuestion.message} ${item.askQuestion.answer || ""} ${(item.askQuestion.tags || []).join(" ")} ${item.askQuestion.status}`
          : `${item.weeklySurvey.question} ${item.weeklySurvey.selectedOptions.join(" ")} ${item.weeklySurvey.freeFormAnswer || ""}`;

      const haystack = [
        item.user.name,
        item.user.email,
        item.user.userId,
        item.user.country,
        item.user.language,
        text,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });

    list = [...list].sort((left, right) => {
      if (filters.sort === "created_asc") return left.createdAt.localeCompare(right.createdAt);
      return right.createdAt.localeCompare(left.createdAt);
    });

    return list;
  }, [
    submissions,
    searchValue,
    activeTab,
    filters.country,
    filters.language,
    filters.userType,
    filters.sort,
    filters.askStatus,
    filters.tags,
  ]);

  const filteredSurveyVariants = React.useMemo(() => {
    if (activeTab !== "SurveyBuilder") return [];

    const query = searchValue.trim().toLowerCase();

    let list = surveyVariants.filter((item) => {
      if (filters.country !== "All" && item.country !== filters.country) return false;
      if (filters.language !== "All" && item.language !== filters.language) return false;
      if (builderWeekFilter !== "All" && item.week !== builderWeekFilter) return false;

      if (!query) return true;

      const haystack = [
        item.question,
        item.options.join(" "),
        item.country,
        item.language,
        item.responseType,
        `week ${item.week}`,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });

    list = [...list].sort((left, right) => {
      if (filters.sort === "created_asc") return left.createdAt.localeCompare(right.createdAt);
      return right.createdAt.localeCompare(left.createdAt);
    });

    return list;
  }, [surveyVariants, activeTab, searchValue, filters.country, filters.language, filters.sort, builderWeekFilter]);

  const total = activeTab === "SurveyBuilder" ? filteredSurveyVariants.length : filteredSubmissions.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedSubmissions = React.useMemo(
    () => filteredSubmissions.slice(startIndex, startIndex + pageSize),
    [filteredSubmissions, startIndex, pageSize]
  );

  const paginatedSurveyVariants = React.useMemo(
    () => filteredSurveyVariants.slice(startIndex, startIndex + pageSize),
    [filteredSurveyVariants, startIndex, pageSize]
  );

  const weeklyRows = React.useMemo(
    () => paginatedSubmissions.filter((i): i is WeeklySurveyResponseRow => i.type === "WeeklySurvey"),
    [paginatedSubmissions]
  );

  const askRows = React.useMemo(
    () => paginatedSubmissions.filter((i): i is AskQuestionRow => i.type === "AskQuestion"),
    [paginatedSubmissions]
  );

  /**  NEW: full list for charts (filtered, not paginated) */
  const askInsightsRows = React.useMemo(
    () => filteredSubmissions.filter((i): i is AskQuestionRow => i.type === "AskQuestion"),
    [filteredSubmissions]
  );

  const openDetails = (submission: SubmissionItem) => {
    setSelectedSubmission(submission);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => setIsDetailsOpen(false);

  const openSurveyEditor = () => {
    setEditingSurvey(null);
    setIsSurveyEditorOpen(true);
  };

  const editSurveyDefinition = (row: SurveyVariant) => {
    setEditingSurvey(row);
    setIsSurveyEditorOpen(true);
  };

  const closeSurveyEditor = () => {
    setIsSurveyEditorOpen(false);
    setEditingSurvey(null);
  };

  const removeSurveyDefinition = (row: SurveyVariant) => {
    setSurveyVariants((prev) => prev.filter((item) => item.id !== row.id));
  };

  const saveWeeklySurveyDefinition = (draft: WeeklySurveyDefinitionDraft) => {
    setSurveyVariants((prev) => {
      if (editingSurvey) {
        return prev.map((item) => (item.id === editingSurvey.id ? { ...item, ...draft } : item));
      }

      const next: SurveyVariant = {
        id: `sv-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...draft,
      };

      return [next, ...prev];
    });

    closeSurveyEditor();
  };

  const viewResponsesFromVariant = (row: SurveyVariant) => {
    setActiveTab("WeeklySurvey");
    setFilters((prev) => ({
      ...prev,
      type: "WeeklySurvey",
      country: row.country,
      language: row.language,
    }));
    setPage(1);
  };

  const editorInitialDraft: WeeklySurveyDefinitionDraft | null = editingSurvey
    ? {
        week: editingSurvey.week,
        country: editingSurvey.country,
        language: editingSurvey.language,
        responseType: editingSurvey.responseType,
        question: editingSurvey.question,
        options: editingSurvey.options,
      }
    : null;

  /**  NEW: update AskQuestion status/tags/answer */
  const updateAskQuestion = (
    id: string,
    patch: { status: AskQuestionStatus; tags: string[]; answer?: string }
  ) => {
    setSubmissions((prev) =>
      prev.map((item) => {
        if (item.id !== id || item.type !== "AskQuestion") return item;

        const nextStatus = patch.status;
        const answeredAt =
          nextStatus === "answered" ? item.askQuestion.answeredAt || new Date().toISOString() : undefined;

        return {
          ...item,
          askQuestion: {
            ...item.askQuestion,
            status: nextStatus,
            tags: patch.tags,
            answer: nextStatus === "answered" ? patch.answer : undefined,
            answeredAt,
          },
        };
      })
    );
  };

  /**  NEW: tag manager */
  const openTagsManager = () => setIsTagsManagerOpen(true);
  const closeTagsManager = () => setIsTagsManagerOpen(false);

  const createTag = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setTagCatalog((prev) => {
      if (prev.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return prev;
      return [...prev, trimmed];
    });
  };

  const deleteTag = (name: string) => {
    setTagCatalog((prev) => prev.filter((t) => t !== name));
    setSubmissions((prev) =>
      prev.map((item) => {
        if (item.type !== "AskQuestion") return item;
        if (!item.askQuestion.tags?.includes(name)) return item;
        return {
          ...item,
          askQuestion: { ...item.askQuestion, tags: item.askQuestion.tags.filter((t) => t !== name) },
        };
      })
    );

    // if filter currently includes deleted tag, remove it
    setFilters((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== name) }));
  };

  return {
    activeTab,
    handleTabChange,
    search,
    setSearch,
    filters,
    handleFiltersChange,
    clearFilters,
    countryOptions,
    languageOptions,

    weekOptions,
    builderWeekFilter,
    setBuilderWeekFilter,

    weeklyRows,
    askRows,
    askInsightsRows,
    surveyVariants: paginatedSurveyVariants,
    total,
    page: safePage,
    pageSize,
    pageSizeOptions: [...PAGE_SIZE_OPTIONS],
    setPage,
    setPageSize,

    selectedSubmission,
    isDetailsOpen,
    openDetails,
    closeDetails,

    isSurveyEditorOpen,
    openSurveyEditor,
    closeSurveyEditor,
    editSurveyDefinition,
    removeSurveyDefinition,
    saveWeeklySurveyDefinition,
    viewResponsesFromVariant,

    editorCountryOptions,
    editorLanguageOptions,
    editorCountryLanguageMap,
    editorInitialDraft,
    isEditingSurvey: Boolean(editingSurvey),

    /**  NEW exports */
    tagOptions: tagCatalog,
    isTagsManagerOpen,
    openTagsManager,
    closeTagsManager,
    createTag,
    deleteTag,
    updateAskQuestion,
  };
}
