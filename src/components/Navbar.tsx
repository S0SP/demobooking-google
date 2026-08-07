"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { DEMO_BOOKING_PRICE_INR } from "@/lib/constants";

const NAV_LINKS = [
  { name: "Why UnboundYou", href: "#why-unboundyou" },
  { name: "Courses", href: "#courses" },
  { name: "Reviews", href: "#testimonials" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "bg-white shadow-sm border-b border-slate-100 py-2 md:py-3"
        : "bg-transparent py-4 md:py-5"}`}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-14 md:h-auto">
          {/* Left Zone: Logo */}
          <div className="flex-1 flex justify-start">
            <a
              href="https://www.unboundyou.com"
              className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95"
            >
              <Image
                src="/logo.png"
                alt="UnboundYou Logo"
                width={160}
                height={56}
                className="h-14 w-40"
                priority
              />
            </a>
          </div>

          {/* Center Zone: Nav */}
          <div className="hidden md:flex flex-none justify-center gap-8 items-center">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative px-2 py-2 text-[14px] font-semibold text-[#65758B] hover:text-[#0F1729] transition-colors group"
              >
                {link.name}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[var(--brand-blue)] rounded-full transition-all duration-300 group-hover:w-4" />
              </a>
            ))}
          </div>

          {/* Right Zone: CTA */}
          <div className="flex-1 flex justify-end items-center gap-4">
            <a
              href="https://wa.me/916299378633"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 bg-[#25D366] hover:brightness-105 text-white px-6 py-3 rounded-xl text-[14px] font-bold transition-all active:scale-95 shadow-md"
            >
              Connect on WhatsApp
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-200"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-[#0F1729]" />
              ) : (
                <Menu className="w-5 h-5 text-[#0F1729]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl"
          >
            <div className="px-4 py-6 space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-[15px] font-bold text-[#65758B] hover:text-[var(--brand-blue)] hover:bg-slate-50 rounded-xl transition-all"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4">
                <button 
                  onClick={() => {
                    setMobileOpen(false);
                    document.getElementById("booking-card")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full bg-[var(--brand-green)] text-white px-6 py-4 rounded-xl text-[15px] font-bold shadow-lg shadow-emerald-500/20"
                >
                  Book Trial @ ₹{DEMO_BOOKING_PRICE_INR}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
