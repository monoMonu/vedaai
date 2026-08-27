"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  FileSpreadsheet,
  BookOpen,
  Settings,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  ChevronsRight,
} from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useAssessment();

  const navItems = [
    { icon: LayoutDashboard, label: "Home", active: false },
    { icon: Users, label: "My Classroom", active: false },
    { icon: FileCheck2, label: "Assignments", active: false },
    { icon: FileSpreadsheet, label: "Exams", active: true },
    { icon: BookOpen, label: "My Library", active: false },
  ];

  return (
    <aside
      className={cn(
        "transition-all duration-300 z-40 shrink-0 h-screen sticky top-0 p-3",
        isSidebarCollapsed ? "w-20" : "w-68"
      )}
    >
      <div
        className={cn(
          "bg-sidebar text-sidebar-foreground border-r border-sidebar-border rounded-md flex flex-col justify-between min-w-full h-full rounded-2xl",
          isSidebarCollapsed ? "w-18 p-3" : "w-64 p-4"
        )}
      >
        {/* Top Section */}
        <div className="flex flex-col gap-5">
          {/* Brand Logo & Collapse toggle */}
          <div className="flex items-center justify-between pt-1 px-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <Image
                src={'/assets/logo.png'}
                alt="Logo"
                width={40}
                height={40}
              />
              {!isSidebarCollapsed && (
                <span className="font-bold text-2xl tracking-tight text-foreground">
                  VedaAI
                </span>
              )}
            </div>
          </div>

          {/* AI Teacher's Toolkit Button (Matches Figma dark pill with orange rim) */}
          <div>
            {isSidebarCollapsed ? (
              <button
                onClick={toggleSidebar}
                className="w-12 h-12 mx-auto rounded-2xl bg-neutral-900 border border-primary/50 shadow-[0_0_15px_rgba(255,94,58,0.25)] flex items-center justify-center text-primary hover:border-primary transition-all cursor-pointer"
                title="AI Teacher's Toolkit"
              >
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </button>
            ) : (
              <button className="w-full py-2.5 px-3.5 rounded-full bg-neutral-900 border-2 border-primary/80 shadow-[0_0_15px_rgba(255,94,58,0.2)] flex items-center justify-center gap-2 text-white font-semibold text-xs tracking-wide hover:border-primary hover:shadow-[0_0_20px_rgba(255,94,58,0.35)] transition-all cursor-pointer">
                <Sparkles className="w-4 h-4" />
                <span>AI Teacher&apos;s Toolkit</span>
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer",
                    item.active
                      ? "bg-muted text-foreground font-semibold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    isSidebarCollapsed && "justify-center px-0 h-10"
                  )}
                  title={item.label}
                >
                  <Icon className={cn("w-5 h-5 shrink-0", item.active ? "text-foreground" : "text-muted-foreground")} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-3 pb-2 items-end">
          {/* Settings */}
          {!isSidebarCollapsed && (
            <button
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
              title="Settings"
            >
              <Settings className="w-5 h-5 shrink-0" />
              <span>Settings</span>
            </button>
          )}

          {/* School Profile Card */}
          {!isSidebarCollapsed ? (
            <div className="w-full p-3 rounded-2xl bg-muted/60 border border-border flex items-center gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 text-xs font-bold shrink-0">
                DPS
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-foreground truncate">
                  Delhi Public School
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  Bokaro Steel City
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-2">
              <div
                className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 text-xs font-bold shadow-2xs cursor-pointer"
                title="Delhi Public School - Bokaro Steel City"
              >
                DPS
              </div>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
