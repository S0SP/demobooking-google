"use client";

import { motion } from "framer-motion";
import { CircleFlag } from "react-circle-flags";

const countries = [
  { name: "Singapore", code: "sg" },
  { name: "UAE", code: "ae" },
  { name: "Saudi Arabia", code: "sa" },
  { name: "India", code: "in" },
];

export function TrustedBy() {
  return (
    <section className="w-full bg-[var(--brand-blue)] py-8 md:py-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          
          <div className="flex-shrink-0 text-center lg:text-left">
            <h2 className="text-white text-[22px] md:text-[24px] font-bold leading-snug">
              Trusted by Students<br className="hidden lg:block" /> Worldwide
            </h2>
          </div>
          
          <div className="flex-1 w-full max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {countries.map((country, idx) => (
                <motion.div
                  key={country.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl py-3 px-4 flex items-center gap-3 shadow-sm hover:scale-[1.02] transition-transform cursor-default"
                >
                  <CircleFlag countryCode={country.code} className="w-6 h-6 flex-shrink-0" />
                  <span className="text-[#2b2272] font-semibold text-[14px] md:text-[15px]">
                    {country.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
