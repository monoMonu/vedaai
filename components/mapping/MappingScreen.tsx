"use client";

import React from "react";
import { useAssessment } from "@/context/AssessmentContext";
import { QuestionList } from "./QuestionList";
import { AnswerSheetViewer } from "./AnswerSheetViewer";
import { AssessmentSummaryModal } from "./AssessmentSummaryModal";
import { Layers, FileText } from "lucide-react";

export function MappingScreen() {
  const { activeMobileTab, setActiveMobileTab } = useAssessment();

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Mobile Top Segmented Tab Switcher (Matches Figma Phone Mockup) */}
      <div className="md:hidden p-3 bg-card border-b border-border flex items-center justify-between gap-3">
        <div className="flex-1 grid grid-cols-2 bg-muted p-1 rounded-2xl border border-border">
          <button
            onClick={() => setActiveMobileTab("questions")}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeMobileTab === "questions"
              ? "bg-sidebar text-sidebar-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Questions</span>
          </button>

          <button
            onClick={() => setActiveMobileTab("answersheet")}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${activeMobileTab === "answersheet"
              ? "bg-sidebar text-sidebar-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Answer Sheet</span>
          </button>
        </div>

        <AssessmentSummaryModal />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
        {/* Left Questions Column */}
        <div
          className={`w-full md:w-[46%] lg:w-[44%] xl:w-[42%] h-full flex flex-col p-3 pt-0 ${activeMobileTab === "questions" ? "flex" : "hidden md:flex"
            }`}
        >
          <QuestionList />
        </div>

        {/* Right Answer Sheet Column */}
        <div
          className={`w-full md:w-[54%] lg:w-[56%] xl:w-[58%] h-full flex flex-col p-3 pt-0 ${activeMobileTab === "answersheet" ? "flex" : "hidden md:flex"
            }`}
        >
          <AnswerSheetViewer />
        </div>
      </div>
    </div>
  );
}
