/**
 * QureFlow Design System — Screen 1: Auth & Role Gateway Logic
 * Implements 4 UI States (Loading, Empty, Error, Success) and Multi-Role Switching.
 */

// State tracking
let currentRole = 'patient'; // 'patient' | 'staff'
let currentStep = 'phone';   // 'phone' | 'otp'
let selectedStaffSubrole = 'DOCTOR';
let countdownInterval = null;
let currentScreenState = 'empty'; // 'empty' | 'loading' | 'error' | 'success'

document.addEventListener('DOMContentLoaded', () => {
  initOtpInputs();
});

/* ==========================================================================
   Role Switching
   ========================================================================== */
function switchRole(role) {
  currentRole = role;

  // Update tabs
  document.getElementById('tab-patient').classList.toggle('active', role === 'patient');
  document.getElementById('tab-staff').classList.toggle('active', role === 'staff');
  document.getElementById('tab-patient').setAttribute('aria-selected', role === 'patient');
  document.getElementById('tab-staff').setAttribute('aria-selected', role === 'staff');

  // Update top tester buttons
  document.getElementById('role-patient-btn').classList.toggle('active', role === 'patient');
  document.getElementById('role-staff-btn').classList.toggle('active', role === 'staff');

  // Switch form visibility
  document.getElementById('patient-form').style.display = role === 'patient' ? 'block' : 'none';
  document.getElementById('staff-form').style.display = role === 'staff' ? 'block' : 'none';

  // Subtitle
  const subtitle = document.getElementById('role-subtitle');
  if (role === 'patient') {
    subtitle.textContent = 'Synchronized queue management for patients & clinics';
  } else {
    subtitle.textContent = 'Clinic provider & desk administration portal';
  }

  hideAlert();
  resetStateToEmpty();
}

function selectStaffSubrole(subrole) {
  selectedStaffSubrole = subrole;
  document.getElementById('subrole-doctor').classList.toggle('active', subrole === 'DOCTOR');
  document.getElementById('subrole-reception').classList.toggle('active', subrole === 'RECEPTIONIST');
  
  const ctaText = document.getElementById('staff-cta-text');
  ctaText.textContent = subrole === 'DOCTOR' ? 'Sign In to Doctor Console' : 'Sign In to Reception Desk';
}

/* ==========================================================================
   Patient Flow: Phone & OTP Handlers
   ========================================================================== */
function onPhoneInput(input) {
  // Strip non-numeric characters
  input.value = input.value.replace(/\D/g, '');
  const isValid = input.value.length === 10;
  const cta = document.getElementById('patient-primary-cta');

  if (currentStep === 'phone') {
    cta.disabled = !isValid;
    cta.style.opacity = isValid ? '1' : '0.5';
  }

  input.classList.remove('is-error');
  hideAlert();
}

function editPhoneNumber() {
  currentStep = 'phone';
  document.getElementById('group-phone').style.display = 'block';
  document.getElementById('otp-section').style.display = 'none';
  const ctaText = document.getElementById('patient-cta-text');
  ctaText.textContent = 'Get OTP & Continue';
  document.getElementById('phone-input').focus();
  clearInterval(countdownInterval);
}

function initOtpInputs() {
  const otpFields = document.querySelectorAll('.otp-field');
  
  otpFields.forEach((field, index) => {
    field.addEventListener('input', (e) => {
      field.value = field.value.replace(/\D/g, '');
      field.classList.remove('is-error');

      if (field.value && index < otpFields.length - 1) {
        otpFields[index + 1].focus();
      }

      checkOtpCompletion();
    });

    field.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !field.value && index > 0) {
        otpFields[index - 1].focus();
      }
    });

    field.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
      const digits = pasteData.replace(/\D/g, '').slice(0, 6);
      
      digits.split('').forEach((digit, i) => {
        if (otpFields[i]) otpFields[i].value = digit;
      });

      if (digits.length > 0) {
        const nextIndex = Math.min(digits.length, otpFields.length - 1);
        otpFields[nextIndex].focus();
      }

      checkOtpCompletion();
    });
  });
}

function checkOtpCompletion() {
  const otpFields = document.querySelectorAll('.otp-field');
  const allFilled = Array.from(otpFields).every(f => f.value.length === 1);
  const cta = document.getElementById('patient-primary-cta');

  if (currentStep === 'otp') {
    cta.disabled = !allFilled;
    cta.style.opacity = allFilled ? '1' : '0.5';
  }
}

function startOtpCountdown() {
  let timeLeft = 28;
  const timerSec = document.getElementById('timer-sec');
  const countdownText = document.getElementById('countdown-text');
  const resendLink = document.getElementById('resend-link');

  countdownText.style.display = 'inline';
  resendLink.classList.add('disabled');
  timerSec.textContent = timeLeft;

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    timeLeft--;
    timerSec.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      countdownText.style.display = 'none';
      resendLink.classList.remove('disabled');
    }
  }, 1000);
}

function resendOtp() {
  startOtpCountdown();
  showAlert('success', 'New 6-digit verification code sent to +91 ' + document.getElementById('phone-input').value);
}

/* ==========================================================================
   Staff Flow Handlers
   ========================================================================== */
function onStaffInput() {
  const staffId = document.getElementById('staff-id').value.trim();
  const staffPass = document.getElementById('staff-pass').value.trim();
  const cta = document.getElementById('staff-primary-cta');

  const isValid = staffId.length >= 3 && staffPass.length >= 4;
  cta.disabled = !isValid;
  cta.style.opacity = isValid ? '1' : '0.5';
  
  document.getElementById('staff-id').classList.remove('is-error');
  document.getElementById('staff-pass').classList.remove('is-error');
  hideAlert();
}

/* ==========================================================================
   Form Submission Handling
   ========================================================================== */
function handlePatientSubmit(event) {
  event.preventDefault();

  if (currentStep === 'phone') {
    // Transition to OTP step
    currentStep = 'otp';
    document.getElementById('group-phone').style.display = 'none';
    document.getElementById('otp-section').style.display = 'block';
    document.getElementById('patient-cta-text').textContent = 'Verify & Continue';
    document.getElementById('patient-primary-cta').disabled = true;
    document.getElementById('patient-primary-cta').style.opacity = '0.5';
    startOtpCountdown();
    document.querySelector('.otp-field[data-index="0"]').focus();
    return;
  }

  // Trigger loading state and mock verification
  setScreenState('loading');
  setTimeout(() => {
    setScreenState('success');
  }, 1200);
}

function handleStaffSubmit(event) {
  event.preventDefault();
  setScreenState('loading');
  setTimeout(() => {
    setScreenState('success');
  }, 1200);
}

/* ==========================================================================
   4 UI States Simulator (Empty, Loading, Error, Success)
   ========================================================================== */
function setScreenState(state) {
  currentScreenState = state;

  // Update tester buttons
  ['empty', 'loading', 'error', 'success'].forEach(s => {
    document.getElementById(`state-${s}-btn`).classList.toggle('active', s === state);
  });

  const patientCta = document.getElementById('patient-primary-cta');
  const staffCta = document.getElementById('staff-primary-cta');
  const activeCta = currentRole === 'patient' ? patientCta : staffCta;
  const ctaTextId = currentRole === 'patient' ? 'patient-cta-text' : 'staff-cta-text';

  // 1. LOADING STATE
  if (state === 'loading') {
    activeCta.disabled = true;
    activeCta.style.opacity = '0.85';
    activeCta.innerHTML = '<div class="spinner"></div> <span>Verifying credentials...</span>';
    setInputsDisabled(true);
    hideAlert();
  } 
  // 2. EMPTY STATE
  else if (state === 'empty') {
    resetStateToEmpty();
  }
  // 3. ERROR STATE
  else if (state === 'error') {
    setInputsDisabled(false);
    restoreCtaText();
    
    if (currentRole === 'patient') {
      if (currentStep === 'phone') {
        const phone = document.getElementById('phone-input');
        phone.classList.add('is-error');
        phone.focus();
        showAlert('error', '⚠️ Please enter a valid 10-digit mobile number.');
      } else {
        document.querySelectorAll('.otp-field').forEach(f => f.classList.add('is-error'));
        showAlert('error', '⚠️ Incorrect OTP code. 2 attempts remaining.');
      }
    } else {
      document.getElementById('staff-id').classList.add('is-error');
      document.getElementById('staff-pass').classList.add('is-error');
      showAlert('error', '⚠️ Invalid staff credentials or unassigned clinic.');
    }
  }
  // 4. SUCCESS STATE
  else if (state === 'success') {
    setInputsDisabled(false);
    restoreCtaText();
    
    if (currentRole === 'patient') {
      showAlert('success', '✓ Phone verified! Opening Patient Home Dashboard...');
      setTimeout(() => { window.location.href = 'patient-home.html'; }, 1400);
    } else {
      const deskName = selectedStaffSubrole === 'DOCTOR' ? 'Doctor Consultation Desk (Screen 6)' : 'Reception Triage Console (Screen 5)';
      showAlert('success', `✓ Staff authenticated! Opening ${deskName}...`);
      setTimeout(() => {
        window.location.href = selectedStaffSubrole === 'DOCTOR' ? '6-doctor.html' : '5-reception.html';
      }, 1400);
    }
  }
}

function resetStateToEmpty() {
  setInputsDisabled(false);
  hideAlert();
  
  if (currentRole === 'patient') {
    currentStep = 'phone';
    document.getElementById('group-phone').style.display = 'block';
    document.getElementById('otp-section').style.display = 'none';
    const phoneInput = document.getElementById('phone-input');
    phoneInput.value = '';
    phoneInput.classList.remove('is-error');
    
    document.querySelectorAll('.otp-field').forEach(f => {
      f.value = '';
      f.classList.remove('is-error');
    });

    const cta = document.getElementById('patient-primary-cta');
    cta.disabled = true;
    cta.style.opacity = '0.5';
    document.getElementById('patient-cta-text').textContent = 'Get OTP & Continue';
  } else {
    document.getElementById('staff-id').value = '';
    document.getElementById('staff-pass').value = '';
    document.getElementById('staff-id').classList.remove('is-error');
    document.getElementById('staff-pass').classList.remove('is-error');

    const cta = document.getElementById('staff-primary-cta');
    cta.disabled = true;
    cta.style.opacity = '0.5';
    restoreCtaText();
  }
}

function restoreCtaText() {
  const patientCta = document.getElementById('patient-primary-cta');
  const staffCta = document.getElementById('staff-primary-cta');

  if (currentStep === 'phone') {
    patientCta.innerHTML = '<span id="patient-cta-text">Get OTP & Continue</span>';
  } else {
    patientCta.innerHTML = '<span id="patient-cta-text">Verify & Continue</span>';
  }

  const staffText = selectedStaffSubrole === 'DOCTOR' ? 'Sign In to Doctor Console' : 'Sign In to Reception Desk';
  staffCta.innerHTML = `<span id="staff-cta-text">${staffText}</span>`;
}

function setInputsDisabled(disabled) {
  document.querySelectorAll('input, select').forEach(el => {
    el.disabled = disabled;
  });
}

function showAlert(type, message) {
  const alertBox = document.getElementById('alert-box');
  alertBox.className = type === 'error' ? 'alert alert-error' : 'alert alert-success';
  alertBox.textContent = message;
  alertBox.style.display = 'flex';
}

function hideAlert() {
  const alertBox = document.getElementById('alert-box');
  alertBox.style.display = 'none';
}
