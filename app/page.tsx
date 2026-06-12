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
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer at TCS",
    content:
      "ResumeIQ Pro helped me optimize my resume and I landed my dream job at Google! The ATS score feature was incredibly helpful.",
    avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=4ade80&color=fff&size=100",
  },
  {
    name: "Rahul Verma",
    role: "Product Manager at Infosys",
    content:
      "The AI suggestions were spot-on. I revised my resume based on the feedback and got 3x more interview calls.",
    avatar: "https://ui-avatars.com/api/?name=Rahul+Verma&background=4ade80&color=fff&size=100",
  },
  {
    name: "Ananya Krishnan",
    role: "Data Analyst at Wipro",
    content:
      "The skills gap analysis helped me identify exactly what I needed to learn. This tool is a game-changer!",
    avatar: "https://ui-avatars.com/api/?name=Ananya+Krishnan&background=4ade80&color=fff&size=100",
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
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                Trusted by 500+ job seekers
              </Badge>
            </motion.div>

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
                  Get Started Free
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Loved by Job Seekers Everywhere
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              See how ResumeIQ Pro has helped thousands land their dream jobs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glassmorphism h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-emerald-500 fill-emerald-500"
                        />
                      ))}
                    </div>
                    <p className="text-slate-300 mb-6">{testimonial.content}</p>
                    <div className="flex items-center gap-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">
                          {testimonial.name}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
              Join thousands of job seekers who have already improved their
              resumes with ResumeIQ Pro.
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
