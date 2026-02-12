import React from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import PageShell from "../../shared/layout/PageShell";
import PageHeader from "../../shared/layout/PageHeader";
import SectionCard from "../../shared/layout/SectionCard";
import TableToolbar from "../../shared/tables/TableToolbar";
import SearchBar from "../../shared/inputs/SearchBar";
import Button from "../../shared/inputs/Button";
import TablePagination from "../../shared/tables/TablePagination";
import SurveysFeedbackFiltersBar from "../../components/surveys-feedback/SurveysFeedbackFiltersBar";
import SurveyBuilderFiltersBar from "../../components/surveys-feedback/SurveyBuilderFiltersBar";
import ResponsesTable from "../../components/surveys-feedback/ResponsesTable";
import QuestionsTable from "../../components/surveys-feedback/QuestionsTable";
import SurveyBuilderList from "../../components/surveys-feedback/SurveyBuilderList";
import SubmissionDetailsSlideOver from "../../components/surveys-feedback/SubmissionDetailsSlideOver";
import WeeklySurveyEditorSlideOver from "../../components/surveys-feedback/WeeklySurveyEditorSlideOver";
import SurveysFeedbackTabs from "../../components/surveys-feedback/SurveysFeedbackTabs";
import { useSurveysFeedbackPage } from "./useSurveysFeedbackPage";

export const SurveysFeedbackPage: React.FC = () => {
  const vm = useSurveysFeedbackPage();

  const isBuilderTab = vm.activeTab === "SurveyBuilder";
  const searchPlaceholder = isBuilderTab
    ? "Search by question, option, country, language, week..."
    : "Search by question, answer, user name/email, user ID...";

  return (
    <>
      <PageShell>
        <PageHeader
          title="Surveys & Feedback"
          subtitle="Review weekly survey responses, ask-a-question submissions, and survey variants."
          actions={
            isBuilderTab ? (
              <Button
                variant="primary"
                className="h-10 rounded-full bg-emerald-500 px-4 text-sm font-semibold text-black hover:bg-emerald-400"
                onClick={vm.openSurveyEditor}
              >
                <span className="inline-flex items-center gap-2">
                  <FiPlus className="h-4 w-4" />
                  <span>Add Weekly Survey</span>
                </span>
              </Button>
            ) : undefined
          }
        />

        <SectionCard className="mt-4 bg-[#04130d]" contentClassName="space-y-3">
          <SurveysFeedbackTabs activeTab={vm.activeTab} onChange={vm.handleTabChange} />
          <p className="text-xs text-slate-400">
            Review weekly survey responses and ask-a-question submissions, or manage survey variants.
          </p>
        </SectionCard>

        <SectionCard className="mt-4 bg-[#04130d]" contentClassName="space-y-4">
          <TableToolbar
            search={
              <SearchBar
                value={vm.search}
                onChange={vm.setSearch}
                placeholder={searchPlaceholder}
                leftIcon={<FiSearch />}
                className="h-10 bg-[#071810]"
              />
            }
            filters={
              isBuilderTab ? (
                <SurveyBuilderFiltersBar
                  country={vm.filters.country}
                  language={vm.filters.language}
                  sort={vm.filters.sort}
                  weekFilter={vm.builderWeekFilter}
                  weekOptions={vm.weekOptions}
                  onChange={vm.handleFiltersChange}
                  onWeekFilterChange={vm.setBuilderWeekFilter}
                  onClear={vm.clearFilters}
                  countryOptions={vm.countryOptions}
                  languageOptions={vm.languageOptions}
                />
              ) : (
                <SurveysFeedbackFiltersBar
                  filters={vm.filters}
                  onChange={vm.handleFiltersChange}
                  onClear={vm.clearFilters}
                  countryOptions={vm.countryOptions}
                  languageOptions={vm.languageOptions}
                  showUserType
                />
              )
            }
          />
        </SectionCard>

        <div className="mt-6 space-y-4">
          {vm.activeTab === "WeeklySurvey" ? (
            <ResponsesTable rows={vm.weeklyRows} onView={vm.openDetails} />
          ) : null}

          {vm.activeTab === "AskQuestion" ? (
            <QuestionsTable rows={vm.askRows} onView={vm.openDetails} />
          ) : null}

          {vm.activeTab === "SurveyBuilder" ? (
            <SurveyBuilderList
              rows={vm.surveyVariants}
              onEdit={vm.editSurveyDefinition}
              onRemove={vm.removeSurveyDefinition}
              onViewResponses={vm.viewResponsesFromVariant}
            />
          ) : null}

          <TablePagination
            page={vm.page}
            pageSize={vm.pageSize}
            totalItems={vm.total}
            pageSizeOptions={vm.pageSizeOptions}
            onPageChange={vm.setPage}
            onPageSizeChange={vm.setPageSize}
          />
        </div>
      </PageShell>

      <SubmissionDetailsSlideOver
        isOpen={vm.isDetailsOpen}
        submission={vm.selectedSubmission}
        onClose={vm.closeDetails}
      />

      <WeeklySurveyEditorSlideOver
        isOpen={vm.isSurveyEditorOpen}
        onClose={vm.closeSurveyEditor}
        countryOptions={vm.editorCountryOptions}
        languageOptions={vm.editorLanguageOptions}
        countryLanguageMap={vm.editorCountryLanguageMap}
        initialDraft={vm.editorInitialDraft}
        mode={vm.isEditingSurvey ? "edit" : "create"}
        onSave={vm.saveWeeklySurveyDefinition}
      />
    </>
  );
};

export default SurveysFeedbackPage;
