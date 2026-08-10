"use client";

import { motion } from "framer-motion";
import { UserCheck, Headphones } from "lucide-react";
import Image from "next/image";

export function MentorshipShowcase() {
  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Image with Custom Shape */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:justify-start"
          >
            {/* SVG for the custom mask shape */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <clipPath id="tutor-shape" clipPathUnits="objectBoundingBox">
                  <path d="M 0.25,0.05 A 0.05,0.05 0 0 1 0.3,0 L 0.95,0 A 0.05,0.05 0 0 1 1,0.05 L 1,0.95 A 0.05,0.05 0 0 1 0.95,1 L 0.3,1 A 0.05,0.05 0 0 1 0.25,0.95 L 0.25,0.85 A 0.05,0.05 0 0 0 0.2,0.8 L 0.05,0.8 A 0.05,0.05 0 0 1 0,0.75 L 0,0.25 A 0.05,0.05 0 0 1 0.05,0.2 L 0.2,0.2 A 0.05,0.05 0 0 0 0.25,0.15 Z" />
                </clipPath>
              </defs>
            </svg>

            <div 
              className="relative aspect-square w-full max-w-[500px]"
              style={{ clipPath: "url(#tutor-shape)" }}
            >
              {/* Indian teacher image */}
              <div className="w-full h-full bg-slate-200 relative">
                <Image
                  src="/images/tutor.png"
                  alt="Expert Tutor"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Copy & Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#F3F1FB] rounded-[32px] p-8 md:p-12 lg:p-14"
          >
            {/* Badge - Match second image but with brand green */}
            <div className="inline-flex items-center gap-2 bg-white text-[#08BD7E] text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-8 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#08BD7E]" />
              WHY CHOOSE US
            </div>
            
            <h2 className="text-3xl md:text-[40px] font-bold text-[#0F1729] tracking-tight mb-10 leading-[1.2]">
              Your Child&apos;s <span className="text-[var(--brand-blue)]">Growth</span>, Our <span className="text-[var(--brand-blue)]">Priority</span>
            </h2>

            <div className="space-y-5">
              {/* Card 1 */}
              <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start gap-5">
                <div className="bg-[#08BD7E] p-3 rounded-full shrink-0">
                  <UserCheck className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F1729] mb-1.5">Expert Educators</h3>
                  <p className="text-[#65758B] text-[15px] font-medium leading-relaxed">
                    Our certified tutors specialize in international curriculums and focus on building conceptual clarity.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start gap-5">
                <div className="bg-[#08BD7E] p-3 rounded-full shrink-0">
                  <Headphones className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F1729] mb-1.5">Dedicated Support</h3>
                  <p className="text-[#65758B] text-[15px] font-medium leading-relaxed">
                    Ongoing academic support to ensure your child never feels stuck.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
