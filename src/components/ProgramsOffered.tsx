"use client";

import { motion } from "framer-motion";
import { Calendar, Rocket, FileSearch } from "lucide-react";
import Image from "next/image";

export function ProgramsOffered() {
  const programs = [
    {
      title: "Year-Long Course",
      description: "This comprehensive igcse online coaching course is ideal for students who want to cover the entire curriculum from scratch with a dedicated tutor.",
      icon: <Calendar className="w-8 h-8 text-[var(--brand-blue)]" strokeWidth={1.5} />,
      features: [
        "Start from the fundamentals",
        "Create a personalized curriculum plan",
        "Estimate total hours based on topic-by-topic learning pace",
        "Include time for tests, assessments, and past papers"
      ]
    },
    {
      title: "Crash Course",
      description: "Perfect for students with limited time before exams. Our intensive online tuition igcse program helps students:",
      icon: <Rocket className="w-8 h-8 text-[var(--brand-blue)]" strokeWidth={1.5} />,
      features: [
        "Categorize chapters into: Comfortable, Partially Comfortable, and Uncomfortable",
        "Tutors then prioritize the uncomfortable and partially comfortable topics",
        "Final sessions include rigorous past paper practice"
      ]
    },
    {
      title: "Past Paper Coverage Only",
      description: "For students who've completed their syllabus and want an igcse online tutor to focus only on exam performance.",
      icon: <FileSearch className="w-8 h-8 text-[var(--brand-blue)]" strokeWidth={1.5} />,
      features: [
        "Tutors focus only on solving past papers",
        "Very limited topic teaching — only when absolutely necessary for understanding",
        "Goal: Boost confidence and performance through smart revision"
      ]
    }
  ];

  return (
    <section id="courses" className="py-20 md:py-32 bg-[var(--bg-panel)] relative">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

          {/* Left Side - Text Content */}
          <div className="lg:w-1/3 lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-[var(--brand-blue)] text-[10px] md:text-[12px] font-bold px-3 py-1.5 md:px-4 md:py-1.5 rounded-full uppercase tracking-widest shadow-sm mb-6"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand-blue)]" />
              WHAT WE OFFER
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F1729] tracking-tight mb-6 leading-tight"
            >
              Courses Offered{" "}
              <span className="inline-flex items-center gap-3 align-middle">
                at
                <Image
                  src="/logo.png"
                  alt="UnboundYou"
                  width={250}
                  height={60}
                  className="h-12 md:h-14 lg:h-16 w-auto object-contain"
                />
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 font-medium leading-relaxed text-sm md:text-base"
            >
              From foundational clarity to exam success, our approach ensures measurable progress for every student.
            </motion.p>
          </div>

          {/* Right Side - Cards */}
          <div className="lg:w-2/3 space-y-6">
            {programs.map((prog, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[var(--brand-blue)]/[0.04] rounded-[24px] p-6 md:p-8 border border-[var(--brand-blue)]/[0.08] flex flex-col sm:flex-row gap-6 md:gap-8 hover:bg-[var(--brand-blue)]/[0.08] transition-colors"
              >
                {/* Icon */}
                <div className="shrink-0">
                  {prog.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-[20px] md:text-[22px] font-bold text-[#0F1729] mb-2">
                    {prog.title}
                  </h3>
                  <p className="text-slate-600 text-[13px] md:text-[14px] font-medium mb-5 leading-relaxed">
                    {prog.description}
                  </p>
                  <ul className="space-y-3.5">
                    {prog.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-[3px] shrink-0 w-4 h-4 rounded-full bg-[var(--brand-blue)] flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-700 text-[13.5px] md:text-[14px] font-medium leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
