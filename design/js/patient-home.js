/**
 * QureFlow Design System — Patient Home Dashboard Logic
 * Dynamically updates the active context hero card based on patient's current visit lifecycle.
 */

let currentHomeMode = 'in_queue'; // 'in_queue' | 'booked_today' | 'empty'

document.addEventListener('DOMContentLoaded', () => {
  setDynamicGreeting();
});

function setDynamicGreeting() {
  const hour = new Date().getHours();
  let timeOfDay = 'Morning';
  if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
  else if (hour >= 17) timeOfDay = 'Evening';

  const elem = document.getElementById('welcome-user');
  if (elem) elem.textContent = `Good ${timeOfDay}, Rahul 👋`;
}

function setHomeMode(mode) {
  currentHomeMode = mode;

  // Update top tester buttons
  document.getElementById('mode-active-queue-btn').classList.toggle('active', mode === 'in_queue');
  document.getElementById('mode-booked-btn').classList.toggle('active', mode === 'booked_today');
  document.getElementById('mode-empty-btn').classList.toggle('active', mode === 'empty');

  // Toggle dynamic hero cards
  document.getElementById('hero-card-in-queue').style.display = mode === 'in_queue' ? 'block' : 'none';
  document.getElementById('hero-card-booked').style.display = mode === 'booked_today' ? 'block' : 'none';
  document.getElementById('hero-card-empty').style.display = mode === 'empty' ? 'block' : 'none';
}
