// src/lib/mailService.ts
// Nodemailer-based email sender.
// Called from the Razorpay webhook handler (server-side only).

import nodemailer from "nodemailer";
import type { BookingEmailData } from "./emailTemplates";
import {
  buildStudentConfirmationEmail,
  buildPaymentFailedEmail,
  buildTeamNotificationEmail,
} from "./emailTemplates";

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export interface MailResult {
  success: boolean;
  error?: string;
}

/* ─── Payment Success: student confirmation + team alert ──────── */
export async function sendPaymentSuccessEmails(
  data: BookingEmailData
): Promise<MailResult> {
  const teamEmail = process.env.TEAM_EMAIL;
  const gmailUser = process.env.GMAIL_USER;

  if (!teamEmail || !gmailUser) {
    console.error("[MailService] Missing TEAM_EMAIL or GMAIL_USER env vars.");
    return { success: false, error: "Mail configuration missing." };
  }

  try {
    const transporter = getTransporter();

    const studentMail = buildStudentConfirmationEmail(data);
    const teamMail    = buildTeamNotificationEmail(data, "payment_success");
    const fromAddress = `"UnboundYou" <${gmailUser}>`;

    const [studentResult, teamResult] = await Promise.allSettled([
      transporter.sendMail({
        from:    fromAddress,
        to:      data.email,
        subject: studentMail.subject,
        html:    studentMail.html,
        text:    studentMail.text,
      }),
      transporter.sendMail({
        from:    fromAddress,
        to:      teamEmail,
        subject: teamMail.subject,
        html:    teamMail.html,
        text:    teamMail.text,
        replyTo: data.email,
      }),
    ]);

    if (studentResult.status === "rejected") {
      console.error(
        "[MailService] Student success email failed:",
        (studentResult as PromiseRejectedResult).reason
      );
    }
    if (teamResult.status === "rejected") {
      console.error(
        "[MailService] Team success notification failed:",
        (teamResult as PromiseRejectedResult).reason
      );
    }

    if (studentResult.status === "rejected" && teamResult.status === "rejected") {
      return { success: false, error: "Failed to send both emails." };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown mail error";
    console.error("[MailService] Transporter error (success):", message);
    return { success: false, error: message };
  }
}

/* ─── Payment Failed: student failure + retry email ──────────── */
export async function sendPaymentFailedEmail(
  data: BookingEmailData
): Promise<MailResult> {
  const teamEmail = process.env.TEAM_EMAIL;
  const gmailUser = process.env.GMAIL_USER;

  if (!gmailUser) {
    console.error("[MailService] Missing GMAIL_USER env var.");
    return { success: false, error: "Mail configuration missing." };
  }

  try {
    const transporter = getTransporter();

    const studentMail = buildPaymentFailedEmail(data);
    const fromAddress = `"UnboundYou" <${gmailUser}>`;

    // Send failure email to student + optional team notification
    const sends: Promise<unknown>[] = [
      transporter.sendMail({
        from:    fromAddress,
        to:      data.email,
        subject: studentMail.subject,
        html:    studentMail.html,
        text:    studentMail.text,
      }),
    ];

    // Also notify team on failure so they're aware
    if (teamEmail) {
      const teamMail = buildTeamNotificationEmail(data, "payment_failed");
      sends.push(
        transporter.sendMail({
          from:    fromAddress,
          to:      teamEmail,
          subject: teamMail.subject,
          html:    teamMail.html,
          text:    teamMail.text,
        })
      );
    }

    const results = await Promise.allSettled(sends);

    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(`[MailService] Failed email send [${i}]:`, (r as PromiseRejectedResult).reason);
      }
    });

    const allFailed = results.every((r) => r.status === "rejected");
    if (allFailed) {
      return { success: false, error: "Failed to send failure notification emails." };
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown mail error";
    console.error("[MailService] Transporter error (failure):", message);
    return { success: false, error: message };
  }
}
