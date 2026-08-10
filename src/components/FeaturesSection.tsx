"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);
const features = [
  {
    title: "One-on-One Sessions",
    desc: "1 teacher dedicated to 1 student for focused learning",
    iconUrl: "https://img.icons8.com/?id=ABBSjQJK83zf&format=png&size=64",
    color: "var(--brand-blue)"
  },
  {
    title: "Past Papers Support",
    desc: "Practice real past papers with expert guidance to master exam patterns",
    iconUrl: "https://img.icons8.com/?id=EYKscqtifDDh&format=png&size=64",
    color: "var(--brand-blue)",
    highlight: true
  },
  {
    title: "Experienced Teachers",
    desc: "Curriculum-specific expert teachers (IGCSE) with 5+ years average experience",
    iconUrl: "https://img.icons8.com/?id=AZp2VfJc0n9C&format=png&size=64",
    color: "var(--brand-green)"
  },
  {
    title: "Session Recordings",
    desc: "All sessions are recorded for revision anytime, anywhere",
    iconUrl: "https://img.icons8.com/?id=alybng0KUhxp&format=png&size=64",
    color: "var(--brand-blue)"
  },
  {
    title: "Revision Notes",
    desc: "Get concise, high-quality notes for quick and effective revision",
    iconUrl: "https://img.icons8.com/?id=nNdlyDCOxmCR&format=png&size=64",
    color: "var(--brand-green)"
  },
  {
    title: "Custom Learning",
    desc: "Classes strictly tailored to your specific learning goals and pace",
    iconUrl: "https://img.icons8.com/?id=Zydyx4gBcOrY&format=png&size=64",
    color: "var(--brand-green)"
  }
];

export function FeaturesSection() {
  const mainRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !headerRef.current) return;

    // Header animation
    gsap.fromTo(headerRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 95%",
          toggleActions: "play none none none"
        }
      }
    );

    // Cards animation
    gsap.fromTo(containerRef.current.children,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      }
    );
  }, { scope: mainRef });

  return (
    <section ref={mainRef} className="py-12 md:py-24 bg-white relative overflow-hidden" id="features">
      <div className="max-w-7xl mx-auto px-0 md:px-8">

        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-10 md:mb-20 px-4 md:px-0">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-blue)]/5 text-[var(--brand-blue)] text-[11px] md:text-[12px] font-bold px-3 py-1 md:px-4 md:py-1 rounded-full mb-4 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            The Unbound Advantage
          </div>
          <h2 className="text-3xl md:text-[48px] font-bold text-[#0F1729] leading-tight mb-4 md:mb-6 tracking-tight">
            Everything You Need for <br />
            <span className="text-[var(--brand-blue)]">Academic Excellence</span>
          </h2>
          <p className="text-sm md:text-[18px] text-[#65758B] font-medium leading-relaxed max-w-sm mx-auto md:max-w-none">
            We provide a comprehensive learning ecosystem designed specifically for the unique demands of IGCSE and IB curriculums.
          </p>
        </div>

        <div
          ref={containerRef}
          className="flex flex-col gap-3 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:px-0"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`relative flex flex-row items-center gap-4 p-4 md:flex-col md:items-start md:gap-6 md:p-8 rounded-2xl md:rounded-[32px] border bg-white transition-all duration-500 group overflow-hidden ${feature.highlight
                  ? "border-[var(--brand-blue)]/30 shadow-sm md:shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 md:hover:-translate-y-2"
                  : "border-slate-100 shadow-sm md:hover:shadow-2xl md:hover:shadow-slate-200/50 md:hover:-translate-y-2 hover:border-[var(--brand-blue)]/20"
                }`}
            >
              {/* Subtle Corner Accent */}
              <div className={`absolute top-0 right-0 w-24 h-24 transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none ${feature.highlight ? "bg-gradient-to-bl from-[var(--brand-blue)]/5 to-transparent" : "bg-gradient-to-bl from-slate-50 to-transparent"
                }`} />

              <div className={`shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 ${feature.highlight ? "bg-[var(--brand-blue)]/10" : "bg-slate-50 group-hover:bg-[var(--brand-blue)]/5"
                }`}>
                <Image
                  src={feature.iconUrl}
                  alt={feature.title}
                  width={24}
                  height={24}
                  className={`object-contain transition-all duration-500 group-hover:scale-110 md:w-8 md:h-8 ${feature.highlight ? "" : "opacity-60 group-hover:opacity-100"
                    }`}
                />
              </div>

              <div className="flex flex-col text-left relative z-10">
                <h3 className="text-base md:text-[20px] font-bold mb-0.5 md:mb-3 text-[#0F1729] group-hover:text-[var(--brand-blue)] transition-colors">
                  {feature.title}
                </h3>

                <p className="text-[13px] md:text-[15px] leading-relaxed font-medium text-[#65758B] line-clamp-2 md:line-clamp-none">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Hook */}
        <div className="mt-10 md:mt-20 text-center px-4 md:px-0 mb-8 md:mb-0">
          <button
            onClick={() => document.getElementById("booking-card")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 text-sm md:text-base text-[var(--brand-blue)] font-bold hover:gap-3 transition-all group"
          >
            Start your personalized journey today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

