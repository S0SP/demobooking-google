// src/app/api/razorpay/webhook/route.ts
//
// Receives Razorpay webhook events.
// Verifies HMAC-SHA256 signature, updates Firestore, and fires emails.
//
// Events handled:
//   payment.captured  → status: "payment_success" → success emails
//   payment.failed    → status: "payment_failed"  → failure email to student
//
// Register this URL in Razorpay Dashboard → Webhooks:
//   https://demobooking.unboundyou.com/api/razorpay/webhook
// Enable events: payment.captured, payment.failed

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebaseAdmin";
import {
  sendPaymentSuccessEmails,
  sendPaymentFailedEmail,
} from "@/lib/mailService";

/* ─── Razorpay Webhook Event Types ──────────────────────────── */
interface RazorpayPaymentEntity {
  id:          string;
  order_id:    string;
  amount:      number;
  currency:    string;
  status:      string;
  email:       string;
  contact:     string;
  error_code?:        string;
  error_description?: string;
  notes?: {
    booking_id?: string;
    [key: string]: unknown;
  };
}

interface RazorpayWebhookPayload {
  event:  string;
  payload: {
    payment: {
      entity: RazorpayPaymentEntity;
    };
  };
}

/* ─── Signature Verification ─────────────────────────────────── */
function verifyWebhookSignature(rawBody: string, signature: string, secret: string): boolean {
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  // Use timingSafeEqual to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSig, "hex"),
      Buffer.from(signature,   "hex")
    );
  } catch {
    return false;
  }
}

/*
 * Build the SAME doc-ID keys that create-order/route.ts used when it
 * originally wrote phoneIndex/emailIndex.
 *
 * create-order writes:
 *   whatsapp  = phone.replace(/^\+/, "").replace(/\D/g, "")   -> digits only
 *   emailKey  = email.trim().toLowerCase().replace(/\./g, "_dot_")
 *
 * and stores `whatsapp` verbatim on the booking doc as `d.whatsapp`, so the
 * webhook should read that field directly rather than rebuild it from
 * `d.countryCode` + `d.phone` (countryCode is an ISO-2 string like "IN", not
 * a "+91" prefix, so the old `countryCode.replace("+","") + phone` logic
 * never matched the real phoneIndex doc ID).
 *
 * `d.email` is stored as a plain lowercased email, not the "_dot_" form, so
 * the email key must go through the same normalization create-order used.
 */
function phoneIndexKey(d: Record<string, unknown>): string {
  const whatsapp = String(d.whatsapp ?? "").trim();
  if (whatsapp) return whatsapp;
  // Fallback only if an older booking doc predates the `whatsapp` field.
  return String(d.phone ?? "").replace(/^\+/, "").replace(/\D/g, "");
}

function emailIndexKey(d: Record<string, unknown>): string {
  return String(d.email ?? "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "_dot_");
}

/* ─── Helpers ─────────────────────────────────────────────────── */
async function getBookingByOrderId(orderId: string, bookingId?: string) {
  const db = getAdminFirestore();

  // Fast path: if booking_id is in the notes, look it up directly
  if (bookingId) {
    const snap = await db.collection("bookings").doc(bookingId).get();
    if (snap.exists) return { id: snap.id, data: snap.data()! };
  }

  // Fallback: query by razorpay_order_id field
  const querySnap = await db
    .collection("bookings")
    .where("razorpay_order_id", "==", orderId)
    .limit(1)
    .get();

  if (querySnap.empty) return null;
  const doc = querySnap.docs[0]!;
  return { id: doc.id, data: doc.data() };
}

/* ─── Route Handler ───────────────────────────────────────────── */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const rawBody   = await req.text();

  if (WEBHOOK_SECRET) {
    if (!signature) {
      console.warn("[webhook] Missing x-razorpay-signature header.");
      return NextResponse.json({ error: "Missing signature." }, { status: 401 });
    }
    if (!verifyWebhookSignature(rawBody, signature, WEBHOOK_SECRET)) {
      console.warn("[webhook] Signature verification failed.");
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    // Fail closed: never accept unsigned webhook events in production.
    // (Previously this silently fell through and accepted any unsigned
    // request if the env var was unset — e.g. typo'd or missing on deploy.)
    console.error("[webhook] RAZORPAY_WEBHOOK_SECRET is not set in production. Rejecting request.");
    return NextResponse.json({ error: "Server misconfigured." }, { status: 500 });
  } else {
    console.warn("[webhook] RAZORPAY_WEBHOOK_SECRET not set — skipping signature check (dev mode).");
  }

  let webhookBody: RazorpayWebhookPayload;
  try {
    webhookBody = JSON.parse(rawBody) as RazorpayWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const event   = webhookBody.event;
  const payment = webhookBody.payload?.payment?.entity;

  if (!payment) {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const orderId   = payment.order_id;
  const paymentId = payment.id;
  const bookingId = payment.notes?.booking_id;

  console.log(`[webhook] Event: ${event} | Order: ${orderId} | Payment: ${paymentId} | BookingId: ${bookingId}`);

  /* ── Idempotency: look up the booking ─────────────────────── */
  let booking: { id: string; data: Record<string, unknown> } | null = null;
  try {
    booking = await getBookingByOrderId(orderId, bookingId);
  } catch (err) {
    console.error("[webhook] Error fetching booking:", err);
    // Return 200 so Razorpay doesn't retry forever — we'll handle via dashboard
    return NextResponse.json({ received: true, warning: "DB lookup failed" }, { status: 200 });
  }

  if (!booking) {
    console.warn(`[webhook] No booking found for order ${orderId}`);
    return NextResponse.json({ received: true, warning: "Booking not found" }, { status: 200 });
  }

  const db      = getAdminFirestore();
  const bookRef = db.collection("bookings").doc(booking.id);
  const d       = booking.data;

  const now = new Date();
  const nowReadable = now.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  /* ── payment.captured → SUCCESS ────────────────────────────── */
  if (event === "payment.captured") {
    // Guard: don't double-process
    if (d.status === "payment_success") {
      console.log(`[webhook] Already processed as success. Skipping.`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    try {
      await bookRef.update({
        status:                "payment_success",
        razorpay_payment_id:   paymentId,
        razorpay_order_id:     orderId,
        payment_captured_at:   FieldValue.serverTimestamp(),
        payment_captured_readable: nowReadable,
        amount_paid_paise:     payment.amount,
      });
    } catch (err) {
      console.error("[webhook] Firestore update (success) failed:", err);
      return NextResponse.json({ received: true, warning: "DB update failed" }, { status: 200 });
    }

    // Also write phoneIndex and emailIndex so duplicates are properly locked
    // (they may already exist from create-order, but ensure they are confirmed).
    // Keys MUST match the doc IDs create-order originally wrote — see
    // phoneIndexKey()/emailIndexKey() above.
    try {
      const phoneKey = phoneIndexKey(d);
      const emailKey = emailIndexKey(d);

      const batch = db.batch();
      if (phoneKey) {
        batch.set(db.collection("phoneIndex").doc(phoneKey), {
          bookingId: booking.id,
          status:    "payment_success",
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      }
      if (emailKey) {
        batch.set(db.collection("emailIndex").doc(emailKey), {
          bookingId: booking.id,
          status:    "payment_success",
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      }
      await batch.commit();
    } catch (err) {
      console.warn("[webhook] Index update failed (non-fatal):", err);
    }

    // Fire emails (non-blocking — don't fail webhook if mail fails)
    try {
      const subjects = String(d.subjects_flat ?? "").split(", ");
      const emailData = {
        studentName:    String(d.name ?? ""),
        email:          String(d.email ?? ""),
        phone:          String(d.countryCode ?? "") + String(d.phone ?? ""),
        grade:          String(d.grade ?? ""),
        board:          String(d.board ?? ""),
        subjects,
        otherSubject:   String(d.otherSubject ?? ""),
        preferredDate:  Number(d.slot_iso_date?.toString().split("-")[2] ?? 0),
        preferredMonth: monthNameFromIso(String(d.slot_iso_date ?? "")),
        preferredYear:  Number(d.slot_iso_date?.toString().split("-")[0] ?? new Date().getFullYear()),
        timePreference: String(d.timePreference ?? ""),
        timezone:       String(d.timezone ?? ""),
        paymentId,
        orderId,
        bookingId:      booking.id,
      };
      await sendPaymentSuccessEmails(emailData);
    } catch (err) {
      console.error("[webhook] Success email failed (non-fatal):", err);
    }

    return NextResponse.json({ received: true, status: "payment_success" }, { status: 200 });
  }

  /* ── payment.failed → FAILURE ──────────────────────────────── */
  if (event === "payment.failed") {
    // Guard: don't overwrite a success
    if (d.status === "payment_success") {
      console.log(`[webhook] Already succeeded. Ignoring failure event.`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    try {
      await bookRef.update({
        status:               "payment_failed",
        razorpay_payment_id:  paymentId,
        razorpay_order_id:    orderId,
        payment_failed_at:    FieldValue.serverTimestamp(),
        payment_failed_readable: nowReadable,
        failure_code:         payment.error_code         ?? null,
        failure_reason:       payment.error_description  ?? null,
      });
    } catch (err) {
      console.error("[webhook] Firestore update (failed) failed:", err);
      return NextResponse.json({ received: true, warning: "DB update failed" }, { status: 200 });
    }

    // Mark phone/email indexes as failed — allows rebooking.
    // Keys MUST match the doc IDs create-order originally wrote — see
    // phoneIndexKey()/emailIndexKey() above.
    try {
      const phoneKey = phoneIndexKey(d);
      const emailKey = emailIndexKey(d);
      const batch = db.batch();
      if (phoneKey) {
        batch.set(db.collection("phoneIndex").doc(phoneKey), {
          bookingId: booking.id,
          status:    "payment_failed",
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      }
      if (emailKey) {
        batch.set(db.collection("emailIndex").doc(emailKey), {
          bookingId: booking.id,
          status:    "payment_failed",
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      }
      await batch.commit();
    } catch (err) {
      console.warn("[webhook] Index update (failed status) failed (non-fatal):", err);
    }

    // Send failure email to student only
    try {
      const subjects = String(d.subjects_flat ?? "").split(", ");
      const emailData = {
        studentName:    String(d.name ?? ""),
        email:          String(d.email ?? ""),
        phone:          String(d.countryCode ?? "") + String(d.phone ?? ""),
        grade:          String(d.grade ?? ""),
        board:          String(d.board ?? ""),
        subjects,
        otherSubject:   String(d.otherSubject ?? ""),
        preferredDate:  Number(d.slot_iso_date?.toString().split("-")[2] ?? 0),
        preferredMonth: monthNameFromIso(String(d.slot_iso_date ?? "")),
        preferredYear:  Number(d.slot_iso_date?.toString().split("-")[0] ?? new Date().getFullYear()),
        timePreference: String(d.timePreference ?? ""),
        timezone:       String(d.timezone ?? ""),
        failureReason:  payment.error_description ?? "Payment was not completed.",
        bookingId:      booking.id,
      };
      await sendPaymentFailedEmail(emailData);
    } catch (err) {
      console.error("[webhook] Failure email failed (non-fatal):", err);
    }

    return NextResponse.json({ received: true, status: "payment_failed" }, { status: 200 });
  }

  // Any other event — acknowledge receipt
  return NextResponse.json({ received: true }, { status: 200 });
}

/* ─── Helpers ─────────────────────────────────────────────────── */
function monthNameFromIso(iso: string): string {
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const idx = parseInt(iso.split("-")[1] ?? "1", 10) - 1;
  return months[idx] ?? "January";
}