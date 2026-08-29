"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Hand,
} from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import { BoundingBoxOverlay } from "./BoundingBoxOverlay";
import { cn } from "@/lib/utils";

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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const [touchDistance, setTouchDistance] = useState<number | null>(null);

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
    setZoomLevel((prev) => Math.min(prev + 15, 250));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 15, 50));
  };

  // Mouse drag-to-pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    // Don't drag if clicking directly on an active bounding box
    if ((e.target as HTMLElement).closest(".bounding-box-active")) return;

    setIsDragging(true);
    setDragStart({
      x: e.pageX - containerRef.current.offsetLeft,
      y: e.pageY - containerRef.current.offsetTop,
      scrollLeft: containerRef.current.scrollLeft,
      scrollTop: containerRef.current.scrollTop,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - dragStart.x) * 1.2;
    const walkY = (y - dragStart.y) * 1.2;
    containerRef.current.scrollLeft = dragStart.scrollLeft - walkX;
    containerRef.current.scrollTop = dragStart.scrollTop - walkY;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pan & pinch zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].pageX - containerRef.current.offsetLeft,
        y: e.touches[0].pageY - containerRef.current.offsetTop,
        scrollLeft: containerRef.current.scrollLeft,
        scrollTop: containerRef.current.scrollTop,
      });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      setTouchDistance(dist);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    if (e.touches.length === 1 && isDragging) {
      const x = e.touches[0].pageX - containerRef.current.offsetLeft;
      const y = e.touches[0].pageY - containerRef.current.offsetTop;
      const walkX = x - dragStart.x;
      const walkY = y - dragStart.y;
      containerRef.current.scrollLeft = dragStart.scrollLeft - walkX;
      containerRef.current.scrollTop = dragStart.scrollTop - walkY;
    } else if (e.touches.length === 2 && touchDistance !== null) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const delta = dist - touchDistance;
      if (Math.abs(delta) > 5) {
        if (delta > 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
        setTouchDistance(dist);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchDistance(null);
  };

  // Wheel zoom with Ctrl key
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full rounded-2xl overflow-hidden bg-neutral-900 shadow-md select-none">
      {/* Top Dark Toolbar */}
      <div className="h-14 bg-sidebar-foreground border-b border-neutral-800 px-3 sm:px-6 flex items-center justify-between sm:justify-none z-20 shrink-0">
        {/* Desktop Title */}
        <div className="hidden sm:flex items-center gap-2 flex-1">
          <span className="text-sm font-semibold text-white tracking-wide">
            Answer Sheet
          </span>
        </div>

        {/* Zoom Controls Pill */}
        <div className="flex items-center bg-background/10 rounded-md p-1 text-xs font-semibold text-white shadow-inner mr-2">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 text-[11px] font-mono select-none">
            {zoomLevel}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Page Navigator Pill */}
        <div className="flex items-center bg-background/10 rounded-md p-1 text-xs font-semibold text-white shadow-inner">
          <button
            onClick={handlePrevPage}
            disabled={activePage <= 1}
            className="p-1.5 rounded-lg hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2.5 text-[11px] font-medium select-none whitespace-nowrap">
            Page {activePage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={activePage >= totalPages}
            className="p-1.5 rounded-lg hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Answer Sheet Page Canvas Viewport with Pan / Hand Drag Support */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn(
          "flex-1 overflow-auto bg-neutral-950/90 p-2 sm:p-4 touch-none flex",
          zoomLevel > 100 ? "items-start justify-start" : "items-start justify-center",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        <div
          style={{
            width: `${zoomLevel}%`,
            minWidth: zoomLevel > 100 ? `${zoomLevel}%` : undefined,
            maxWidth: zoomLevel <= 100 ? "100%" : "none",
          }}
          className={cn(
            "relative transition-all duration-100 overflow-hidden",
            zoomLevel <= 100 ? "mx-auto my-auto sm:my-0" : "m-0"
          )}
        >
          {/* Page Image */}
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
