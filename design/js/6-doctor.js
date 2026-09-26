/**
 * QureFlow Design System — Screen 6: Doctor Consultation & Vitals Desk Logic
 * Manages active encounter timer, vitals recording, queue advancing, and 4 UI states.
 */

let doctorTimerSeconds = 522; // 08:42
let docTimerInterval = null;
let currentDoctorState = 'normal';
let isCallNextTriggered = false;

document.addEventListener('DOMContentLoaded', () => {
  startDoctorTimer();
});

/* ==========================================================================
   Consultation Timer
   ========================================================================== */
function startDoctorTimer() {
  clearInterval(docTimerInterval);
  docTimerInterval = setInterval(() => {
    doctorTimerSeconds++;
    const mins = Math.floor(doctorTimerSeconds / 60).toString().padStart(2, '0');
    const secs = (doctorTimerSeconds % 60).toString().padStart(2, '0');
    const elem = document.getElementById('live-consult-timer');
    if (elem) elem.textContent = `${mins}:${secs}`;
  }, 1000);
}

/* ==========================================================================
   Primary Action: Complete Consult & Call Next Patient
   ========================================================================== */
function handleCompleteConsultation() {
  setDoctorState('loading');

  setTimeout(() => {
    setDoctorState('normal');

    if (!isCallNextTriggered) {
      // Advance from #A-11 (Amit Mehra) to #A-12 (Sunita Rao)
      isCallNextTriggered = true;

      document.getElementById('patient-name-display').textContent = 'Sunita Rao';
      document.getElementById('patient-meta-display').textContent = 'Female, 46 yrs • ID: #P-9014 • Walk-in: Joint Pain & Swelling';
      document.getElementById('patient-token-display').textContent = '#A-12';
      
      // Reset timer
      doctorTimerSeconds = 0;
      
      // Clear/Reset Vitals for new patient
      document.getElementById('vit-bp').value = '130/85';
      document.getElementById('vit-sugar').value = '112';
      document.getElementById('vit-weight').value = '64.0';
      document.getElementById('vit-notes').value = '';

      // Update Up Next List
      const next1 = document.getElementById('next-1');
      if (next1) next1.remove();
      document.getElementById('upnext-count').textContent = '2 Waiting';

      // Update CTA text
      document.getElementById('complete-cta-text').textContent = 'Complete Consult & Call Next (#A-13) →';

      // Visual flash
      highlightCard();
    } else {
      // Clear queue
      setDoctorState('empty');
    }
  }, 1000);
}

function highlightCard() {
  const card = document.getElementById('encounter-card');
  card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
  card.style.borderColor = 'var(--color-secondary-blue)';
  card.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
  setTimeout(() => {
    card.style.borderColor = 'var(--color-border)';
    card.style.boxShadow = 'var(--shadow-card)';
  }, 1000);
}

/* ==========================================================================
   Doctor Availability Mode
   ========================================================================== */
function toggleDoctorAvailability(mode) {
  const btnActive = document.getElementById('btn-status-active');
  const btnBreak = document.getElementById('btn-status-break');

  if (mode === 'ACTIVE') {
    btnActive.classList.add('active');
    btnBreak.classList.remove('active');
    btnActive.textContent = '● Ready / Active';
  } else {
    btnActive.classList.remove('active');
    btnBreak.classList.add('active');
    alert('☕ Break mode activated: 10-minute pause broadcasted to reception and patient live queue.');
  }
}

function hideDocAlert() {
  document.getElementById('doctor-error-alert').style.display = 'none';
}

/* ==========================================================================
   4 UI States Simulator (Normal, Loading, Empty, Error)
   ========================================================================== */
function setDoctorState(state) {
  currentDoctorState = state;

  // Update top tester buttons
  ['normal', 'loading', 'empty', 'error'].forEach(s => {
    const btn = document.getElementById(`state-${s}-btn`);
    if (btn) btn.classList.toggle('active', s === state);
  });

  const encounterView = document.getElementById('active-encounter-view');
  const asideView = document.querySelector('aside');
  const emptyView = document.getElementById('empty-doctor-view');
  const errorAlert = document.getElementById('doctor-error-alert');
  const cta = document.getElementById('primary-complete-cta');

  // 1. LOADING STATE
  if (state === 'loading') {
    encounterView.style.display = 'block';
    asideView.style.display = 'block';
    emptyView.style.display = 'none';
    errorAlert.style.display = 'none';

    cta.disabled = true;
    cta.style.opacity = '0.85';
    cta.innerHTML = '<div class="spinner" style="border-top-color:#FFF;"></div> <span>Saving vitals & advancing queue...</span>';
    
    document.querySelectorAll('.vitals-card input, .vitals-card textarea').forEach(el => el.disabled = true);
  } 
  // 2. EMPTY STATE
  else if (state === 'empty') {
    encounterView.style.display = 'none';
    asideView.style.display = 'none';
    emptyView.style.display = 'block';
    errorAlert.style.display = 'none';
  } 
  // 3. ERROR STATE
  else if (state === 'error') {
    encounterView.style.display = 'block';
    asideView.style.display = 'block';
    emptyView.style.display = 'none';
    errorAlert.style.display = 'block';
    restoreDocCta();
  } 
  // 4. NORMAL STATE
  else {
    encounterView.style.display = 'block';
    asideView.style.display = 'block';
    emptyView.style.display = 'none';
    errorAlert.style.display = 'none';
    restoreDocCta();
    document.querySelectorAll('.vitals-card input, .vitals-card textarea').forEach(el => el.disabled = false);
  }
}

function restoreDocCta() {
  const cta = document.getElementById('primary-complete-cta');
  cta.disabled = false;
  cta.style.opacity = '1';
  const nextTarget = isCallNextTriggered ? 'Call Next (#A-13)' : 'Call Next (#A-12)';
  cta.innerHTML = `<span id="complete-cta-text">Complete Consult & ${nextTarget} →</span>`;
}
