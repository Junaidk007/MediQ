# QureFlow: MVP Ideation & Scope

**QureFlow** solves unpredictable clinic waits by providing a real-time, synchronized queue management system.

**The Core Flow:** Book → Arrive → QR Check-in → Get Token → Track Live Queue → Consult → Done.

## MVP Scope (MoSCoW)
**🔴 MUST-HAVE (Core Loop):**
- Patient ID (Permanent) vs. Token ID (Visit-specific).
- Appointment Booking & QR-based Validation Check-in.
- Live Queue Generation based on actual arrivals, not just scheduled times.
- State Machine: `BOOKED` → `CHECKED_IN` → `IN_QUEUE` → `CHECK_UP` → `DONE`.
- Dynamic ETA Range (e.g., 25–40 mins) based on historical consultation averages.
- Dashboards for 3 Roles: Patient, Reception, Doctor.

**🟡 SHOULD-HAVE:**
- Exception states (`NO_SHOW`, `CANCELLED`).
- Queue corrections for Walk-ins.
- Basic visual notifications ("You're next").

**⚫ WON'T-HAVE (Out of Scope for MVP):**
- Payments, Full EMR, Advanced AI diagnostics, Telemedicine, Insurance.

---

## Key Technical & Product Mechanics

### 1. Booking vs. Live Queue
Booking secures a slot, but the **live queue** only includes patients who have physically arrived and checked in via QR. Queue position is derived dynamically from the list of `IN_QUEUE` patients.

### 2. State Ownership
- **Patient:** Triggers `BOOKED`.
- **System/Reception (via QR):** Validates and triggers `CHECKED_IN` → `IN_QUEUE`.
- **Doctor:** Triggers `CHECK_UP` (Starts timer) and `DONE` (Ends timer).
- **Reception:** Manages exceptions (`NO_SHOW`, Walk-ins).

### 3. Real-Time ETA Calculation
The ETA is always a range, calculated using the doctor's recent average consultation time multiplied by patients ahead, plus the remaining time of the current consultation. 

## Success Metrics
- **Queue Position Accuracy:** Does the screen match reality?
- **ETA Usefulness:** Is the estimated range reliable?
- **Sync Reliability:** Do patient screens update instantly when the doctor clicks "Next"?
