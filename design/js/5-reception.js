/**
 * QureFlow Design System — Screen 5: Reception Queue & Triage Console Logic
 * Manages walk-in generation, triage reordering, no-show exception handling, and 4 UI states.
 */

let currentReceptionState = 'normal';
let waitingCount = 8;
let noShowCount = 2;

/* ==========================================================================
   Walk-in Drawer Handlers
   ========================================================================== */
function openWalkInDrawer() {
  document.getElementById('walkin-drawer').style.display = 'flex';
  document.getElementById('wi-name').focus();
}

function closeWalkInDrawer() {
  document.getElementById('walkin-drawer').style.display = 'none';
  document.getElementById('walkin-form').reset();
}

function handleWalkInSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('wi-name').value.trim();
  const phone = document.getElementById('wi-phone').value.trim();
  const doctor = document.getElementById('wi-doctor').value;
  const isUrgent = document.getElementById('wi-urgent').checked;

  const newToken = isUrgent ? '#A-15 (URGENT)' : '#A-15';
  const tbody = document.getElementById('queue-tbody');

  const newRow = document.createElement('tr');
  if (isUrgent) newRow.className = 'urgent-row';

  newRow.innerHTML = `
    <td><span class="token-chip" style="${isUrgent ? 'background:#DC2626;' : ''}">${newToken}</span></td>
    <td><strong>${name}</strong><br><span class="text-small" style="color:var(--color-accent-muted);">+91 ${phone}</span></td>
    <td><span class="badge ${isUrgent ? 'badge-red' : 'badge-amber'}">${isUrgent ? 'Urgent Walk-in' : 'Walk-in'}</span></td>
    <td>Just Now</td>
    <td>${doctor}</td>
    <td><span class="badge badge-blue">● Queued</span></td>
    <td style="text-align: right;">
      <div class="row-actions" style="justify-content: flex-end;">
        <button class="btn-row-action" onclick="prioritizeToken('A-15')">⬆ Prioritize</button>
        <button class="btn-row-action destructive" onclick="markNoShow('A-15')">No-Show</button>
      </div>
    </td>
  `;

  // If urgent, insert right after the currently consulting patient
  if (isUrgent && tbody.children.length > 1) {
    tbody.insertBefore(newRow, tbody.children[1]);
  } else {
    tbody.appendChild(newRow);
  }

  // Update counters
  waitingCount++;
  document.getElementById('count-waiting').textContent = waitingCount;

  closeWalkInDrawer();
  highlightNewRow(newRow);
}

function highlightNewRow(row) {
  row.style.transition = 'background-color 0.5s ease';
  const origBg = row.style.backgroundColor;
  row.style.backgroundColor = '#ECFDF5';
  setTimeout(() => {
    row.style.backgroundColor = origBg;
  }, 1200);
}

/* ==========================================================================
   Row Level Exception Actions (Prioritize & No-Show)
   ========================================================================== */
function prioritizeToken(tokenId) {
  const tbody = document.getElementById('queue-tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const targetRow = rows.find(r => r.textContent.includes(tokenId));

  if (targetRow && rows.length > 1) {
    // Insert right after the serving row (row 0)
    tbody.insertBefore(targetRow, tbody.children[1]);
    highlightNewRow(targetRow);
  }
}

function markNoShow(tokenId) {
  const tbody = document.getElementById('queue-tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const targetRow = rows.find(r => r.textContent.includes(tokenId));

  if (targetRow && confirm(`Mark Token #${tokenId} as NO_SHOW? This will remove them from the queue and re-calculate ETA for subsequent patients.`)) {
    targetRow.remove();
    waitingCount = Math.max(0, waitingCount - 1);
    noShowCount++;
    document.getElementById('count-waiting').textContent = waitingCount;
    document.getElementById('count-noshow').textContent = noShowCount;

    if (tbody.children.length === 0) {
      setReceptionState('empty');
    }
  }
}

function filterQueue(type) {
  const tabs = document.querySelectorAll('.table-tab-btn');
  tabs.forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');

  const rows = document.querySelectorAll('#queue-tbody tr');
  rows.forEach(r => {
    if (type === 'ALL') {
      r.style.display = '';
    } else if (type === 'DR_SHARMA') {
      r.style.display = r.textContent.includes('Dr. Rajesh Sharma') ? '' : 'none';
    } else if (type === 'DR_PATEL') {
      r.style.display = r.textContent.includes('Dr. Priya Patel') ? '' : 'none';
    } else if (type === 'UNCHECKED') {
      r.style.display = 'none'; // None checked-in in this view
    }
  });
}

function hideAlert() {
  document.getElementById('reception-alert').style.display = 'none';
}

/* ==========================================================================
   4 UI States Simulator (Normal, Loading, Empty, Error)
   ========================================================================== */
function setReceptionState(state) {
  currentReceptionState = state;

  // Update top tester buttons
  ['normal', 'loading', 'empty', 'error'].forEach(s => {
    const btn = document.getElementById(`state-${s}-btn`);
    if (btn) btn.classList.toggle('active', s === state);
  });

  const tableContainer = document.getElementById('table-container');
  const emptyView = document.getElementById('empty-reception-view');
  const alertBox = document.getElementById('reception-alert');

  // 1. LOADING STATE
  if (state === 'loading') {
    tableContainer.style.display = 'block';
    emptyView.style.display = 'none';
    alertBox.style.display = 'none';

    document.getElementById('queue-tbody').style.opacity = '0.3';
    document.querySelectorAll('.stat-number').forEach(n => n.style.opacity = '0.3');
  } 
  // 2. EMPTY STATE
  else if (state === 'empty') {
    tableContainer.style.display = 'none';
    emptyView.style.display = 'block';
    alertBox.style.display = 'none';
    document.getElementById('count-waiting').textContent = '0';
  } 
  // 3. ERROR STATE
  else if (state === 'error') {
    tableContainer.style.display = 'block';
    emptyView.style.display = 'none';
    alertBox.style.display = 'block';
    document.getElementById('queue-tbody').style.opacity = '1';
    document.querySelectorAll('.stat-number').forEach(n => n.style.opacity = '1');
  } 
  // 4. NORMAL STATE
  else {
    tableContainer.style.display = 'block';
    emptyView.style.display = 'none';
    alertBox.style.display = 'none';
    document.getElementById('queue-tbody').style.opacity = '1';
    document.querySelectorAll('.stat-number').forEach(n => n.style.opacity = '1');
    document.getElementById('count-waiting').textContent = waitingCount;
  }
}
