import { Star } from "lucide-react";

export function TrustBar() {
  return (
    <section className="bg-white py-12 border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          {/* Accreditation Side */}
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mr-4">Accreditation</div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl text-slate-800">Pearson</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl text-slate-800">CAIE Aligned</span>
            </div>

          </div>

          {/* Trustpilot Side */}
          <div className="flex items-center gap-6 bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1 text-emerald-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-[16px] font-bold text-[#0F1729]">Excellent 4.9/5</p>
              <p className="text-[12px] text-[#65758B] font-medium">on Trustpilot</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
