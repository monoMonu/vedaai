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

  const displayBadge = label.startsWith("Q") || label.startsWith("q")
    ? label.toUpperCase()
    : `Q${label}`;

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
        "absolute rounded-2xl transition-all duration-200 cursor-pointer pointer-events-auto",
        isActive
          ? "border-[2.5px] border-[#22C55E] bg-[#22C55E]/10 bounding-box-active z-20"
          : "border-2 border-[#22C55E]/60 bg-[#22C55E]/5 hover:border-[#22C55E] hover:bg-[#22C55E]/15 z-10"
      )}
    >
      {/* Docked Tag Pill (Matches Figma neon green Q2 tag) */}
      <div
        className={cn(
          "absolute -top-3.5 left-2 px-2 py-0.5 rounded-md font-black text-[11px] shadow-md transition-transform flex items-center justify-center select-none tracking-tight",
          isActive
            ? "bg-[#22C55E] text-white scale-105"
            : "bg-[#16A34A] text-white hover:bg-[#22C55E]"
        )}
      >
        {displayBadge}
      </div>
    </div>
  );
}
