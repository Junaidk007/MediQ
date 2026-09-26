/**
 * QureFlow Design System — Screen 3: QR Arrival Check-In Logic
 * Manages QR camera scanner simulation, arrival window validation, token issuance, and 4 UI states.
 */

let currentCheckinState = 'normal';

/* ==========================================================================
   Scanner Actions & Simulation
   ========================================================================== */
function simulateQrScan() {
  setCheckinState('loading');
  setTimeout(() => {
    setCheckinState('success');
  }, 1200);
}

function toggleManualCode() {
  const box = document.getElementById('manual-code-box');
  box.style.display = box.style.display === 'none' || box.style.display === '' ? 'block' : 'none';
  if (box.style.display === 'block') {
    document.getElementById('manual-code-input').focus();
  }
}

function submitManualCode() {
  const code = document.getElementById('manual-code-input').value.trim();
  if (code.length < 3) {
    showAlert('Please enter the code displayed on the clinic standee (e.g. APL-102).');
    return;
  }
  simulateQrScan();
}

function closeTokenModal() {
  document.getElementById('token-success-modal').style.display = 'none';
  setCheckinState('normal');
}

/* ==========================================================================
   4 UI States Simulator (Interactive, Loading, Empty, Error, Success)
   ========================================================================== */
function setCheckinState(state) {
  currentCheckinState = state;

  // Update top tester buttons
  ['normal', 'loading', 'empty', 'error', 'success'].forEach(s => {
    const btn = document.getElementById(`state-${s}-btn`);
    if (btn) btn.classList.toggle('active', s === state);
  });

  const apptCard = document.getElementById('appt-card');
  const scannerWrapper = document.getElementById('scanner-wrapper');
  const emptyView = document.getElementById('empty-appt-state');
  const modal = document.getElementById('token-success-modal');
  const cta = document.getElementById('primary-scan-cta');
  const scanInstruction = document.getElementById('scanner-instruction');

  // 1. LOADING STATE
  if (state === 'loading') {
    apptCard.style.display = 'block';
    scannerWrapper.style.display = 'block';
    emptyView.style.display = 'none';
    modal.style.display = 'none';
    hideAlert();

    cta.disabled = true;
    cta.style.opacity = '0.85';
    cta.innerHTML = '<div class="spinner" style="border-top-color:#FFF;"></div> <span>Validating clinic check-in...</span>';
    scanInstruction.textContent = '⚡ QR Code Detected! Verifying booking & arrival window...';
  }
  // 2. EMPTY STATE (No Booking for Today)
  else if (state === 'empty') {
    apptCard.style.display = 'none';
    scannerWrapper.style.display = 'none';
    emptyView.style.display = 'block';
    modal.style.display = 'none';
    hideAlert();
  }
  // 3. ERROR STATE (Window Expired / Outside ±15 min)
  else if (state === 'error') {
    apptCard.style.display = 'block';
    scannerWrapper.style.display = 'block';
    emptyView.style.display = 'none';
    modal.style.display = 'none';
    restoreCta();

    showAlert('⚠️ Check-In Window Closed: Current time is outside the permitted 15-minute arrival window. Please approach reception to re-slot.');
    
    const windowPill = document.getElementById('window-status-pill');
    windowPill.className = 'badge badge-red';
    windowPill.textContent = '● Window Closed / Late';
  }
  // 4. SUCCESS STATE (Token Generated)
  else if (state === 'success') {
    apptCard.style.display = 'block';
    scannerWrapper.style.display = 'block';
    emptyView.style.display = 'none';
    hideAlert();
    restoreCta();
    modal.style.display = 'flex';
  }
  // 5. NORMAL / INTERACTIVE DEFAULT
  else {
    apptCard.style.display = 'block';
    scannerWrapper.style.display = 'block';
    emptyView.style.display = 'none';
    modal.style.display = 'none';
    hideAlert();
    restoreCta();

    const windowPill = document.getElementById('window-status-pill');
    windowPill.className = 'badge badge-green';
    windowPill.textContent = '● Check-In Open (±15m)';
    scanInstruction.textContent = 'Align clinic reception QR code within the frame';
  }
}

function restoreCta() {
  const cta = document.getElementById('primary-scan-cta');
  cta.disabled = false;
  cta.style.opacity = '1';
  cta.innerHTML = '<span id="scan-cta-text">Scan Clinic QR Code</span>';
}

function showAlert(message) {
  const alertBox = document.getElementById('checkin-alert');
  const alertText = document.getElementById('checkin-alert-text');
  alertText.textContent = message;
  alertBox.style.display = 'block';
}

function hideAlert() {
  const alertBox = document.getElementById('checkin-alert');
  if (alertBox) alertBox.style.display = 'none';
}
