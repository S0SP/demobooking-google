"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Check, ArrowRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const journeyNodes = [
  {
    title: "Diagnostic Match",
    traditional: "Random tutor assigned based on location. No strategy.",
    unbound: "Expert pairs with a personalized long-term strategy.",
    iconUrl: "https://img.icons8.com/?id=nbBCL87roGNj&format=png&size=64"
  },
  {
    title: "Support",
    traditional: "Support stops completely once the tutor leaves.",
    unbound: "On-demand doubt resolution when it's actually needed.",
    iconUrl: "https://img.icons8.com/?id=GtgqQIYSqT50&format=png&size=64"
  },
  {
    title: "Visibility",
    traditional: "Generic verbal reassurances—no real tracking.",
    unbound: "Transparent progress tracking with visible metrics.",
    iconUrl: "https://img.icons8.com/?id=4VdgitiyspJ9&format=png&size=64"
  },
  {
    title: "Execution",
    traditional: "Last-minute panic and high levels of exam stress.",
    unbound: "Structured revision notes executed from day one.",
    iconUrl: "https://img.icons8.com/?id=g34sfj4NMisg&format=png&size=64"
  }
];

export function ComparisonGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!progressLineRef.current || !containerRef.current) return;

    gsap.fromTo(progressLineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 30%",
          end: "bottom 70%",
          scrub: 1
        }
      }
    );

    const rows = gsap.utils.toArray(".timeline-row") as HTMLElement[];
    rows.forEach((row) => {
      const dot = row.querySelector(".timeline-dot");
      const trap = row.querySelector(".trap-card");
      const cure = row.querySelector(".cure-card");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      tl.to(dot, { backgroundColor: "var(--brand-blue)", scale: 1.1, duration: 0.3 })
        .fromTo([trap, cure],
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" },
          "-=0.2"
        );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-[#F8FAFC] relative overflow-hidden" id="comparison">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20 px-4 md:px-0">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-blue)]/5 text-[var(--brand-blue)] text-[11px] md:text-[12px] font-bold px-3 py-1 md:px-4 md:py-1 rounded-full mb-4 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            The Roadmap to Success
          </div>
          <h2 className="text-3xl md:text-[48px] font-bold text-[#0F1729] leading-tight mb-4 md:mb-6 tracking-tight">
            Stop guessing with home tutors. <br />
            <span className="text-[var(--brand-blue)]">The Path to A*</span> is a System.
          </h2>
          <p className="text-sm md:text-[18px] text-[#65758B] font-medium leading-relaxed max-w-sm mx-auto md:max-w-none">
            See exactly how our structured, data-driven methodology eliminates the guesswork and outperforms traditional tutoring.
          </p>
        </div>

        <div className="relative">
          {/* Central Progress Line - Left Aligned on Mobile */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-200 -translate-x-1/2 rounded-full z-0">
            <div
              ref={progressLineRef}
              className="w-full h-full bg-gradient-to-b from-[var(--brand-blue)] to-[var(--brand-green)] origin-top scale-y-0 rounded-full"
            />
          </div>

          <div className="space-y-12 relative z-10">
            {journeyNodes.map((node, idx) => (
              <div key={idx} className="timeline-row relative flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-24 items-start md:items-center pl-14 md:pl-0 w-full">

                {/* Traditional Trap (Left) */}
                <div className="md:text-right flex md:justify-end w-full">
                  <div className="trap-card bg-[#F1F5F9] p-4 md:p-6 rounded-2xl md:rounded-[28px] border border-[#E2E8F0] shadow-sm w-full max-w-full md:max-w-[280px] min-h-0 md:min-h-[160px] flex flex-col justify-center transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2 md:justify-end">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">The Traditional Trap</span>
                      <span className="w-3 h-3 text-red-500 font-bold inline-block align-middle">×</span>
                    </div>
                    <p className="text-[14px] text-[#475569] leading-tight font-medium italic">
                      &quot;{node.traditional}&quot;
                    </p>
                  </div>
                </div>

                {/* Central Dot */}
                <div className="timeline-dot absolute left-6 md:left-1/2 top-8 md:top-1/2 -translate-x-1/2 -translate-y-1/2 flex w-6 h-6 rounded-full bg-white border-2 border-slate-200 items-center justify-center shadow-md z-20">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                </div>

                {/* UnboundYou Standard (Right) */}
                <div className="text-left flex md:justify-start w-full">
                  <div className="cure-card bg-white p-4 md:p-6 rounded-2xl md:rounded-[28px] shadow-sm md:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] border border-slate-100 hover:border-[var(--brand-blue)]/20 transition-all duration-500 w-full max-w-full md:max-w-[280px] min-h-0 md:min-h-[160px] flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[var(--brand-blue)] text-[10px] font-bold uppercase tracking-widest">{node.title}</span>
                      <div className="w-6 h-6 rounded-lg bg-[var(--brand-blue)]/5 flex items-center justify-center p-1">
                        <Image src={node.iconUrl} alt={node.title} width={24} height={24} className="object-contain" unoptimized />
                      </div>
                    </div>
                    <p className="text-[15px] text-[#0F1729] font-bold leading-tight">
                      {node.unbound}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-[var(--brand-green)] font-bold text-[11px] uppercase tracking-wider">
                      <Check className="w-3 h-3 stroke-[3px]" strokeWidth={3} />
                      Outcome: Success
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="mt-20 text-center relative z-10">
            <button
              onClick={() => document.getElementById("booking-card")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative inline-flex items-center gap-2 bg-[#0F1729] text-white px-8 py-4 rounded-full text-[15px] font-bold hover:scale-105 transition-all shadow-xl overflow-hidden"
            >
              Join the Path to A*
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
