import React from "react";
import { FiPlus, FiSearch, FiTag } from "react-icons/fi";
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
import SurveysFeedbackInsights from "../../components/surveys-feedback/SurveysFeedbackInsights";
import TagsManagerSlideOver from "../../components/surveys-feedback/TagsManagerSlideOver";
import { useSurveysFeedbackPage } from "./useSurveysFeedbackPage";

export const SurveysFeedbackPage: React.FC = () => {
  const vm = useSurveysFeedbackPage();

  const isBuilderTab = vm.activeTab === "SurveyBuilder";
  const isAskTab = vm.activeTab === "AskQuestion";

  const searchPlaceholder = isBuilderTab
    ? "Search by question, option, country, language, week..."
    : isAskTab
    ? "Search by question, message, answer, tags, user..."
    : "Search by question, answer, user name/email, user ID...";

  const actions = (
    <div className="flex items-center gap-2">
      {isAskTab ? (
        <Button
          variant="secondary"
          className="h-10 rounded-full border border-white/10 bg-transparent px-4 text-sm font-semibold hover:bg-white/5"
          onClick={vm.openTagsManager}
        >
          <span className="inline-flex items-center gap-2">
            <FiTag className="h-4 w-4" />
            <span>Manage Tags</span>
          </span>
        </Button>
      ) : null}

      {isBuilderTab ? (
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
      ) : null}
    </div>
  );

  return (
    <>
      <PageShell>
        <PageHeader
          title="Surveys & Feedback"
          subtitle="Review weekly survey responses, ask-a-question submissions, and survey variants."
          actions={actions}
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
                  showAskStatus={isAskTab}
                  showTags={isAskTab}
                  tagOptions={vm.tagOptions}
                />
              )
            }
          />
        </SectionCard>

        <div className="mt-6 space-y-4">
          {/* NEW charts */}
          {isAskTab ? <SurveysFeedbackInsights rows={vm.askInsightsRows} /> : null}

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
        tagOptions={vm.tagOptions}
        onUpdateAskQuestion={vm.updateAskQuestion}
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

      {/*  NEW: tag manager */}
      <TagsManagerSlideOver
        isOpen={vm.isTagsManagerOpen}
        onClose={vm.closeTagsManager}
        tags={vm.tagOptions}
        onCreate={vm.createTag}
        onDelete={vm.deleteTag}
      />
    </>
  );
};

export default SurveysFeedbackPage;
