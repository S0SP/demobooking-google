// src/lib/firebaseAdmin.ts
// Server-side Firebase Admin SDK — used in API routes/webhooks.
// Requires FIREBASE_SERVICE_ACCOUNT_JSON env var (base64-encoded service account JSON).

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]!;

  const encoded = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  let credentialCert: ReturnType<typeof cert>;

  if (encoded) {
    try {
      const serviceAccount = JSON.parse(Buffer.from(encoded, "base64").toString("utf8"));
      credentialCert = cert(serviceAccount as Parameters<typeof cert>[0]);
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid base64-encoded JSON.");
    }
  } else {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Missing Firebase Admin credentials. Please set either FIREBASE_SERVICE_ACCOUNT_JSON " +
        "or FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY."
      );
    }

    // Clean up private key if wrapped in quotes or contains escaped newlines
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, "\n");

    credentialCert = cert({
      projectId,
      clientEmail,
      privateKey,
    });
  }

  return initializeApp({
    credential: credentialCert,
  });
}

export function getAdminFirestore() {
  getAdminApp();
  return getFirestore();
}
