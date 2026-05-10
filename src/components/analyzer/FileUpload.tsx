"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Loader2,
  X,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isAnalyzing: boolean;
}

export const FileUpload = ({ onFileSelected, isAnalyzing }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      setSelectedFile(files[0]);
      onFileSelected(files[0]);
    }
  }, [onFileSelected]);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files?.[0]) {
        setSelectedFile(files[0]);
        onFileSelected(files[0]);
      }
    },
    [onFileSelected]
  );

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.label
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            htmlFor="resume-upload"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              flex flex-col items-center justify-center w-full h-64 
              rounded-3xl border-2 border-dashed cursor-pointer
              transition-all duration-500 group
              ${isDragging
                ? "border-rcb-red bg-rcb-red/5 scale-[1.02]"
                : "border-white/10 hover:border-rcb-red/50 hover:bg-white/[0.02]"
              }
            `}
          >
            <div className="flex flex-col items-center gap-4 p-8">
              <motion.div
                animate={isDragging ? { scale: 1.2, y: -5 } : { scale: 1, y: 0 }}
                className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-rcb-red/10 flex items-center justify-center transition-colors"
              >
                <Upload className="w-8 h-8 text-white/40 group-hover:text-rcb-red transition-colors" />
              </motion.div>
              <div className="text-center">
                <p className="text-sm font-bold text-white/80 mb-1">
                  Drop your resume here
                </p>
                <p className="text-xs text-white/30">
                  PDF or TXT • Max 10MB
                </p>
              </div>
              <div className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/50 group-hover:text-white group-hover:border-rcb-red/30 transition-all">
                BROWSE FILES
              </div>
            </div>
            <input
              id="resume-upload"
              type="file"
              className="hidden"
              accept=".pdf,.txt"
              onChange={handleFileInput}
            />
          </motion.label>
        ) : (
          <motion.div
            key="selected"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-6 rounded-2xl glass border-white/5"
          >
            <div className="w-12 h-12 rounded-xl bg-rcb-red/10 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-rcb-red" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{selectedFile.name}</p>
              <p className="text-xs text-white/40">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            {isAnalyzing ? (
              <Loader2 className="w-5 h-5 text-rcb-red animate-spin shrink-0" />
            ) : (
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors shrink-0"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
