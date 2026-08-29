"use client";

import React from "react";
import { useAssessment } from "@/context/AssessmentContext";
import { QuestionList } from "./QuestionList";
import { AnswerSheetViewer } from "./AnswerSheetViewer";

export function MappingScreen() {
  const { activeMobileTab, setActiveMobileTab } = useAssessment();

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Mobile Top Segmented Tab Switcher (Matches Figma Phone Mockup) */}
      <div className="md:hidden mb-3 w-full bg-background flex items-center justify-center gap-3 px-4">
        <div className="flex-1 grid grid-cols-2 bg-white p-1 rounded-full shadow-2xs">
          <button
            onClick={() => setActiveMobileTab("questions")}
            className={`py-2 rounded-full text-sm font-semibold transition-all text-center cursor-pointer ${activeMobileTab === "questions"
              ? "bg-[#232730] text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Questions
          </button>

          <button
            onClick={() => setActiveMobileTab("answersheet")}
            className={`py-2 rounded-full text-sm font-semibold transition-all text-center cursor-pointer ${activeMobileTab === "answersheet"
              ? "bg-[#232730] text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Answer Sheet
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
        {/* Left Questions Column */}
        <div
          className={`w-full md:w-[46%] lg:w-[44%] xl:w-[42%] h-full flex flex-col p-3 md:pr-0 pt-0 ${activeMobileTab === "questions" ? "flex" : "hidden md:flex"
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
