"use client";

import { motion } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";

export function ComparisonChecklist() {
  const shortfalls = [
    {
      title: "Extremely Limited Tutor Pool",
      description: "Even the best international schools in India struggle to find qualified home tutors for IB, IGCSE, AP, and SAT — because they're restricted by local availability (just 10-50 km radius)."
    },
    {
      title: "Few International Experts Available Locally",
      description: "Most tutors available offline teach CBSE/ICSE and may not understand the methodology of international boards."
    },
    {
      title: "Real Experts Prefer Online Tutoring",
      description: "Experienced IB/AP/IGCSE tutors now teach students globally via online platforms that save time and increase flexibility."
    },
    {
      title: "Risk of Unqualified Tutors",
      description: "Many home tutors claim to teach international curriculum but actually rely on outdated methods, harming your child's performance."
    }
  ];

  const benefits = [
    {
      title: "Global Access to True Experts",
      description: "Connect with experienced IGCSE, IB, AP, and SAT tutors — no matter where they are. We, at UnboundYou offer you the global access to true experts of their subjects."
    },
    {
      title: "Flexible Scheduling, Zero Travel",
      description: "Choose time slots from out flexible schedule that match your child's rhythm and school timings."
    },
    {
      title: "Consistent Availability",
      description: "No last-minute cancellations or \"not available today\" issues — we ensure continuity."
    },
    {
      title: "Results-Driven, Verified Tutors",
      description: "Our tutors are selected based on results, testimonials, punctuality, and curriculum expertise."
    }
  ];

  return (
    <section id="why-unboundyou" className="py-20 md:py-24 bg-[#F8F9FE]">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[32px] md:text-[40px] font-bold text-[#0F1729] leading-tight mb-4"
          >
            Why UnboundYou&apos;s Online <span className="text-[var(--brand-blue)]">One-on-One Tutoring</span> Outshines Home Tutoring
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#65758B] text-[16px] md:text-[18px]"
          >
            Finding an expert home tutor for an international curriculum is harder than you think, here&apos;s why going online is smarter.
          </motion.p>
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <div className="bg-[#EFEEFF] border border-[#E0DDF7] rounded-[24px] py-4 px-6 text-center shadow-sm">
              <h3 className="text-[#0F1729] font-bold text-[18px]">
                Why Home Tutoring Falls Short
              </h3>
            </div>
            
            <div className="space-y-8 pl-2">
              {shortfalls.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-0.5 bg-[#FF4D4F] rounded-md p-1 flex-shrink-0">
                    <X className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-[#0F1729] font-bold text-[16px] mb-2">{item.title}</h4>
                    <p className="text-[#65758B] text-[15px] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <div className="bg-[#EFEEFF] border border-[#E0DDF7] rounded-[24px] py-4 px-6 text-center shadow-sm">
              <h3 className="text-[#0F1729] font-bold text-[18px]">
                Why UnboundYou&apos;s Online Classes Are Better
              </h3>
            </div>
            
            <div className="space-y-8 pl-2">
              {benefits.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-0.5 bg-[#22C55E] rounded-md p-1 flex-shrink-0">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-[#0F1729] font-bold text-[16px] mb-2">{item.title}</h4>
                    <p className="text-[#65758B] text-[15px] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <button
            onClick={() => document.getElementById("booking-card")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-[var(--brand-blue)] text-white font-medium px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all inline-flex items-center gap-2"
          >
            Book a Demo Class <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
