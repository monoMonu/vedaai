"use client";

import React from "react";
import {
  ArrowLeft,
  FileText,
  HelpCircle,
  Bell,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";

export function Header() {
  const { resetAssessment } = useAssessment();

  return (
    <header className="h-16 border-b border-border rounded-2xl m-3 bg-card/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={resetAssessment}
          className="p-2 rounded-lg hover:bg-muted text-neutral-600 hover:text-foreground transition-colors cursor-pointer"
          title="Back to Upload"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span>Exams</span>
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Help & Documentation"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <button
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
        </button>

        <button
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="AI Assistant"
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden ring-2 ring-border">
            <span className="text-amber-300">M</span>
          </div>
          <span className="text-sm font-semibold text-foreground hidden md:inline-block">
            Monu
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:inline-block" />
        </div>
      </div>
    </header>
  );
}
