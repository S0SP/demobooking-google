// src/lib/emailTemplates.ts
// All email templates for demo booking flow.
// Used by mailService.ts which is called from the Razorpay webhook handler.

import { DEMO_BOOKING_PRICE_INR } from "./constants";

export interface BookingEmailData {
  studentName:    string;
  email:          string;
  phone:          string;
  grade:          string;
  board:          string;
  subjects:       string[];
  otherSubject:   string;
  preferredDate:  number;
  preferredMonth: string;
  preferredYear:  number;
  timePreference: string;
  timezone:       string;
  // Payment fields (optional — only present after payment events)
  paymentId?:    string;
  orderId?:      string;
  bookingId?:    string;
  failureReason?: string;
}

/* ─── Brand Tokens ────────────────────────────────────────────── */
const brandBlue  = "#2563EB";
const brandGreen = "#10B981";
const brandRed   = "#EF4444";
const darkText   = "#0F1729";
const mutedText  = "#64748B";
const borderColor = "#E2E8F0";
const bgLight    = "#F8FAFC";

/* ─── Helpers ─────────────────────────────────────────────────── */
function getSubjectDisplay(subjects: string[], otherSubject: string): string {
  return subjects
    .map((s) => (s === "Other" ? otherSubject || "Other" : s))
    .filter(Boolean)
    .join(", ");
}

function baseWrapper(content: string, preheader: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>UnboundYou</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    a { text-decoration: none; }
    .preheader { display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; color: #F1F5F9; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .fluid { max-width: 100% !important; height: auto !important; }
      .stack-column, .stack-column-center { display: block !important; width: 100% !important; max-width: 100% !important; }
      .p-mobile { padding: 24px 16px !important; }
      .detail-row td { display: block !important; width: 100% !important; padding-bottom: 4px !important; }
    }
  </style>
</head>
<body>
  <span class="preheader">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F1F5F9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function logoHeader(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.unboundyou.com";
  return `
  <tr>
    <td style="padding: 0 0 24px 0; text-align: center;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align: center; padding: 20px 0 0 0;">
            <a href="${siteUrl}" target="_blank">
              <img src="${siteUrl}/logo.png" alt="UnboundYou Logo" style="height: 40px; width: auto; border: 0;" />
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function detailRow(label: string, value: string): string {
  return `
  <tr class="detail-row">
    <td style="padding: 10px 0; border-bottom: 1px solid ${borderColor}; vertical-align: top;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="40%" style="font-size: 12px; font-weight: 700; color: ${mutedText}; text-transform: uppercase; letter-spacing: 0.5px; padding-right: 12px;">${label}</td>
          <td width="60%" style="font-size: 14px; font-weight: 600; color: ${darkText};">${value}</td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function footer(year: number): string {
  return `
  <tr>
    <td style="background: ${bgLight}; padding: 24px 40px; border-radius: 0 0 16px 16px; border-top: 1px solid ${borderColor}; text-align: center;">
      <p style="font-size: 11px; color: ${mutedText}; line-height: 1.6; margin: 0;">
        &copy; ${year} UnboundYou &mdash; IGCSE &amp; IB Elite Tutoring<br />
        You're receiving this because you booked a demo session at unboundyou.com
      </p>
    </td>
  </tr>`;
}

/* ═══════════════════════════════════════════════════════════════
   1. PAYMENT SUCCESS — Student Confirmation
   ═══════════════════════════════════════════════════════════════ */
export function buildStudentConfirmationEmail(data: BookingEmailData): {
  subject: string;
  html:    string;
  text:    string;
} {
  const subjectDisplay = getSubjectDisplay(data.subjects, data.otherSubject);
  const dateDisplay    = `${data.preferredDate} ${data.preferredMonth} ${data.preferredYear}`;
  const timezoneDisplay = data.timezone.split("/").pop()?.replace(/_/g, " ") || data.timezone;
  const year           = new Date().getFullYear();

  const subject = `✅ Payment Confirmed — Demo Booked! | ${subjectDisplay} (Grade ${data.grade})`;

  const html = baseWrapper(
    `
    ${logoHeader()}

    <!-- Hero Banner -->
    <tr>
      <td style="background: linear-gradient(135deg, ${brandGreen} 0%, #059669 100%); border-radius: 16px 16px 0 0; padding: 40px 40px 36px 40px; text-align: center;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding-bottom: 16px;">
              <div style="display: inline-block; background: rgba(255,255,255,0.2); border-radius: 50%; width: 64px; height: 64px; line-height: 64px; font-size: 28px;">✅</div>
            </td>
          </tr>
          <tr>
            <td>
              <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 8px 0; line-height: 1.3;">Payment Confirmed!</h1>
              <p style="font-size: 15px; color: rgba(255,255,255,0.9); margin: 0; line-height: 1.5;">Hi ${data.studentName}, your ₹` + DEMO_BOOKING_PRICE_INR + ` demo is locked in. 🎓</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- What Happens Next -->
    <tr>
      <td style="background: #F0FDF4; border-left: 4px solid ${brandGreen}; padding: 18px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="28" style="vertical-align: top; padding-right: 12px; padding-top: 2px;">
              <span style="font-size: 20px;">📅</span>
            </td>
            <td style="vertical-align: middle;">
              <p style="font-size: 13px; font-weight: 800; color: #065F46; margin: 0 0 2px 0; text-transform: uppercase; letter-spacing: 0.5px;">Payment Status</p>
              <p style="font-size: 15px; font-weight: 700; color: #059669; margin: 0 0 6px 0;">Confirmed & Paid ✅</p>
              <p style="font-size: 13px; color: #065F46; margin: 0; line-height: 1.5;">
                Our team will reach you on <strong>WhatsApp</strong> within <strong>6 hours</strong> to confirm your exact session time and assign your personal mentor.<br />
                <span style="font-size: 12px; opacity: 0.85; display: inline-block; margin-top: 4px;">Support Hours: 10:00 AM &ndash; 10:00 PM IST</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Booking Summary -->
    <tr>
      <td style="background: #ffffff; padding: 36px 40px; border-radius: 0;">
        <h2 style="font-size: 14px; font-weight: 800; color: ${mutedText}; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 20px 0;">📋 Booking Summary</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${detailRow("Student Name",   data.studentName)}
          ${detailRow("Email",          data.email)}
          ${detailRow("Phone",          data.phone)}
          ${detailRow("Grade",          `Grade ${data.grade}`)}
          ${detailRow("Curriculum",     data.board)}
          ${detailRow("Subject(s)",     subjectDisplay)}
          ${detailRow("Preferred Date", dateDisplay)}
          ${detailRow("Time Preference",data.timePreference)}
          ${detailRow("Timezone",       timezoneDisplay)}
          ${data.paymentId ? detailRow("Payment ID", `<span style="font-family:monospace; font-size:12px;">${data.paymentId}</span>`) : ""}
        </table>
      </td>
    </tr>

    <!-- Next Steps -->
    <tr>
      <td style="background: ${bgLight}; padding: 28px 40px; border-top: 1px solid ${borderColor};">
        <h2 style="font-size: 14px; font-weight: 800; color: ${mutedText}; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0;">What Happens Next?</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding: 8px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td width="32" style="vertical-align: top;">
                <div style="width: 24px; height: 24px; background: ${brandGreen}; border-radius: 50%; text-align: center; line-height: 24px; font-size: 11px; font-weight: 800; color: #fff;">1</div>
              </td>
              <td style="padding-left: 10px; font-size: 14px; color: ${darkText}; line-height: 1.5;">Our team will contact you on <strong>WhatsApp</strong> within 6 hours to confirm your session time.</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding: 8px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td width="32" style="vertical-align: top;">
                <div style="width: 24px; height: 24px; background: ${brandBlue}; border-radius: 50%; text-align: center; line-height: 24px; font-size: 11px; font-weight: 800; color: #fff;">2</div>
              </td>
              <td style="padding-left: 10px; font-size: 14px; color: ${darkText}; line-height: 1.5;">We'll assign your <strong>personal expert mentor</strong> and send you the session link.</td>
            </tr></table>
          </td></tr>
          <tr><td style="padding: 8px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td width="32" style="vertical-align: top;">
                <div style="width: 24px; height: 24px; background: ${brandBlue}; border-radius: 50%; text-align: center; line-height: 24px; font-size: 11px; font-weight: 800; color: #fff;">3</div>
              </td>
              <td style="padding-left: 10px; font-size: 14px; color: ${darkText}; line-height: 1.5;">Attend your personalized <strong>1-on-1 trial session</strong> and experience the UnboundYou difference!</td>
            </tr></table>
          </td></tr>
        </table>
      </td>
    </tr>

    <!-- WhatsApp CTA -->
    <tr>
      <td style="background: #ffffff; padding: 28px 40px; text-align: center; border-top: 1px solid ${borderColor};">
        <p style="font-size: 13px; color: ${mutedText}; margin: 0 0 16px 0;">Have immediate questions? We're just a text away.</p>
        <a href="https://api.whatsapp.com/send/?phone=916299378633&text&type=phone_number&app_absent=0"
           target="_blank" rel="noopener noreferrer"
           style="display: inline-block; background: ${brandGreen}; color: #ffffff; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none;">
          Contact Us via WhatsApp
        </a>
      </td>
    </tr>

    ${footer(year)}
    `,
    `Payment confirmed! Your UnboundYou demo is booked — we'll WhatsApp you within 6 hours.`
  );

  const text = `
Hi ${data.studentName},

✅ PAYMENT CONFIRMED — Your demo is booked!

Our team will contact you on WhatsApp within 6 hours to confirm your session time and assign your mentor.
(Support Hours: 10:00 AM - 10:00 PM IST)

BOOKING SUMMARY
---------------
Student Name   : ${data.studentName}
Email          : ${data.email}
Phone          : ${data.phone}
Grade          : Grade ${data.grade}
Curriculum     : ${data.board}
Subject(s)     : ${subjectDisplay}
Preferred Date : ${dateDisplay}
Time Preference: ${data.timePreference}
Timezone       : ${timezoneDisplay}
${data.paymentId ? `Payment ID     : ${data.paymentId}` : ""}

NEXT STEPS
----------
1. Our team will contact you on WhatsApp within 6 hours to confirm your session time.
2. We'll assign your personal expert mentor and send you the session link.
3. Attend your personalized 1-on-1 trial session!

Have immediate questions? Contact us via WhatsApp:
https://api.whatsapp.com/send/?phone=916299378633

© ${year} UnboundYou — IGCSE Elite Tutoring
`.trim();

  return { subject, html, text };
}

/* ═══════════════════════════════════════════════════════════════
   2. PAYMENT FAILED — Student Notification + Retry
   ═══════════════════════════════════════════════════════════════ */
export function buildPaymentFailedEmail(data: BookingEmailData): {
  subject: string;
  html:    string;
  text:    string;
} {
  const subjectDisplay  = getSubjectDisplay(data.subjects, data.otherSubject);
  const dateDisplay     = `${data.preferredDate} ${data.preferredMonth} ${data.preferredYear}`;
  const year            = new Date().getFullYear();
  const retryUrl        = (process.env.NEXT_PUBLIC_SITE_URL || "https://demobooking.unboundyou.com") + "/#booking-card";

  const subject = `⚠️ Payment Not Completed — Retry & Secure Your Demo | UnboundYou`;

  const html = baseWrapper(
    `
    ${logoHeader()}

    <!-- Hero Banner -->
    <tr>
      <td style="background: linear-gradient(135deg, #1E293B 0%, #334155 100%); border-radius: 16px 16px 0 0; padding: 40px 40px 36px 40px; text-align: center;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding-bottom: 16px;">
              <div style="display: inline-block; background: rgba(239,68,68,0.2); border-radius: 50%; width: 64px; height: 64px; line-height: 64px; font-size: 28px;">⚠️</div>
            </td>
          </tr>
          <tr>
            <td>
              <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 8px 0; line-height: 1.3;">Payment Not Completed</h1>
              <p style="font-size: 15px; color: rgba(255,255,255,0.8); margin: 0; line-height: 1.5;">Hi ${data.studentName}, don't worry — your spot can still be secured!</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Reason Banner -->
    <tr>
      <td style="background: #FEF2F2; border-left: 4px solid ${brandRed}; padding: 18px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="28" style="vertical-align: top; padding-right: 12px; padding-top: 2px;">
              <span style="font-size: 20px;">❌</span>
            </td>
            <td style="vertical-align: middle;">
              <p style="font-size: 13px; font-weight: 800; color: #991B1B; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px;">Payment Status: Failed</p>
              ${data.failureReason ? `<p style="font-size: 13px; color: #7F1D1D; margin: 0; line-height: 1.5;">${data.failureReason}</p>` : ""}
              <p style="font-size: 13px; color: #991B1B; margin: 6px 0 0 0; line-height: 1.5;">
                <strong>Good news:</strong> You can rebook your demo with the same phone number and email — no restrictions!
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Retry CTA -->
    <tr>
      <td style="background: #ffffff; padding: 36px 40px; text-align: center;">
        <p style="font-size: 16px; font-weight: 700; color: ${darkText}; margin: 0 0 8px 0;">Your booking details are saved. Just retry the payment.</p>
        <p style="font-size: 14px; color: ${mutedText}; margin: 0 0 28px 0;">Click below to go back and complete your ₹` + DEMO_BOOKING_PRICE_INR + ` payment to secure your demo session.</p>
        <a href="${retryUrl}"
           target="_blank" rel="noopener noreferrer"
           style="display: inline-block; background: ${brandBlue}; color: #ffffff; font-size: 16px; font-weight: 800; padding: 16px 40px; border-radius: 14px; text-decoration: none; letter-spacing: 0.3px;">
          Retry Payment &rarr;
        </a>
        <p style="font-size: 12px; color: ${mutedText}; margin: 16px 0 0 0;">You can book again with the same email and phone number.</p>
      </td>
    </tr>

    <!-- Original Booking Summary -->
    <tr>
      <td style="background: ${bgLight}; padding: 28px 40px; border-top: 1px solid ${borderColor};">
        <h2 style="font-size: 14px; font-weight: 800; color: ${mutedText}; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0;">📋 Your Previous Booking Details</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${detailRow("Student Name",    data.studentName)}
          ${detailRow("Grade",           `Grade ${data.grade}`)}
          ${detailRow("Curriculum",      data.board)}
          ${detailRow("Subject(s)",      subjectDisplay)}
          ${detailRow("Preferred Date",  dateDisplay)}
          ${detailRow("Time Preference", data.timePreference)}
        </table>
      </td>
    </tr>

    <!-- Support -->
    <tr>
      <td style="background: #ffffff; padding: 24px 40px; text-align: center; border-top: 1px solid ${borderColor};">
        <p style="font-size: 13px; color: ${mutedText}; margin: 0 0 12px 0;">Need help? Our team is here for you.</p>
        <a href="https://api.whatsapp.com/send/?phone=916299378633&text&type=phone_number&app_absent=0"
           target="_blank" rel="noopener noreferrer"
           style="display: inline-block; background: ${brandGreen}; color: #ffffff; font-size: 14px; font-weight: 700; padding: 12px 28px; border-radius: 12px; text-decoration: none;">
          Contact Support via WhatsApp
        </a>
      </td>
    </tr>

    ${footer(year)}
    `,
    `Your payment wasn't completed — retry to secure your demo with UnboundYou.`
  );

  const text = `
Hi ${data.studentName},

⚠️ PAYMENT NOT COMPLETED

Your payment for the UnboundYou demo was not successful.
${data.failureReason ? `Reason: ${data.failureReason}` : ""}

GOOD NEWS: You can rebook your demo using the same phone number and email — no restrictions!

→ Retry Payment: ${retryUrl}

YOUR PREVIOUS BOOKING DETAILS
------------------------------
Student Name   : ${data.studentName}
Grade          : Grade ${data.grade}
Curriculum     : ${data.board}
Subject(s)     : ${subjectDisplay}
Preferred Date : ${dateDisplay}
Time Preference: ${data.timePreference}

Need help? Contact us via WhatsApp:
https://api.whatsapp.com/send/?phone=916299378633

© ${year} UnboundYou — IGCSE Elite Tutoring
`.trim();

  return { subject, html, text };
}

/* ═══════════════════════════════════════════════════════════════
   3. TEAM NOTIFICATION — Internal Alert (Success or Failed)
   ═══════════════════════════════════════════════════════════════ */
export function buildTeamNotificationEmail(
  data: BookingEmailData,
  paymentStatus: "payment_success" | "payment_failed"
): {
  subject: string;
  html:    string;
  text:    string;
} {
  const subjectDisplay  = getSubjectDisplay(data.subjects, data.otherSubject);
  const dateDisplay     = `${data.preferredDate} ${data.preferredMonth} ${data.preferredYear}`;
  const timezoneDisplay = data.timezone.split("/").pop()?.replace(/_/g, " ") || data.timezone;
  const now = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const year = new Date().getFullYear();

  const isSuccess = paymentStatus === "payment_success";

  const subject = isSuccess
    ? `💰 Payment Confirmed — ${data.studentName} | Grade ${data.grade} ${data.board} | ${subjectDisplay}`
    : `❌ Payment Failed — ${data.studentName} | Grade ${data.grade} | ${subjectDisplay}`;

  const statusBadge = isSuccess
    ? `<p style="font-size: 12px; font-weight: 800; color: #065F46; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
        Payment Status: <span style="color: #059669;">✅ Captured & Confirmed</span>
       </p>`
    : `<p style="font-size: 12px; font-weight: 800; color: #991B1B; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
        Payment Status: <span style="color: ${brandRed};">❌ Failed</span>
        ${data.failureReason ? `<br/><span style="font-weight: 400; text-transform: none; font-size: 12px;">${data.failureReason}</span>` : ""}
       </p>`;

  const actionItems = isSuccess
    ? `
      <p style="margin: 0 0 6px 0;">1. WhatsApp the student to confirm their exact session time.</p>
      <p style="margin: 0 0 6px 0;">2. Assign a mentor and send the session link.</p>
      <p style="margin: 0;">3. Payment is already confirmed — no manual Razorpay check needed.</p>`
    : `
      <p style="margin: 0 0 6px 0;">1. Student has been sent a failure email with a retry link.</p>
      <p style="margin: 0 0 6px 0;">2. They can rebook using the same email/phone (no block).</p>
      <p style="margin: 0;">3. No action required — monitor if they retry.</p>`;

  const html = baseWrapper(
    `
    ${logoHeader()}

    <tr>
      <td style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); border-radius: 16px 16px 0 0; padding: 32px 40px; text-align: center;">
        <h1 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 0 0 6px 0;">${isSuccess ? "💰 Payment Confirmed" : "❌ Payment Failed"} — New Demo Booking</h1>
        <p style="font-size: 13px; color: rgba(255,255,255,0.7); margin: 0;">Received at ${now} IST</p>
      </td>
    </tr>

    <tr>
      <td style="background: ${isSuccess ? "#F0FDF4" : "#FEF2F2"}; border-left: 4px solid ${isSuccess ? brandGreen : brandRed}; padding: 14px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="28" style="vertical-align: middle; padding-right: 10px;">
              <span style="font-size: 18px;">${isSuccess ? "✅" : "❌"}</span>
            </td>
            <td style="vertical-align: middle;">
              ${statusBadge}
              ${data.paymentId ? `<p style="font-size: 11px; color: ${mutedText}; margin: 4px 0 0 0; font-family: monospace;">Payment ID: ${data.paymentId}</p>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="background: #ffffff; padding: 32px 40px;">
        <h2 style="font-size: 13px; font-weight: 800; color: ${mutedText}; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 18px 0;">👤 Student Details</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${detailRow("Full Name",       data.studentName)}
          ${detailRow("Email",           `<a href="mailto:${data.email}" style="color: ${brandBlue};">${data.email}</a>`)}
          ${detailRow("WhatsApp",        `<a href="https://wa.me/${data.phone.replace(/\D/g, "")}" style="color: ${brandGreen}; font-weight: 700;">${data.phone}</a>`)}
          ${detailRow("Grade",           `Grade ${data.grade}`)}
          ${detailRow("Curriculum",      data.board)}
          ${detailRow("Subject(s)",      subjectDisplay)}
          ${detailRow("Preferred Date",  dateDisplay)}
          ${detailRow("Time Preference", data.timePreference)}
          ${detailRow("Timezone",        `${data.timezone} (${timezoneDisplay})`)}
          ${data.bookingId ? detailRow("Booking ID", `<span style="font-family:monospace; font-size:12px;">${data.bookingId}</span>`) : ""}
        </table>
      </td>
    </tr>

    <tr>
      <td style="background: #EFF6FF; border-top: 1px solid #BFDBFE; padding: 24px 40px; border-radius: 0 0 16px 16px;">
        <h2 style="font-size: 13px; font-weight: 800; color: #1E40AF; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0;">⚡ ${isSuccess ? "Action Required" : "FYI — No Action Needed"}</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size: 13px; color: #1E40AF; line-height: 1.7;">
              ${actionItems}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${footer(year)}
    `,
    `${isSuccess ? "New confirmed demo booking" : "Payment failed"} — ${data.studentName} | Grade ${data.grade} ${data.board}`
  );

  const text = `
${isSuccess ? "PAYMENT CONFIRMED" : "PAYMENT FAILED"} — UnboundYou Internal Alert
============================================
Received: ${now} IST
Payment Status: ${isSuccess ? "Captured ✅" : "Failed ❌"}
${data.paymentId ? `Payment ID: ${data.paymentId}` : ""}
${data.failureReason ? `Failure Reason: ${data.failureReason}` : ""}

STUDENT DETAILS
---------------
Full Name      : ${data.studentName}
Email          : ${data.email}
WhatsApp       : ${data.phone}
Grade          : Grade ${data.grade}
Curriculum     : ${data.board}
Subject(s)     : ${subjectDisplay}
Preferred Date : ${dateDisplay}
Time Preference: ${data.timePreference}
Timezone       : ${data.timezone} (${timezoneDisplay})
${data.bookingId ? `Booking ID     : ${data.bookingId}` : ""}

${isSuccess
  ? "ACTION REQUIRED\n---------------\n1. WhatsApp the student to confirm their exact session time.\n2. Assign a mentor and send the session link.\n3. Payment is already confirmed — no manual Razorpay check needed."
  : "FYI — NO ACTION NEEDED\n----------------------\n1. Student has been sent a failure email with a retry link.\n2. They can rebook using the same email/phone (no block).\n3. No action required — monitor if they retry."}
`.trim();

  return { subject, html, text };
}
