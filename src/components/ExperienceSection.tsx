"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, Monitor, Users, ArrowRight, Sun } from "lucide-react";
import { DEMO_BOOKING_PRICE_INR } from "@/lib/constants";

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const monitorY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  // Animation variants for cards
  const springTransition = (delay: number) => ({
    type: "spring" as const,
    stiffness: 100,
    damping: 15,
    delay
  });

  const floatTransition = {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut" as const
  };

  return (
    <section
      ref={containerRef}
      className="pt-12 md:pt-32 pb-28 md:pb-32 bg-[#0F172A] relative overflow-hidden"
      id="experience"
    >
      {/* 1. Premium Ambient Glow (Top Center) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--brand-blue)]/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none z-0" />

      {/* 2. Particles & Background Shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -120],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">

        {/* Section Header Cluster - Gestalt Optimization (Tighter Gaps) */}
        <div className="flex flex-col items-center justify-center mb-10 md:mb-20 text-center max-w-3xl mx-auto px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-[11px] md:text-[12px] font-bold px-3 py-1 md:px-4 md:py-1 rounded-full uppercase tracking-widest border border-white/10 mb-4"
          >
            <Sun className="w-3 h-3 text-[var(--brand-green)]" />
            The Classroom Revolution
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-[48px] font-bold leading-tight tracking-tight mb-4 md:mb-6"
          >
            <span className="text-white/90">Step Inside the</span> <br />
            <span className="text-[var(--brand-blue)]">Unbound</span>
            <span className="text-[var(--brand-green)]">You</span> <span className="text-white">Classroom</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-[18px] text-slate-400 font-medium leading-relaxed max-w-2xl px-4 md:px-0"
          >
            A proprietary learning environment designed for maximum focus, interaction, and data-driven results.
          </motion.p>
        </div>

        {/* Main Product Image Container with Parallax */}
        <div className="relative max-w-[1024px] mx-auto perspective-1000 w-full -mx-4 w-[calc(100%+2rem)] md:mx-auto md:w-full px-0 md:px-8">
          <motion.div
            style={{ y: monitorY }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative rounded-none md:rounded-[32px] p-0 md:p-2 bg-gradient-to-b from-white/10 to-transparent border-0 md:border md:border-white/10 shadow-2xl md:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] group overflow-hidden"
          >
            <div className="relative rounded-none md:rounded-[24px] overflow-hidden bg-slate-800 aspect-[16/10]">
              <Image
                src="/tutor.png"
                alt="UnboundYou Classroom Experience"
                fill
                sizes="(max-width: 768px) 100vw, 1024px"
                quality={85}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Floating Trust Badges */}

          {/* Card 1: Top Left */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springTransition(0.2)}
            className="absolute top-[18%] left-[-18%] hidden lg:block z-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={floatTransition}
              className="bg-[#1E293B]/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] max-w-[240px] group cursor-default"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--brand-green)]/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[var(--brand-green)]" />
                </div>
                <h4 className="text-white font-bold text-[14px] leading-tight">Top 1% Expert Mentors</h4>
              </div>
              <p className="text-slate-200 text-[12px] leading-relaxed font-medium">
                Professional setups, crystal-clear audio, and deep IGCSE/IB expertise.
              </p>
            </motion.div>
          </motion.div>

          {/* Card 2: Bottom Left */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springTransition(0.4)}
            className="absolute bottom-[10%] left-[-16%] hidden lg:block z-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ ...floatTransition, delay: 0.5 }}
              className="bg-[#1E293B]/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] max-w-[240px] group cursor-default"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--brand-green)]/20 flex items-center justify-center">
                  <Monitor className="w-4 h-4 text-[var(--brand-green)]" />
                </div>
                <h4 className="text-white font-bold text-[14px] leading-tight">Interactive Learning Hub</h4>
              </div>
              <p className="text-slate-200 text-[12px] leading-relaxed font-medium">
                Live notes, past papers, and interactive data—all in one window.
              </p>
            </motion.div>
          </motion.div>

          {/* Card 3: Right */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={springTransition(0.6)}
            className="absolute top-[45%] right-[-18%] hidden lg:block z-20"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ ...floatTransition, delay: 1 }}
              className="bg-[#1E293B]/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] max-w-[240px] group cursor-default"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--brand-green)]/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-[var(--brand-green)]" />
                </div>
                <h4 className="text-white font-bold text-[14px] leading-tight">1-on-1 Undivided Attention</h4>
              </div>
              <p className="text-slate-200 text-[12px] leading-relaxed font-medium">
                Zero classroom distractions. 100% focus on your child&apos;s learning pace.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile Feature List removed for conversion efficiency */}


        {/* Call to Action Cluster - Gestalt Optimization (Tighter Gaps) */}
        <div className="mt-8 md:mt-16 text-center px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center"
          >
            <button
              onClick={() => document.getElementById("booking-card")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#10B981] text-white px-8 md:px-10 h-12 md:h-16 rounded-2xl text-[15px] md:text-[16px] font-bold hover:bg-[#059669] transition-all active:scale-95 shadow-lg shadow-emerald-500/20 group"
            >
              <span className="block md:hidden">Book a ₹{DEMO_BOOKING_PRICE_INR} Demo &rarr;</span>
              <span className="hidden md:block">Experience It Live — Book a ₹{DEMO_BOOKING_PRICE_INR} Demo</span>
              <ArrowRight className="hidden md:block w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-4">
              Secure your slot in 60 seconds. Limited availability.
            </p>
          </motion.div>
        </div>

      </div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--brand-blue)]/10 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* 3. Bottom SVG Smooth Divider (Concave Smile Shape) - Hidden on mobile for cleaner transition */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20 hidden md:block">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[80px]"
        >
          <path
            d="M0,0 C300,120 900,120 1200,0 V120 H0 Z"
            fill="#FFFFFF"
          ></path>
        </svg>
      </div>
    </section>
  );
}
