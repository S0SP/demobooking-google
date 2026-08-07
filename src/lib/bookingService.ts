// src/lib/bookingService.ts
// Full replacement

import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/* ─── Types ───────────────────────────────────────────────────────────────── */

export type BookingStatus =
  | "idle"
  | "checking"
  | "submitting"
  | "duplicate"
  | "success"
  | "error"
  | "payment_cancelled";

export interface BookingInput {
  name: string;
  email: string;
  phone: string;         // E.164 e.g. "+919876543210"
  countryCode: string;   // ISO 2-letter e.g. "IN", "AE" — from PhoneInputField
  grade: string;
  board: string;
  subjects: string[];
  otherSubject: string;  // client-only, never sent to server
  preferredDate: number;
  preferredMonth: string;
  preferredYear: number;
  timePreference: string;
  timezone: string;
}

export interface BookingResult {
  success: boolean;
  isDuplicate?: boolean;
  bookingId?: string;
  orderId?: string;
  keyId?: string;
  amount?: number;
  currency?: string;
  error?: string;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function toWhatsapp(phone: string): string {
  // "+919876543210" → "919876543210"
  return phone.replace(/^\+/, "").replace(/\D/g, "");
}

function normalizeEmailKey(email: string): string {
  return email.trim().toLowerCase().replace(/\./g, "_dot_");
}

/* ─── Duplicate Checks ────────────────────────────────────────────────────── */

export async function checkPhoneDuplicate(phone: string): Promise<boolean> {
  try {
    const whatsapp = toWhatsapp(phone);
    const snap = await getDoc(doc(db, "phoneIndex", whatsapp));
    if (!snap.exists()) return false;
    const data = snap.data();
    // Only treat as duplicate if a successful payment already exists
    return data?.status === "payment_success";
  } catch (err) {
    console.warn("[bookingService] checkPhoneDuplicate:", err);
    return false; // fail open — server is authoritative
  }
}

export async function checkEmailDuplicate(email: string): Promise<boolean> {
  try {
    const key = normalizeEmailKey(email);
    const snap = await getDoc(doc(db, "emailIndex", key));
    if (!snap.exists()) return false;
    const data = snap.data();
    // Only treat as duplicate if a successful payment already exists
    return data?.status === "payment_success";
  } catch (err) {
    console.warn("[bookingService] checkEmailDuplicate:", err);
    return false;
  }
}

/* ─── Main Submit ─────────────────────────────────────────────────────────── */

export async function submitBookingAndCreateOrder(
  input: BookingInput
): Promise<BookingResult> {
  try {
    const response = await fetch("/api/booking/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone,
        countryCode: input.countryCode,   // ← passed from PhoneInputField
        grade: input.grade,
        board: input.board,
        subjects: input.subjects,
        // otherSubject intentionally omitted
        preferredDate: input.preferredDate,
        preferredMonth: input.preferredMonth,
        preferredYear: input.preferredYear,
        timePreference: input.timePreference,
        timezone: input.timezone,
      }),
    });

    if (response.status === 409) {
      return { success: false, isDuplicate: true };
    }
    if (response.status === 400) {
      const data = await response.json().catch(() => ({})) as { error?: string };
      return { success: false, error: data.error ?? "Invalid form data." };
    }
    if (response.status === 503) {
      return { success: false, error: "Service unavailable. Please retry." };
    }
    if (response.status === 502) {
      return { success: false, error: "Payment gateway error. Please retry." };
    }
    if (!response.ok) {
      const data = await response.json().catch(() => ({})) as { error?: string };
      return { success: false, error: data.error ?? "Something went wrong." };
    }

    const data = await response.json() as {
      bookingId: string;
      orderId: string;
      keyId: string;
      amount: number;
      currency: string;
    };

    return {
      success: true,
      bookingId: data.bookingId,
      orderId: data.orderId,
      keyId: data.keyId,
      amount: data.amount,
      currency: data.currency ?? "INR",
    };
  } catch (err) {
    console.error("[bookingService] network error:", err);
    return {
      success: false,
      error: "Network error. Please check your connection.",
    };
  }
}