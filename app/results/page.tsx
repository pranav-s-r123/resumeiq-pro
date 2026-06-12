"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Lightbulb,
  Award,
  TargetIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ProgressRing } from "@/components/ui/progress-ring";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface AnalysisResults {
  fileName: string;
  atsScore: number;
  jobMatchScore: number | null;
  overallGrade: string;
  skillsFound: string[];
  skillsMissing: string[];
  keywordsFound: string[];
  keywordsMissing: string[];
  aiSuggestions: string[];
  analyzedAt: string;
}

export default function ResultsPage() {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedResults = sessionStorage.getItem("analysisResults");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  if (!results) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">No Results Found</h2>
            <p className="text-slate-400 mb-8">
              Please upload a resume first to see analysis results.
            </p>
            <Link href="/upload">
              <Button className="gradient-emerald text-white glow-emerald-sm">
                Upload Resume
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-emerald-500 text-white";
      case "B":
        return "bg-blue-500 text-white";
      case "C":
        return "bg-amber-500 text-white";
      case "D":
        return "bg-red-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const downloadPDF = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`resume-analysis-${results?.fileName || "report"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={contentRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Analysis Results
              </h1>
              <p className="text-slate-400">
                {results.fileName} • Analyzed on{" "}
                {new Date(results.analyzedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/upload">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <Button className="gradient-emerald text-white glow-emerald-sm" onClick={downloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glassmorphism h-full">
                <CardContent className="p-8 flex flex-col items-center">
                  <div className="w-48 h-48 flex items-center justify-center mb-4">
                    <ProgressRing progress={results.atsScore} size={180} strokeWidth={12} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">ATS Score</h3>
                  <p className="text-emerald-400 font-medium">
                    {getScoreLabel(results.atsScore)}
                  </p>
                  <p className="text-slate-400 text-sm mt-2 text-center">
                    How compatible your resume is with Applicant Tracking Systems
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glassmorphism h-full">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 rounded-full gradient-emerald flex items-center justify-center mb-4">
                    <span className="text-6xl font-bold text-white">
                      {results.overallGrade}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    Overall Grade
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 text-center">
                    Based on formatting, content, and keyword optimization
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glassmorphism h-full">
                <CardContent className="p-8 flex flex-col items-center justify-center">
                  {results.jobMatchScore ? (
                    <>
                      <div className="w-full mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <TargetIcon className="h-6 w-6 text-emerald-400" />
                          <span className="text-3xl font-bold text-white">
                            {results.jobMatchScore}%
                          </span>
                        </div>
                        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${results.jobMatchScore}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-emerald-500 rounded-full"
                          />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        Job Match Score
                      </h3>
                      <p className="text-slate-400 text-sm mt-2 text-center">
                        How well your resume matches the job description
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                        <TargetIcon className="h-8 w-8 text-slate-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        Job Match Score
                      </h3>
                      <p className="text-slate-400 text-sm mt-2 text-center">
                        Add a job description to see your job match score
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glassmorphism">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                    <CardTitle className="text-white">Skills Found</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.skillsFound.map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glassmorphism">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <CardTitle className="text-white">Missing Skills</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.skillsMissing.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="glassmorphism">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Award className="h-5 w-5 text-blue-400" />
                    </div>
                    <CardTitle className="text-white">Keywords Found</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.keywordsFound.map((keyword) => (
                      <Badge
                        key={keyword}
                        className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="glassmorphism">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Award className="h-5 w-5 text-amber-400" />
                    </div>
                    <CardTitle className="text-white">Missing Keywords</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.keywordsMissing.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="outline"
                        className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="glassmorphism mb-8">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-emerald flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-white">AI Improvement Suggestions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {results.aiSuggestions.map((suggestion, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-8 h-8 rounded-full gradient-emerald flex items-center justify-center shrink-0 text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-slate-300 pt-1">{suggestion}</p>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/upload">
              <Button size="lg" className="gradient-emerald text-white glow-emerald">
                <RefreshCw className="mr-2 h-5 w-5" />
                Analyze Another Resume
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
              onClick={downloadPDF}
            >
              <Download className="mr-2 h-5 w-5" />
              Download PDF Report
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}