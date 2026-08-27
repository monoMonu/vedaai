"use client";

import React, { useState } from "react";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import { FileUploadCard } from "./FileUploadCard";
import { UploadedFileMeta } from "@/types/assessment";
import { convertFileToPages } from "@/lib/pdf-utils";
import Image from "next/image";

export function UploadScreen() {
  const {
    questionPaper,
    answerSheet,
    setQuestionPaper,
    setAnswerSheet,
    startMapping,
    error,
  } = useAssessment();

  const [isConvertingQP, setIsConvertingQP] = useState(false);
  const [isConvertingAns, setIsConvertingAns] = useState(false);

  const handleQuestionPaperUpload = async (file: File) => {
    setIsConvertingQP(true);
    try {
      const pages = await convertFileToPages(file);
      const meta: UploadedFileMeta = {
        file,
        name: file.name,
        size: file.size,
        pageCount: pages.length || 1,
        pages,
      };
      setQuestionPaper(meta);
    } catch (err) {
      console.error("Error processing question paper file:", err);
      setQuestionPaper({
        file,
        name: file.name,
        size: file.size,
        pageCount: 1,
      });
    } finally {
      setIsConvertingQP(false);
    }
  };

  const handleAnswerSheetUpload = async (file: File) => {
    setIsConvertingAns(true);
    try {
      const pages = await convertFileToPages(file);
      const meta: UploadedFileMeta = {
        file,
        name: file.name,
        size: file.size,
        pageCount: pages.length || 1,
        pages,
      };
      setAnswerSheet(meta);
    } catch (err) {
      console.error("Error processing answer sheet file:", err);
      setAnswerSheet({
        file,
        name: file.name,
        size: file.size,
        pageCount: 1,
      });
    } finally {
      setIsConvertingAns(false);
    }
  };

  const isReady = Boolean(questionPaper && answerSheet && !isConvertingQP && !isConvertingAns);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:py-10 flex flex-col items-center justify-start bg-background">
      <div className="max-w-4xl w-full flex flex-col items-center my-auto">
        {/* Error Banner */}
        {error && (
          <div className="w-full mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Title Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight flex flex-wrap items-center justify-center gap-2">
            <span>Upload</span>
            <span className="relative px-3 py-1 bg-accent text-accent-foreground rounded-2xl border border-primary/20">
              Question Paper &amp; Answer Sheets
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2.5 font-normal">
            Upload <span className="font-semibold text-foreground">both</span> files to get started
          </p>
        </div>

        {/* Teacher Avatar Badge with Orbiting Orbs */}
        <div className="relative mb-8 flex items-center justify-center mt-6">
          <Image
            src={"/assets/teacher.png"}
            alt="Teacher"
            width={500}
            height={500}
            className="rounded-full w-30 h-30"
          />
        </div>

        {/* Dual Upload Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full mb-8">
          <div className="relative">
            <FileUploadCard
              label="Question Paper"
              fileMeta={questionPaper}
              onFileSelect={handleQuestionPaperUpload}
              onRemove={() => setQuestionPaper(null)}
            />
            {isConvertingQP && (
              <div className="absolute inset-0 bg-card/80 backdrop-blur-xs rounded-3xl flex items-center justify-center gap-2 text-xs font-semibold text-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Rendering PDF pages...</span>
              </div>
            )}
          </div>

          <div className="relative">
            <FileUploadCard
              label="Answer Sheet"
              fileMeta={answerSheet}
              onFileSelect={handleAnswerSheetUpload}
              onRemove={() => setAnswerSheet(null)}
            />
            {isConvertingAns && (
              <div className="absolute inset-0 bg-card/80 backdrop-blur-xs rounded-3xl flex items-center justify-center gap-2 text-xs font-semibold text-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Rendering PDF pages...</span>
              </div>
            )}
          </div>
        </div>

        {/* Start Mapping Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={startMapping}
            disabled={!isReady}
            className={`px-8 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer ${isReady
              ? "bg-sidebar-foreground text-sidebar hover:bg-primary shadow-lg hover:shadow-xl active:scale-[0.98]"
              : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
              }`}
          >
            <span>Start Mapping</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-xs text-muted-foreground text-center max-w-md">
            Once both files are uploaded, you&apos;ll able to map answers with questions
          </p>
        </div>
      </div>
    </div>
  );
}
