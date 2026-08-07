"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Sun, ArrowRight } from "lucide-react";
import { SITE_CONTENT } from "@/config/content";

export function CtaAndFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white">
      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0F1729] rounded-[48px] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl"
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-[var(--brand-blue)]/20 rounded-full" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[var(--brand-green)]/20 rounded-full" />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-white/10 text-white text-[11px] md:text-[12px] font-bold px-4 py-1.5 rounded-full mb-6 md:mb-8 uppercase tracking-widest backdrop-blur-md"
              >
                <Sun className="w-3 h-3 text-[var(--brand-green)]" />
                FAST-TRACK YOUR GRADES
              </motion.div>

              <h2 className="text-3xl md:text-[56px] font-bold text-white leading-tight mb-8 md:mb-10 tracking-tight">
                {SITE_CONTENT.footer.headline}
              </h2>

              <p className="text-sm md:text-[20px] text-slate-300 leading-relaxed mb-10 md:mb-14 max-w-2xl mx-auto font-medium px-4 md:px-0">
                {SITE_CONTENT.footer.subtext}
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => document.getElementById("booking-card")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full md:w-auto bg-[var(--brand-green)] text-white px-10 py-4 md:py-5 rounded-2xl text-[16px] font-bold hover:brightness-105 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                >
                  Book Your Session
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => document.getElementById("comparison")?.scrollIntoView({ behavior: "smooth" })}
                  className="hidden md:flex w-full md:w-auto bg-white/10 text-white px-10 py-5 rounded-2xl text-[16px] font-bold hover:bg-white/20 transition-all active:scale-95 border border-white/10 backdrop-blur-sm"
                >
                  Why Choose Us?
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contact" className="pt-16 pb-32 md:pb-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-10 md:grid md:grid-cols-4 md:gap-8 mb-16">

            {/* Brand Column */}
            <div className="space-y-6">
              <a href="#" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
                <Image
                  src="/logo.png"
                  alt="UnboundYou Logo"
                  width={140}
                  height={40}
                  className="h-9 w-auto"
                />
              </a>
              <p className="text-[14px] text-[#65758B] leading-relaxed font-medium">
                Revolutionizing 1-on-1 learning with expert mentors from the world&apos;s top universities. Your journey to academic excellence starts here.
              </p>
              <div className="flex gap-4">
                {[
                  { Icon: Linkedin, href: "https://www.linkedin.com/company/unboundyou/" },
                  { Icon: Instagram, href: "https://www.instagram.com/unboundyou.team/" },
                  { Icon: Youtube, href: "https://www.youtube.com/@unboundyou_team" }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[var(--brand-blue)] hover:bg-blue-50 transition-all"
                  >
                    <social.Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links & Subjects Wrapper for Mobile Grid */}
            <div className="grid grid-cols-2 gap-4 w-full md:contents">
              {/* Quick Links */}
              <div>
                <h4 className="text-[16px] font-bold text-[#0F1729] mb-4 md:mb-6">Quick Links</h4>
                <ul className="space-y-1 md:space-y-4">
                  {["Find Tutors", "Our Methodology", "Real Stories", "Pricing Plans"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm md:text-[14px] text-[#65758B] hover:text-[var(--brand-green)] py-2 md:py-0 transition-colors font-medium inline-block">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subjects */}
              <div>
                <h4 className="text-[16px] font-bold text-[#0F1729] mb-4 md:mb-6">Subjects</h4>
                <ul className="space-y-1 md:space-y-4">
                  {["Mathematics", "Physics", "Chemistry", "Biology", "French"].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm md:text-[14px] text-[#65758B] hover:text-[var(--brand-green)] py-2 md:py-0 transition-colors font-medium inline-block">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-6">
              <h4 className="text-[16px] font-bold text-[#0F1729] mb-4 md:mb-6">Get in Touch</h4>
              <div className="space-y-4">
                <a href="mailto:team@unboundyou.com" className="flex items-center gap-3 text-xs md:text-[14px] text-[#65758B] hover:text-[var(--brand-blue)] transition-colors font-medium">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="truncate">team@unboundyou.com</span>
                </a>
                <a href="https://wa.me/916299378633" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs md:text-[14px] text-[#65758B] hover:text-[#25D366] transition-colors font-medium">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  +91 62993 78633
                </a>
                <div className="flex items-center gap-3 text-xs md:text-[14px] text-[#65758B] font-medium">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  Bangalore
                </div>
              </div>
            </div>
          </div>

          {/* SEO Subjects Block */}
          <div className="pt-10 pb-4 mt-12 border-t border-slate-100">
            <p className="text-xs leading-loose text-slate-400 text-justify font-medium">
              <strong className="text-slate-500">IGCSE Online Tuition Experts:</strong> We specialize in providing the highest quality <span className="text-slate-500">igcse online tuition</span> and connect students with a dedicated <span className="text-slate-500">igcse online tutor</span>. Our highly tailored programs include matching you with an expert <span className="text-slate-500">igcse maths tutor online</span>, <span className="text-slate-500">igcse english tutor online</span>, <span className="text-slate-500">igcse physics online tutor</span>, <span className="text-slate-500">igcse chemistry tutor online</span>, or <span className="text-slate-500">igcse biology online tutor</span>. Whether you are specifically looking for an <span className="text-slate-500">online igcse maths tutor</span>, <span className="text-slate-500">online igcse physics tutor</span>, an <span className="text-slate-500">igcse english online tutor</span>, an <span className="text-slate-500">igcse chemistry online tutor</span>, or a dedicated <span className="text-slate-500">physics igcse tutor online</span>, our personalized <span className="text-slate-500">igcse online coaching</span> is designed to maximize your academic performance. Experience the best <span className="text-slate-500">online tuition igcse</span> and <span className="text-slate-500">igcse maths online tuition</span> with UnboundYou&apos;s elite mentors.
            </p>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[13px] text-[#65758B] font-medium">
              © {currentYear} <span className="text-[var(--brand-blue)]">Unbound</span><span className="text-[var(--brand-green)]">You</span>. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-[13px] text-[#65758B] hover:text-[#0F1729] transition-colors font-medium">Privacy Policy</a>
              <a href="#" className="text-[13px] text-[#65758B] hover:text-[#0F1729] transition-colors font-medium">Terms of Service</a>
              <a href="#" className="text-[13px] text-[#65758B] hover:text-[#0F1729] transition-colors font-medium">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
