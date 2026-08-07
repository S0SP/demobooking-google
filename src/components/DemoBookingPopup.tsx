"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { BookingWidget } from "./BookingWidget";

export function DemoBookingPopup({
  serverIso,
  serverTimezone,
}: {
  serverIso: string | null;
  serverTimezone: string | null;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // If they already dismissed it this session, don't bother setting up listeners
    if (sessionStorage.getItem("hasSeenDemoPopup") === "true") {
      setHasDismissed(true);
      return;
    }

    let inactivityTimer: NodeJS.Timeout;

    const checkAndShow = () => {
      if (sessionStorage.getItem("hasSeenDemoPopup") === "true") return;
      
      // Check if user is actively focused inside the existing booking card
      const activeEl = document.activeElement;
      const bookingCard = document.getElementById("booking-card");
      if (bookingCard && bookingCard.contains(activeEl)) {
        return;
      }
      
      setIsVisible(true);
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      if (!isVisible && !hasDismissed) {
        // Show after 10 seconds of inactivity
        inactivityTimer = setTimeout(checkAndShow, 10000);
      }
    };

    const handleScroll = () => {
      resetTimer();
      // Show immediately if they scrolled past a certain point
      if (!isVisible && !hasDismissed && window.scrollY > 2000) {
        checkAndShow();
      }
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", resetTimer);

    // Initial timer
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [isVisible, hasDismissed]);

  const handleClose = () => {
    setIsVisible(false);
    setHasDismissed(true);
    sessionStorage.setItem("hasSeenDemoPopup", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && !hasDismissed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 overflow-hidden"
          style={{ zIndex: 99999 }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Close Button placed globally so it's always visible and not clipped */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] p-2 bg-white text-slate-800 hover:bg-slate-200 rounded-full shadow-lg border border-slate-200 transition-all"
            aria-label="Close popup"
            style={{ zIndex: 999999 }}
          >
            <X className="w-6 h-6" />
          </button>

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl flex flex-col scrollbar-hide z-10"
          >
            <div className="w-full flex-1">
               <BookingWidget serverIso={serverIso} serverTimezone={serverTimezone} isPopup={true} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
