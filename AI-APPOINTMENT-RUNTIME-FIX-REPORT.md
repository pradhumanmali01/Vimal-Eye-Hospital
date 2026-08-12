# VIMAL EYE HOSPITAL — AI APPOINTMENT RUNTIME FIX REPORT

## Executive Summary
This report documents the root causes and production fixes for the two runtime bugs identified in the Vimal Eye Hospital AI Assistant appointment booking flow.

---

## 1. Bug #1 Root Cause & Fix
- **Issue:** Sending `"i want to book appointment"` triggered a runtime `TypeError` (`setBookingTimestamp is not a function`), which fell through to the generic error handler and rendered `"I don't have that exact detail in my system yet. Please call our hospital desk at +91 98765 43210 for immediate assistance."`.
- **Root Cause:** `setBookingTimestamp(null)` was being invoked in `startAppointmentFlow()` and `handleEditAppointment()`, but `const [bookingTimestamp, setBookingTimestamp] = useState(null)` was missing from `ChatContext.jsx` state declarations.
- **Fix Implemented:** Added `const [bookingTimestamp, setBookingTimestamp] = useState(null)` to `ChatContext.jsx`.

---

## 2. Bug #2 Root Cause & Fix
- **Issue:** Submitting social tokens such as `"hi"` or `"hello"` while on the NAME collection step resulted in accepting `"hi"` as a valid patient name and echoing `"Thank you hi! Please enter your 10-digit Mobile Phone Number."`.
- **Root Cause:** `validateName()` in `src/utils/ai/validators.js` only checked minimum length (>=2 chars), absence of digits, and a minimal list of appointment intent words. `"hi"` (2 chars) passed all checks.
- **Fix Implemented:**
  1. Updated `validateName()` in `src/utils/ai/validators.js`:
     - Added an explicit `SOCIAL_TOKENS` list (`hi`, `hey`, `hello`, `ok`, `okay`, `yes`, `no`, `thanks`, `thankyou`, `namaste`, `namaskar`, `pls`, `please`, `test`, `hi there`, etc.).
     - Expanded `INVALID_NAME_WORDS` list to include hospital/medical inquiry words (`hospital`, `timing`, `opd`, `treatment`, `fees`, `cost`, `price`, `address`, `location`, `map`, `contact`, `phone`, `call`, `emergency`, `lasik`, `cataract`, etc.).
     - Integrated `classifyIntent()` inside `validateName()` to reject any input that classifies as `GREETING`, `OFF_TOPIC`, `START_APPOINTMENT_FLOW`, `OPD_TIMINGS`, `LOCATION`, `CONTACT`, `CONSULTATION_FEE`, or `DOCTORS`.
  2. Updated NAME step error handling in `ChatContext.jsx`:
     - Rejects non-name inputs cleanly with validation feedback.
     - Keeps patient on the NAME step without advancing to `phone` step.
     - Prevents echoing raw invalid inputs into acknowledgement prompts.

---

## 3. Files Modified
- **`src/contexts/ChatContext.jsx`**: Added `bookingTimestamp` state variable and updated `handleAppointmentFlowStep` NAME step error response handling.
- **`src/utils/ai/validators.js`**: Imported `classifyIntent`, added `SOCIAL_TOKENS`, expanded `INVALID_NAME_WORDS`, and integrated intent-based semantic validation for patient names.

---

## 4. Test Results (Regression Tests 1 – 13)

| Test ID | Input Query | Expected Output | Status |
|---|---|---|---|
| **TEST 1** | `"i want to book appointment"` | Enters appointment flow at NAME step | **PASS ✅** |
| **TEST 2** | `"iwant to book appointmnet"` | Enters appointment flow at NAME step | **PASS ✅** |
| **TEST 3** | `"iwatnto book appointmenr"` | Enters appointment flow at NAME step | **PASS ✅** |
| **TEST 4** | `"mujhe appointment book krni hai"` | Enters appointment flow at NAME step | **PASS ✅** |
| **TEST 5** | `"i want to check my eyes"` | Enters appointment flow at NAME step | **PASS ✅** |
| **TEST 6** | `"hi"` (on NAME step) | Rejected as name; remains on NAME step | **PASS ✅** |
| **TEST 7** | `"hello"` (on NAME step) | Rejected as name; remains on NAME step | **PASS ✅** |
| **TEST 8** | `"i want to book appointment"` (on NAME step) | Remains on NAME step with clean prompt | **PASS ✅** |
| **TEST 9** | `"hospital kaha hai"` (on NAME step) | Rejected as name; remains on NAME step | **PASS ✅** |
| **TEST 10** | `"Rahul Sharma"` | Accepted as valid name; advances to phone step | **PASS ✅** |
| **TEST 11** | `"Pradhuman Mali"` | Accepted as valid name; advances to phone step | **PASS ✅** |
| **TEST 12** | `"hi there"` | Rejected as name; remains on NAME step | **PASS ✅** |
| **TEST 13** | `"book appointment"` | Rejected as name; remains on NAME step | **PASS ✅** |

---

## 5. Verification Results
- **`npm run lint`**: 0 errors (23 pre-existing warnings)
- **`npm run build`**: SUCCESS (bundle `dist/assets/index-hXGBsp8I.js` created in 881 ms)
