"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Target,
  Globe2,
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  Trophy,
  Activity
} from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function MissionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const milestoneRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Fade in text blocks
    gsap.fromTo(".mission-fade",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );

    // Milestone count up or scale effect
    gsap.fromTo(milestoneRef.current,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: milestoneRef.current,
          start: "top 85%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section id="about" ref={containerRef} className="pt-6 pb-10 lg:py-24 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left: The Manifesto */}
          <div className="space-y-10 text-center lg:text-left">
            <div className="mission-fade">
              <div className="inline-flex items-center gap-2 bg-[var(--brand-green)]/5 text-[var(--brand-green)] text-[12px] font-bold px-4 py-1 rounded-full mb-6 uppercase tracking-widest mx-auto lg:mx-0">
                <Sparkles className="w-3 h-3" />
                Our Mission
              </div>
              <h2 className="text-2xl md:text-[42px] font-bold text-[#0F1729] leading-[1.1] md:leading-tight tracking-tighter mb-4 md:mb-6 text-center lg:text-left">
                5,000+ Hours of Pure <br />
                <span className="text-[var(--brand-blue)]">One-on-One</span> Learning.
              </h2>
              <p className="text-sm md:text-[16px] text-[#64748B] leading-relaxed font-medium max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                At <span className="text-[var(--brand-blue)] font-bold">Unbound</span><span className="text-[var(--brand-green)] font-bold">You</span>, learning isn&apos;t a group activity. It&apos;s a personal breakthrough. We&apos;ve unlocked 5,000 hours of pure 1:1 sessions — not a single group batch, ever.
              </p>
            </div>

            <div className="mission-fade flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-6">
              <div className="p-4 md:p-6 rounded-[24px] bg-slate-50 border border-slate-100 group hover:border-[var(--brand-blue)]/20 transition-all">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3 md:mb-4">
                  <Target className="w-4 h-4 md:w-5 md:h-5 text-[var(--brand-blue)]" />
                </div>
                <h4 className="text-[15px] md:text-[16px] font-bold text-[#0F1729] mb-1 md:mb-2 text-wrap">One Teacher. One Student. One Goal.</h4>
                <p className="text-[13px] md:text-[14px] text-[#64748B] leading-relaxed">Personalised learning that adapts to your child’s pace and needs.</p>
              </div>
              <div className="p-4 md:p-6 rounded-[24px] bg-slate-50 border border-slate-100 group hover:border-[var(--brand-green)]/20 transition-all">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3 md:mb-4">
                  <HeartHandshake className="w-4 h-4 md:w-5 md:h-5 text-[var(--brand-green)]" />
                </div>
                <h4 className="text-[15px] md:text-[16px] font-bold text-[#0F1729] mb-1 md:mb-2">Inclusive Support</h4>
                <p className="text-[13px] md:text-[14px] text-[#64748B] leading-relaxed">Integrated learning support with tutors trained for neurodiverse learners — ADHD, autism, and beyond.</p>
              </div>
            </div>

            <div className="mission-fade flex items-center gap-3 pt-4 md:pt-6 border-t border-slate-100 text-xs md:text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-[#0F1729]">Global Trust:</span>
              </div>
              <div className="flex gap-3">
                {['Saudi Arabia', 'UAE', 'UK', 'India'].map(country => (
                  <span key={country} className="font-bold text-slate-400">{country}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: The Milestone Card */}
          <div className="mission-fade relative">
            <div
              ref={milestoneRef}
              className="bg-[#0F1729] rounded-[40px] p-6 md:p-16 text-white overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block">
                <Trophy className="w-48 h-48 rotate-12" />
              </div>

              <div className="relative z-10 space-y-6 md:space-y-8">
                {/* Header: Inlined for Mobile */}
                <div className="flex items-center gap-4 md:block md:space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center flex-shrink-0">
                    <Activity className="w-6 h-6 md:w-8 md:h-8 text-[var(--brand-green)]" />
                  </div>
                  <div>
                    <div className="text-4xl md:text-[64px] font-bold leading-none tracking-tighter mb-1 md:mb-2">5,000+</div>
                    <div className="text-[12px] md:text-[18px] font-bold text-[var(--brand-green)] uppercase tracking-widest">Hours of Impact</div>
                  </div>
                </div>

                {/* 2x2 Grid for Mobile, List for Desktop */}
                <div className="grid grid-cols-2 gap-3 md:flex md:flex-col md:space-y-4">
                  {[
                    "100% Live 1:1",
                    "No Groups",
                    "Personalised",
                    "Well-being"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-white/80 font-medium text-[12px] md:text-base">
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[var(--brand-green)] flex-shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Primary CTA: Mobile Only */}
                <button 
                  onClick={() => document.getElementById("booking-card")?.scrollIntoView({ behavior: "smooth" })}
                  className="md:hidden w-full bg-[#10B981] hover:brightness-105 active:scale-[0.98] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all"
                >
                  Start Your 1:1 Journey
                </button>

                {/* Progress Bar: Inline for Mobile */}
                <div className="pt-6 md:pt-8 border-t border-white/10">
                  <div className="flex flex-col md:block gap-3">
                    <div className="flex items-center justify-between mb-0 md:mb-4">
                      <div className="hidden md:block text-[10px] md:text-[14px] text-white/50 font-medium uppercase tracking-widest">Next Stop: 10,000 Hours</div>
                      
                      {/* Mobile Progress Bar (Small) */}
                      <div className="md:hidden flex-1 ml-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "50%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className="h-full bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-green)] rounded-full"
                        />
                      </div>
                    </div>

                    {/* Desktop Progress Bar (Full) */}
                    <div className="hidden md:block w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "50%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-green)] rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Element: Overlapping for Mobile */}
            <div className="-mt-8 md:mt-0 relative z-20 md:absolute md:-bottom-6 md:-right-6 bg-white p-5 md:p-6 rounded-3xl shadow-xl md:shadow-2xl border border-slate-100 max-w-[280px] mx-auto md:mx-0">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                    <Image src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&auto=format&fit=crop" alt="Student" fill className="object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                    <Image src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&auto=format&fit=crop" alt="Student" fill className="object-cover" />
                  </div>
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                    <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&auto=format&fit=crop" alt="Student" fill className="object-cover" />
                  </div>
                </div>
                <div>
                  <div className="text-[14px] font-bold text-[#0F1729]">500+ Happy Families</div>
                  <div className="text-[12px] text-[#64748B]">Trusted across 4 countries</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Decorative background circle */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--brand-blue)]/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
