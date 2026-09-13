/**
 * Rahul & Shristi — Royal Wedding Invitation (Interactive Engine)
 * Features: 3D Envelope, Scratch-to-Reveal, Confetti, Countdown,
 * WhatsApp RSVP, WhatsApp Share, Google Calendar, Petals Canvas & Audio.
 */

document.addEventListener("DOMContentLoaded", () => {
  initEnvelope();
  initPetalsCanvas();
  initCompanionButterfly();
  initBlessingTapEffect();
  initMomentTilt();
  initScratchCard();
  initCountdown();
  initScrollReveal();
});

/* ==========================================================================
   1. 3D ENVELOPE INTERACTION
   ========================================================================== */
function initEnvelope() {
  const waxSeal = document.getElementById("waxSeal");
  const envelopeScreen = document.getElementById("envelopeScreen");
  const welcomeSection = document.getElementById("welcomeSection");

  if (!waxSeal || !envelopeScreen) return;

  waxSeal.addEventListener("click", () => {
    if (envelopeScreen.classList.contains("opened")) return;

    envelopeScreen.classList.add("opened");

    // Smooth scroll down to the revealed welcome cover
    setTimeout(() => {
      if (welcomeSection) {
        welcomeSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 1400);
  });
}

/* ==========================================================================
   2. MAJESTIC ROYAL COMPANION BUTTERFLY (TRAVELS WITH USER ON SCROLL)
   ========================================================================== */
function initCompanionButterfly() {
  const butterfly = document.getElementById("companionButterfly");
  const rotator = document.getElementById("butterflyFlightRotator");
  if (!butterfly || !rotator) return;

  // Viewport position tracking
  let currentX = window.innerWidth - (window.innerWidth < 600 ? 75 : 100);
  let currentY = window.innerHeight * 0.38;
  let targetX = currentX;
  let targetY = currentY;
  let flightAngle = 0;
  let isScrolling = false;
  let scrollTimeout = null;
  let lastScrollY = window.scrollY;
  let lastSparkleTime = 0;

  // Initial placement
  butterfly.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

  // Spawn glowing golden sparkle dust behind butterfly
  function dropSparkle(x, y, count = 1) {
    for (let i = 0; i < count; i++) {
      const dust = document.createElement("div");
      dust.className = "sparkle-dust";
      const offsetX = (Math.random() - 0.5) * 16;
      const offsetY = (Math.random() - 0.5) * 16;
      dust.style.left = `${x + 36 + offsetX}px`;
      dust.style.top = `${y + 30 + offsetY}px`;
      document.body.appendChild(dust);

      setTimeout(() => {
        dust.remove();
      }, 850);
    }
  }

  // Scroll listener: detects movement and drives flight to accompany user
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    if (Math.abs(deltaY) > 0.5) {
      isScrolling = true;
      butterfly.classList.add("flying");

      // While scrolling, butterfly swoops along with the scroll direction
      const clampedDelta = Math.max(Math.min(deltaY * 0.5, 25), -25);
      targetY += clampedDelta;

      // Keep target comfortably within viewport bounds
      const minY = 60;
      const maxY = window.innerHeight - 110;
      if (targetY < minY) targetY = minY;
      if (targetY > maxY) targetY = maxY;

      // Playful horizontal wave during flight
      targetX = (window.innerWidth - (window.innerWidth < 600 ? 75 : 100)) + Math.sin(Date.now() * 0.008) * 18;

      // Dynamic tilt in direction of movement
      const targetAngle = Math.max(Math.min(deltaY * 1.2, 40), -40);
      flightAngle += (targetAngle - flightAngle) * 0.25;

      // Emit sparkle dust trail while scrolling
      const now = performance.now();
      if (now - lastSparkleTime > 75) {
        lastSparkleTime = now;
        dropSparkle(currentX, currentY, 1);
      }

      // Reset when scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        butterfly.classList.remove("flying");
        // Settle smoothly back to comfortable resting perch beside current position
        targetX = window.innerWidth - (window.innerWidth < 600 ? 75 : 100);
        targetY = window.innerHeight * 0.42;
        flightAngle = 0;
      }, 180);
    }
  }, { passive: true });

  // Handle window resize
  window.addEventListener("resize", () => {
    targetX = window.innerWidth - (window.innerWidth < 600 ? 75 : 100);
  });

  // Tap or click on butterfly to trigger celebratory loop
  butterfly.addEventListener("click", () => {
    butterfly.classList.add("celebrating");
    dropSparkle(currentX, currentY, 8);

    // Float celebratory blessings from butterfly
    const emojis = ["💛", "✨", "🌸", "💍", "🪷"];
    for (let i = 0; i < 6; i++) {
      const p = document.createElement("div");
      p.className = "blessing-particle";
      p.textContent = emojis[i % emojis.length];
      p.style.setProperty("--dx", `${(Math.random() - 0.5) * 100}px`);
      p.style.setProperty("--rot", `${(Math.random() - 0.5) * 40}deg`);
      p.style.setProperty("--rot-end", `${(Math.random() - 0.5) * 90}deg`);
      p.style.left = `${currentX + 35}px`;
      p.style.top = `${currentY + 25}px`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1350);
    }

    setTimeout(() => {
      butterfly.classList.remove("celebrating");
    }, 950);
  });

  // Main animation loop: smooth easing to target position
  function animateCompanion() {
    const ease = isScrolling ? 0.14 : 0.07;
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    butterfly.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
    rotator.style.transform = `rotate(${flightAngle.toFixed(1)}deg)`;

    requestAnimationFrame(animateCompanion);
  }

  requestAnimationFrame(animateCompanion);
}

/* ==========================================================================
   2.5 BLESSING TAP EFFECT (FLOATING HEARTS & PETALS ON TAP)
   ========================================================================== */
function initBlessingTapEffect() {
  const blessings = ["💛", "🌸", "✨", "🪷", "💖", "✦", "💍"];

  document.addEventListener("click", (e) => {
    // Avoid interfering with form inputs or buttons
    if (e.target.closest("input, textarea, select, button, a")) return;

    const count = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "blessing-particle";
      p.textContent = blessings[Math.floor(Math.random() * blessings.length)];

      const dx = (Math.random() - 0.5) * 80;
      const rot = (Math.random() - 0.5) * 40;
      const rotEnd = (Math.random() - 0.5) * 90;

      p.style.setProperty("--dx", `${dx}px`);
      p.style.setProperty("--rot", `${rot}deg`);
      p.style.setProperty("--rot-end", `${rotEnd}deg`);
      p.style.left = `${e.clientX}px`;
      p.style.top = `${e.clientY}px`;

      document.body.appendChild(p);

      setTimeout(() => {
        p.remove();
      }, 1350);
    }
  });
}

/* ==========================================================================
   2.8 3D MOMENT FRAME TILT INTERACTION
   ========================================================================== */
function initMomentTilt() {
  const frame = document.getElementById("momentFrame");
  if (!frame) return;

  frame.addEventListener("mousemove", (e) => {
    const rect = frame.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = -(y / (rect.height / 2)) * 6;
    const tiltY = (x / (rect.width / 2)) * 6;

    frame.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(1.02)`;
  });

  frame.addEventListener("mouseleave", () => {
    frame.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  });
}

/* ==========================================================================
   3. FALLING ROSE PETALS & GOLD DUST CANVAS
   ========================================================================== */
function initPetalsCanvas() {
  const canvas = document.getElementById("petalsCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = 28;
  const petals = [];

  for (let i = 0; i < petalsCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 1.2 + 0.6,
      speedX: Math.random() * 0.8 - 0.4,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 1.5 - 0.75,
      opacity: Math.random() * 0.5 + 0.3,
      isGold: Math.random() > 0.65,
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;

    if (p.isGold) {
      // Golden Sparkle
      ctx.fillStyle = "#dfb76c";
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Rose Petal Shape
      ctx.fillStyle = "#b43a4e";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size, -p.size, p.size * 1.5, p.size, 0, p.size * 1.5);
      ctx.bezierCurveTo(-p.size * 1.5, p.size, -p.size, -p.size, 0, 0);
      ctx.fill();
    }
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.008) * 0.8 + p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }

      drawPetal(p);
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   4. INTERACTIVE "SCRATCH TO REVEAL" HEART ENGINE
   ========================================================================== */
function initScratchCard() {
  const canvas = document.getElementById("scratchCanvas");
  const promptEl = document.getElementById("scratchPrompt");
  const badgeEl = document.getElementById("revealedBadge");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  // Draw initial glitter card on top
  function renderGlitterCard() {
    // Shimmering base
    const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width / 2);
    grad.addColorStop(0, "#dfa3a9");
    grad.addColorStop(0.5, "#bd6e78");
    grad.addColorStop(1, "#863a45");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add glitter particles
    for (let i = 0; i < 400; i++) {
      const gx = Math.random() * width;
      const gy = Math.random() * height;
      const gr = Math.random() * 2.2;
      ctx.fillStyle = Math.random() > 0.5 ? "#fbe3ba" : "#ffffff";
      ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Draw central decorative heart
    ctx.save();
    ctx.translate(width / 2, height / 2 - 10);
    ctx.strokeStyle = "#e8c582";
    ctx.lineWidth = 3;
    ctx.fillStyle = "rgba(223, 183, 108, 0.15)";

    ctx.beginPath();
    const s = 6;
    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      if (t === 0) ctx.moveTo(hx * s, hy * s);
      else ctx.lineTo(hx * s, hy * s);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Heart Inner Text
    ctx.font = "bold 15px Manrope, sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("Scratch to Reveal", 0, 0);

    ctx.font = "20px serif";
    ctx.fillText("✨", 0, -25);
    ctx.fillText("♥", 0, 26);
    ctx.restore();
  }

  renderGlitterCard();

  let isDrawing = false;
  let scratchedPixels = 0;
  let hasRevealed = false;
  const brushRadius = 26;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function scratch(pos) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkScratchProgress() {
    if (hasRevealed) return;
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const pixels = imgData.data;
      let clearCount = 0;
      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) clearCount++;
      }
      const totalSampled = pixels.length / 16;
      const progress = clearCount / totalSampled;

      if (progress > 0.38) {
        hasRevealed = true;
        canvas.classList.add("cleared");
        if (promptEl) promptEl.style.display = "none";
        if (badgeEl) badgeEl.style.display = "block";
        triggerCelebrationConfetti();
      }
    } catch (e) {}
  }

  // Pointer & Touch Listeners
  function handleStart(e) {
    isDrawing = true;
    const pos = getPos(e);
    scratch(pos);
  }

  function handleMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    scratch(pos);
  }

  function handleEnd() {
    if (!isDrawing) return;
    isDrawing = false;
    checkScratchProgress();
  }

  canvas.addEventListener("mousedown", handleStart);
  canvas.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", handleEnd);

  canvas.addEventListener("touchstart", handleStart, { passive: false });
  canvas.addEventListener("touchmove", handleMove, { passive: false });
  window.addEventListener("touchend", handleEnd);
}

/* ==========================================================================
   5. CONFETTI CELEBRATION
   ========================================================================== */
function triggerCelebrationConfetti() {
  const container = document.getElementById("scratchSection");
  if (!container) return;

  const colors = ["#dfb76c", "#f6e4b8", "#f3d7d7", "#b43a4e", "#ffffff"];
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "absolute";
    confetti.style.width = Math.random() * 10 + 6 + "px";
    confetti.style.height = Math.random() * 14 + 6 + "px";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = "50%";
    confetti.style.top = "50%";
    confetti.style.borderRadius = "2px";
    confetti.style.zIndex = "10";
    confetti.style.pointerEvents = "none";
    confetti.style.transition = "all 1.4s cubic-bezier(0.2, 0.8, 0.2, 1)";
    container.appendChild(confetti);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 220 + 80;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 40;
    const rot = Math.random() * 720;

    requestAnimationFrame(() => {
      confetti.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
      confetti.style.opacity = "0";
    });

    setTimeout(() => {
      confetti.remove();
    }, 1500);
  }
}

/* ==========================================================================
   6. COUNTDOWN TO FOREVER
   ========================================================================== */
function initCountdown() {
  const targetDate = new Date("2026-12-11T09:00:00+05:30").getTime();
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minsEl = document.getElementById("mins");
  const secsEl = document.getElementById("secs");

  if (!daysEl) return;

  function update() {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, "0");
    hoursEl.textContent = String(h).padStart(2, "0");
    minsEl.textContent = String(m).padStart(2, "0");
    secsEl.textContent = String(s).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   7. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   8. RSVP & SEND WISHES DIRECTLY ON WHATSAPP
   ========================================================================== */
function sendWishesToWhatsApp(event) {
  event.preventDefault();

  const name = document.getElementById("guestName").value.trim();
  const attendance = document.getElementById("guestAttendance").value;
  const count = document.getElementById("guestCount").value;
  const message = document.getElementById("guestMessage").value.trim();

  let text = `💐 *Shubh Vivah Wishes & RSVP* 💐\n`;
  text += `*For Rahul Patel & Shristi Singh*\n\n`;
  text += `👤 *Guest Name:* ${name}\n`;
  text += `✨ *RSVP Status:* ${attendance}\n`;
  text += `👥 *Number of Guests:* ${count}\n`;
  if (message) {
    text += `💌 *Wishes:* "${message}"\n\n`;
  } else {
    text += `\n`;
  }
  text += `Looking forward to celebrating this auspicious union! 🌸☸`;

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(waUrl, "_blank");
}

/* ==========================================================================
   9. WHATSAPP INVITATION FORWARD & CLIPBOARD UTILITY
   ========================================================================== */
function getInviteMessageText() {
  const currentUrl = window.location.href;
  return `🌸 *Shubh Vivah Nimantran* 🌸

॥ बुद्धं शरणं गच्छामि · धम्मं शरणं गच्छामि · संघं शरणं गच्छामि ॥

With immense joy and the blessings of our elders, we cordially invite you to celebrate the royal wedding of:

🤵 *Rahul Patel*
(Son of Smt. Geeta Patel & Shri Bhojraj Patel)
&
👰 *Shristi Singh*
(Daughter of Smt. Nirmala Singh & Shri Amin Singh)

A divine celebration of Maharashtrian Buddhist Grace & Bihari Wedding Parampara!

📅 *Wedding Date:* Friday, 11 December 2026
📍 *Locations:* Buddh Vihar & Pallav Bhawan, Bilaspur (C.G.)

✨ *Open our interactive wedding invitation card here:*
${currentUrl}

Your blessings and gracious presence are our greatest treasure!
— *Patel Family & Singh Family*`;
}

function shareOnWhatsApp() {
  const message = getInviteMessageText();
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function copyInviteText() {
  const message = getInviteMessageText();
  navigator.clipboard.writeText(message).then(() => {
    const hint = document.getElementById("copyHint");
    if (hint) {
      hint.textContent = "✓ Formatted message copied to clipboard! You can now paste in WhatsApp.";
      hint.style.color = "#dfb76c";
      setTimeout(() => {
        hint.textContent = "Or tap below to copy invitation text to clipboard";
        hint.style.color = "";
      }, 4000);
    }
  }).catch(() => {
    alert("Copied text to clipboard!");
  });
}

/* ==========================================================================
   10. GOOGLE CALENDAR 1-CLICK INTEGRATION
   ========================================================================== */
function addToGoogleCalendar(title, startISO, endISO, location, details) {
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startISO}/${endISO}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  window.open(url, "_blank");
}

// Attach global functions for inline HTML calls
window.sendWishesToWhatsApp = sendWishesToWhatsApp;
window.shareOnWhatsApp = shareOnWhatsApp;
window.copyInviteText = copyInviteText;
window.addToGoogleCalendar = addToGoogleCalendar;
