// src/components/HeroSection.tsx
// Full replacement

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ChevronLeft, ChevronRight, ArrowRight,
  User, ShieldCheck, GraduationCap,
  Target, BookOpen, Sparkles,
  AlertTriangle, CheckCircle2, Mail,
} from "lucide-react";
import { PhoneInputField } from "./PhoneInputField";
import { TimezoneSelector } from "./TimezoneSelector";
import { useBeastLocation, isValidTz } from "../hooks/useBeastLocation";
import {
  submitBookingAndCreateOrder,
  checkPhoneDuplicate,
  checkEmailDuplicate,
  type BookingStatus,
} from "../lib/bookingService";
import { DEMO_BOOKING_PRICE_INR } from "@/lib/constants";
import type { Country } from "react-phone-number-input";

gsap.registerPlugin(useGSAP);

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface FormData {
  name: string;
  email: string;
  phone: string;        // E.164
  countryCode: string;  // ISO 2-letter from PhoneInputField e.g. "IN"
  grade: string;
  board: string;
  subjects: string[];
  otherSubject: string;
  timezone: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  countryCode: "",
  grade: "",
  board: "IGCSE",
  subjects: [],
  otherSubject: "",
  timezone: "",
};

const SUBJECTS = [
  "Physics", "Chemistry", "Math", "Biology", "English", "French", "ICT",
];
const TIME_PREFS = [
  "Morning (7am\u201312pm)",
  "Afternoon (12pm\u20135pm)",
  "Evening (5pm\u201310pm)",
];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/* ─── Razorpay types ──────────────────────────────────────────────────────── */

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
interface RazorpayErrorResponse {
  error: {
    code: string; description: string; source: string;
    step: string; reason: string;
    metadata: { order_id: string; payment_id: string };
  };
}
interface RazorpayOptions {
  key: string; amount: number; currency: string;
  name: string; description: string; order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; email: string; contact: string };
  notes: { booking_id: string };
  theme: { color: string };
  modal: { ondismiss: () => void };
}
interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (e: RazorpayErrorResponse) => void) => void;
}
interface WindowWithRazorpay extends Window {
  Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
}

/* ─── Step 1: Basic Details ───────────────────────────────────────────────── */

function IntroForm({
  formData, setFormData, onNext, direction, defaultCountry,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  direction: number;
  defaultCountry: Country;
}) {
  const [nameWarning, setNameWarning] = useState("");
  const [emailWarning, setEmailWarning] = useState("");
  const [phoneCheck, setPhoneCheck] =
    useState<"idle" | "checking" | "duplicate" | "available">("idle");
  const [emailCheck, setEmailCheck] =
    useState<"idle" | "checking" | "duplicate" | "available">("idle");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [currentCountry, setCurrentCountry] = useState<Country>(defaultCountry);

  const containerRef = useRef<HTMLDivElement>(null);

  const inputBase =
    "w-full h-12 md:h-[52px] px-4 rounded-xl border border-slate-200 bg-white " +
    "text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 " +
    "focus:ring-[var(--brand-blue)]/20 focus:border-[var(--brand-blue)] " +
    "transition-all text-sm font-medium";
  const selectBase =
    "h-12 md:h-[52px] px-4 rounded-xl border border-slate-200 bg-white " +
    "text-slate-900 focus:outline-none focus:ring-2 " +
    "focus:ring-[var(--brand-blue)]/20 focus:border-[var(--brand-blue)] " +
    "transition-all text-sm font-medium appearance-none cursor-pointer";

  useEffect(() => {
    if (defaultCountry) setCurrentCountry(defaultCountry);
  }, [defaultCountry]);

  // Email debounce duplicate check
  useEffect(() => {
    const email = formData.email.trim();
    if (!email) { setEmailCheck("idle"); setEmailWarning(""); return; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailCheck("idle");
      const t = setTimeout(
        () => setEmailWarning("Please enter a valid email address"), 800
      );
      return () => clearTimeout(t);
    }

    setEmailWarning("");
    setEmailCheck("checking");
    const t = setTimeout(async () => {
      const isDup = await checkEmailDuplicate(email);
      setEmailCheck(isDup ? "duplicate" : "available");
      setEmailWarning(isDup ? "Email already registered for a demo." : "");
    }, 600);
    return () => clearTimeout(t);
  }, [formData.email]);

  const handlePhoneChange = useCallback(
    (val: string) => {
      setFormData((p) => ({ ...p, phone: val }));
      setPhoneCheck("idle");
    },
    [setFormData]
  );

  // ── Key fix: when country changes in PhoneInputField, store ISO code ──────
  const handleCountryChange = useCallback(
    (country: Country) => {
      setCurrentCountry(country);
      // Store ISO 2-letter code in formData so CalendarStep can pass it to server
      setFormData((p) => ({ ...p, countryCode: country ?? "" }));
    },
    [setFormData]
  );

  const toggleSubject = (s: string) =>
    setFormData((p) => ({
      ...p,
      subjects: p.subjects.includes(s)
        ? p.subjects.filter((x) => x !== s)
        : [...p.subjects, s],
    }));

  const isEmailValid =
    formData.email.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(formData.email.trim());

  const isValid =
    formData.name.trim().length >= 3 &&
    isEmailValid &&
    emailCheck !== "duplicate" &&
    emailCheck !== "checking" &&
    isPhoneValid &&
    phoneCheck !== "duplicate" &&
    phoneCheck !== "checking" &&
    !!formData.grade &&
    formData.subjects.length > 0;

  useGSAP(() => {
    gsap.from(".form-input-animate", {
      y: 15, opacity: 0, stagger: 0.04, duration: 0.4, ease: "power2.out",
    });
  }, { scope: containerRef });

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: direction * 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -50 }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className="flex flex-col w-full bg-white rounded-2xl z-10 p-5 md:p-8 space-y-4 md:space-y-5"
      ref={containerRef}
    >
      <div className="mb-4 form-input-animate">
        <div className="flex justify-center gap-2 mb-4">
          <div className="w-10 h-1.5 rounded-full bg-[var(--brand-blue)]"></div>
          <div className="w-10 h-1.5 rounded-full bg-slate-100"></div>
        </div>
        <h2 className="text-xl font-bold text-[#0F1729] mb-1">
          Book your Trial Session
        </h2>
        <p className="text-sm text-[#65758B]">Step 1: Share your details</p>
      </div>

      {/* Name */}
      <div className="relative form-input-animate">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => {
            const v = e.target.value;
            setFormData((p) => ({ ...p, name: v }));
            setNameWarning(
              /[^a-zA-Z\s]/.test(v) ? "Only alphabets and spaces allowed" : ""
            );
          }}
          className={`${inputBase} pl-10`}
        />
        {nameWarning && (
          <p className="text-xs text-red-500 mt-1 ml-1">{nameWarning}</p>
        )}
      </div>

      {/* Email */}
      <div className="relative form-input-animate">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => {
            setFormData((p) => ({ ...p, email: e.target.value }));
            setEmailWarning("");
          }}
          className={`${inputBase} pl-10`}
        />
        {emailWarning && (
          <p className="text-xs text-red-500 mt-1 ml-1">{emailWarning}</p>
        )}
      </div>

      {/* Phone */}
      <div className="form-input-animate relative z-50">
        <PhoneInputField
          value={formData.phone}
          onChange={handlePhoneChange}
          onValidityChange={setIsPhoneValid}
          onCountryChange={handleCountryChange}  // ← uses new handler
          onStatusChange={setPhoneCheck}
          defaultCountry={currentCountry}
        />
      </div>

      {/* Grade + Board */}
      <div className="grid grid-cols-2 gap-2 md:gap-3 form-input-animate">
        <div className="relative">
          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
          <select
            value={formData.grade}
            onChange={(e) => setFormData((p) => ({ ...p, grade: e.target.value }))}
            className={`${selectBase} w-full pl-10 pr-8`}
          >
            <option value="" disabled>Grade</option>
            {["6", "7", "8", "9", "10", "11", "12"].map((g) => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
        </div>
        <div className="relative">
          <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--brand-blue)] z-10" />
          <div className="h-12 md:h-[52px] w-full pl-10 pr-8 flex items-center rounded-xl border border-[var(--brand-blue)]/50 bg-[var(--brand-blue)]/5 text-[var(--brand-blue)] cursor-default text-sm font-bold shadow-sm">
            IGCSE
          </div>
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--brand-blue)]" />
        </div>
      </div>

      {/* Subjects */}
      <div className="mt-4 form-input-animate">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          Select Subjects
        </label>
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSubject(s)}
              className={`w-full py-2.5 md:py-3 rounded-xl text-[12px] md:text-[13px] font-bold transition-all border ${formData.subjects.includes(s)
                ? "bg-[var(--brand-blue)]/10 text-[var(--brand-blue)] border-[var(--brand-blue)] shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-[var(--brand-blue)]/40 hover:bg-slate-50"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Next */}
      <button
        disabled={!isValid}
        onClick={onNext}
        className="w-full h-14 bg-[var(--brand-blue)] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed mt-2 group overflow-hidden relative"
      >
        <span className="relative z-10">Next: Choose a Time</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </button>
    </motion.div>
  );
}

/* ─── Helper for Blocked Days ─────────────────────────────────────────────── */

// Deterministically generates 3-4 blocked days in a given month/year.
// These are not recurring days of the week, and Saturdays/Sundays are never blocked.
function getBlockedDaysForMonth(year: number, month: number): number[] {
  const seed = (year * 12 + month) % 10;
  // Even seeds get 4 blocked days, odd get 3.
  const numDays = seed % 2 === 0 ? 4 : 3;
  const baseDays = [8, 15, 22, 27];
  const blocked: number[] = [];

  for (let i = 0; i < numDays; i++) {
    const variation = ((seed + i) % 5) - 2; // -2, -1, 0, 1, or 2
    let day = baseDays[i] + variation;

    // Keep day in bounds
    if (day < 1) day = 1;

    // Avoid Saturdays (6) and Sundays (0)
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 6) {
      day = day - 1; // shift to Friday
    } else if (dayOfWeek === 0) {
      day = day + 1; // shift to Monday
    }

    // Keep day in bounds after shift
    if (day < 1) day = 1;

    if (!blocked.includes(day)) {
      blocked.push(day);
    } else {
      // Find a nearby weekday to avoid duplicates
      let altDay = day;
      for (const offset of [2, -2, 3, -3, 4, -4]) {
        altDay = day + offset;
        if (altDay >= 1 && altDay <= 28) {
          const altDate = new Date(year, month, altDay);
          const altDOW = altDate.getDay();
          if (altDOW !== 0 && altDOW !== 6 && !blocked.includes(altDay)) {
            blocked.push(altDay);
            break;
          }
        }
      }
    }
  }

  return blocked.sort((a, b) => a - b);
}

/* ─── Step 2: Calendar & Time ─────────────────────────────────────────────── */

function CalendarStep({
  formData, setFormData, onBack, direction, initialTimezone, detectedCountry,
}: {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onBack: () => void;
  direction: number;
  initialTimezone: string;
  detectedCountry: string;
}) {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTimePref, setSelectedTimePref] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedDateObj = selectedDate ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate) : null;
  const isWeekendSelected = selectedDateObj ? selectedDateObj.getDay() === 0 : false;

  const scrollRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTimezone && !formData.timezone) {
      setFormData((p) => ({ ...p, timezone: initialTimezone }));
    }
  }, [initialTimezone, formData.timezone, setFormData]);

  useEffect(() => {
    if (selectedDate && scrollRef.current && scheduleRef.current) {
      setTimeout(() => {
        const offset = scheduleRef.current?.offsetTop ?? 0;
        scrollRef.current?.scrollTo({ top: offset - 20, behavior: "smooth" });
      }, 100);
    }
  }, [selectedDate]);

  useGSAP(() => {
    gsap.from(".calendar-animate", {
      y: 20, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power3.out",
    });
  }, { scope: scrollRef });

  const daysInMonth = new Date(
    currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0
  ).getDate();
  const firstDay = new Date(
    currentMonth.getFullYear(), currentMonth.getMonth(), 1
  ).getDay();

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = new Date(currentMonth);
    m.setMonth(parseInt(e.target.value));
    setCurrentMonth(m);
    setSelectedDate(null);
  };
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null);
  };
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  /* ── Finalize ─────────────────────────────────────────────────────────── */
  const handleFinalize = async () => {
    if (
      !selectedDate || !selectedTimePref || !isValidTz(formData.timezone) ||
      bookingStatus === "submitting" || bookingStatus === "checking" ||
      bookingStatus === "success"
    ) return;

    setErrorMessage("");

    // Fast client pre-check
    setBookingStatus("checking");
    const isDup = await checkPhoneDuplicate(formData.phone);
    if (isDup) { setBookingStatus("duplicate"); return; }

    setBookingStatus("submitting");

    const result = await submitBookingAndCreateOrder({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      countryCode: formData.countryCode,  // ← ISO code from PhoneInputField
      grade: formData.grade,
      board: formData.board,
      subjects: formData.subjects,
      otherSubject: formData.otherSubject,
      preferredDate: selectedDate,
      preferredMonth: MONTH_NAMES[currentMonth.getMonth()],
      preferredYear: currentMonth.getFullYear(),
      timePreference: selectedTimePref,
      timezone: formData.timezone,
    });

    if (result.isDuplicate) { setBookingStatus("duplicate"); return; }

    if (
      result.success && result.orderId && result.keyId &&
      result.amount !== undefined && result.bookingId
    ) {
      const RazorpayConstructor = (window as unknown as WindowWithRazorpay).Razorpay;
      if (!RazorpayConstructor) {
        setBookingStatus("error");
        setErrorMessage("Razorpay failed to load. Please reload the page.");
        return;
      }

      const options: RazorpayOptions = {
        key: result.keyId,
        amount: result.amount,
        currency: result.currency ?? "INR",
        name: "UnboundYou",
        description: "IGCSE Elite Tutoring Trial Session",
        order_id: result.orderId,
        handler: () => {
          // Webhook handles the Firestore status update asynchronously.
          // We just redirect — webhook will mark status: "payment_success".
          setBookingStatus("success");
          if (typeof window !== "undefined") {
            sessionStorage.setItem("valid_checkout", "true");
          }
          window.location.href = `/thank-you?bookingId=${result.bookingId}`;
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: { booking_id: result.bookingId },
        theme: { color: "#3B82F6" },
        modal: {
          ondismiss: () => {
            setBookingStatus("payment_cancelled");
            setErrorMessage("Payment cancelled. You can retry.");
          },
        },
      };

      try {
        const rzp = new RazorpayConstructor(options);
        rzp.on("payment.failed", (response: RazorpayErrorResponse) => {
          setBookingStatus("error");
          setErrorMessage(
            response.error?.description ?? "Payment failed. Please try again."
          );
        });
        rzp.open();
      } catch (err) {
        console.error("[HeroSection] Razorpay init error:", err);
        setBookingStatus("error");
        setErrorMessage("Failed to open payment modal. Please try again.");
      }
      return;
    }

    setBookingStatus("error");
    setErrorMessage(result.error ?? "Something went wrong. Please try again.");
  };

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: direction * 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -50 }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className="flex flex-col w-full bg-white rounded-2xl z-10 p-6 sm:p-8"
    >
      <div className="flex justify-center gap-2 mb-4">
        <div className="w-10 h-1.5 rounded-full bg-[#10B981]"></div>
        <div className="w-10 h-1.5 rounded-full bg-[var(--brand-blue)]"></div>
      </div>
      {/* Header bar */}
      <div className="bg-[#10B981] px-6 py-6 text-white relative overflow-hidden flex items-center min-h-[95px] rounded-2xl mb-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 -translate-y-16 blur-2xl" />
        <div className="flex items-center w-full relative z-10">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white -ml-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex flex-col items-center pr-9">
            <h3 className="font-bold text-xl !text-white tracking-tight leading-tight">
              Select Schedule
            </h3>
            <p className="!text-white/80 text-[13px] font-medium mt-0.5">
              Choose your preferred slot
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div ref={scrollRef} className="overflow-y-auto scrollbar-hide flex-1">

        {/* Scarcity Banner / Supporting Copy */}
        <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100 text-center calendar-animate">
          <p className="text-[13px] font-bold text-slate-800">
            Choose a convenient time for your demo class.
          </p>
          <p className="text-[11px] text-amber-600 font-bold mt-1">
            ⚠️ Limited slots available each week.
          </p>
        </div>

        {/* Month nav */}
        <div className="flex items-center justify-between calendar-animate mb-4">
          <select
            value={currentMonth.getMonth()}
            onChange={handleMonthChange}
            className="bg-slate-50 border-none text-sm font-bold text-[#0F1729] px-3 py-1 rounded-lg focus:ring-0 cursor-pointer"
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i}>{name} {currentMonth.getFullYear()}</option>
            ))}
          </select>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-md">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-md">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 text-center mb-4">
          {["Su", "M", "T", "W", "Th", "F", "S"].map((d) => (
            <div key={d} className="text-[10px] font-bold text-slate-400 mb-2">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const thisDate = new Date(
              currentMonth.getFullYear(), currentMonth.getMonth(), day
            ); thisDate.setHours(0, 0, 0, 0);

            const isPast = thisDate < today;
            const isSelected = selectedDate === day;

            const dayOfWeek = thisDate.getDay();
            const isWeekend = dayOfWeek === 0;
            
            // Scarcity rule: Exactly 3-4 days in a month are blocked (never Saturdays/Sundays, not recurring)
            const blockedDays = getBlockedDaysForMonth(currentMonth.getFullYear(), currentMonth.getMonth());
            const isUnavailable = blockedDays.includes(day);
            const isDisabled = isPast || isUnavailable;

            let btnClass = "aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all ";
            if (isSelected) {
              btnClass += "bg-[var(--brand-blue)] text-white shadow-md scale-110";
            } else if (isPast) {
              btnClass += "text-slate-300 cursor-not-allowed";
            } else if (isUnavailable) {
              btnClass += "text-slate-300 bg-slate-50 line-through cursor-not-allowed opacity-50";
            } else if (isWeekend) {
              btnClass += "border border-amber-200 bg-amber-50/20 text-amber-900 hover:bg-amber-50/50";
            } else if (thisDate.getTime() === today.getTime()) {
              btnClass += "text-[var(--brand-blue)] bg-[var(--brand-blue)]/5 hover:bg-[var(--brand-blue)]/10";
            } else {
              btnClass += "text-slate-600 hover:bg-slate-50";
            }

            return (
              <button
                key={day}
                onClick={() => !isDisabled && setSelectedDate(day)}
                disabled={isDisabled}
                className={btnClass}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-3.5 text-[10px] font-bold text-slate-400 mb-6 calendar-animate">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-200 border border-slate-300" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[var(--brand-blue)]" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-100 border border-amber-200" />
            <span>Sunday</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-100 line-through opacity-50" />
            <span>Unavailable</span>
          </div>
        </div>

        {/* Time + TZ picker */}
        <AnimatePresence mode="wait">
          {selectedDate && (
            <motion.div
              ref={scheduleRef}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="space-y-5 pt-2"
            >
              {/* Timezone */}
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    YOUR TIME ZONE
                  </label>
                  {!isValidTz(formData.timezone) && (
                    <span className="text-[10px] font-bold text-red-500 animate-pulse">
                      SELECTION REQUIRED
                    </span>
                  )}
                </div>
                <TimezoneSelector
                  value={formData.timezone}
                  onChange={(tz) => setFormData((p) => ({ ...p, timezone: tz }))}
                  detectedCountry={detectedCountry}
                />
                {!isValidTz(formData.timezone) && (
                  <p className="text-[10px] text-red-400 font-medium ml-1">
                    Please select your local timezone to continue.
                  </p>
                )}
              </div>

              {/* Time preference */}
              <div className="space-y-3">
                <label className="text-xs font-bold tracking-wider text-slate-500 uppercase ml-1">
                  PREFERRED TIME OF DAY
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_PREFS.map((pref) => {
                    let disabled = false;
                    if (selectedDate) {
                      const today = new Date();
                      const sel = new Date(
                        currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate
                      );
                      today.setHours(0, 0, 0, 0); sel.setHours(0, 0, 0, 0);
                      if (today.getTime() === sel.getTime()) {
                        const h = new Date().getHours();
                        if (h >= 22) disabled = true;
                        else if (h >= 17) disabled = !pref.startsWith("Evening");
                        else if (h >= 12) disabled = pref.startsWith("Morning");
                      }
                    }
                    return (
                      <button
                        key={pref}
                        onClick={() => !disabled && setSelectedTimePref(pref)}
                        disabled={disabled}
                        className={`flex-1 border rounded-xl p-3 text-center transition-all
                          ${selectedTimePref === pref
                            ? "bg-[#3B82F6] border-[#3B82F6] text-white shadow-md ring-2 ring-blue-500/20 ring-offset-2 scale-[1.02]"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}
                          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="text-[12px] font-bold">{pref.split(" ")[0]}</div>
                        <div className={`text-[10px] font-medium ${selectedTimePref === pref ? "text-white/80" : "text-slate-400"
                          }`}>
                          {pref.split(" ").slice(1).join(" ")}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* WhatsApp note */}
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs px-3 py-2.5 rounded-lg mt-4 border border-emerald-100/50">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-emerald-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <p className="font-semibold tracking-tight">
                    Our team will confirm exact time via WhatsApp
                  </p>
                </div>

                {/* Weekend Confirmation Alert */}
                {isWeekendSelected && (
                  <div className="flex items-start gap-2 bg-amber-50 text-amber-800 text-xs px-3.5 py-3 rounded-xl mt-4 border border-amber-100">
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-900 mb-0.5">Sunday slot selected</p>
                      <p className="font-semibold text-amber-800 leading-relaxed">
                        Sunday demo confirmations may take a little longer. We&apos;ll confirm your slot shortly.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary card */}
              <div className="mt-6 bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-inner">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                    <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Session Summary
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[14px] font-semibold text-slate-900 leading-tight">
                    {formData.subjects.join(", ") || "No subject"}
                    <span className="text-slate-500 font-medium">
                      {" "}for Grade {formData.grade || "???"}
                    </span>
                  </p>
                  <p className="text-[13px] font-medium text-slate-500">
                    {selectedDate
                      ? `${selectedDate} ${MONTH_NAMES[currentMonth.getMonth()]}`
                      : "Select a date"}
                    {selectedTimePref ? ` • ${selectedTimePref.split(" ")[0]}` : ""}
                    {formData.timezone && isValidTz(formData.timezone) && (
                      <span className="text-[var(--brand-blue)] font-semibold">
                        {` • ${formData.timezone.split("/").pop()?.replace(/_/g, " ") ??
                          formData.timezone
                          }`}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status banners */}
        <AnimatePresence mode="wait">
          {bookingStatus === "duplicate" && (
            <motion.div key="dup" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-4"
            >
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-800">Demo already booked</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Go back and use a different WhatsApp number or email.
                </p>
              </div>
            </motion.div>
          )}
          {(bookingStatus === "error" || bookingStatus === "payment_cancelled") && (
            <motion.div key="err" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4"
            >
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-red-700">{errorMessage}</p>
            </motion.div>
          )}
          {bookingStatus === "success" && (
            <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mt-4"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <p className="text-xs font-bold text-emerald-700">Payment successful! Redirecting...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pay button */}
        <button
          disabled={
            !selectedDate || !selectedTimePref ||
            !isValidTz(formData.timezone) ||
            bookingStatus === "submitting" || bookingStatus === "checking" ||
            bookingStatus === "success"
          }
          onClick={handleFinalize}
          className="w-full h-14 bg-[var(--brand-blue)] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed mt-6"
        >
          {bookingStatus === "checking" || bookingStatus === "submitting" ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{bookingStatus === "checking" ? "Checking..." : "Processing..."}</span>
            </div>
          ) : bookingStatus === "success" ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Redirecting...</span>
            </div>
          ) : (
            <span>{selectedDate ? "Finalize & Pay @ ₹" + DEMO_BOOKING_PRICE_INR : "Book Demo"}</span>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 opacity-60 mt-4">
          <ShieldCheck className="w-4 h-4 text-[var(--brand-green)]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Secure Checkout
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Export ─────────────────────────────────────────────────────────── */

export function BookingWidget({
  serverIso, serverTimezone, isPopup = false
}: {
  serverIso: string | null;
  serverTimezone: string | null;
  isPopup?: boolean;
}) {
  const { countryIso, timezone, isReady } = useBeastLocation(serverIso, serverTimezone);
  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  useEffect(() => {
    if (isReady && timezone && !formData.timezone) {
      setFormData((p) => ({ ...p, timezone }));
    }
  }, [isReady, timezone, formData.timezone]);

  // Also seed countryCode from detected location as initial value
  // PhoneInputField will override this when the user interacts
  useEffect(() => {
    if (isReady && countryIso && !formData.countryCode) {
      setFormData((p) => ({ ...p, countryCode: countryIso }));
    }
  }, [isReady, countryIso, formData.countryCode]);

  const goToNext = () => { setDirection(1); setStep(2); };
  const goToBack = () => { setDirection(-1); setStep(1); };

  return (
    <div className={`w-full max-w-[420px] bg-white relative z-20 flex flex-col mx-auto ${isPopup ? "h-auto rounded-2xl" : "rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden min-h-[500px] sm:min-h-[600px]"
      }`}>
      {/* Removed absolute step pills */}


      <div className={`relative bg-white rounded-2xl w-full flex-1 ${isPopup ? "h-auto" : "h-full overflow-hidden"}`}>
        <AnimatePresence initial={false} mode="wait">
          {step === 1 ? (
            <IntroForm
              key="form"
              formData={formData}
              setFormData={setFormData}
              onNext={goToNext}
              direction={direction}
              defaultCountry={countryIso}
            />
          ) : (
            <CalendarStep
              key="calendar"
              formData={formData}
              setFormData={setFormData}
              onBack={goToBack}
              direction={direction}
              initialTimezone={timezone}
              detectedCountry={countryIso}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}