"use client";

import { motion } from "framer-motion";

export function SuccessJourney() {
  const steps = [
    {
      title: "Free Consultation",
      description: "Talk to our academic advisors to find the right plan for your child.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff8a4c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 4H4v4" />
          <path d="M4 4l5 5" />
          <path d="M16 4h4v4" />
          <path d="M20 4l-5 5" />
          <path d="M8 20H4v-4" />
          <path d="M4 20l5-5" />
          <path d="M16 20h4v-4" />
          <path d="M20 20l-5-5" />
          <circle cx="12" cy="12" r="2.5" />
          <path d="M8 19v-1a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1" />
        </svg>
      ),
    },
    {
      title: "Choose the Program",
      description: "Select from IGCSE, IB, SAT, or foundation courses.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff8a4c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 14h2.5" />
          <path d="M14 10.5V9a1.5 1.5 0 0 1 3 0v4.5" />
          <path d="M17 11.5V10a1.5 1.5 0 0 1 3 0v6a5 5 0 0 1-10 0V5a1.5 1.5 0 0 1 3 0v6.5" />
          <path d="M10.5 2.5a4 4 0 0 1 3 0" />
          <path d="M9 4.5a6 6 0 0 1 6 0" />
        </svg>
      ),
    },
    {
      title: "Join Classes",
      description: "Join live online sessions and access recorded classes.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff8a4c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <rect x="8" y="10" width="3" height="3" rx="0.5" />
          <path d="M13 11.5h4" />
          <rect x="8" y="15" width="3" height="3" rx="0.5" />
          <path d="M13 16.5h4" />
        </svg>
      ),
    },
    {
      title: "Track Progress",
      description: "Assessments and feedback to measure and guide growth.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff8a4c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="12" rx="2" ry="2" />
          <path d="M7 12v-3" />
          <path d="M12 12V6" />
          <path d="M17 12v-1.5" />
          <path d="M3 16h18" />
          <circle cx="12" cy="19.5" r="1.5" />
          <path d="M9 23c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" />
        </svg>
      ),
    },
  ];

  return (
    <section className="w-full py-20 bg-[#f8f9fc]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white text-[#ff8a4c] text-[12px] font-semibold px-4 py-2 rounded-full border border-gray-100 uppercase tracking-widest shadow-sm mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-[#ff8a4c]" />
            HOW IT WORKS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[32px] md:text-[42px] font-bold tracking-tight"
          >
            <span className="text-[#0F1729]">Guiding You</span>{" "}
            <span className="text-[#2a2272]">Every Step of the Way</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-[24px] p-8 hover:-translate-y-1 transition-transform border border-[#e5e7eb]"
              style={{ backgroundColor: index % 2 === 1 ? '#f0eeff' : '#ffffff' }}
            >
              <div className="mb-6 flex items-center justify-start">
                {step.icon}
              </div>
              <h3 className="text-[20px] font-bold text-[#2a2272] mb-4 leading-tight">
                {step.title}
              </h3>
              <p className="text-[#65758B] text-[15px] leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
