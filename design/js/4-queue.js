/**
 * QureFlow Design System — Screen 4: Patient Live Queue & ETA Tracker Logic
 * Manages live WebSocket sync simulation, consult timer, stepper progression, and 4 UI states.
 */

let consultSeconds = 522; // 08:42
let timerInterval = null;
let currentQueueState = 'normal';

document.addEventListener('DOMContentLoaded', () => {
  startConsultTimer();
});

/* ==========================================================================
   Live Consultation Timer (Simulating Doctor Encounter)
   ========================================================================== */
function startConsultTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    consultSeconds++;
    const mins = Math.floor(consultSeconds / 60).toString().padStart(2, '0');
    const secs = (consultSeconds % 60).toString().padStart(2, '0');
    const timerElem = document.getElementById('consult-timer');
    if (timerElem) timerElem.textContent = `${mins}:${secs}`;
  }, 1000);
}

/* ==========================================================================
   Primary Action: Manual & Auto WebSocket Refresh
   ========================================================================== */
function triggerRefresh() {
  const cta = document.getElementById('primary-refresh-cta');
  const originalHtml = cta.innerHTML;

  cta.disabled = true;
  cta.style.opacity = '0.85';
  cta.innerHTML = '<div class="spinner" style="border-top-color:#FFF;"></div> <span>Syncing live queue...</span>';

  setTimeout(() => {
    cta.disabled = false;
    cta.style.opacity = '1';
    cta.innerHTML = originalHtml;
    setQueueState('normal');
  }, 900);
}

function cancelVisit() {
  if (confirm('Are you sure you want to leave the queue? Your token #A-14 will be cancelled and given to the next waiting patient.')) {
    setQueueState('empty');
  }
}

/* ==========================================================================
   Turn Alert Handlers
   ========================================================================== */
function acknowledgeTurn() {
  document.getElementById('turn-alert-modal').style.display = 'none';
  
  // Advance stepper to Step 4: Consulting
  document.getElementById('step-3').className = 'step-item completed';
  document.getElementById('step-3').querySelector('.step-node').textContent = '✓';
  
  document.getElementById('step-4').className = 'step-item active';
  document.getElementById('stepper-line-fill').style.width = '75%';
  document.getElementById('stepper-percentage').textContent = 'Step 4 of 5 (In Room)';

  // Update metrics
  document.getElementById('metric-ahead').textContent = '0';
  document.getElementById('metric-eta').textContent = 'Now';
  document.getElementById('metric-serving').textContent = '#A-14 (You)';
  document.getElementById('hero-status-pill').textContent = '● Status: In Consultation (CHECK_UP)';
  document.getElementById('hero-status-pill').className = 'badge badge-green';
}

function dismissTurnModal() {
  document.getElementById('turn-alert-modal').style.display = 'none';
}

/* ==========================================================================
   4 UI States Simulator (Normal, Loading, Empty, Error, Success/Turn)
   ========================================================================== */
function setQueueState(state) {
  currentQueueState = state;

  // Update top tester buttons
  ['normal', 'loading', 'empty', 'error', 'success'].forEach(s => {
    const btn = document.getElementById(`state-${s}-btn`);
    if (btn) btn.classList.toggle('active', s === state);
  });

  const activeQueueView = document.getElementById('active-queue-view');
  const emptyQueueView = document.getElementById('empty-queue-view');
  const offlineAlert = document.getElementById('queue-offline-alert');
  const turnModal = document.getElementById('turn-alert-modal');
  const liveIndicator = document.getElementById('live-indicator');
  const cta = document.getElementById('primary-refresh-cta');

  // 1. LOADING STATE
  if (state === 'loading') {
    activeQueueView.style.display = 'block';
    emptyQueueView.style.display = 'none';
    offlineAlert.style.display = 'none';
    turnModal.style.display = 'none';

    liveIndicator.style.background = '#F1F5F9';
    liveIndicator.style.color = '#64748B';
    liveIndicator.style.borderColor = '#CBD5E1';
    document.getElementById('live-sync-text').textContent = 'Reconnecting...';

    cta.disabled = true;
    cta.style.opacity = '0.85';
    cta.innerHTML = '<div class="spinner" style="border-top-color:#FFF;"></div> <span>Connecting to Queue Engine...</span>';

    // Temporary opacity dimming
    document.querySelectorAll('.metric-val').forEach(v => v.style.opacity = '0.3');
  } 
  // 2. EMPTY STATE (No Active Token Today)
  else if (state === 'empty') {
    activeQueueView.style.display = 'none';
    emptyQueueView.style.display = 'block';
    offlineAlert.style.display = 'none';
    turnModal.style.display = 'none';
  } 
  // 3. ERROR STATE (Offline / Sync Drop)
  else if (state === 'error') {
    activeQueueView.style.display = 'block';
    emptyQueueView.style.display = 'none';
    turnModal.style.display = 'none';
    offlineAlert.style.display = 'block';

    liveIndicator.style.background = '#FEF2F2';
    liveIndicator.style.color = '#EF4444';
    liveIndicator.style.borderColor = '#FECACA';
    document.getElementById('live-sync-text').textContent = 'Sync Offline';

    cta.disabled = false;
    cta.style.opacity = '1';
    cta.innerHTML = '<span id="refresh-cta-text">Reconnect & Sync</span>';
  } 
  // 4. SUCCESS STATE (Doctor Calls Patient)
  else if (state === 'success') {
    activeQueueView.style.display = 'block';
    emptyQueueView.style.display = 'none';
    offlineAlert.style.display = 'none';
    resetLiveIndicator();
    turnModal.style.display = 'flex';
  } 
  // 5. NORMAL / INTERACTIVE LIVE
  else {
    activeQueueView.style.display = 'block';
    emptyQueueView.style.display = 'none';
    offlineAlert.style.display = 'none';
    turnModal.style.display = 'none';
    resetLiveIndicator();

    cta.disabled = false;
    cta.style.opacity = '1';
    cta.innerHTML = '<span id="refresh-cta-text">Refresh Live Status</span>';
    document.querySelectorAll('.metric-val').forEach(v => v.style.opacity = '1');
  }
}

function resetLiveIndicator() {
  const liveIndicator = document.getElementById('live-indicator');
  liveIndicator.style.background = 'var(--color-success-bg)';
  liveIndicator.style.color = 'var(--color-success)';
  liveIndicator.style.borderColor = 'var(--color-success-border)';
  document.getElementById('live-sync-text').textContent = 'Live Sync Active';
}
