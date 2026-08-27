"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export function LoadingState() {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "Analyzing Question Paper structure & sub-parts...",
    "Extracting student handwriting & mathematical formulas...",
    "Localizing bounding box coordinates across pages...",
    "Grading answers & synthesizing teacher AI feedback...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 bg-background">
      <div className="flex flex-col items-center max-w-sm text-center">
        {/* Animated Sparkling Stars Icon (Matches Figma) */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-accent border border-primary/20 flex items-center justify-center shadow-lg relative">
            <svg
              className="w-14 h-14 text-primary animate-pulse"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
            <div className="absolute -top-2 -right-2 w-6 h-6 text-amber-500 animate-bounce">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -left-1 w-5 h-5 text-orange-400 animate-pulse">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title and Subtitle */}
        <h2 className="text-2xl font-black text-foreground tracking-tight">
          Extracting...
        </h2>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          This may take a while
        </p>

        {/* Animated Extraction Milestones */}
        <div className="w-full bg-card rounded-2xl border border-border p-4 shadow-xs text-left flex flex-col gap-2.5">
          {steps.map((step, idx) => {
            const isDone = idx < stepIndex;
            const isCurrent = idx === stepIndex;
            return (
              <div
                key={step}
                className={`flex items-center gap-2.5 text-xs transition-opacity duration-300 ${
                  isDone
                    ? "text-muted-foreground font-normal"
                    : isCurrent
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground/40 font-normal"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-border shrink-0" />
                )}
                <span className="truncate">{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
