"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

export function ValueProps() {
  return (
    <section className="w-full py-10 md:py-16 overflow-hidden bg-[var(--brand-blue)]">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Card 1: Expert Guidance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-[32px] p-4 flex flex-col bg-white/10 border border-white/20 order-2 lg:order-1"
          >
            <div className="relative w-full h-[140px] rounded-[24px] overflow-hidden mb-5">
              <Image
                src="/images/tutor.png"
                alt="Expert Tutor"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
                className="object-cover object-center"
              />
            </div>
            <div className="px-2 pb-2">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 flex-shrink-0" />
                <p className="text-white text-[14.5px] leading-snug">
                  Expert guidance that transforms students into high achievers.
                </p>
              </div>
              <div className="h-px w-full bg-white/20 mb-4" />
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 flex-shrink-0" />
                <p className="text-white text-[14.5px] leading-snug">
                  A personalized approach for meaningful growth and long-term success.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Tutors Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-[32px] p-4 flex gap-4 flex-col bg-white/10 border border-white/20 order-1 lg:order-2"
          >
            {/* 50+ Tutors block */}
            <div className="bg-white rounded-[24px] flex flex-col items-center justify-center w-full py-6 shrink-0">
              <h3 className="text-[40px] font-bold mb-1 text-[var(--brand-blue)]">
                150+
              </h3>
              <p className="text-[15px] text-[var(--brand-blue)]">
                Tutors
              </p>
            </div>

            {/* Quote block */}
            <div className="bg-white rounded-[24px] p-5 flex-1 flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <Quote className="w-10 h-10 rotate-180" style={{ color: '#FF8A00', fill: '#FF8A00' }} />
                <div className="flex items-center gap-2 border border-slate-100 rounded-full px-3.5 py-1 bg-slate-50">
                  <span className="text-[13px] font-bold text-slate-500">Tutors</span>
                </div>
              </div>
              <p className="text-slate-600 text-[14px] leading-relaxed">
                Meet our highly experienced educators specializing in subjects like Physics, Chemistry, Math, Biology, and more.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Best Achievement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[32px] p-6 lg:p-7 flex flex-col order-3"
          >
            <div className="mb-5">
              <p className="font-medium mb-2 text-[14.5px]" style={{ color: '#FF8A00' }}>
                Best Achievement
              </p>
              <h3 className="text-[19px] font-bold text-[#0F1729] leading-snug">
                Lessons from India&apos;s Best Online Tutors
              </h3>
            </div>
            <div className="relative w-full h-[180px] lg:h-[200px] mt-auto rounded-[24px] overflow-hidden">
              <Image
                src="/images/tutor_zoom_call.png"
                alt="Student studying online"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
