"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Upload,
  Settings,
  LogOut,
  BarChart3,
  TrendingUp,
  Award,
  Eye,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase-client";
import { toast } from "sonner";

interface User {
  email: string;
  user_metadata: {
    full_name?: string;
  };
}

interface ResumeHistory {
  id: string;
  file_name: string;
  ats_score: number;
  job_match_score: number | null;
  overall_grade: string;
  created_at: string;
}

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Upload, label: "Upload Resume", href: "/upload" },
  { icon: FileText, label: "All Resumes", href: "/dashboard" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumeHistory, setResumeHistory] = useState<ResumeHistory[]>([]);

  useEffect(() => {
  const fetchData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth");
      return;
    }

    setUser(user as unknown as User);

    const { data, error } = await supabase
      .from("resume_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("History fetch error:", error);
      return;
    }

    setResumeHistory(data || []);
  };

  fetchData();
}, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/");
  };

  const stats = [
    {
      icon: FileText,
      label: "Total Resumes Analyzed",
      value: resumeHistory.length,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      icon: BarChart3,
      label: "Average ATS Score",
      value: resumeHistory.length > 0
        ? Math.round(
            resumeHistory.reduce((acc, r) => acc + r.ats_score, 0) /
              resumeHistory.length
          )
        : 0,
      suffix: "%",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
    },
    {
      icon: TrendingUp,
      label: "Best Score",
      value: resumeHistory.length > 0
        ? Math.max(...resumeHistory.map((r) => r.ats_score))
        : 0,
      suffix: "%",
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
    },
  ];

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

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 glassmorphism z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-emerald-500" />
              <span className="text-xl font-bold text-white">ResumeIQ</span>
            </Link>
            <button
              className="lg:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="space-y-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  link.active
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 glassmorphism z-30 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              className="lg:hidden text-white p-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1 lg:flex-none">
              <h1 className="text-xl font-semibold text-white">
                Welcome back, {user.user_metadata?.full_name || "User"}!
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/upload">
                <Button className="gradient-emerald text-white glow-emerald-sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resume
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glassmorphism">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center shrink-0`}
                      >
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">{stat.label}</p>
                        <p className="text-3xl font-bold text-white mt-1">
                          {stat.value}
                          {stat.suffix}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glassmorphism">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-white">
                  Resume History
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-6 text-slate-400 font-medium">
                        File Name
                      </th>
                      <th className="text-left p-6 text-slate-400 font-medium">
                        Date
                      </th>
                      <th className="text-left p-6 text-slate-400 font-medium">
                        ATS Score
                      </th>
                      <th className="text-left p-6 text-slate-400 font-medium">
                        Job Match
                      </th>
                      <th className="text-left p-6 text-slate-400 font-medium">
                        Grade
                      </th>
                      <th className="text-left p-6 text-slate-400 font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeHistory.map((resume, index) => (
                      <motion.tr
                        key={resume.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-emerald-400" />
                            </div>
                            <span className="text-white font-medium">
                              {resume.file_name}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-slate-400">
                            {new Date(resume.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 rounded-full bg-slate-700 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{
                                  width: `${resume.ats_score}%`,
                                }}
                              />
                            </div>
                            <span className="text-white font-medium">
                              {resume.ats_score}%
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          {resume.job_match_score ? (
                            <span className="text-white">
                              {resume.job_match_score}%
                            </span>
                          ) : (
                            <span className="text-slate-500">N/A</span>
                          )}
                        </td>
                        <td className="p-6">
                          <Badge className={getGradeColor(resume.overall_grade)}>
                            {resume.overall_grade}
                          </Badge>
                        </td>
                        <td className="p-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {resumeHistory.length === 0 && (
                <div className="p-12 text-center">
                  <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No resumes analyzed yet. Upload your first resume!</p>
                  <Link href="/upload">
                    <Button className="mt-4 gradient-emerald text-white glow-emerald-sm">
                      Upload Your First Resume
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
