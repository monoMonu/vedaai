"use client";

import React, { useState } from "react";
import {
  Award,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  FileDown,
  Sparkles,
} from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AssessmentSummaryModal() {
  const { result } = useAssessment();
  const [open, setOpen] = useState(false);

  if (!result) return null;

  const answeredCount = result.questions.filter(
    (q) => q.status !== "unanswered"
  ).length;
  const unansweredCount = result.questions.filter(
    (q) => q.status === "unanswered"
  ).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer">
            <Award className="w-3.5 h-3.5" />
            <span>Grading Summary</span>
          </button>
        }
      />

      <DialogContent className="max-w-md w-full p-6 bg-card rounded-3xl border border-border shadow-2xl">
        <DialogHeader className="p-0 mb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="w-4 h-4" />
            <span>Automated Grading Report</span>
          </div>
          <DialogTitle className="text-xl font-extrabold text-foreground">
            {result.examTitle}
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            Student: <span className="font-semibold text-foreground">{result.studentName}</span>
          </p>
        </DialogHeader>

        {/* Score Card */}
        <div className="rounded-2xl bg-sidebar text-white p-5 flex items-center justify-between mb-4 shadow-md">
          <div>
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Score
            </span>
            <div className="text-3xl font-black text-white mt-0.5">
              {result.totalScoredMarks}
              <span className="text-lg font-medium text-neutral-400">
                /{result.totalMaxMarks}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-lg border border-emerald-500/40">
              {result.percentage}%
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">Grade: A</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-900">
                {answeredCount} Answered
              </div>
              <span className="text-[11px] text-emerald-600">
                Mapped to paper
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <div>
              <div className="text-xs font-bold text-destructive">
                {unansweredCount} Unanswered
              </div>
              <span className="text-[11px] text-destructive/80">
                0 marks awarded
              </span>
            </div>
          </div>
        </div>

        {/* AI Synthesis */}
        <div className="rounded-2xl bg-muted/60 border border-border p-4 mb-4">
          <h4 className="text-xs font-bold text-foreground mb-1 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-primary" />
            <span>AI Teacher Insight</span>
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {result.summaryFeedback}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-sidebar hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Print / Save Summary</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
