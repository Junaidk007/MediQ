# QureFlow — Project Context File

## Purpose

This file captures the product ideation, decisions, assumptions, scope, user flows, state model, MVP priorities, and validation goals established during the conversation for the healthcare clinic queue-management project.

It is intended to be reused as project context for future discussions about product strategy, UX, MVP planning, architecture, README/PPT creation, and implementation.

**Project name:** QureFlow

---

# 1. Domain & Problem

**Domain:** Healthcare & Wellness

**Target environment:** Small clinics, OPDs, and multi-doctor outpatient clinics.

**Primary users:**
- Patients
- Receptionists / clinic staff
- Doctors

**Core problem:** Small clinics suffer from unpredictable waiting times, manual check-in, and poor visibility into the actual physical queue. A patient may know their appointment time but still have no idea how many people are ahead or when their turn will actually come.

**Core solution:** A multi-role real-time clinic queue-management platform where patients book appointments, check in at reception using a QR code, receive a visit-specific token, track their live queue position, and see an estimated waiting-time range. Receptionists manage check-ins and exceptions, while doctors control consultation state and view essential patient information.

**Core product hypothesis:**
> Can a clinic maintain an accurate live queue while patients reliably understand where they are in the queue and approximately how long they may need to wait?

QureFlow is therefore primarily a **real-time clinic queue management system**, not merely an appointment-booking application.

---

# 2. Initial Healthcare Bottleneck Research

Five broad patient-side healthcare operational bottlenecks were identified:

## 2.1 Finding the right doctor and appointment

**Root causes:** Specialist selection and information about availability, fees, experience, and departments can be fragmented.

**Current workaround:** Calling multiple hospitals/clinics, asking friends/family, searching online, or physically visiting.

## 2.2 Managing medical records

**Root causes:** Reports, prescriptions, scans, and summaries can be scattered across hospitals, labs, WhatsApp, email, and physical files.

**Current workaround:** Physical folders, photos, PDFs, WhatsApp/Drive storage, and repeatedly explaining history to new doctors.

## 2.3 Medication adherence

**Root causes:** Patients forget doses, schedules can be complex, prescriptions change, and medicines run out.

**Current workaround:** Phone alarms, handwritten notes, family reminders, or manually checking medicine strips.

## 2.4 Tracking tests, reports, and follow-ups

**Root causes:** Tests and appointments happen across different providers and patients may not know when a test is due or whether a doctor reviewed a result.

**Current workaround:** Diaries/calendars, calling hospitals/labs, checking portals, and carrying reports to appointments.

## 2.5 Understanding healthcare costs

**Root causes:** Costs can span consultation, diagnostics, medicines, procedures, and insurance.

**Current workaround:** Calling providers, keeping notes/spreadsheets, and contacting insurers separately.

### Important pattern

The broad healthcare problem is fragmented coordination across:

> Patient → Doctor → Hospital → Lab → Pharmacy → Insurance

However, the selected project deliberately narrows this down to one operational problem: **Doctor Appointment & Queue Management for Small Clinics.**

---

# 3. Selected Problem Statement

> Small clinics suffer from chaotic walk-in crowding. Build a multi-role app for patients to view live slot/appointment availability, book appointments/tokens, check in at the clinic, and track their real-time queue position.

The product focuses on what happens **after the appointment is booked and the patient reaches the clinic**.

---

# 4. Existing Workflow / Product Gaps Identified

Three major gaps were identified in existing appointment workflows:

## 4.1 Appointment time does not equal actual consultation time

A scheduled appointment can still involve long waits because previous consultations take different amounts of time, doctor availability changes, and the physical clinic workflow differs from the booking schedule.

**Opportunity:** Show the actual live queue and an estimated wait range instead of relying only on the scheduled appointment time.

## 4.2 Patients lack reliable real-time queue visibility

Patients often do not know:
- how many patients are ahead;
- who is currently being consulted;
- whether the doctor is delayed;
- how long they should wait;
- when they should return to the clinic.

**Opportunity:** Provide a live queue position, patients-ahead count, current consultation, doctor state, and ETA range.

## 4.3 Clinic operations and patient-facing information can become disconnected

The receptionist may maintain a physical queue while the patient sees a different digital status. If doctor/reception actions are not synchronized, the digital queue becomes unreliable.

**Opportunity:** Use one synchronized workflow across Patient + Reception + Doctor.

---

# 5. Core Product Model

QureFlow is built around **state-driven queue management**.

## Patient state

Normal lifecycle:

```text
BOOKED
   ↓
CHECKED_IN
   ↓
IN_QUEUE
   ↓
CHECK_UP
   ↓
DONE
```

Exception states:

```text
IN_QUEUE → NO_SHOW
IN_QUEUE → CANCELLED
IN_QUEUE → URGENT
```

## Doctor state

```text
AVAILABLE
IN_CONSULTATION
ON_BREAK
ON_LEAVE
OFFLINE
```

The queue is a live representation of these states plus queue order and consultation duration.

---

# 6. Patient ID vs Token ID

This distinction is a core product decision.

## Patient ID

Permanent, unique identity of the person.

> **Patient ID = Who is this patient?**

Example:

```text
Patient ID: P-1024
```

It remains the same across visits.

## Token ID

Visit-specific queue identity.

> **Token ID = Where is this patient in today's clinic queue?**

Example:

```text
Patient ID: P-1024

Visit 1 → Token A-12
Visit 2 → Token A-21
Visit 3 → Token B-07
```

Therefore:

- Patient ID = permanent identity
- Token ID = current visit/queue identity

---

# 7. Appointment Model

An appointment conceptually contains:
- Patient ID
- Doctor
- Clinic
- Date
- Appointment time
- Consultation type
- Appointment status

Consultation types:
- New Consultation
- Follow-up

**Queue priority decision:** New consultation and follow-up have the same queue priority in the MVP. Follow-up does not automatically jump ahead.

---

# 8. Booking and Live Queue Formation

Appointments may be booked in advance, including the previous day for the next day's clinic session.

Important distinction:

> **Booking order is not the same as live physical queue order.**

Example:

```text
Bookings:
A → #1
B → #2
C → #3
D → #4

Actual arrivals:
A → arrived
C → arrived
B → not arrived
D → not arrived
```

Live queue:

```text
A
C
```

The live queue is formed from patients who have actually checked in, not simply everyone who has an appointment.

---

# 9. QR Check-In

A single QR code is placed at the **clinic reception**.

The patient scans it after arriving at the clinic.

The QR code does not itself need to contain appointment data. Scanning starts the validation flow:

```text
Patient identified
      ↓
Today's appointments retrieved
      ↓
Appointment mapped
      ↓
Appointment validated
      ↓
Check-in allowed/rejected
```

Successful flow:

```text
BOOKED
   ↓
CHECKED_IN
   ↓
IN_QUEUE
```

After successful check-in, the patient receives a visit-specific Token ID.

---

# 10. Appointment Validation Rules

The system validates the patient against today's appointment(s).

## Tomorrow's appointment

If the patient scans today for an appointment tomorrow:

> Check-in rejected because the appointment is not valid today.

## Valid appointment

If the appointment is today and within the allowed check-in window:

> Check-in successful.

## Late patient

Each appointment has a defined valid check-in window.

Example:

```text
Appointment: 10:00 AM
Valid check-in: 9:45 AM – 10:15 AM
```

At 10:08 → check-in allowed.

At 10:40 → check-in window expired; reception handles the exception.

The key rule is that a late patient should not silently enter the normal queue without validation.

---

# 11. Multiple Appointments

A patient can have multiple appointments with different doctors in the same clinic on the same day.

Example:

```text
Today's Appointments

Dr. Sharma — 10:00 AM
Dr. Verma — 11:30 AM
```

The system maps the Patient ID to the patient's appointments and lets the patient select the relevant appointment during check-in.

---

# 12. State Ownership

The product explicitly defines who controls each state.

| State / Action | Primary Owner |
|---|---|
| Appointment created | System / Patient |
| BOOKED | System |
| CHECKED_IN | Reception / validated QR flow |
| IN_QUEUE | System after successful check-in |
| CHECK_UP | Doctor |
| DONE | Doctor |
| NO_SHOW | Reception |
| CANCELLED | Patient / Reception |
| URGENT | Authorized clinic/medical staff |

**Patient:** Can book, request cancellation, scan QR, and view queue. Patient should not manually set themselves to CHECK_UP or DONE.

**Receptionist:** Handles check-in, queue corrections, no-shows, walk-ins, late-arrival exceptions, and operational exceptions.

**Doctor:** Starts and completes consultations.

**System:** Calculates token/queue position, patients ahead, ETA, and synchronizes views.

Core philosophy:

> Patient tells the system “I want care.”
> Reception tells the system “the patient has arrived.”
> Doctor tells the system “consultation has started/ended.”
> System tells everyone where the patient is in the queue.

---

# 13. Queue Position Logic

Queue position should not be treated as a manually maintained number.

It should be derived from current patient states and queue order.

Example:

```text
A-14 → DONE
A-15 → CHECK_UP
A-16 → IN_QUEUE
A-17 → IN_QUEUE
A-18 → IN_QUEUE
```

The system understands:

```text
Current patient: A-15

A-16 → #1
A-17 → #2
A-18 → #3
```

Patient A-17 sees:

> You are #2 in queue.
> Patients ahead: 1.
> Currently consulting: A-15.

---

# 14. Doctor Workflow

Doctor has a portal/dashboard.

Doctor can see:
- Current patient
- Current Token ID
- Patient name
- Next patients
- Consultation type
- Patient profile
- Basic vitals
- Consultation timer
- Complete consultation action

Example:

```text
CURRENT PATIENT
Token: A-17
Name: Junaid Khan
Type: New Consultation

Vitals:
BP: 120/80
Sugar: 96 mg/dL
Weight: 68 kg

Consultation Time: 08:42

[ Complete Consultation ]

NEXT: A-18
```

---

# 15. Basic Patient Health Profile

The MVP intentionally includes only essential health information useful during consultation:

- Blood Pressure
- Blood Sugar
- Weight

This is **not** a full Electronic Medical Record system.

The purpose is to give the doctor basic context without expanding the MVP into a complete healthcare-record platform.

Detailed reports, prescriptions, historical charts, and extensive medical records are future scope.

---

# 16. Consultation Timer

When the doctor starts consultation:

```text
Patient: A-17
State: CHECK_UP
Timer: 00:08:42
```

When consultation is completed, the timer stops.

Example:

```text
Consultation duration: 09 min 18 sec
```

Actual consultation durations become data for waiting-time estimation.

---

# 17. ETA / Estimated Waiting Time

The MVP will show a **range**, not an exact promised time.

Example:

> Estimated wait: 25–40 min

Initial estimation can use:
- number of patients ahead;
- current consultation;
- recent/average consultation duration;
- doctor availability.

If 3 patients are ahead and average consultation time is 10 minutes, a basic estimate starts around 30 minutes, but the UI should show a range such as 25–40 minutes.

The product should never promise an exact consultation time because consultation duration varies.

---

# 18. Dynamic ETA Updates

Example:

```text
Initial:
Patients ahead: 3
Estimated wait: 25–40 min
```

After one consultation finishes:

```text
Patients ahead: 2
Estimated wait: 15–30 min
```

After another:

```text
Patients ahead: 1
Estimated wait: 8–15 min
```

When the patient becomes next:

> You're next. Please be ready for your consultation.

---

# 19. Real-Time Queue Synchronization

This is the primary differentiating feature.

The conceptual flow is:

```text
Doctor / Reception Action
          ↓
Patient State Changes
          ↓
Queue Recalculated
          ↓
Patient Screen Updated
          ↓
Doctor Screen Updated
          ↓
Reception Screen Updated
```

Example:

```text
A-15 → DONE
A-16 → CHECK_UP
A-17 → IN_QUEUE
```

Patient A-17 immediately sees their position improve.

When A-16 finishes:

```text
A-16 → DONE
A-17 → CHECK_UP
```

A-17 receives:

> You're next. Please proceed to the consultation room.

No manual refresh should be required.

---

# 20. Doctor State Effects

Doctor state directly affects what patients see.

## AVAILABLE

Normal queue operation.

## IN_CONSULTATION

Patient can see that the doctor is currently consulting and ETA uses current consultation + queue.

## ON_BREAK

Show that the doctor is temporarily unavailable rather than continuing to display a misleading ETA.

## ON_LEAVE

Affected appointments should receive an unavailable/rescheduling message.

## OFFLINE

Clearly indicate that the doctor is not currently active.

---

# 21. Urgent State

Normal consultation and follow-up patients have equal queue priority.

Urgency is an exception.

If authorized clinic/medical staff determine that a patient requires urgent handling:

```text
IN_QUEUE → URGENT
```

The product represents the state but does **not** independently diagnose or decide medical urgency.

Urgent is therefore an exception state, not a routine queue-priority category.

---

# 22. No-Show and Cancellation

If a patient is called but is not present:

```text
IN_QUEUE → NO_SHOW
```

If a visit is cancelled:

```text
IN_QUEUE → CANCELLED
```

These states prevent missing/cancelled patients from blocking the active queue.

---

# 23. Three Main Interfaces

## Patient Interface

Main information:
- Doctor
- Token
- Queue position
- Patients ahead
- Current patient
- Estimated wait
- Doctor status

Example:

```text
Dr. Sharma

Your Token: A-17
You are #2 in queue
Patients ahead: 1
Currently consulting: A-15
Estimated wait: 25–40 min
🟢 Clinic Active
```

## Reception Interface

Main information:
- Today's appointments
- Checked-in patients
- Current queue
- Current consultation
- Doctor state
- Exception controls

## Doctor Interface

Main information:
- Current patient
- Next patient
- Patient profile
- Basic vitals
- Consultation type
- Timer
- Complete consultation

---

# 24. Core Entities / Conceptual Relationships

```text
PATIENT
  │
  └── Patient ID
       │
       ├── Appointment 1
       │     └── Token
       │
       ├── Appointment 2
       │     └── Token
       │
       └── Appointment 3
             └── Token
```

Appointment connects:

```text
Patient + Doctor + Clinic + Date + Time + Consultation Type
```

Token represents the patient's actual queue participation for that visit.

---

# 25. MoSCoW MVP Scope

## 🔴 MUST-HAVE

- Patient ID
- Appointment booking
- Doctor selection
- Appointment date/time
- Consultation type
- Appointment validation
- Valid check-in window
- Reception QR check-in
- Token ID
- Patient state management
- Doctor state management
- Live queue
- Queue position
- Patients-ahead count
- Estimated waiting-time range
- Doctor dashboard
- Reception dashboard
- Start consultation
- Complete consultation
- Consultation timer
- Basic patient profile
- Basic vitals: BP, Sugar, Weight
- Real-time queue updates
- “You're next” / turn notification state

## 🟡 SHOULD-HAVE

- Appointment history
- Consultation type display
- No-show handling
- Queue correction
- Walk-in handling
- Basic notifications
- Multiple doctors
- Basic patient/doctor history

## 🟢 COULD-HAVE

- Advanced ETA prediction
- Detailed medical history
- Detailed reports
- Prescription management
- Historical vitals graphs
- Clinic analytics
- Advanced notifications
- SMS/WhatsApp
- Automated reminders
- Patient rescheduling

## ⚫ WON'T-HAVE

- Payments
- Insurance
- Full EMR
- Video consultation
- AI diagnosis
- AI medical recommendations
- Complex emergency management
- Multi-hospital ecosystem
- Advanced predictive AI
- Full billing
- Advanced prescription management

---

# 26. Four-Day MVP Plan

## Day 1 — Appointment + Check-in

Build:
- Patient ID
- Appointment booking
- Doctor selection
- Appointment date/time
- Consultation type
- Appointment validation
- Reception QR
- Check-in
- Token generation

Success condition:

> Patient can book → arrive → scan QR → get validated → receive Token.

## Day 2 — Queue + Doctor Workflow

Build:
- Patient state machine
- Doctor state
- Reception dashboard
- Doctor dashboard
- Queue ordering
- Start consultation
- Complete consultation
- Consultation timer
- Basic patient profile/vitals

Success condition:

> Doctor can see queue → call patient → start consultation → view patient information → complete consultation → move to next patient.

## Day 3 — Real-Time Queue

Build:
- Live queue synchronization
- Queue position
- Patients ahead
- ETA range
- Doctor state synchronization
- Turn notification

Success condition:

```text
Patient #3
 ↓
Doctor completes current patient
 ↓
Patient #2
 ↓
Another patient completes
 ↓
Patient #1
 ↓
You're next
```

## Day 4 — Edge Cases + Polish

Test:
- Valid appointment
- Tomorrow's appointment
- Expired check-in
- Multiple appointments
- Late arrival
- No-show
- Cancellation
- Walk-in
- Doctor break
- Doctor leave
- Long consultation
- Multiple patients
- Queue synchronization

Then polish:
- Patient UI
- Doctor UI
- Reception UI
- Loading/error states
- Queue status
- Demo data

---

# 27. MVP Success Metrics

## Primary

### Queue Position Accuracy
Does displayed position match the real clinic queue?

### State Accuracy
Does the system correctly represent BOOKED, CHECKED_IN, IN_QUEUE, CHECK_UP, and DONE?

### ETA Usefulness
Is the estimated waiting range reasonably close to actual waiting time?

### Real-Time Reliability
When doctor/reception changes the queue, does the patient view update correctly and quickly?

### Manual Correction Rate
How often does reception need to correct the digital queue?

A high correction rate may indicate that the workflow or queue rules do not match the real clinic.

---

# 28. Product Philosophy

The system should minimize manual state management.

### Patient
> “I want to know when my turn will come.”

### Receptionist
> “I need to know who has arrived and who is waiting.”

### Doctor
> “I need to know who I am consulting and who is next.”

### System
> “I synchronize all three.”

Reception primarily handles **check-in + exceptions**.

Doctor primarily handles **start + complete consultation**.

System handles **queue position + patients ahead + ETA + synchronization**.

---

# 29. Complete Patient Flow

```text
PATIENT
   ↓
BOOK APPOINTMENT
   ↓
PATIENT ID
   ↓
APPOINTMENT DAY
   ↓
ARRIVE AT CLINIC
   ↓
SCAN RECEPTION QR
   ↓
VALIDATE APPOINTMENT
   ↓
CHECKED_IN
   ↓
TOKEN GENERATED
   ↓
IN_QUEUE
   ↓
LIVE QUEUE POSITION
   ↓
ESTIMATED WAIT RANGE
   ↓
DOCTOR CALLS PATIENT
   ↓
CHECK_UP
   ↓
CONSULTATION TIMER
   ↓
DOCTOR VIEWS BASIC PROFILE + VITALS
   ↓
CONSULTATION COMPLETE
   ↓
DONE
   ↓
NEXT PATIENT
   ↓
QUEUE UPDATES IN REAL TIME
```

---

# 30. Product Definition

> **QureFlow is a real-time clinic queue management platform that connects appointment booking, QR check-in, live token tracking, consultation workflow, and estimated waiting time for patients, receptionists, and doctors.**

---

# 31. Core Validation Question

> **Can we replace “How long will I have to wait?” with reliable, real-time information about a patient's actual place in the clinic queue?**

If this is validated, the core product concept has been validated.

---

# 32. Scope Guardrail

QureFlow should not become a generic healthcare super-app during the MVP.

The 4-day prototype stays centered around:

> **Appointment → Check-in → Token → Queue → ETA → Consultation → Done**

Everything outside this loop is secondary until the core workflow works reliably.
