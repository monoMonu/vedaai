"use client";

import React from "react";
import { NormalizedBoundingBox } from "@/types/assessment";
import { cn } from "@/lib/utils";

interface BoundingBoxOverlayProps {
  box: NormalizedBoundingBox;
  label: string;
  isActive: boolean;
  onSelect: () => void;
}

export function BoundingBoxOverlay({
  box,
  label,
  isActive,
  onSelect,
}: BoundingBoxOverlayProps) {
  const topPercent = box.ymin * 100;
  const leftPercent = box.xmin * 100;
  const widthPercent = (box.xmax - box.xmin) * 100;
  const heightPercent = (box.ymax - box.ymin) * 100;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{
        top: `${topPercent}%`,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        height: `${heightPercent}%`,
      }}
      className={cn(
        "absolute rounded-xl transition-all duration-200 cursor-pointer pointer-events-auto",
        isActive
          ? "border-2 border-emerald-500 bg-emerald-500/10 bounding-box-active z-20"
          : "border-2 border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/80 hover:bg-emerald-500/15 z-10"
      )}
    >
      {/* Docked Tag Pill (Matches Figma neon green Q2 tag) */}
      <div
        className={cn(
          "absolute -top-3.5 left-2 px-2 py-0.5 rounded-md font-bold text-xs shadow-md transition-transform flex items-center justify-center select-none",
          isActive
            ? "bg-emerald-500 text-white scale-105"
            : "bg-emerald-600/90 text-white hover:bg-emerald-600"
        )}
      >
        Q{label}
      </div>
    </div>
  );
}
