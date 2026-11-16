"use client";

import React, { useRef } from "react";
import { Upload, FileText, Trash2, RefreshCw } from "lucide-react";

export interface DocumentFile {
  name: string;
  size?: string;
  data?: string;
}

export interface DocumentUploadProps {
  label: string;
  required?: boolean;
  file: DocumentFile | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  accept?: string;
  error?: string;
  uploading?: boolean;
  className?: string;
  helperText?: string;
}

export default function DocumentUpload({
  label,
  required = false,
  file,
  onFileSelect,
  onFileRemove,
  accept = ".pdf,.doc,.docx",
  error,
  uploading = false,
  className = "",
  helperText,
}: DocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      onFileSelect(selected);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      <label className="text-xs font-medium text-slate-600 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {file ? (
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in duration-200">
          <div className="flex items-center gap-2 overflow-hidden min-w-0 pr-2">
            <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold text-slate-700 truncate">{file.name}</p>
            {file.size && (
              <span className="text-[10px] text-slate-400 shrink-0 font-normal">
                ({file.size})
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 rounded-full text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
            title="Remove file"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-full px-4 py-4 rounded-xl border border-dashed transition-all text-sm text-center cursor-pointer flex items-center justify-center ${
            error
              ? "border-red-400 bg-red-50"
              : "border-slate-200 bg-slate-50 hover:bg-slate-100 focus:bg-white"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />
          {uploading ? (
            <span className="text-orange-600 font-medium text-xs flex items-center justify-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-500" /> Uploading...
            </span>
          ) : (
            <span className="text-slate-500 font-medium text-xs flex items-center justify-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Click to upload
            </span>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-[10px] ml-1 font-medium">{error}</p>}
      {!error && helperText && <p className="text-slate-400 text-[10px] ml-1">{helperText}</p>}
    </div>
  );
}
