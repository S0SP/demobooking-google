// src/app/api/booking/create-order/route.ts

import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebaseAdmin";
import { DEMO_BOOKING_PRICE_INR } from "@/lib/constants";

/* ─── Constants ───────────────────────────────────────────────────────────── */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const VALID_GRADES = ["6", "7", "8", "9", "10", "11", "12"];
const VALID_SUBJECTS = ["Physics", "Chemistry", "Math", "Biology", "English", "French", "ICT"];
const VALID_TIME_PREFS = [
  "Morning (7am\u201312pm)",
  "Afternoon (12pm\u20135pm)",
  "Evening (5pm\u201310pm)",
];

// ISO 3166-1 alpha-2 codes accepted from the phone field
const VALID_ISO_COUNTRIES = new Set([
  "AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW",
  "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO",
  "BQ", "BR", "BS", "BT", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK",
  "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM",
  "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR",
  "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS",
  "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN",
  "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN",
  "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV",
  "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ",
  "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI",
  "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM",
  "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC",
  "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV",
  "SX", "SY", "SZ", "TA", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO",
  "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG",
  "VI", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW",
]);

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Convert E.164 phone to WhatsApp-safe digits.
 * "+919876543210" → "919876543210"
 * This is used as the phoneIndex document ID AND stored as `whatsapp` field.
 * The webhook reads `d.whatsapp` directly — no reconstruction needed.
 */
function toWhatsapp(phone: string): string {
  return phone.replace(/^\+/, "").replace(/\D/g, "");
}

function normalizeEmailKey(email: string): string {
  return email.trim().toLowerCase().replace(/\./g, "_dot_");
}

/* ─── Razorpay order creation ─────────────────────────────────────────────── */

async function createRazorpayOrder(
  bookingId: string
): Promise<{ id: string; amount: number; currency: string }> {
  const credentials = Buffer.from(
    `${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`
  ).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${credentials}`,
    },
    body: JSON.stringify({
      amount: DEMO_BOOKING_PRICE_INR * 100,
      currency: "INR",
      receipt: bookingId.slice(0, 40),
      notes: {
        booking_id: bookingId,
        source: "demo_landing_page_google",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[booking/create] Razorpay error:", res.status, text);
    throw new Error(`Razorpay ${res.status}`);
  }

  return res.json() as Promise<{ id: string; amount: number; currency: string }>;
}

/* ─── Request body shape ──────────────────────────────────────────────────── */

interface BookingBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  countryCode?: unknown;  // ISO 2-letter from PhoneInputField
  grade?: unknown;
  board?: unknown;
  subjects?: unknown;
  preferredDate?: unknown;
  preferredMonth?: unknown;
  preferredYear?: unknown;
  timePreference?: unknown;
  timezone?: unknown;
}

/* ─── Validation ──────────────────────────────────────────────────────────── */

function validate(b: BookingBody): string | null {
  if (
    typeof b.name !== "string" ||
    b.name.trim().length < 2 ||
    b.name.trim().length > 80
  ) return "Invalid name (2–80 chars).";

  if (
    typeof b.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email.trim())
  ) return "Invalid email address.";

  // E.164: + then 7–15 digits
  if (
    typeof b.phone !== "string" ||
    !/^\+[1-9]\d{6,14}$/.test(b.phone)
  ) return "Invalid phone (E.164 required).";

  // ISO 2-letter country code from PhoneInputField
  if (
    typeof b.countryCode !== "string" ||
    !VALID_ISO_COUNTRIES.has(b.countryCode.toUpperCase())
  ) return "Invalid country code.";

  if (!VALID_GRADES.includes(String(b.grade)))
    return `Invalid grade.`;

  if (String(b.board) !== "IGCSE")
    return "Only IGCSE board accepted.";

  if (
    !Array.isArray(b.subjects) ||
    b.subjects.length === 0 ||
    !(b.subjects as unknown[]).every(
      (s) => VALID_SUBJECTS.includes(String(s))
    )
  ) return "Select at least one valid subject.";

  if (
    typeof b.preferredDate !== "number" ||
    b.preferredDate < 1 ||
    b.preferredDate > 31
  ) return "Invalid date.";

  if (!MONTH_NAMES.includes(String(b.preferredMonth)))
    return "Invalid month.";

  if (
    typeof b.preferredYear !== "number" ||
    b.preferredYear < new Date().getFullYear()
  ) return "Invalid year.";

  if (!VALID_TIME_PREFS.includes(String(b.timePreference)))
    return "Invalid time preference.";

  if (typeof b.timezone !== "string" || b.timezone.trim().length < 3)
    return "Invalid timezone.";

  return null;
}

/* ─── Route Handler ───────────────────────────────────────────────────────── */

export async function POST(req: NextRequest): Promise<NextResponse> {

  /* 1. Parse */
  let body: BookingBody;
  try {
    body = (await req.json()) as BookingBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  /* 2. Validate */
  const err = validate(body);
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  /* 3. Cast (safe after validation) */
  const name = (body.name as string).trim();
  const email = (body.email as string).trim().toLowerCase();
  const phone = body.phone as string;                  // E.164
  const countryCode = (body.countryCode as string).toUpperCase(); // ISO e.g. "IN"
  const grade = String(body.grade);
  const subjects = body.subjects as string[];
  const preferredDate = body.preferredDate as number;
  const preferredMonth = body.preferredMonth as string;
  const preferredYear = body.preferredYear as number;
  const timePreference = body.timePreference as string;
  const timezone = (body.timezone as string).trim();

  /*
   * whatsapp = digits-only E.164 without leading "+"
   * e.g. "+919876543210" → "919876543210"
   *
   * This is stored as `d.whatsapp` in Firestore.
   * The webhook reads `d.whatsapp` directly to update the phoneIndex,
   * so there is no reconstruction ambiguity.
   */
  const whatsapp = toWhatsapp(phone);
  const emailKey = normalizeEmailKey(email);

  /* 4. Duplicate check (Admin SDK = authoritative) */
  const db = getAdminFirestore();
  try {
    const [phoneSnap, emailSnap] = await Promise.all([
      db.collection("phoneIndex").doc(whatsapp).get(),
      db.collection("emailIndex").doc(emailKey).get(),
    ]);

    const phoneDup =
      phoneSnap.exists && phoneSnap.data()?.status !== "payment_failed";
    const emailDup =
      emailSnap.exists && emailSnap.data()?.status !== "payment_failed";

    if (phoneDup || emailDup) {
      return NextResponse.json(
        { error: "A demo is already booked with this phone or email." },
        { status: 409 }
      );
    }
  } catch (e) {
    console.error("[booking/create-order] Duplicate check failed:", e);
    return NextResponse.json(
      { error: "Could not verify booking eligibility. Try again." },
      { status: 503 }
    );
  }

  /* 5. Generate booking ID */
  const bookingRef = db.collection("bookings").doc();
  const bookingId = bookingRef.id;

  /* 6. Create Razorpay order */
  let rzpOrder: { id: string; amount: number; currency: string };
  try {
    rzpOrder = await createRazorpayOrder(bookingId);
  } catch {
    return NextResponse.json(
      { error: "Payment gateway error. Please try again." },
      { status: 502 }
    );
  }

  /* 7. Build slot_iso_date */
  const monthIndex = MONTH_NAMES.indexOf(preferredMonth);
  const slotIsoDate = `${preferredYear}-${pad2(monthIndex + 1)}-${pad2(preferredDate)}`;

  /*
   * 8. Atomic batch write
   *
   * Fields written here must match what the webhook reads.
   * Webhook reads:
   *   d.whatsapp          → used as phoneIndex doc ID update key
   *   d.email             → used as emailIndex doc ID update key
   *   d.name              → emails
   *   d.grade, d.board    → emails
   *   d.subjects_flat     → split by ", " for emails
   *   d.slot_iso_date     → split by "-" for date parts in emails
   *   d.timePreference    → emails
   *   d.timezone          → emails
   *   d.countryCode       → emails (ISO 2-letter, e.g. "IN")
   *   d.status            → idempotency guard
   *   d.razorpay_order_id → fallback query if notes.booking_id missing
   */
  const batch = db.batch();

  batch.set(bookingRef, {
    // Identity
    name,
    email,
    phone,                                       // E.164, e.g. "+919876543210"
    countryCode,                                 // ISO 2-letter, e.g. "IN"
    country: "",                   // enriched later if needed
    whatsapp,                                    // digits-only, e.g. "919876543210"
    whatsapp_click_to_chat: `https://wa.me/${whatsapp}`,

    // Academic
    grade,
    board: "IGCSE",
    subjects_flat: subjects.join(", "),

    // Schedule
    slot_iso_date: slotIsoDate,                 // "YYYY-MM-DD"
    timePreference,
    timezone,

    // Payment
    razorpay_order_id: rzpOrder.id,              // webhook fallback lookup

    // Meta
    status: "pending_payment",
    source: "landing_page_hero",
    createdAt: FieldValue.serverTimestamp(),
    createdAt_readable: new Date().toISOString(),
  });

  // phoneIndex — doc ID is whatsapp digits, webhook updates this by the same key
  batch.set(db.collection("phoneIndex").doc(whatsapp), {
    bookingId,
    createdAt: FieldValue.serverTimestamp(),
    status: "pending_payment",
  });

  // emailIndex — doc ID is normalized email, webhook updates by same key
  batch.set(db.collection("emailIndex").doc(emailKey), {
    bookingId,
    createdAt: FieldValue.serverTimestamp(),
    status: "pending_payment",
  });

  try {
    await batch.commit();
  } catch (e) {
    console.error("[booking/create-order] Batch write failed:", e);
    console.error("[booking/create-order] Orphaned Razorpay order:", rzpOrder.id);
    return NextResponse.json(
      { error: "Failed to save booking. Please try again." },
      { status: 500 }
    );
  }

  /* 9. Return to client */
  return NextResponse.json(
    {
      success: true,
      bookingId,
      orderId: rzpOrder.id,
      keyId: RAZORPAY_KEY_ID,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    },
    { status: 201 }
  );
}