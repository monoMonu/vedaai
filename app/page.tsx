"use client";

import React from "react";
import { useAssessment } from "@/context/AssessmentContext";
import { Sidebar } from "@/components/common/Sidebar";
import { Header } from "@/components/common/Header";
import { UploadScreen } from "@/components/upload/UploadScreen";
import { LoadingState } from "@/components/processing/LoadingState";
import { MappingScreen } from "@/components/mapping/MappingScreen";

export default function Home() {
  const { status } = useAssessment();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Collapsible Veda AI Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />

        <main className="flex-1 flex flex-col overflow-hidden relative">
          {(status === "idle" || status === "uploading") && <UploadScreen />}
          {status === "processing" && <LoadingState />}
          {status === "completed" && <MappingScreen />}
        </main>
      </div>
    </div>
  );
}
