"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  X,
  Loader2,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { toast } from "sonner";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const analyzeResume = async () => {
    if (!file) {
      toast.error("Please upload your resume first");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      if (jobDescription) {
        formData.append("jobDescription", jobDescription);
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze resume");
      }

      const results = await response.json();
      sessionStorage.setItem("analysisResults", JSON.stringify(results));
      router.push("/results");
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze resume");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Upload Your Resume
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto">
              Upload your resume in PDF format and optionally paste the job
              description for a comprehensive analysis.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glassmorphism mb-8">
              <CardContent className="p-8">
                <div className="mb-8">
                  <Label className="text-white text-lg font-semibold mb-4 block">
                    Resume File
                  </Label>

                  <AnimatePresence mode="wait">
                    {!file ? (
                      <motion.div
                        key="dropzone"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onDragEnter={handleDragIn}
                        onDragLeave={handleDragOut}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                          isDragging
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-slate-600 hover:border-emerald-500/50 hover:bg-slate-800/50"
                        }`}
                      >
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileInput}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-full gradient-emerald flex items-center justify-center">
                            <Upload className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium mb-1">
                              Drag and drop your resume here
                            </p>
                            <p className="text-slate-400 text-sm">
                              or click to browse (PDF only)
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                          >
                            Choose File
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="file"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative border-2 border-emerald-500/30 rounded-xl p-6 bg-emerald-500/5"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg gradient-emerald flex items-center justify-center shrink-0">
                            <FileText className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {file.name}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={removeFile}
                            className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mb-8">
                  <Label className="text-white text-lg font-semibold mb-4 block">
                    Job Description (Optional)
                  </Label>
                  <Textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here to get a job match score and tailored recommendations..."
                    rows={6}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500 resize-none"
                  />
                  <p className="text-slate-500 text-sm mt-2">
                    Adding a job description enables job-specific keyword
                    matching and suggestions.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={analyzeResume}
                    disabled={!file || isAnalyzing}
                    className="flex-1 gradient-emerald text-white font-semibold py-6 glow-emerald disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        Analyze My Resume
                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-800 py-6 px-8"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glassmorphism rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">
                  Tips for Best Results
                </h3>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Ensure your resume is in PDF format for best parsing</li>
                  <li>• Use a clean, well-formatted resume layout</li>
                  <li>• Include relevant keywords from your target job</li>
                  <li>• Paste the job description for tailored suggestions</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 mx-auto mb-6"
              />
              <h3 className="text-2xl font-bold text-white mb-2">
                Analyzing Your Resume
              </h3>
              <p className="text-slate-400">
                Our AI is reviewing your resume for ATS compatibility...
              </p>
              <div className="mt-6 flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 rounded-full bg-emerald-500"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}