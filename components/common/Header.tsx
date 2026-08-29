"use client";

import React from "react";
import {
  ArrowLeft,
  FileText,
  HelpCircle,
  Bell,
  Sparkles,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import Image from "next/image";

export function Header() {
  const { resetAssessment, toggleSidebar } = useAssessment();

  return (
    <header className="h-16 border-b border-border rounded-2xl m-3 bg-card/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left Breadcrumb / Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={resetAssessment}
          className="p-1.5 sm:p-2 rounded-lg hover:bg-muted text-foreground transition-colors cursor-pointer"
          title="Back to Upload"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-foreground md:hidden">
            VedaAI
          </span>
          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText className="w-4 h-4 text-foreground" />
            <span>Exams</span>
          </div>
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          className="hidden sm:inline-flex p-2 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer"
          title="Help & Documentation"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <button
          className="p-2 rounded-full hover:bg-muted text-foreground transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
        </button>

        <button
          className="hidden sm:inline-flex p-2 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer"
          title="AI Assistant"
        >
          <Sparkles className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 sm:pl-2">
          <Image
            src="https://picsum.photos/200"
            alt="User"
            width={500}
            height={500}
            className="rounded-full w-8 h-8"
          />
          <span className="text-sm font-semibold text-foreground hidden md:inline-block">
            Monu
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:inline-block" />
        </div>

        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-muted text-foreground md:hidden transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
