"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileSearch,
  TrendingUp,
  Sparkles,
  TargetIcon,
  FileCheck,
  Key,
  Upload,
  BarChart3,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const features = [
  {
    icon: FileSearch,
    title: "ATS Score",
    description: "Get your Applicant Tracking System compatibility score instantly.",
  },
  {
    icon: TrendingUp,
    title: "Skills Gap Analysis",
    description: "Identify missing skills that could boost your employability.",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description: "Receive personalized improvement recommendations from AI.",
  },
  {
    icon: TargetIcon,
    title: "Job Match Score",
    description: "See how well your resume matches specific job descriptions.",
  },
  {
    icon: FileCheck,
    title: "Resume Formatting Check",
    description: "Ensure your resume follows best practices and standards.",
  },
  {
    icon: Key,
    title: "Keyword Optimization",
    description: "Optimize keywords to pass automated screening systems.",
  },
];

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload",
    description: "Simply upload your resume in PDF format.",
  },
  {
    number: "02",
    icon: BarChart3,
    title: "Analyze",
    description: "Our AI analyzes your resume against industry standards.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Improve",
    description: "Get actionable insights and improve your resume.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Land Your Dream Job with{" "}
              <span className="text-gradient">AI Powered</span>
              <br />
              Resume Analysis
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto"
            >
              Get instant ATS scores, identify skill gaps, and receive
              personalized AI suggestions to transform your resume into an
              interview-generating machine.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <Button
                  size="lg"
                  className="gradient-emerald text-white font-semibold px-8 py-6 glow-emerald group"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Powerful Features to Boost Your Job Search
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive resume analysis
              to help you stand out from the competition.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glassmorphism h-full hover:border-emerald-500/50 transition-colors duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg gradient-emerald flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Three simple steps to transform your resume and land more
              interviews.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 rounded-full glassmorphism flex items-center justify-center">
                      <step.icon className="h-8 w-8 text-emerald-500" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-emerald text-white text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Resume?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Improve your resume with ResumeIQ Pro and land more interviews.
            </p>
            <Link href="/upload">
              <Button
                size="lg"
                className="gradient-emerald text-white font-semibold px-8 py-6 glow-emerald"
              >
                Analyze My Resume Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
