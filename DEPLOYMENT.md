# Deployment Guide

This guide details the steps required to configure, test, and deploy the Elite 1-on-1 IGCSE Tuition Demo Booking platform to a production environment. 

---

## 1. Project Architecture Overview

The platform is built using the following stack:
- **Framework**: Next.js (App Router, Tailwind CSS, TypeScript, React 19)
- **Database**: Google Cloud Firestore (leveraging security rules and index constraints for transaction safety)
- **Payments**: Razorpay Checkout SDK (client-side modal) & Razorpay REST API (server-side order creation)
- **Webhooks**: Razorpay Webhook API (capturing async payments and updating database statuses)
- **Notifications**: SMTP Server via Nodemailer (Gmail App Passwords) for sending confirmation emails to students and internal notification emails to the team.

---

## 2. Environment Variables Configuration

To run the application, copy the example environment file:
```bash
cp .env.example .env.local
```
Configure the variables below in your local environment file or your hosting provider's setting dashboard (e.g., Vercel Dashboard).

### Public Environment Variables (Browser-Accessible)

These variables must be prefixed with `NEXT_PUBLIC_` so they are accessible to client-side components like [src/lib/firebase.ts](file:///d:/work/demo-booking-new/src/lib/firebase.ts).

| Variable Name | Description | Example / Details |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL of the application. | `https://demobooking.unboundyou.com` |
| `NEXT_PUBLIC_GTM_ID` | Container ID for Google Tag Manager (optional). | `GTM-XXXXXXX` |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity Project ID for behavior tracking (optional). | `prji12345` |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Facebook Pixel ID for tracking payment conversions (optional). | `1234567890` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web Client API key. | Find under Firebase Console → Project Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Web Client Authentication Domain. | `<project-id>.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Web Client Project ID. | `<project-id>` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket. | `<project-id>.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID. | `123456789012` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase Web App App ID. | `1:12345:web:abcd1234` |

### Private Environment Variables (Server-Side Only)

These variables are hidden from the browser and are securely processed by API routes in Next.js.

| Variable Name | Description | Example / Details |
| :--- | :--- | :--- |
| `RAZORPAY_KEY_ID` | Razorpay API key ID for checkout initialization. | `rzp_live_xxxxxxxxxxxxxx` (Production)<br>`rzp_test_xxxxxxxxxxxxxx` (Testing) |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret. | Keep this secure! |
| `RAZORPAY_WEBHOOK_SECRET` | Secret key used to verify webhook signatures. | Generated when creating webhooks in Razorpay Dashboard. **Required in production** to prevent spoofing. |
| `GMAIL_USER` | Gmail address used by Nodemailer to fire emails. | `bookings@yourdomain.com` or custom SMTP Gmail account |
| `GMAIL_APP_PASSWORD` | App-specific Google password for SMTP authentication. | **Do not use your personal Gmail password**. (See Section 5) |
| `TEAM_EMAIL` | Internal address to receive admin booking alerts. | `team_bookings@yourdomain.com` |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | **(Option A - Recommended)** Base64 encoded Firebase service account JSON. | base64 string (See Section 3) |
| `FIREBASE_ADMIN_PROJECT_ID` | **(Option B)** Service account Project ID. | Used if `FIREBASE_SERVICE_ACCOUNT_JSON` is blank. |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | **(Option B)** Service account Client Email. | Used if `FIREBASE_SERVICE_ACCOUNT_JSON` is blank. |
| `FIREBASE_ADMIN_PRIVATE_KEY` | **(Option B)** Service account Private Key. | Used if `FIREBASE_SERVICE_ACCOUNT_JSON` is blank. Supports raw strings and escaped newlines (`\n`). |

---

## 3. Database (Firebase/Firestore) Setup

The application uses Google Cloud Firestore for persistence. It relies on strict transactional control to block duplicate bookings (by matching WhatsApp numbers or emails) using index maps.

### Step 3.1: Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the prompts.
3. Once the project is created, click the **Web icon** (`</>`) under "Get started by adding Firebase to your app".
4. Register the app name and copy the configuration snippet. Map these fields to the `NEXT_PUBLIC_FIREBASE_*` variables.
5. In the left panel, navigate to **Build** → **Firestore Database** and click **Create database**. Set it to **Production Mode** and choose a regional server close to your target users (e.g., `asia-south1` for India / Asia).

### Step 3.2: Configure Firebase Admin SDK Credentials
The server endpoints use the Admin SDK ([src/lib/firebaseAdmin.ts](file:///d:/work/demo-booking-new/src/lib/firebaseAdmin.ts)) to read/write Firestore authority bypass checks.

1. Go to **Project Settings** (gear icon) → **Service accounts**.
2. Click **Generate new private key** to download the credentials `.json` file.
3. **Encode to Base64 (Recommended)**:
   - **On Windows (PowerShell)**:
     ```powershell
     [Convert]::ToBase64String([System.IO.File]::ReadAllBytes("path\to\downloaded-key.json"))
     ```
   - **On macOS / Linux**:
     ```bash
     base64 -i path/to/downloaded-key.json
     ```
   - Copy the long string and set it as `FIREBASE_SERVICE_ACCOUNT_JSON` in your production environments.
4. *Alternative*: Set the individual properties (`FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, and `FIREBASE_ADMIN_PRIVATE_KEY` with newlines preserved as `\n`).

### Step 3.3: Deploy Security Rules
Security rules must be deployed to secure user submissions.
1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in and verify credentials:
   ```bash
   firebase login
   ```
3. Initialize Firestore:
   ```bash
   firebase init firestore
   ```
   Select your existing project and set up rules files. Ensure it points to [firestore.rules](file:///d:/work/demo-booking-new/firestore.rules).
4. Deploy the rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
   *Alternative*: Copy the content of [firestore.rules](file:///d:/work/demo-booking-new/firestore.rules) and paste it directly into the **Rules** tab of your Firestore Database console.

### Database Index Collection Details
The system enforces rules on 3 main collections:
- `bookings`: Stores booking records. Initially created with a `status` of `"pending_payment"`. Updated to `"payment_success"` or `"payment_failed"` by the webhook.
- `phoneIndex`: Holds document ID maps where the document key is the numerical WhatsApp number (`whatsapp`). Used to prevent multiple trials for the same number.
- `emailIndex`: Holds document ID maps where the document key is a normalized email address (`emailKey` with `.` mapped to `_dot_`). Used to prevent multiple trials for the same email.

---

## 4. Razorpay Integration

The payment gateway is Razorpay. 

### Step 4.1: Retrieve API Keys
1. Log in to the [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Switch to the appropriate mode (**Test Mode** for testing, **Live Mode** for production) in the upper right.
3. Navigate to **Account & Settings** → **API Keys** → **Generate Key**.
4. Copy the `Key ID` and `Key Secret` and map them to `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.

### Step 4.2: Configure the Payment Webhook
Since client connections can drop (e.g., closing browser during payment confirmation), emails and database state updates are handled by a backend webhook listener ([src/app/api/razorpay/webhook/route.ts](file:///d:/work/demo-booking-new/src/app/api/razorpay/webhook/route.ts)).

1. Navigate to **Account & Settings** → **Webhooks** in the Razorpay Dashboard.
2. Click **Add New Webhook**.
3. Set the **Webhook URL**:
   - For Production: `https://demobooking.unboundyou.com/api/razorpay/webhook`
   - For Testing: You can use tools like ngrok to forward traffic locally (e.g., `https://xxxx.ngrok-free.app/api/razorpay/webhook`).
4. Set a **Secret**. Enter a random, strong alphanumeric string. Save this secret and assign it to `RAZORPAY_WEBHOOK_SECRET` in your environment.
5. In **Active Events**, select:
   - `payment.captured` (trigggers success flow)
   - `payment.failed` (triggers failure email)
6. Click **Create Webhook**.

---

## 5. Gmail SMTP (Nodemailer) Setup

The platform uses Nodemailer to send emails through Gmail SMTP ([src/lib/mailService.ts](file:///d:/work/demo-booking-new/src/lib/mailService.ts)). Modern Gmail security requires an **App Password** for programmatic access.

1. Log in to the target Gmail account (`GMAIL_USER`).
2. Go to **Google Account Settings** → **Security**.
3. Under "How you sign in to Google", ensure **2-Step Verification** is turned **ON**.
4. Click on **2-Step Verification** and scroll to the bottom of the page.
5. Click on **App passwords**.
6. Enter an app name (e.g., `UnboundYou Tuition Bookings`) and click **Create**.
7. Google will show a 16-character code (e.g., `abcd efgh ijkl mnop`).
8. Copy this code (without spaces) and paste it as the `GMAIL_APP_PASSWORD` environment variable.

---

## 6. Deployment on Vercel

Vercel is the recommended hosting platform for Next.js applications.

### Step 6.1: Connect Repository
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** → **Project**.
3. Import the Git repository containing this codebase.

### Step 6.2: Add Environment Variables
During the import steps, expand the **Environment Variables** section and paste the key-value pairs configured in Section 2.

> [!WARNING]
> Do not omit `RAZORPAY_WEBHOOK_SECRET` in production! If it is unset, the webhook handler will reject all incoming Razorpay webhook calls to prevent unsigned payloads from mutating data, throwing a `500 Server misconfigured` error.

### Step 6.3: Deploy and Custom Domain Setup
1. Click **Deploy**. Vercel will build the static pages and spin up Serverless Functions for routes in `/api`.
2. Once deployed, go to the project settings → **Domains**.
3. Enter `demobooking.unboundyou.com` (or your chosen custom domain).
4. Configure your DNS provider (e.g., GoDaddy, Cloudflare) with the CNAME record or A record provided by Vercel.

---

## 7. Post-Deployment Verification Checklist

After deploying the platform, run these sanity checks to confirm all systems are operating correctly:

- [ ] **Check Frontend Load**: Navigate to your production URL. Verify that styles load correctly, Google fonts are imported, and fonts display smoothly.
- [ ] **Test Duplicate Prevention (Pre-Check)**: Verify email duplicate checks in the form field. Try booking with a mock email that has a `status: "payment_success"` in Firestore. The input should trigger a validation warning.
- [ ] **Order Creation API Check**: Fill out the trial form and proceed to the calendar step. Click the checkout button. Verify that the Razorpay checkout modal opens immediately.
- [ ] **Simulate Success Flow**:
  - In Razorpay **Test Mode**, enter a test card or select "Success" in the payment screen.
  - Verify that you are redirected to `/thank-you` with a valid `bookingId`.
  - Check the Firestore `bookings` collection: The booking document status should change from `"pending_payment"` to `"payment_success"`.
  - Check the Firestore `phoneIndex` and `emailIndex` collections: The corresponding entries should have status set to `"payment_success"`.
  - Check inboxes: Ensure the student receives the confirmation template, and the team receives the alert containing the slot details.
- [ ] **Simulate Failure Flow**:
  - Open checkout and choose "Failure" in the test simulator, or cancel the checkout.
  - Verify that the Firestore status changes to `"payment_failed"`.
  - Check the student's email inbox: Ensure they receive a payment failure notification with a link to try again.
  - Check the Firestore index status maps: Confirm they changed to `"payment_failed"` so the phone and email are released for another booking attempt.
