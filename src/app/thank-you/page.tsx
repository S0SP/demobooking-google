'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, X, AlertCircle, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { DEMO_BOOKING_PRICE_INR } from "@/lib/constants";

interface BookingData {
  status?: string;
  failure_reason?: string;
  email?: string;
  countryCode?: string;
  phone?: string;
  [key: string]: unknown;
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  const [status, setStatus] = useState<"loading" | "pending" | "payment_success" | "payment_failed" | "unauthorized">("loading");
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    if (!bookingId) {
      // Fallback: check session storage (just in case they redirected without param, or for backward compatibility)
      const hasValidSession = typeof window !== "undefined" && sessionStorage.getItem("valid_checkout") === "true";
      if (hasValidSession) {
        setStatus("payment_success");
        sessionStorage.removeItem("valid_checkout");
      } else {
        setStatus("unauthorized");
        // Boot to Home after 3 seconds
        const timer = setTimeout(() => {
          router.push("/");
        }, 3000);
        return () => clearTimeout(timer);
      }
      return;
    }

    setStatus("loading");
    const docRef = doc(db, "bookings", bookingId);
    
    // Set up a real-time listener for the booking document
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBookingData(data);
        if (data.status === "payment_success") {
          setStatus("payment_success");
        } else if (data.status === "payment_failed") {
          setStatus("payment_failed");
        } else {
          setStatus("pending");
        }
      } else {
        setStatus("unauthorized");
      }
    }, (error) => {
      console.error("Error listening to booking:", error);
      setStatus("unauthorized");
    });

    return () => unsubscribe();
  }, [bookingId, router]);

  if (status === "loading" || status === "pending") {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col items-center text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-8 border border-blue-100"
          >
            <Loader2 className="w-8 h-8 text-blue-500" />
          </motion.div>
          
          <h1 className="text-2xl font-semibold tracking-tight text-[#222C3D] mb-4">
            Confirming Payment...
          </h1>
          <p className="text-slate-500 leading-relaxed max-w-sm">
            We are waiting for payment verification from Razorpay. This usually takes just a few seconds.
          </p>
        </div>
      </div>
    );
  }

  if (status === "payment_failed") {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col items-center text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-8 border border-red-100"
          >
            <X className="w-8 h-8 text-red-500 stroke-[3px]" />
          </motion.div>

          <h1 className="text-3xl font-semibold tracking-tight text-[#222C3D] mb-4">
            Payment Failed
          </h1>
          
          <div className="space-y-4 mb-10">
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Unfortunately, your payment could not be completed.
            </p>
            <p className="text-slate-500 leading-relaxed text-sm">
              Reason: {bookingData?.failure_reason || "Transaction was declined or cancelled."}
            </p>
            <p className="text-slate-400 leading-relaxed text-xs">
              You can safely retry your booking using the same phone number and email address.
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
            <Link 
              href="/#booking-card"
              className="inline-flex items-center justify-center w-full px-8 py-3.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Retry Payment / Book Again
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col items-center text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-8 border border-amber-100"
          >
            <AlertCircle className="w-8 h-8 text-amber-500 stroke-[2px]" />
          </motion.div>

          <h1 className="text-2xl font-semibold tracking-tight text-[#222C3D] mb-4">
            Access Denied
          </h1>
          <p className="text-slate-500 leading-relaxed mb-8">
            No active booking session found. Redirecting you back to home...
          </p>

          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full px-8 py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-xl transition-all duration-200"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
      <div className="p-8 md:p-12 flex flex-col items-center text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-8 border border-emerald-100"
        >
          <Check className="w-8 h-8 text-emerald-500 stroke-[3px]" />
        </motion.div>

        <h1 className="text-3xl font-semibold tracking-tight text-[#222C3D] mb-4">
          Booking Confirmed!
        </h1>
        
        <div className="space-y-4 mb-10">
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            Your trial session booking has been successfully confirmed.
          </p>
          <p className="text-slate-500 leading-relaxed text-sm">
            We have received your payment of ₹{DEMO_BOOKING_PRICE_INR}. A confirmation email has been sent to <span className="font-semibold text-slate-700">{bookingData?.email || "your email"}</span>.
          </p>
          <p className="text-slate-500 leading-relaxed text-sm">
            Our team will contact you on WhatsApp at <span className="font-semibold text-slate-700">{bookingData?.countryCode || ""}{bookingData?.phone || "your number"}</span> within the next 24 hours to schedule the session.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
          <Link 
            href="https://www.unboundyou.com/"
            className="inline-flex items-center justify-center w-full px-8 py-3.5 bg-[#3B72F1] hover:bg-[#2563EB] text-white font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Back to Website
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full"
      >
        <Suspense fallback={
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-8 md:p-12 flex flex-col items-center text-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-500">Loading details...</p>
            </div>
          </div>
        }>
          <ThankYouContent />
        </Suspense>
        
        {/* Subtle Brand Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-xl font-bold tracking-tight animate-fade-in"
        >
          <span className="text-[#2F80F9]">Unbound</span>
          <span className="text-[#08BD7E]">You</span>
        </motion.p>
      </motion.div>
    </main>
  );
}
