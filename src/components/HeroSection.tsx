"use client";

import { motion } from "framer-motion";
import { ArrowRight, Target, Users2, Star } from "lucide-react";
import Script from "next/script";
import Image from "next/image";
import { DEMO_BOOKING_PRICE_INR } from "@/lib/constants";
import { BookingWidget } from "./BookingWidget";

export function HeroSection({
  serverIso, serverTimezone,
}: {
  serverIso: string | null;
  serverTimezone: string | null;
}) {
  return (
    <section className="relative w-full min-h-screen lg:flex lg:items-center pt-24 sm:pt-28 pb-6 lg:pb-20 bg-white overflow-hidden">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="absolute top-[-5%] right-[-5%] w-[60%] h-[60%] bg-[var(--brand-blue)]/5 rounded-full -z-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[50%] h-[50%] bg-[var(--brand-green)]/5 rounded-full -z-10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-24">

          {/* Left copy */}
          <div className="flex-1 text-center lg:text-left space-y-8">

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="flex items-center gap-3 bg-white border border-slate-200/60 shadow-sm rounded-full py-1.5 px-2 pr-4 w-fit mx-auto lg:mx-0 mb-6"
            >
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&q=80"
                ].map((src, i) => (
                  <img key={i} src={src} alt="Student" className="w-6 h-6 md:w-7 md:h-7 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <span className="text-[10px] md:text-[11px] font-bold text-[#0F1729] uppercase tracking-wider">
                Trusted by 1000+ IGCSE Students
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-2xl md:text-3xl lg:text-[42px] font-bold text-[#0F1729] leading-tight md:leading-[1.15] mb-4 tracking-tight"
            >
              Personalized <span className="text-[var(--brand-blue)]">IGCSE</span> Online Tuition
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-sm md:text-base md:text-lg text-[#65758B] font-medium mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0 leading-[1.6]"
            >
              Top global provider for expert IGCSE online tuition. Connect with a dedicated IGCSE online tutor for Maths, Physics, Chemistry, Biology, and English.
            </motion.p>

            {/* Feature Pills */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8"
            >
              {[
                { icon: "https://img.icons8.com/color/48/teacher.png", text: "One-on-One Live Tutoring" },
                { icon: "https://img.icons8.com/color/48/books.png", text: "Test Series" },
                { icon: "https://img.icons8.com/color/48/clipboard.png", text: "Customized Course Plan" },
                { icon: "https://img.icons8.com/color/48/calendar--v1.png", text: "Monthly Parent-Teacher Meetings" },
              ].map((pill, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[12px] md:text-[13px] font-bold shadow-sm text-slate-800">
                  <img src={pill.icon} alt={pill.text} className="w-4 h-4 object-contain" />
                  <span>{pill.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Trust Badges & Subjects */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col items-center lg:items-start gap-5 mb-8 w-full"
            >
              <div className="flex items-center gap-3 bg-white border border-slate-200/60 shadow-sm rounded-2xl p-2.5 pr-5 w-fit">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                  <Image src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width={20} height={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#0F1729]">UnboundYou</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[13px] font-bold text-[#0F1729]">4.8</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FACC15] text-[#FACC15]" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium ml-1">(1K+)</span>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md h-px bg-slate-100" />

              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-y-2 gap-x-3 text-sm font-bold">
                <span className="text-[#0F1729]">Mathematics</span>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[#0F1729]">Physics</span>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[#0F1729]">Chemistry</span>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[#0F1729]">Biology</span>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[#0F1729]">French</span>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[#0F1729]">ICT</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex flex-col items-center lg:items-start gap-8 mb-8 lg:mb-10"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => document.getElementById("booking-card")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex flex-1 sm:flex-none bg-[var(--brand-blue)] hover:brightness-105 text-white font-bold px-8 py-3.5 md:px-6 md:py-3 rounded-2xl md:rounded-xl text-[16px] md:text-[13px] transition-all active:scale-95 shadow-md whitespace-nowrap justify-center items-center"
                >
                  Book Trial @ ₹{DEMO_BOOKING_PRICE_INR}
                </button>
                <a href="#testimonials"
                  className="hidden sm:flex flex-1 sm:flex-none bg-white text-[#0F1729] border border-slate-200 font-bold px-6 py-3 rounded-xl text-[13px] transition-all hover:bg-slate-50 active:scale-95 whitespace-nowrap items-center justify-center gap-2"
                >
                  See Student Success Stories
                  <ArrowRight className="w-4 h-4 text-[var(--brand-green)]" />
                </a>
              </div>
            </motion.div>

            {/* Trust — desktop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="hidden lg:flex flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-8 pt-6 border-t border-slate-100"
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 md:w-5 md:h-5 text-[var(--brand-green)]" />
                <span className="text-[11px] md:text-[13px] font-bold text-[#0F1729] uppercase tracking-wide">IGCSE Specialists</span>
              </div>
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 md:w-5 md:h-5 text-[var(--brand-green)]" />
                <span className="text-[11px] md:text-[13px] font-bold text-[#0F1729] uppercase tracking-wide">Top 1% Mentors</span>
              </div>
            </motion.div>
          </div>

          {/* Right: booking card */}
          <div className="relative flex-1 flex flex-col items-center lg:items-end gap-6 lg:gap-8">
            <motion.div
              id="booking-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-[420px] scroll-mt-32 flex flex-col"
            >
              <BookingWidget serverIso={serverIso} serverTimezone={serverTimezone} />
            </motion.div>

            {/* Trust — mobile */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="flex lg:hidden flex-wrap items-center justify-center gap-6 pt-4 w-full"
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--brand-green)]" />
                <span className="text-[11px] font-bold text-[#0F1729] uppercase tracking-wide">IGCSE Specialists</span>
              </div>
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-[var(--brand-green)]" />
                <span className="text-[11px] font-bold text-[#0F1729] uppercase tracking-wide">Top 1% Mentors</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}