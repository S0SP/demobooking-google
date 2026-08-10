"use client";

import { motion } from "framer-motion";
import { UserSearch, Mountain, Handshake } from "lucide-react";

export function SelectionCriteria() {
  const criteria = [
    {
      icon: (
        <div className="relative w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
          <UserSearch className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
          <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full" />
        </div>
      ),
      title: "Only 1 in 20 applicants make it",
      description: "We handpick tutors with strong command over IGCSE methodology. Even seasoned teachers are not selected unless they match the pedagogy of international boards."
    },
    {
      icon: (
        <div className="relative w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center">
          <Mountain className="w-8 h-8 text-teal-500" strokeWidth={1.5} />
          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full" />
        </div>
      ),
      title: "Consistent success stories",
      description: "We rely on genuine testimonials from both students and parents to ensure that our tutors deliver top results, not just promises."
    },
    {
      icon: (
        <div className="relative w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <Handshake className="w-8 h-8 text-red-500" strokeWidth={1.5} />
          <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full" />
        </div>
      ),
      title: "No compromises on commitment",
      description: "Tutors who cancel or reschedule classes frequently are blacklisted. We value your child's time and learning continuity."
    }
  ];

  return (
    <section id="selection-criteria" className="py-16 md:py-24 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-[40px] font-bold text-[#0F1729] tracking-tight text-center"
          >
            3 Key Selection Criteria for UnboundYou Tutors
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {criteria.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="mb-6 flex items-center justify-start">
                {item.icon}
              </div>
              <h3 className="text-[19px] font-bold text-[#0F1729] mb-4 leading-tight">
                {item.title}
              </h3>
              <p className="text-[#65758B] text-[15px] leading-relaxed flex-grow">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 md:mt-16 bg-[#F8F9FE] border border-[#E0DDF7] rounded-[24px] p-8 md:p-12 text-center"
        >
          <h3 className="text-[22px] md:text-[26px] font-bold text-[#0F1729] mb-4 flex items-center justify-center gap-3">
            <span className="text-2xl">🏆</span> 
            <span>Ranking System & <span className="text-[var(--brand-blue)]">Tutor Match</span></span>
          </h3>
          <p className="text-[#65758B] max-w-[800px] mx-auto text-[15px] md:text-[16px] leading-relaxed">
            Our proprietary ranking system evaluates tutors across all three pillars: expertise, outcomes, and punctuality. 
            Only the top-ranked tutor is assigned for your first demo, ensuring no wasted time, just the perfect match.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
