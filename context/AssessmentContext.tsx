"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  AssessmentResult,
  UploadedFileMeta,
  Question,
  AnswerSpan,
  AnswerSheetPage,
} from "@/types/assessment";

interface AssessmentContextType {
  status: "idle" | "uploading" | "processing" | "completed" | "error";
  error: string | null;
  questionPaper: UploadedFileMeta | null;
  answerSheet: UploadedFileMeta | null;
  result: AssessmentResult | null;
  selectedQuestionId: string | null;
  selectedAnswerSpanId: string | null;
  activePage: number;
  zoomLevel: number;
  expandedQuestions: Record<string, boolean>;
  activeMobileTab: "questions" | "answersheet";
  isSidebarCollapsed: boolean;
  setQuestionPaper: (file: UploadedFileMeta | null) => void;
  setAnswerSheet: (file: UploadedFileMeta | null) => void;
  startMapping: () => Promise<void>;
  selectQuestion: (questionId: string) => void;
  selectAnswerSpan: (spanId: string) => void;
  toggleExpand: (questionId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  setActivePage: (page: number) => void;
  setZoomLevel: (zoom: number | ((prev: number) => number)) => void;
  setActiveMobileTab: (tab: "questions" | "answersheet") => void;
  toggleSidebar: () => void;
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

export function AssessmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<
    "idle" | "uploading" | "processing" | "completed" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [questionPaper, setQuestionPaper] = useState<UploadedFileMeta | null>(
    null
  );
  const [answerSheet, setAnswerSheet] = useState<UploadedFileMeta | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );
  const [selectedAnswerSpanId, setSelectedAnswerSpanId] = useState<
    string | null
  >(null);
  const [activePage, setActivePage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [expandedQuestions, setExpandedQuestions] = useState<
    Record<string, boolean>
  >({});
  const [activeMobileTab, setActiveMobileTab] = useState<
    "questions" | "answersheet"
  >("questions");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const selectQuestion = useCallback(
    (questionId: string) => {
      setSelectedQuestionId(questionId);
      setExpandedQuestions((prev) => ({ ...prev, [questionId]: true }));

      if (result) {
        const question = result.questions.find((q) => q.id === questionId);
        if (question && question.answerSpans.length > 0) {
          const firstSpan = question.answerSpans[0];
          setActivePage(firstSpan.pageNumber);
          setSelectedAnswerSpanId(firstSpan.id);
        } else {
          setSelectedAnswerSpanId(null);
        }
      }
    },
    [result]
  );

  const selectAnswerSpan = useCallback(
    (spanId: string) => {
      setSelectedAnswerSpanId(spanId);
      if (result) {
        const targetQ = result.questions.find((q) =>
          q.answerSpans.some((s) => s.id === spanId)
        );
        if (targetQ) {
          setSelectedQuestionId(targetQ.id);
          setExpandedQuestions((prev) => ({ ...prev, [targetQ.id]: true }));
        }
      }
    },
    [result]
  );

  const toggleExpand = useCallback((questionId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  }, []);

  const expandAll = useCallback(() => {
    if (!result) return;
    const allExpanded: Record<string, boolean> = {};
    result.questions.forEach((q) => {
      allExpanded[q.id] = true;
    });
    setExpandedQuestions(allExpanded);
  }, [result]);

  const collapseAll = useCallback(() => {
    setExpandedQuestions({});
  }, []);

  const startMapping = useCallback(async () => {
    if (!questionPaper || !answerSheet) return;

    setStatus("processing");
    setIsSidebarCollapsed(true);
    setError(null);

    try {
      const qpPages = questionPaper.pages || [];
      const ansPages = answerSheet.pages || [];

      const qpImages = qpPages.map((p) => p.imageUrl);
      const ansImages = ansPages.map((p) => p.imageUrl);

      const res = await fetch("/api/process-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionPaperImages: qpImages,
          answerSheetImages: ansImages,
          examTitle: questionPaper.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process assessment");
      }

      const parsed: AssessmentResult = data;
      
      // Ensure the actual uploaded pages are linked to the result
      parsed.answerSheetPages = ansPages.length > 0 ? ansPages : [
        {
          pageNumber: 1,
          imageUrl: ansImages[0] || "",
          width: 800,
          height: 1100,
        },
      ];

      setResult(parsed);
      if (parsed.questions.length > 0) {
        const firstQ = parsed.questions[0];
        setSelectedQuestionId(firstQ.id);
        setExpandedQuestions({ [firstQ.id]: true });
        if (firstQ.answerSpans.length > 0) {
          setActivePage(firstQ.answerSpans[0].pageNumber);
          setSelectedAnswerSpanId(firstQ.answerSpans[0].id);
        }
      }
      setStatus("completed");
    } catch (err: unknown) {
      console.error("Extraction error:", err);
      const msg = err instanceof Error ? err.message : "An error occurred while analyzing the files.";
      setError(msg);
      setStatus("idle");
    }
  }, [questionPaper, answerSheet]);

  const resetAssessment = useCallback(() => {
    setStatus("idle");
    setError(null);
    setQuestionPaper(null);
    setAnswerSheet(null);
    setResult(null);
    setSelectedQuestionId(null);
    setSelectedAnswerSpanId(null);
    setActivePage(1);
    setZoomLevel(100);
    setIsSidebarCollapsed(false);
  }, []);

  return (
    <AssessmentContext.Provider
      value={{
        status,
        error,
        questionPaper,
        answerSheet,
        result,
        selectedQuestionId,
        selectedAnswerSpanId,
        activePage,
        zoomLevel,
        expandedQuestions,
        activeMobileTab,
        isSidebarCollapsed,
        setQuestionPaper,
        setAnswerSheet,
        startMapping,
        selectQuestion,
        selectAnswerSpan,
        toggleExpand,
        expandAll,
        collapseAll,
        setActivePage,
        setZoomLevel,
        setActiveMobileTab,
        toggleSidebar,
        resetAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
}
