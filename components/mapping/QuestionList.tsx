"use client";

import React, { useState } from "react";
import { useAssessment } from "@/context/AssessmentContext";
import { QuestionCard } from "./QuestionCard";
import { ChevronDown, ChevronUp } from "lucide-react";

export function QuestionList() {
  const { result, expandAll, collapseAll, expandedQuestions } = useAssessment();
  const [filter, setFilter] = useState<"all" | "answered" | "unanswered">("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!result) return null;

  const allExpanded =
    result.questions.length > 0 &&
    result.questions.every((q) => expandedQuestions[q.id]);

  const filteredQuestions = result.questions.filter((q) => {
    if (filter === "answered" && q.status === "unanswered") return false;
    if (filter === "unanswered" && q.status !== "unanswered") return false;
    if (searchQuery.trim()) {
      const qText = `${q.fullLabel} ${q.text} ${q.keyConcept || ""}`.toLowerCase();
      return qText.includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-card/60 border-r border-border rounded-2xl">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              Extracted Questions{" "}
              <span className="text-muted-foreground font-normal text-xs">
                (from question paper)
              </span>
            </h2>
          </div>

          {/* Expand / Collapse All */}
          <button
            onClick={allExpanded ? collapseAll : expandAll}
            className="text-xs font-semibold text-foreground hover:text-foreground/80 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{allExpanded ? "Collapse All" : "Expand All"}</span>
            {allExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${filter === "all"
              ? "bg-sidebar text-sidebar-foreground shadow-xs"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
          >
            All ({result.questions.length})
          </button>
          <button
            onClick={() => setFilter("answered")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${filter === "answered"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
          >
            Answered (
            {result.questions.filter((q) => q.status !== "unanswered").length}
            )
          </button>
          <button
            onClick={() => setFilter("unanswered")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${filter === "unanswered"
              ? "bg-destructive text-destructive-foreground shadow-xs"
              : "bg-destructive/10 text-destructive hover:bg-destructive/20"
              }`}
          >
            Unanswered (
            {result.questions.filter((q) => q.status === "unanswered").length}
            )
          </button>
        </div>
      </div>

      {/* Questions Scrollable List */}
      <div className="h-full relative flex-1 overflow-y-auto p-4 sm:p-5">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No questions matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
