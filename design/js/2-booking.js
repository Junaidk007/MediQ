/**
 * QureFlow Design System — Screen 2: Doctor Discovery & Appointment Booking Logic
 * Manages slot selection, date picker, visit types, booking confirmation, and 4 UI states.
 */

let selectedDoctor = 'Dr. Rajesh Sharma';
let selectedVisitType = 'New Consultation';
let selectedDate = 'Today, Sep 26';
let selectedSlot = '11:00 AM';
let currentBookingState = 'normal';

/* ==========================================================================
   Slot & Option Selection Handlers
   ========================================================================== */
function selectSlot(chipElement, slotTime) {
  if (chipElement.classList.contains('booked')) return;

  // Clear previous selections
  document.querySelectorAll('.slot-chip').forEach(chip => {
    chip.classList.remove('selected');
  });

  // Apply selection
  chipElement.classList.add('selected');
  selectedSlot = slotTime;

  // Update summary
  document.getElementById('sum-slot').textContent = selectedSlot;
  document.getElementById('modal-slot-text').textContent = `${selectedDate} at ${selectedSlot}`;
  
  // Enable CTA
  const cta = document.getElementById('book-slot-cta');
  cta.disabled = false;
  cta.style.opacity = '1';

  hideToast();
}

function selectVisitType(type) {
  selectedVisitType = type === 'NEW' ? 'New Consultation' : 'Follow-Up / Reports';
  document.getElementById('type-new').classList.toggle('active', type === 'NEW');
  document.getElementById('type-followup').classList.toggle('active', type === 'FOLLOW-UP');
  document.getElementById('sum-type').textContent = selectedVisitType;
}

function selectDate(pillElement, dateString, openSlots) {
  if (pillElement.classList.contains('disabled')) return;

  document.querySelectorAll('.date-pill').forEach(pill => {
    pill.classList.remove('active');
  });

  pillElement.classList.add('active');
  selectedDate = dateString;
  document.getElementById('sum-date').textContent = selectedDate;
  document.getElementById('modal-slot-text').textContent = `${selectedDate} at ${selectedSlot}`;

  if (openSlots === 0) {
    setBookingState('empty');
  } else {
    document.getElementById('slots-content-area').style.display = 'block';
    document.getElementById('empty-state-view').style.display = 'none';
  }
}

/* ==========================================================================
   Primary Action (CTA) Handler
   ========================================================================== */
function handleConfirmBooking() {
  if (!selectedSlot) return;

  setBookingState('loading');
  setTimeout(() => {
    setBookingState('success');
  }, 1000);
}

function closeSuccessModal() {
  document.getElementById('success-modal').style.display = 'none';
  setBookingState('normal');
}

/* ==========================================================================
   4 UI States Simulator (Interactive, Loading, Empty, Error, Success)
   ========================================================================== */
function setBookingState(state) {
  currentBookingState = state;

  // Update top tester buttons
  ['normal', 'loading', 'empty', 'error', 'success'].forEach(s => {
    const btn = document.getElementById(`state-${s}-btn`);
    if (btn) btn.classList.toggle('active', s === state);
  });

  const slotsArea = document.getElementById('slots-content-area');
  const emptyView = document.getElementById('empty-state-view');
  const successModal = document.getElementById('success-modal');
  const cta = document.getElementById('book-slot-cta');

  // 1. LOADING STATE
  if (state === 'loading') {
    slotsArea.style.display = 'block';
    emptyView.style.display = 'none';
    hideToast();
    successModal.style.display = 'none';

    cta.disabled = true;
    cta.style.opacity = '0.85';
    cta.innerHTML = '<div class="spinner" style="border-top-color:#FFF;"></div> <span>Securing appointment slot...</span>';
    
    // Add temporary shimmer to slots grid
    document.querySelectorAll('.slot-chip').forEach(c => c.style.opacity = '0.4');
  } 
  // 2. EMPTY STATE (No Slots)
  else if (state === 'empty') {
    slotsArea.style.display = 'none';
    emptyView.style.display = 'block';
    hideToast();
    successModal.style.display = 'none';
    restoreCta();
    cta.disabled = true;
    cta.style.opacity = '0.5';
    document.getElementById('sum-slot').textContent = 'No slot selected';
  }
  // 3. ERROR STATE (Slot Conflict)
  else if (state === 'error') {
    slotsArea.style.display = 'block';
    emptyView.style.display = 'none';
    successModal.style.display = 'none';
    restoreCta();

    // Show Conflict Toast
    showToast('⚠️ Slot Conflict: 11:00 AM was just booked by another patient. We have highlighted the next available slot.');

    // Mark 11:00 AM as booked and auto-shift selection to 11:30 AM
    document.querySelectorAll('.slot-chip').forEach(chip => {
      chip.classList.remove('selected');
      if (chip.textContent.trim() === '11:00 AM') {
        chip.classList.add('booked');
        chip.disabled = true;
      }
      if (chip.textContent.trim() === '11:30 AM') {
        chip.classList.add('selected');
        selectedSlot = '11:30 AM';
        document.getElementById('sum-slot').textContent = '11:30 AM';
      }
    });
  }
  // 4. SUCCESS STATE (Confirmation Modal)
  else if (state === 'success') {
    slotsArea.style.display = 'block';
    emptyView.style.display = 'none';
    hideToast();
    restoreCta();
    successModal.style.display = 'flex';
  }
  // 5. NORMAL / INTERACTIVE DEFAULT
  else {
    slotsArea.style.display = 'block';
    emptyView.style.display = 'none';
    successModal.style.display = 'none';
    hideToast();
    restoreCta();
    document.querySelectorAll('.slot-chip').forEach(c => c.style.opacity = '1');
  }
}

function restoreCta() {
  const cta = document.getElementById('book-slot-cta');
  cta.disabled = false;
  cta.style.opacity = '1';
  cta.innerHTML = '<span id="book-cta-text">Confirm & Book Slot</span>';
}

function showToast(msg) {
  const toast = document.getElementById('booking-toast');
  const toastMsg = document.getElementById('toast-message');
  toastMsg.textContent = msg;
  toast.style.display = 'block';
}

function hideToast() {
  const toast = document.getElementById('booking-toast');
  if (toast) toast.style.display = 'none';
}
