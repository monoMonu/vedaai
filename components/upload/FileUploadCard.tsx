"use client";

import React, { useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { UploadedFileMeta } from "@/types/assessment";

interface FileUploadCardProps {
  label: "Question Paper" | "Answer Sheet";
  fileMeta: UploadedFileMeta | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

export function FileUploadCard({
  label,
  fileMeta,
  onFileSelect,
  onRemove,
}: FileUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(0)}MB`;
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleChange}
      />

      {!fileMeta ? (
        // Empty Upload Zone
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border hover:border-primary/60 bg-card/70 hover:bg-card rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md group"
        >
          <div className="w-12 h-12 rounded-2xl bg-muted group-hover:bg-accent flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
            <Upload className="w-5 h-5" />
          </div>

          <div className="text-center mt-2">
            <p className="text-lg font-semibold text-foreground">
              Upload <span className="text-primary">{label}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Max 10MB</p>
          </div>
        </div>
      ) : (
        // Filled File State
        <div className="border-2 border-dashed border-border bg-card/60 rounded-3xl p-6 sm:p-8 flex items-center justify-center">
          <div className="w-full bg-card rounded-2xl border border-border p-4 flex items-center justify-between shadow-xs relative group">
            <div className="flex items-center gap-3.5 overflow-hidden">
              <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-sm font-semibold text-foreground truncate">
                  {fileMeta.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(fileMeta.size)} • {fileMeta.pageCount} {fileMeta.pageCount === 1 ? "Page" : "Pages"}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="w-7 h-7 rounded-full bg-neutral-600 hover:bg-neutral-800 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer shadow-xs"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
