"use client";

import React from "react";
import { ChevronDown, ChevronUp, Sparkles, Layers, AlertCircle } from "lucide-react";
import { Question } from "@/types/assessment";
import { useAssessment } from "@/context/AssessmentContext";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const {
    selectedQuestionId,
    selectQuestion,
    expandedQuestions,
    toggleExpand,
  } = useAssessment();

  const isSelected = selectedQuestionId === question.id;
  const isExpanded = Boolean(expandedQuestions[question.id]);

  const isFullMarks =
    question.scoredMarks === question.maxMarks && question.maxMarks > 0;
  const isZeroMarks = question.scoredMarks === 0;

  const hasMultiPageAnswer = question.answerSpans.length > 1;

  return (
    <div
      onClick={() => selectQuestion(question.id)}
      className={cn(
        "rounded-2xl bg-card border mb-3.5 transition-all duration-200 cursor-pointer overflow-hidden shadow-xs hover:shadow-sm",
        isSelected
          ? "border-primary ring-2 ring-primary/20 shadow-md"
          : "border-border hover:border-neutral-300"
      )}
    >
      {/* Main Header Bar */}
      <div className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4 justify-between">
        {/* Left Number & Text */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Question Number Badge */}
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors",
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-foreground text-background"
            )}
          >
            {question.fullLabel}
          </div>

          {/* Question Text */}
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-sm font-semibold text-foreground leading-snug">
              {question.text}
            </p>

            {/* Badges for Edge Cases (Multi-page, Unanswered) */}
            <div className="flex items-center gap-2 mt-2">
              {question.status === "unanswered" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-destructive bg-destructive/10 border border-destructive/20 px-2 py-0.5 rounded-md">
                  <AlertCircle className="w-3 h-3" />
                  Unanswered
                </span>
              )}

              {hasMultiPageAnswer && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md">
                  <Layers className="w-3 h-3" />
                  Spans {question.answerSpans.length} pages
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Score Pill & Expand Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Marks Score Badge */}
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold border tracking-wide",
              isFullMarks
                ? "bg-emerald-50 text-emerald-600 border-emerald-200/80"
                : isZeroMarks
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-amber-50 text-amber-600 border-amber-200/80"
            )}
          >
            {question.scoredMarks}/{question.maxMarks}
          </span>

          {/* Chevron Collapse */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(question.id);
            }}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded AI Feedback Section */}
      {isExpanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
          <div className="rounded-xl bg-muted/60 border border-border p-3.5 sm:p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>AI Feedback</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {question.aiFeedback}
            </p>

            {question.keyConcept && (
              <div className="mt-2.5 pt-2 border-t border-border flex items-center gap-2">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Concept:
                </span>
                <span className="text-[11px] font-medium text-foreground">
                  {question.keyConcept}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
