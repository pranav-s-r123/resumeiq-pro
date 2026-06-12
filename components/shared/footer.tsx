"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900/50 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-emerald-500" />
            <span className="text-xl font-bold text-white">ResumeIQ Pro</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
