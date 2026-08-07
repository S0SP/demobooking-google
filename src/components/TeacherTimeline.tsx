"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import { DEMO_BOOKING_PRICE_INR } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    iconUrl: "https://img.icons8.com/?id=nbBCL87roGNj&format=png&size=64",
    title: "Fill Details / Select Curriculum",
    description: "Share your child's grade, subject needs, and IGCSE or IB curriculum path to get matched with the right specialist.",
    color: "var(--brand-blue)",
  },
  {
    iconUrl: "https://img.icons8.com/?id=05i5CNp7gW1d&format=png&size=64",
    title: "Book Your Trial",
    description: "Confirm your ₹" + DEMO_BOOKING_PRICE_INR + " slot. You'll receive an instant WhatsApp confirmation from our team.",
    color: "var(--brand-green)",
  },
  {
    iconUrl: "https://img.icons8.com/?id=fS7NyZKyMzc0&format=png&size=64",
    title: "Experience the Trial Class",
    description: "Join a live, 1-on-1 session fully tailored to your child's current level and learning gaps.",
    color: "var(--brand-blue)",
  },
  {
    iconUrl: "https://img.icons8.com/?id=ENl0nEMCLBRE&format=png&size=64",
    title: "Start Regular Learning",
    description: "Enrol in a personalised ongoing program. Track progress, get recordings, and see results.",
    color: "var(--brand-green)",
  },
];

export function TeacherTimeline() {
  const mainRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const journeyHeaderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Academic Excellence Cards Animation
    if (cardsRef.current) {
      gsap.fromTo(cardsRef.current.children,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Journey Header Animation
    if (journeyHeaderRef.current) {
      gsap.fromTo(journeyHeaderRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: journeyHeaderRef.current,
            start: "top 95%",
          }
        }
      );
    }

    // Journey Steps Animation
    if (stepsContainerRef.current) {
      gsap.fromTo(stepsContainerRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stepsContainerRef.current,
            start: "top 90%",
          }
        }
      );
    }
  }, { scope: mainRef });

  return (
    <section ref={mainRef} className="py-12 md:py-24 bg-[#F9FAFB]" id="how-it-works">
      <div className="max-w-7xl mx-auto px-0 md:px-8">

        {/* Journey Section */}
        <div ref={journeyHeaderRef} className="text-center max-w-3xl mx-auto mb-10 md:mb-20 px-4 md:px-0">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-blue)]/5 text-[var(--brand-blue)] text-[11px] md:text-[12px] font-bold px-3 py-1 md:px-4 md:py-1 rounded-full mb-4 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            Quick Start
          </div>
          <h2 className="text-3xl md:text-[48px] font-bold text-[#0F1729] leading-tight mb-4 md:mb-6 tracking-tight">
            Start Your Journey in <br className="block md:hidden" />
            <span className="text-[var(--brand-green)]">4 Simple Steps</span>
          </h2>
          <p className="text-sm md:text-[18px] text-[#65758B] font-medium leading-relaxed max-w-sm mx-auto md:max-w-none">
            A seamless onboarding process designed to get your child matched with an expert educator instantly.
          </p>
        </div>

        <div
          ref={stepsContainerRef}
          className="flex flex-col gap-10 px-6 md:grid md:grid-cols-4 md:gap-8 mb-20 md:mb-32 relative"
        >
          {/* Vertical Timeline Connector (Mobile Only) */}
          <div className="absolute left-[3rem] top-6 bottom-6 w-[2px] bg-slate-200 md:hidden z-0" />

          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="relative flex flex-row items-start gap-6 md:flex-col md:items-start bg-transparent md:bg-white md:rounded-[32px] md:p-8 md:border md:border-slate-100 md:hover:shadow-2xl md:hover:shadow-black/5 transition-all duration-500 group z-10"
            >
              {/* Step Indicator */}
              <div
                className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full md:rounded-2xl flex items-center justify-center bg-white text-[var(--brand-blue)] font-bold text-lg border-2 border-slate-100 shadow-sm md:shadow-none group-hover:scale-110 md:group-hover:scale-110 transition-transform duration-500"
              >
                <span className="md:hidden">{idx + 1}</span>
                <Image
                  src={step.iconUrl}
                  alt={step.title}
                  width={32}
                  height={32}
                  className="hidden md:block object-contain"
                />
              </div>

              <div className="flex flex-col pt-1">
                <div className="mb-1 md:mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {idx + 1}</span>
                  <h3 className="text-base md:text-[18px] font-bold text-[#0F1729] mt-0.5">{step.title}</h3>
                </div>

                <p className="text-sm md:text-[14px] text-[#65758B] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Selection Standard */}
        <div className="bg-[#F9FAFB] rounded-none md:rounded-[48px] p-6 md:p-20 overflow-hidden relative border-0 md:border md:border-slate-50">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-start relative z-10">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="flex items-center gap-2 mb-4 md:mb-6 text-[var(--brand-blue)]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] md:text-[12px] font-bold tracking-widest uppercase">The Selection Standard</span>
              </div>
              <h3 className="text-3xl md:text-[40px] font-bold text-[#0F1729] leading-tight mb-4 md:mb-6 tracking-tight">
                Only 5 in 1,000 Tutors <br className="hidden md:block" /> <span className="text-[var(--brand-blue)]">Make It Through.</span>
              </h3>
              <p className="text-sm md:text-[16px] text-[#65758B] font-medium mb-6 md:mb-10 leading-relaxed max-w-md text-center lg:text-left">
                Only 5 in 1,000 tutors make it through the <span className="text-[var(--brand-blue)] font-bold">Unbound</span><span className="text-[var(--brand-green)] font-bold">You</span> hiring process. Our standards are more rigorous than most competitive exams.
              </p>
              
              <button 
                onClick={() => document.getElementById("booking-card")?.scrollIntoView({ behavior: "smooth" })}
                className="w-fit mx-auto lg:mx-0 flex items-center justify-center gap-2 bg-[var(--brand-blue)] text-white px-6 h-11 md:h-12 rounded-xl text-sm font-bold hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-black/10 mt-4 md:mt-2"
              >
                Book Your Demo
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full space-y-3 md:space-y-4 order-2 lg:order-none" ref={cardsRef}>
              {[
                { title: "Academic Excellence", desc: "Sourced from IITs, NITs, IIITs, and top international universities across Asia and Europe." },
                { title: "Subject Mastery", desc: "Rigorously tested candidates across complex problem-solving scenarios and core concepts." },
                { title: "Pedagogy Audit", desc: "Assessing the ability to simplify abstract concepts and build genuine student empathy." }
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 md:p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-1 md:mb-2">
                    <div className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                    </div>
                    <h4 className="text-base md:text-lg font-bold text-[#0F1729]">{item.title}</h4>
                  </div>
                  <p className="text-sm md:text-[14px] text-[#65758B] leading-relaxed ml-7 md:ml-0">{item.desc}</p>
                </div>
              ))}
            </div>


          </div>

          {/* Decorative Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--brand-blue)]/5 rounded-full blur-[120px] pointer-events-none" />
        </div>

      </div>
    </section>
  );
}
