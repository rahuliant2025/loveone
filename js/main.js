/**
 * CHAPTER 2 — CINEMATIC BUTTERFLY WEDDING EXPERIENCE
 * Main Script: Countdown, RSVP WhatsApp dispatch, Calendar Sync & Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Music Engine, Butterfly Engine and Cinematic Story Orchestrator
  const butterflyEl = document.getElementById('glowingBlueButterfly');
  const stageEl = document.getElementById('heroStage');

  const musicEngine = new CinematicMusicEngine();
  musicEngine.init();

  if (butterflyEl) {
    const butterflyEngine = new GlowingButterflyEngine(butterflyEl, stageEl);
    butterflyEngine.init();

    const timelineController = new CinematicTimelineController(butterflyEngine, musicEngine);
    timelineController.init();

    window.butterflyEngine = butterflyEngine;
    window.musicEngine = musicEngine;
    window.cinematicTimeline = timelineController;
  }

  // 2. Start Live Countdown Timer to 11 December 2026
  initCountdownTimer();

  // 3. Initialize Back-to-Top Button
  initBackToTopButton();
});

/* ==========================================================================
   LIVE COUNTDOWN TIMER
   Target: Friday, 11 December 2026, 09:00:00 AM (Auspicious Vivah Sanskar)
   ========================================================================== */
function initCountdownTimer() {
  const weddingDate = new Date('2026-12-11T09:00:00+05:30').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('mins');
  const secsEl = document.getElementById('secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   GOOGLE CALENDAR 1-CLICK EVENT SYNC
   ========================================================================== */
function addToGoogleCalendar(title, startIso, endIso, location, details) {
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  showToast('Opening Google Calendar...');
}

/* ==========================================================================
   WHATSAPP RSVP DISPATCH
   ========================================================================== */
function sendWishesToWhatsApp(event) {
  event.preventDefault();

  const name = document.getElementById('guestName')?.value?.trim() || 'Guest';
  const attendance = document.getElementById('guestAttendance')?.value || 'Attending';
  const count = document.getElementById('guestCount')?.value || '1';
  const message = document.getElementById('guestMessage')?.value?.trim() || 'Heartiest congratulations to Rahul & Shristi!';

  const formattedText = 
`🌸 *Rahul & Shristi Wedding Blessings & RSVP* 🌸
━━━━━━━━━━━━━━━━━━━
👤 *From:* ${name}
✨ *Status:* ${attendance}
👨‍👩‍👧 *Guest Count:* ${count}
💌 *Personal Blessings:*
"${message}"
━━━━━━━━━━━━━━━━━━━
॥ मंगलं बुद्धं · शुभ विवाह ॥`;

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedText)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
  showToast('Sending blessings to WhatsApp...');
}

/* ==========================================================================
   WHATSAPP INVITATION FORWARD & SHARE
   ========================================================================== */
function shareOnWhatsApp() {
  const pageUrl = window.location.href;
  const inviteText = 
`🌸 *Wedding Invitation — Rahul & Shristi* 🌸
॥ बुद्धं शरणं गच्छामि · शुभ विवाह ॥

With the affectionate blessings of our parents and elders, we cordially invite you and your family to celebrate the sacred wedding union of:

👑 *Rahul Patel*
        ❤️
👑 *Shristi Singh*

📅 *Auspicious Wedding:* Friday, 11 December 2026
📍 *Buddh Vihar & Pallav Bhawan, Bilaspur (C.G.)*

✨ *Experience our Interactive Cinematic Wedding Invitation:*
${pageUrl}

With Warm Regards:
Patel Family & Singh Family`;

  const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteText)}`;
  window.open(waShareUrl, '_blank', 'noopener,noreferrer');
}

function copyInviteText() {
  const pageUrl = window.location.href;
  const inviteText = 
`🌸 *Wedding Invitation — Rahul & Shristi* 🌸
॥ बुद्धं शरणं गच्छामि · शुभ विवाह ॥

With the affectionate blessings of our parents and elders, we cordially invite you and your family to celebrate the sacred wedding union of:

👑 *Rahul Patel*
        ❤️
👑 *Shristi Singh*

📅 *Auspicious Wedding:* Friday, 11 December 2026
📍 *Buddh Vihar & Pallav Bhawan, Bilaspur (C.G.)*

✨ *Experience our Interactive Cinematic Wedding Invitation:*
${pageUrl}

With Warm Regards:
Patel Family & Singh Family`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(inviteText).then(() => {
      showToast('✓ Formatted WhatsApp invitation copied to clipboard!');
    }).catch(() => {
      fallbackCopy(inviteText);
    });
  } else {
    fallbackCopy(inviteText);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('✓ Formatted WhatsApp invitation copied!');
  } catch (err) {
    showToast('Please select and copy manually.');
  }
  document.body.removeChild(textarea);
}

/* ==========================================================================
   TOAST NOTIFICATION HELPER
   ========================================================================== */
let toastTimeout = null;
function showToast(message, duration = 3200) {
  const toast = document.getElementById('toastMessage');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ==========================================================================
   BACK TO TOP FLOATING BUTTON
   ========================================================================== */
function initBackToTopButton() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Global Exports
window.addToGoogleCalendar = addToGoogleCalendar;
window.sendWishesToWhatsApp = sendWishesToWhatsApp;
window.shareOnWhatsApp = shareOnWhatsApp;
window.copyInviteText = copyInviteText;
window.scrollToTop = scrollToTop;
window.showToast = showToast;
