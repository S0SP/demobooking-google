"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PhoneInput, { isValidPhoneNumber, type Country } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import 'flag-icons/css/flag-icons.min.css';
import { AlertTriangle, CheckCircle2, Search, ChevronDown } from 'lucide-react';
import { checkPhoneDuplicate } from '../lib/bookingService';

import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

/* ── Custom Flag Component ───────────────────────────────────── */
function FlagIcon({ countryCode }: { countryCode?: string }) {
  if (!countryCode) return <div className="w-[24px] h-[18px] bg-slate-200 rounded-sm shrink-0" />;

  return (
    <span
      className={`fi fi-${countryCode.toLowerCase()} rounded-sm`}
      style={{ width: "24px", height: "18px", display: "inline-block", flexShrink: 0 }}
      aria-label={countryCode}
    />
  );
}

/* ── Standard Searchable Country Select using CMDK + Popover ─── */
function CustomCountrySelect({
  value,
  onChange,
  disabled
}: {
  value: Country;
  onChange: (country: Country) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const countries = useMemo(() =>
    getCountries()
      .map((country) => ({
        value: country,
        label: (en as Record<string, string>)[country] || country,
        callingCode: getCountryCallingCode(country)
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    []
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex items-center gap-1.5 px-1 hover:bg-slate-100 rounded-lg transition-colors h-10 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FlagIcon countryCode={value} />
          <ChevronDown className="w-3 h-3 text-slate-400" strokeWidth={2.5} />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="w-[300px] bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-[9999] animate-in fade-in zoom-in-95 duration-200"
          sideOffset={8}
          align="start"
        >
          <Command className="flex flex-col h-[350px]">
            <div className="flex items-center border-b border-slate-100 px-3 h-12 gap-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <Command.Input
                placeholder="Search country or code..."
                className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <Command.List className="overflow-y-auto p-1 scrollbar-hide">
              <Command.Empty className="py-6 text-center text-xs text-slate-400 font-medium">
                No country found.
              </Command.Empty>

              {countries.map((country) => (
                <Command.Item
                  key={country.value}
                  value={`${country.label} ${country.callingCode} ${country.value}`}
                  onSelect={() => {
                    onChange(country.value);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-50 aria-selected:bg-slate-100 transition-colors"
                >
                  <FlagIcon countryCode={country.value} />
                  <span className="text-sm font-medium text-slate-700 flex-1 truncate">
                    {country.label}
                  </span>
                  <span className="text-xs font-bold text-slate-400 shrink-0">
                    +{country.callingCode}
                  </span>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/* ── Main Component ───────────────────────────────────────────── */

interface PhoneInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onValidityChange?: (isValid: boolean) => void;
  onStatusChange?: (status: "idle" | "checking" | "duplicate") => void;
  onCountryChange?: (country: Country) => void;
  defaultCountry?: Country;
}

export const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  value,
  onChange,
  onValidityChange,
  onStatusChange,
  onCountryChange,
  defaultCountry = "IN"
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalStatus, setInternalStatus] = useState<"idle" | "checking" | "duplicate">("idle");
  const checkTimer = useRef<NodeJS.Timeout | null>(null);

  const isValid = value ? isValidPhoneNumber(value) : false;

  // Silent Debounce Logic (600ms)
  useEffect(() => {
    if (checkTimer.current) clearTimeout(checkTimer.current);

    if (!value || !isValid) {
      setInternalStatus("idle");
      onStatusChange?.("idle");
      return;
    }

    // Set checking state after 200ms to avoid flashing on fast typers
    const startCheckingTimer = setTimeout(() => {
      setInternalStatus("checking");
      onStatusChange?.("checking");
    }, 200);

    // Final check after 600ms
    checkTimer.current = setTimeout(async () => {
      try {
        const isDup = await checkPhoneDuplicate(value);
        const newStatus = isDup ? "duplicate" : "idle";
        setInternalStatus(newStatus);
        onStatusChange?.(newStatus);
      } catch (err) {
        console.error("Silent check failed", err);
        setInternalStatus("idle");
        onStatusChange?.("idle");
      }
    }, 600);

    return () => {
      clearTimeout(startCheckingTimer);
      if (checkTimer.current) clearTimeout(checkTimer.current);
    };
  }, [value, isValid, onStatusChange]);

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  const handleChange = useCallback((val: string | undefined) => {
    onChange(val || "");
  }, [onChange]);

  return (
    <div className="w-full">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
        WhatsApp Number
      </label>

      <div className={`relative transition-all duration-300 ${isFocused ? "ring-2 ring-[var(--brand-blue)]/20" : ""
        }`}>
        <div className={`flex items-center w-full bg-slate-50 border ${internalStatus === "duplicate" ? "border-amber-300 bg-amber-50/30" :
          isValid ? "border-emerald-300 bg-emerald-50/10" : "border-slate-200"
          } rounded-xl px-4 transition-all h-[52px] overflow-hidden`}>
          <PhoneInput
            international
            defaultCountry={defaultCountry}
            onCountryChange={onCountryChange}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            countrySelectComponent={CustomCountrySelect as any}
            className="flex-1 phone-input-container"
          />

          {/* Silent Indicator Cluster */}
          <div className="flex items-center gap-2 ml-2">
            {internalStatus === "checking" && (
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[var(--brand-blue)] rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-[var(--brand-blue)]/60 rounded-full animate-pulse delay-75" />
              </div>
            )}

            {internalStatus === "duplicate" && (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}

            {isValid && internalStatus === "idle" && (
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-green)]" />
            )}
          </div>

          {/* Pulsating Glowing Bottom Border (Silent Loader) */}
          {internalStatus === "checking" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden rounded-b-xl pointer-events-none">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-[var(--brand-blue)]/60 to-transparent animate-shimmer" />
            </div>
          )}
        </div>
      </div>

      {/* Compact Inline Messages (Nuked helper text, only showing Errors/Duplicates) */}
      <div className="min-h-[16px] mt-1.5 ml-1">
        {internalStatus === "duplicate" && (
          <div className="flex items-start gap-1.5 text-amber-700 animate-in fade-in slide-in-from-top-1">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="text-[11px] font-bold leading-tight">Number already booked. Our team will reach out via WhatsApp.</span>
          </div>
        )}

        {!isValid && value && (
          <span className="text-[11px] font-bold text-red-500 animate-in fade-in">Please enter a valid WhatsApp number</span>
        )}
      </div>

      <style jsx global>{`
        .phone-input-container .PhoneInputInput {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          color: #0F1729 !important;
          height: 48px;
        }
        .phone-input-container .PhoneInputCountryIcon--border {
          box-shadow: none !important;
          background-color: transparent !important;
        }
        .phone-input-container .PhoneInputCountry {
          margin-right: 12px;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
