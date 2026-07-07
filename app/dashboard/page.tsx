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
  Menu,
  X,
  Eye,
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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumeHistory, setResumeHistory] = useState<ResumeHistory[]>([]);
  const [loading, setLoading] = useState(true);

 const fetchData = async () => {
  setLoading(true);

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  console.log("Dashboard User:", currentUser);

  if (!currentUser) {
    router.push("/auth");
    return;
  }

  setUser(currentUser as unknown as User);

  const { data, error } = await supabase
    .from("resume_history")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  console.log("History Data:", data);
  console.log("History Error:", error);

  if (error) {
    console.error("History fetch error:", error);
    toast.error("Failed to load history");
    setLoading(false);
    return;
  }

  setResumeHistory(data || []);
  setLoading(false);
};
  useEffect(() => {
    // small delay ensures Supabase session is ready after redirect
    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // ✅ FIX 2: Listen for auth changes (prevents silent logout issues)
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/auth");
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/auth");
  };

  const stats = [
    {
      icon: FileText,
      label: "Total Resumes",
      value: resumeHistory.length,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      icon: BarChart3,
      label: "Average ATS Score",
      value:
        resumeHistory.length > 0
          ? Math.round(
              resumeHistory.reduce((a, b) => a + b.ats_score, 0) /
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
      value:
        resumeHistory.length > 0
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

  // ✅ FIX 3: Proper loading state (prevents false redirects UI flash)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 glassmorphism z-50 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-emerald-500" />
              <span className="text-white font-bold text-xl">ResumeIQ</span>
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="text-white" />
            </button>
          </div>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 text-emerald-400"
            >
              <LayoutDashboard /> Dashboard
            </Link>
            <Link href="/upload" className="flex items-center gap-3 text-white">
              <Upload /> Upload
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 text-white">
              <Settings /> Settings
            </Link>
          </nav>

          <button
            onClick={handleSignOut}
            className="absolute bottom-6 flex items-center gap-2 text-red-400"
          >
            <LogOut /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        <header className="p-4 flex justify-between items-center">
          <button
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>

          <h1 className="text-white text-xl">
            Welcome, {user.user_metadata?.full_name || "User"}
          </h1>

          <Link href="/upload">
            <Button className="gradient-emerald">Upload</Button>
          </Link>
        </header>

        <main className="p-6">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((s, i) => (
              <Card key={i} className="glassmorphism">
                <CardContent className="p-6">
                  <p className="text-slate-400">{s.label}</p>
                  <h2 className="text-3xl text-white font-bold">
                    {s.value}
                    {s.suffix}
                  </h2>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* History */}
          <Card className="glassmorphism">
            <CardContent className="p-6">
              <h2 className="text-white text-xl mb-4">Resume History</h2>

              {resumeHistory.length === 0 ? (
                <p className="text-slate-400">No resumes yet.</p>
              ) : (
                resumeHistory.map((r) => (
                  <div
                    key={r.id}
                    className="flex justify-between border-b border-slate-700 py-3"
                  >
                    <span className="text-white">{r.file_name}</span>
                    <span className="text-emerald-400">{r.ats_score}%</span>
                    <Badge className={getGradeColor(r.overall_grade)}>
                      {r.overall_grade}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}