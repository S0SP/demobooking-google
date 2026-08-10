"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Play, Pause, Volume2, VolumeX, ArrowRight, Quote, Sparkles, Activity } from "lucide-react";
import Image from "next/image";
import { DEMO_BOOKING_PRICE_INR } from "@/lib/constants";

/* Initials avatar — no external HTTP request, no SSL issues */
function InitialsAvatar({ name, size = 56 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const colors = [
    "#2F80F9", "#08BD7E", "#7C3AED", "#DB2777", "#D97706"
  ];
  const bg = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      style={{ width: size, height: size, background: bg, fontSize: size * 0.36 }}
      className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
    >
      {initials}
    </div>
  );
}

const metricCards = [
  {
    id: "smaran",
    name: "Smaran",
    location: "Online",
    grade: "IGCSE-10 Student",
    rating: 5,
    highlight: "Chemistry A* Result",
    quote: "The personalized attention from <span class=\"text-[var(--brand-blue)] font-bold\">Unbound</span><span class=\"text-[var(--brand-green)] font-bold\">You</span> helped me secure my A* in Chemistry.",
    avatar: null,
    prevLabel: "Baseline",
    prevVal: "B",
    currLabel: "Final",
    currVal: "A*",
    metricType: "grade" as const,
  },
  {
    id: "arnav",
    name: "Arnav Asati",
    location: "Online",
    grade: "Student",
    rating: 5,
    highlight: "6 Grades Jump in Last 2 Months",
    quote: "I was struggling with the syllabus, but the crash course focused entirely on my weaknesses. My confidence skyrocketed before the exam.",
    avatar: null,
    prevLabel: "Baseline",
    prevVal: "C",
    currLabel: "Final",
    currVal: "A",
    metricType: "grade" as const,
  },
  {
    id: "fatima",
    name: "Fatima Al Sayed",
    location: "UAE",
    grade: "Parent",
    rating: 5,
    highlight: "The personalized attention is unmatched",
    quote: "Confidence has skyrocketed. The <span class=\"text-[var(--brand-blue)] font-bold\">Unbound</span><span class=\"text-[var(--brand-green)] font-bold\">You</span> mentor provided structured past paper practice that gave my son the edge he needed.",
    avatar: null,
    prevVal: "5",
    currVal: "7",
    metricType: "score" as const,
    prevLabel: "Baseline",
    currLabel: "Final",
  },
];

function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showUnmuteHint, setShowUnmuteHint] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.muted = isMuted;
        videoRef.current.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play();
            setIsMuted(true);
            setShowUnmuteHint(true);
          }
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isInView, isMuted]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      setShowUnmuteHint(false);
    }
  };

  // Global "Unlock" listener: If browser blocked audio, unmute as soon as user clicks anywhere
  useEffect(() => {
    const handleGlobalClick = () => {
      if (videoRef.current && isMuted && showUnmuteHint) {
        videoRef.current.muted = false;
        setIsMuted(false);
        setShowUnmuteHint(false);
      }
    };

    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("touchstart", handleGlobalClick);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("touchstart", handleGlobalClick);
    };
  }, [isMuted, showUnmuteHint]);

  return (
    <div ref={containerRef} className="relative aspect-[9/16] w-full rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border-[8px] md:border-[12px] border-slate-900 bg-black group">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover cursor-pointer"
        loop
        muted={isMuted}
        playsInline
        preload="none"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Control Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />

      {/* Unmute Hint Overlay */}
      {showUnmuteHint && isPlaying && isMuted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
        >
          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
            <VolumeX className="w-4 h-4 text-white" />
            <p className="text-white text-[10px] font-bold uppercase tracking-wider">Tap to Unmute</p>
          </div>
        </motion.div>
      )}

      {/* Play/Pause Large Center Button */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer bg-black/20"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 scale-110">
            <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-6 left-0 right-0 px-6 z-20">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-white fill-current" /> : <Play className="w-4 h-4 text-white fill-current translate-x-0.5" />}
              </button>
            </div>

            {/* Unmute/Volume Button */}
            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full bg-[var(--brand-green)] flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white animate-pulse" />}
            </button>
          </div>

          {/* Progress Bar - Synchronized with video time */}
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-[var(--brand-green)] shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-[width] duration-300 ease-linear"
            />
          </div>

          <div className="flex justify-center items-center">
            <p className="text-slate-200 text-[10px] md:text-[11px] font-bold tracking-wide uppercase">Documented 2-grade jump • IGCSE Specialist</p>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <span className="px-2.5 py-1 bg-[var(--brand-green)]/90 backdrop-blur-md rounded-full text-white text-[8px] font-bold uppercase tracking-widest shadow-lg border border-white/10">
          Verified Result
        </span>
      </div>
    </div>
  );
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
        ))}
    </div>
  );
}

export function SuccessStories() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-12 md:py-24 bg-[#0B1221] relative overflow-hidden scroll-mt-32" id="testimonials">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Animated Background Shapes & Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left Side Shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[5%] w-6 h-6 bg-orange-400 rounded-full opacity-40"
        />
        <motion.div
          animate={{ x: [0, 10, 0], y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[8%] w-12 h-12 opacity-30"
        >
          <div className="w-full h-full bg-emerald-400 rounded-br-[40px] rounded-tl-[40px] rotate-45" />
        </motion.div>

        {/* Particle Scatter - Rendered only on client to avoid hydration mismatch */}
        {mounted && [...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100],
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}

        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] left-[4%] w-10 h-10 border-4 border-indigo-500 rounded-lg opacity-20"
        />

        {/* Right Side Shapes */}
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[6%] opacity-40"
        >
          <Activity className="w-10 h-10 text-red-400" strokeWidth={3} />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] right-[10%] w-14 h-14 bg-amber-400 rounded-2xl opacity-30 rotate-12"
        />
        <motion.div
          animate={{ x: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[30%] right-[5%] w-8 h-8 bg-blue-500 rounded-full opacity-40"
        />
      </div>

      <div className="max-w-7xl mx-auto px-0 md:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/5 !text-white/80 text-[10px] md:text-[12px] font-bold px-3 py-1 md:px-4 md:py-1 rounded-full mb-4 uppercase tracking-widest border border-white/10"
          >
            <Sparkles className="w-3 h-3" />
            Global Success Stories
          </motion.div>
          <h2 className="text-3xl md:text-[48px] font-bold !text-white leading-tight mb-4 tracking-tight px-4 md:px-0">
            Real Results, Real Stories
          </h2>
          <p className="text-sm md:text-[18px] !text-slate-100 px-6 md:px-0">
            See how <span className="text-[var(--brand-blue)] font-bold">Unbound</span><span className="text-[var(--brand-green)] font-bold">You</span> mentors help students achieve a documented average 2-grade improvement within just 3 months.
          </p>
        </div>

        {/* Main Video Testimonial - Native Player with Smart Playback */}
        <div className="max-w-[320px] md:max-w-[360px] mx-auto mb-16 md:mb-24 px-4 md:px-0 relative z-20">
          <VideoPlayer src="/testimonial.mp4" />

          {/* Background Glow */}
          <div className="absolute -inset-20 bg-[var(--brand-blue)]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        </div>

        {/* Infinite Review Marquee (Mobile Only - Positioned Under Video) */}
        <div className="md:hidden">
          <div
            className="relative flex w-full overflow-hidden py-4 mb-8"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
            }}
          >
            <div className="flex w-max min-w-full animate-marquee hover:[animation-play-state:paused] gap-4">
              {[...metricCards, ...metricCards].map((card, idx) => (
                <div
                  key={`${card.id}-${idx}`}
                  className="w-[280px] shrink-0 rounded-2xl bg-white p-4 shadow-sm border border-slate-100 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 flex-shrink-0">
                      {card.avatar
                        ? <Image src={card.avatar} alt={card.name} width={32} height={32} className="w-full h-full object-cover" />
                        : <InitialsAvatar name={card.name} size={32} />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-none mb-1">{card.name}</h4>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2 h-2 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed mb-2">
                    &quot;{card.highlight}: {card.quote.replace(/<[^>]*>?/gm, '')}&quot;
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{card.prevLabel}: {card.prevVal}</span>
                    <ArrowRight className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{card.currLabel}: {card.currVal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Textual Testimonials Carousel (Desktop Only) */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-8 mb-20 px-8">
          {metricCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-[32px] p-8 border border-slate-50 flex flex-col hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden group"
            >
              {/* Profile Header */}
              <div className="flex items-start gap-4 mb-8">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm group-hover:border-[var(--brand-blue)]/30 transition-colors flex-shrink-0">
                    {card.avatar
                      ? <Image src={card.avatar} alt={card.name} width={56} height={56} className="w-full h-full object-cover" />
                      : <InitialsAvatar name={card.name} size={56} />}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Star className="w-2.5 h-2.5 text-white fill-current" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-[17px] font-bold text-[#0F1729] leading-none mb-1.5">{card.name}</h3>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] font-bold text-[var(--brand-blue)] uppercase tracking-wider">{card.grade}</span>
                    <span className="text-[11px] font-semibold text-slate-400">{card.location}</span>
                  </div>
                </div>
                <StarRating count={5} />
              </div>

              {/* Quote Section with Typographic Hierarchy */}
              <div className="flex-1 mb-8">
                <Quote className="w-10 h-10 text-slate-100 absolute -top-2 right-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-[16px] text-[#0F1729] leading-relaxed font-bold mb-2">
                  &ldquo;{card.highlight}&rdquo;
                </p>
                <p
                  className="text-[15px] text-[#65758B] leading-relaxed italic font-medium opacity-90"
                  dangerouslySetInnerHTML={{ __html: card.quote }}
                />
              </div>

              {/* Transformation Bar - Elevated */}
              <div className="pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{card.prevLabel}</p>
                    <p className="text-[24px] font-bold text-slate-300 tracking-tighter line-through decoration-slate-200">{card.prevVal}</p>
                  </div>

                  <div className="px-6 relative">
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border-2 border-emerald-100 shadow-sm"
                    >
                      <ArrowRight className="w-5 h-5 text-[var(--brand-green)] stroke-[3]" />
                    </motion.div>
                  </div>

                  <div className="flex-1 text-right relative">
                    <div className="absolute -inset-4 bg-[var(--brand-green)]/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-[10px] font-bold text-[var(--brand-green)] uppercase tracking-widest mb-1 relative z-10">{card.currLabel}</p>
                    <p className="text-[36px] font-black text-[var(--brand-green)] tracking-tight leading-none drop-shadow-[0_0_15px_rgba(16,185,129,0.2)] relative z-10">
                      {card.currVal}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Stats - One Line on Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex flex-row flex-nowrap justify-between items-center py-6 border-t border-white/10 mb-8 md:mb-16 md:grid md:grid-cols-4 md:gap-8 md:py-10 px-4 md:px-0"
        >
          {[
            { label: "Success", value: "98%", full: "Success Rate" },
            { label: "Boost", value: "2+", full: "Avg Grade Boost" },
            { label: "Mentors", value: "150+", full: "Expert Mentors" },
            { label: "Countries", value: "4", full: "Countries" }
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-1 md:gap-2">
              <div className="flex items-baseline gap-1">
                <p className="text-base md:text-[36px] font-bold !text-white tracking-tight">{stat.value}</p>
                <p className="text-[8px] md:text-[12px] font-bold !text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  <span className="md:hidden">{stat.label}</span>
                  <span className="hidden md:inline">{stat.full}</span>
                </p>
              </div>
              {i < 3 && <div className="w-1 h-1 rounded-full bg-slate-700 md:hidden mx-1" />}
            </div>
          ))}
        </motion.div>

        {/* Contextual CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center px-4 md:px-0"
        >
          <button
            onClick={() => document.getElementById("booking-card")?.scrollIntoView({ behavior: "smooth" })}
            className="w-fit mx-auto md:w-auto bg-[var(--brand-green)] text-white px-10 md:px-12 h-12 md:h-16 rounded-xl md:rounded-[20px] text-sm md:text-[18px] font-bold hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-black/10 inline-flex items-center justify-center gap-3"
          >
            <span className="block md:hidden">Book Demo (₹{DEMO_BOOKING_PRICE_INR}) &rarr;</span>
            <span className="hidden md:block">Get Results Like Vedant — Book Your Demo (₹{DEMO_BOOKING_PRICE_INR})</span>
            <ArrowRight className="hidden md:block w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
