"use client";

import React, { useRef } from "react";
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import { BoundingBoxOverlay } from "./BoundingBoxOverlay";

export function AnswerSheetViewer() {
  const {
    result,
    activePage,
    setActivePage,
    zoomLevel,
    setZoomLevel,
    selectedQuestionId,
    selectQuestion,
  } = useAssessment();

  const containerRef = useRef<HTMLDivElement>(null);

  if (!result) return null;

  const totalPages = result.answerSheetPages.length || 1;
  const currentPageData = result.answerSheetPages.find(
    (p) => p.pageNumber === activePage
  ) || {
    pageNumber: activePage,
    imageUrl: result.answerSheetPages[0]?.imageUrl || "",
    width: 800,
    height: 1100,
  };

  // Find all answer spans on current page
  const pageSpans = result.questions.flatMap((q) =>
    q.answerSpans
      .filter((span) => span.pageNumber === activePage)
      .map((span) => ({
        span,
        question: q,
      }))
  );

  const handlePrevPage = () => {
    if (activePage > 1) {
      setActivePage(activePage - 1);
    }
  };

  const handleNextPage = () => {
    if (activePage < totalPages) {
      setActivePage(activePage + 1);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 15, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 15, 60));
  };

  return (
    <div className="flex-1 flex flex-col h-full rounded-2xl overflow-hidden bg-neutral-900">
      {/* Top Floating / Fixed Toolbar (Matches Figma) */}
      <div className="h-14 bg-sidebar border-b border-sidebar-border px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground tracking-wide">
            Answer Sheet
          </span>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Zoom Controls */}
          <div className="flex items-center bg-sidebar-foreground rounded-xl border border-sidebar-border p-1 text-xs font-semibold text-white shadow-inner">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono select-none">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Page Navigator */}
          <div className="flex items-center bg-sidebar-foreground rounded-xl border border-sidebar-border p-1 text-xs font-semibold text-white shadow-inner">
            <button
              onClick={handlePrevPage}
              disabled={activePage <= 1}
              className="p-1.5 rounded-lg hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-transparent text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2.5 text-[11px] font-medium select-none">
              Page {activePage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={activePage >= totalPages}
              className="p-1.5 rounded-lg hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-transparent text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Answer Sheet Page Canvas Viewport */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center bg-neutral-950/80"
      >
        <div
          style={{
            width: `${(800 * zoomLevel) / 100}px`,
            maxWidth: "none",
          }}
          className="relative transition-all duration-200 bg-card rounded-xl shadow-2xl overflow-hidden border border-border"
        >
          {/* Page Image / SVG Rendering */}
          {currentPageData.imageUrl && (
            <img
              src={currentPageData.imageUrl}
              alt={`Answer Sheet Page ${activePage}`}
              className="w-full h-auto block select-none pointer-events-none"
              draggable={false}
            />
          )}

          {/* Bounding Box Overlays on this page */}
          <div className="absolute inset-0 pointer-events-none">
            {pageSpans.map(({ span, question }) => {
              const isSelected = selectedQuestionId === question.id;
              return (
                <BoundingBoxOverlay
                  key={span.id}
                  box={span.box}
                  label={question.fullLabel}
                  isActive={isSelected}
                  onSelect={() => selectQuestion(question.id)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
