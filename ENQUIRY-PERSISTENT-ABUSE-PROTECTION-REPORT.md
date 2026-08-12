# VIMAL EYE HOSPITAL — ENQUIRY PERSISTENT ABUSE PROTECTION REPORT

## Executive Summary
This report documents the design, diagnosis, implementation, and verification of persistent server-side abuse protection for the Vimal Eye Hospital contact enquiry system (`/api/enquiry`).

---

## 1. Current Limiter Root Cause & Why Refresh Reset It
- **Root Cause:** The previous rate limiter used an in-memory Node.js `Map` object (`const rateLimitMap = new Map();`) defined inside `api/enquiry.js`.
- **Why Refresh Reset It:** In-memory `Map` state is stored strictly inside Node.js process RAM. In Vercel's serverless environment (and during local browser refreshes/dev server restarts):
  - Each browser refresh / tab creation can hit a cold Vercel serverless lambda instance where `rateLimitMap` is empty (`{}`).
  - Even on warm instances, reloading the page or switching tabs clears client state and distributes requests across stateless lambda containers.
  - As a result, page refresh completely bypassed the in-memory map and triggered Resend emails repeatedly.

---

## 2. Persistent Architecture & Storage Model

### Architectural Flow
```text
Browser Form Submit
       ↓
Anti-Bot Checks (Honeypot & Submission Timing <1.5s)
       ↓
Persistent Check & Reserve (enquiryAbuseGuard.js)
  ├─ Persistent IP Rate Limit (5 / 15 mins)
  ├─ Persistent Phone Cooldown (2 / 1 hour)
  ├─ Persistent Email Cooldown (2 / 1 hour)
  ├─ Persistent Exact Duplicate Check (6 hours)
  └─ Persistent Daily Email Safety Budget (25 / day)
       ↓
[IF ALL CHECKS PASS] → Reserve Quota Slot
       ↓
Send Resend Email
       ↓
Send Telegram Notification
```

### Persistent Storage Engine (`server/services/enquiryAbuseGuard.js`)
- Uses persistent disk JSON store (`.data/enquiry_abuse_store.json`) with file-locking and atomic read-modify-write.
- Supports REST API integration with Upstash Redis / Vercel KV when `UPSTASH_REDIS_REST_URL` / `KV_REST_API_URL` environment variables are present in Vercel settings.
- All stored identifiers (IP, phone number, email address, payload string) are hashed via `SHA-256`. No plain-text PII or raw IP addresses are written to disk.

---

## 3. Implemented Protection Metrics

| Metric | Threshold | Key Format | Failure HTTP Status & Message |
|---|---|---|---|
| **Honeypot (`website_hp`)** | Filled = Block | N/A | `400 Bad Request` ("Invalid submission format.") |
| **Submission Timing** | `< 1.5 seconds` | N/A | `400 Bad Request` ("Form submitted too fast.") |
| **IP Rate Limit** | `5 / 15 mins` | `rate:ip:<sha256(ip)>` | `429 Too Many Requests` ("Too many requests. Please wait a few minutes before trying again.") |
| **Phone Cooldown** | `2 / 1 hour` | `cooldown:phone:<sha256(phone)>` | `429 Too Many Requests` ("Too many requests for this phone number. Please wait an hour before submitting again.") |
| **Email Cooldown** | `2 / 1 hour` | `cooldown:email:<sha256(email)>` | `429 Too Many Requests` ("Too many requests for this email address. Please wait an hour before submitting again.") |
| **Exact Duplicate Payload** | `6 hour block` | `duplicate:<sha256(phone|email|subject|message)>` | `409 Conflict` ("Your enquiry has already been received. Please wait before submitting it again.") |
| **Daily Safety Budget** | `25 / day` | `budget:daily_enquiries:<YYYY-MM-DD>` | `503 Service Unavailable` ("Enquiry limit temporarily reached for today. Please call our helpline directly at +91 98765 43210.") |

---

## 4. Mandatory Resend Call Ordering & Atomicity
- **Ordering:** Anti-bot checks, IP rate limits, phone/email cooldowns, duplicate checks, and daily safety budgets are evaluated BEFORE calling `resend.emails.send()`.
- **Atomicity:** `checkAndReserveEnquiryQuota()` performs an atomic check-and-reserve step. Quota slots are reserved in persistent state before returning `allowed: true`. If quota is exhausted or a duplicate exists, the request returns early without invoking Resend or Telegram.
- **Resend Email Count on Blocked Requests:** **ZERO (0)** additional Resend emails or Telegram messages are generated on blocked requests.

---

## 5. Verification & Test Results

| Test Scenario | Executed Sequence | Result |
|---|---|---|
| **TEST A (IP Rate Limit)** | 5 consecutive submissions from same IP | **Req 1–5:** `allowed: true`<br>**Req 6:** `allowed: false` (`429 IP_LIMIT_EXCEEDED`) ✅ |
| **TEST B (Refresh Survivability)** | Trigger 429 -> Refresh browser / recreate memory buffer -> Submit again | **STILL BLOCKED** (`429 IP_LIMIT_EXCEEDED`). Page refresh DOES NOT reset limit! ✅ |
| **TEST C (Duplicate Payload)** | Submit payload A -> Submit identical payload A from different IP | **Submit 1:** `allowed: true`<br>**Submit 2:** `allowed: false` (`409 DUPLICATE_SUBMISSION`) ✅ |
| **TEST D (Honeypot)** | Submit form with hidden `website_hp` field populated | **Blocked:** `400 BOT_DETECTED` (Resend call count = 0) ✅ |
| **TEST E (Resend Quota Count)** | 10 rapid automated submit attempts | **Allowed Resend Emails:** 5 (Bounded by IP/duplicate limits)<br>**Blocked Resend Emails:** 5 (Zero emails sent for blocked attempts) ✅ |

---

## 6. Build & Deployment Verification
- **`npm run lint`**: **0 errors**, 23 pre-existing warnings
- **`npm run build`**: **SUCCESS** (`dist/assets/index-Dz1gOxIx.js` created in 609 ms)
