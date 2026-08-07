// src/hooks/useBeastLocation.ts
"use client";

import { useEffect, useState } from "react";
import ct from "countries-and-timezones";
import type { Country } from "react-phone-number-input";

export function isValidTz(tz: string | null): boolean {
  if (!tz) return false;
  const tzData = ct.getTimezone(tz);
  return !!(tzData && tzData.countries && tzData.countries.length > 0);
}

interface BeastLocationResult {
  countryIso: Country;     // "IN" — typed for react-phone-number-input
  timezone: string;        // "Asia/Kolkata"
  isReady: boolean;
}

export function useBeastLocation(
  serverIso: string | null,
  serverTimezone: string | null
): BeastLocationResult {
  const [countryIso, setCountryIso] = useState<Country>(
    (serverIso as Country) ?? "IN"
  );
  const [timezone, setTimezone] = useState(isValidTz(serverTimezone) ? serverTimezone! : "");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      // Intl API — built into every modern browser, no library needed
      // LTS: Part of ECMAScript Internationalization API — permanent
      const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (browserTz) {
        if (isValidTz(browserTz)) {
          setTimezone(browserTz);
          const tzData = ct.getTimezone(browserTz);
          if (tzData?.countries?.length) {
            setCountryIso(tzData.countries[0] as Country);
          }
        } else {
          setTimezone(""); // Explicitly clear if invalid
        }
      }
    } catch {
      // Graceful fallback to server-side detected values
      if (isValidTz(serverTimezone)) setTimezone(serverTimezone!);
      if (serverIso) setCountryIso(serverIso as Country);
    } finally {
      setIsReady(true);
    }
  }, [serverIso, serverTimezone]);

  return { countryIso, timezone, isReady };
}
