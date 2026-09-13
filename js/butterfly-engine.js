/**
 * CHAPTER 2 — CINEMATIC BUTTERFLY WEDDING EXPERIENCE
 * High-Performance Cinematic Stardust & Sparkle Particle Canvas Engine
 * Central visual character: glowing blue Morpho butterfly with radiant celestial trail
 */

class GlowingButterflyEngine {
  constructor(butterflyEl, stageEl) {
    this.butterfly = butterflyEl;
    this.stage = stageEl || document.body;

    // State Constants
    this.STATES = {
      WAITING_FOR_VIDEO: 'WAITING_FOR_VIDEO',
      TAKEOFF_FROM_VIDEO: 'TAKEOFF_FROM_VIDEO',
      HOVER_CUE: 'HOVER_CUE',
      FLYING_SCROLL: 'FLYING_SCROLL',
      PERCHED_ON_WORD: 'PERCHED_ON_WORD',
      RETURNED_TOP: 'RETURNED_TOP'
    };

    this.state = this.STATES.WAITING_FOR_VIDEO;
    this.isEmittingTrail = false;
    this.isInteracting = false;
    this.activePerchedWord = null;

    // Position tracking for velocity and trail spawning
    this.prevX = null;
    this.prevY = null;
    this.currX = null;
    this.currY = null;
    this.accumulatedDist = 0;
    this.lastPerchSparkleTime = 0;

    // Canvas particle engine — ultra light and delicate
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.maxParticles = 45; // Refined limit: light and subtle, never heavy

    // Authentic Rose Petal & Golden Sparkle Palettes
    this.rosePalettes = [
      { base: '#991B1B', mid: '#DC2626', tip: '#F87171' }, // Velvet Royal Red
      { base: '#BE123C', mid: '#E11D48', tip: '#FB7185' }, // Deep Auspicious Rose
      { base: '#9D174D', mid: '#DB2777', tip: '#F472B6' }, // Blush Pink Petal
      { base: '#B91C1C', mid: '#EF4444', tip: '#FCA5A5' }  // Sacred Sindoor Rose
    ];

    this.goldPalettes = [
      { core: '#FFFFFF', glow: '#FFE58F', outer: '#D4AF37' },
      { core: '#FFFFEE', glow: '#FFD700', outer: '#E6A100' }
    ];
  }

  init() {
    this.initCanvas();
    this.setupInteractivity();
    this.startEngineLoop();
  }

  /**
   * Initializes the full-screen stardust canvas
   */
  initCanvas() {
    let canvas = document.getElementById('butterflySparkleCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'butterflySparkleCanvas';
      canvas.className = 'butterfly-sparkle-canvas';
      document.body.appendChild(canvas);
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = window.innerWidth * dpr;
      this.canvas.height = window.innerHeight * dpr;
      this.canvas.style.width = `${window.innerWidth}px`;
      this.canvas.style.height = `${window.innerHeight}px`;
      this.ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', () => {
      resize();
      if (this.state === this.STATES.PERCHED_ON_WORD && this.activePerchedWord) {
        const rect = this.activePerchedWord.getBoundingClientRect();
        const landX = Math.max(12, Math.min(window.innerWidth - 52, rect.left + (rect.width * 0.5) - 22));
        const landY = Math.max(8, rect.top - 34);
        if (window.gsap) {
          gsap.set(this.butterfly, { x: landX, y: landY });
        }
      }
    }, { passive: true });
  }

  /**
   * Sets up tap/click easter egg on the butterfly
   */
  setupInteractivity() {
    if (!this.butterfly) return;

    const triggerJoyfulSpin = (e) => {
      e.stopPropagation();
      if (this.isInteracting || !window.gsap) return;
      this.isInteracting = true;

      const rect = this.butterfly.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Gentle celebratory burst of rose petals and light gold flecks
      this.spawnRadialBurst(cx, cy, 8);

      gsap.timeline({
        onComplete: () => {
          this.isInteracting = false;
        }
      })
      .to(this.butterfly, {
        rotation: '+=360',
        scale: 1.25,
        duration: 0.6,
        ease: 'back.out(1.6)'
      })
      .to(this.butterfly, {
        scale: this.state === this.STATES.PERCHED_ON_WORD ? 0.72 : 1,
        duration: 0.35,
        ease: 'power2.out'
      });
    };

    this.butterfly.addEventListener('click', triggerJoyfulSpin);
    this.butterfly.addEventListener('touchstart', triggerJoyfulSpin, { passive: true });
  }

  /**
   * Spawns a rich variety of stardust sparkles:
   * 1. 4-point rotating golden/cyan starlight flares
   * 2. Glowing celestial stardust orbs with bright white cores
   * 3. Diamond fairy dust glitter
   */
  /**
   * Spawns delicate particles:
   * 1. 'rose_petal': soft organic 3D fluttering miniature rose petals
   * 2. 'gold_sparkle': tiny 4-point micro gold stars with subtle warmth
   * 3. 'gold_dust': floating micro fairy dust specks
   */
  spawnParticle(x, y, vx = 0, vy = 0, speedMult = 1, forceType = null) {
    if (this.particles.length >= this.maxParticles) return;

    const rand = Math.random();
    let type = forceType;
    if (!type) {
      if (rand < 0.5) type = 'rose_petal';
      else if (rand < 0.85) type = 'gold_sparkle';
      else type = 'gold_dust';
    }

    const angle = Math.random() * Math.PI * 2;
    const spread = (Math.random() * 1.0 + 0.3) * speedMult;

    if (type === 'rose_petal') {
      const palette = this.rosePalettes[Math.floor(Math.random() * this.rosePalettes.length)];
      this.particles.push({
        type: 'rose_petal',
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: vx * 0.25 + Math.cos(angle) * spread * 0.5,
        vy: vy * 0.25 + Math.random() * 0.45 + 0.3, // gentle falling drift
        size: Math.random() * 2.5 + 5.5, // 5.5px to 8px
        color: palette,
        maxLife: Math.random() * 25 + 45, // ~0.8s - 1.2s
        life: 0,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.035,
        flutterPhase: Math.random() * Math.PI * 2,
        flutterSpeed: Math.random() * 0.035 + 0.025,
        friction: 0.97,
        gravity: 0.035
      });
    } else if (type === 'gold_sparkle') {
      const palette = this.goldPalettes[Math.floor(Math.random() * this.goldPalettes.length)];
      this.particles.push({
        type: 'gold_sparkle',
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: vx * 0.2 + Math.cos(angle) * spread * 0.7,
        vy: vy * 0.2 + Math.sin(angle) * spread * 0.7 + 0.1,
        size: Math.random() * 1.5 + 2.2, // 2.2px to 3.7px (tiny micro-star)
        color: palette,
        maxLife: Math.random() * 18 + 30, // ~0.5s - 0.8s
        life: 0,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.06,
        friction: 0.96,
        gravity: 0.02
      });
    } else {
      // gold_dust
      this.particles.push({
        type: 'gold_dust',
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: vx * 0.15 + (Math.random() - 0.5) * 0.5,
        vy: vy * 0.15 + Math.random() * 0.35 + 0.1,
        size: Math.random() * 0.8 + 1.0, // 1px to 1.8px
        maxLife: Math.random() * 18 + 22,
        life: 0,
        friction: 0.96,
        gravity: 0.015
      });
    }

    const p = this.particles[this.particles.length - 1];
    p.life = p.maxLife;
  }

  // Backwards compatibility alias
  spawnSparkle(x, y, vx = 0, vy = 0, speedMult = 1, forceType = null) {
    this.spawnParticle(x, y, vx, vy, speedMult, forceType);
  }

  /**
   * Spawns a subtle, elegant burst of particles
   */
  spawnRadialBurst(cx, cy, count = 6) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 1.8 + 0.7;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      this.spawnParticle(cx, cy, vx, vy, 0.75);
    }
  }

  /**
   * Main animation loop:
   * 1. Tracks butterfly position frame-by-frame
   * 2. Emits stardust along the trajectory if moving
   * 3. Updates and draws all sparkles on canvas
   */
  startEngineLoop() {
    const loop = (timestamp) => {
      this.updateButterflyTracking(timestamp);
      this.renderCanvasParticles(timestamp);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /**
   * Tracks butterfly's exact bounding client rect and movement
   */
  updateButterflyTracking(timestamp) {
    if (!this.butterfly) return;

    const rect = this.butterfly.getBoundingClientRect();
    const isVisible = rect.width > 0 && parseFloat(getComputedStyle(this.butterfly).opacity) > 0.05;

    if (!isVisible) {
      this.prevX = null;
      this.prevY = null;
      return;
    }

    // Wings center / trailing edge coordinate
    const wingX = rect.left + rect.width * 0.5;
    const wingY = rect.top + rect.height * 0.55;

    this.currX = wingX;
    this.currY = wingY;

    if (this.prevX !== null && this.prevY !== null) {
      const dx = this.currX - this.prevX;
      const dy = this.currY - this.prevY;
      const dist = Math.hypot(dx, dy);

      // Light trail emission: spawn sparingly when moving
      if (dist > 1.0) {
        this.accumulatedDist += dist;
        // Only spawn 1 delicate particle every 14px of flight movement
        if (this.accumulatedDist >= 14) {
          this.accumulatedDist = 0;
          const trailVx = -dx * 0.12;
          const trailVy = -dy * 0.12;
          this.spawnParticle(this.currX, this.currY, trailVx, trailVy, 0.7);
        }
      } 
      // If perched on a word: emit very rare, soft resting micro-dust
      else if (this.state === this.STATES.PERCHED_ON_WORD) {
        if (timestamp - this.lastPerchSparkleTime > 450) {
          this.lastPerchSparkleTime = timestamp;
          this.spawnParticle(this.currX + (Math.random() - 0.5) * 16, this.currY + 8, 0, 0.2, 0.3, 'gold_dust');
        }
      } else if (this.state === this.STATES.HOVER_CUE) {
        if (timestamp - this.lastPerchSparkleTime > 400) {
          this.lastPerchSparkleTime = timestamp;
          this.spawnParticle(this.currX, this.currY + 6, 0, 0.2, 0.4, 'gold_dust');
        }
      }
    }

    this.prevX = this.currX;
    this.prevY = this.currY;
  }

  /**
   * Renders all active particles onto canvas
   */
  renderCanvasParticles(timestamp) {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    if (this.particles.length === 0) return;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Physics update
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.friction;
      p.vy = p.vy * p.friction + p.gravity;
      p.life--;
      p.rotation += p.rotSpeed;

      const progress = p.life / p.maxLife; // 1 -> 0
      p.alpha = Math.max(0, Math.sin(progress * Math.PI) * 0.75); // soft in-out curve, max 0.75

      if (p.life <= 0 || p.alpha <= 0.01) {
        this.particles.splice(i, 1);
        continue;
      }

      // Draw particle based on type
      if (p.type === 'rose_petal') {
        p.flutterPhase += p.flutterSpeed;
        p.x += Math.sin(p.flutterPhase) * 0.4;
        this.drawRosePetal(ctx, p.x, p.y, p.size, p.rotation, p.flutterPhase, p.color, p.alpha);
      } else if (p.type === 'gold_sparkle') {
        this.drawLightGoldSpark(ctx, p.x, p.y, p.size, p.rotation, p.alpha);
      } else {
        this.drawMicroDust(ctx, p.x, p.y, p.size, p.alpha);
      }
    }
  }

  /**
   * Draws an organic 3D-fluttering miniature rose petal
   */
  drawRosePetal(ctx, cx, cy, size, rotation, flutterPhase, color, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    // 3D flutter illusion: flipping around Y-axis
    const flip = Math.cos(flutterPhase);
    ctx.scale(flip * 0.85, 1);
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.moveTo(0, -size * 0.7);
    ctx.bezierCurveTo(-size * 0.85, -size * 0.3, -size * 0.85, size * 0.6, 0, size * 0.95);
    ctx.bezierCurveTo(size * 0.85, size * 0.6, size * 0.85, -size * 0.3, 0, -size * 0.7);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, -size * 0.7, 0, size * 0.95);
    grad.addColorStop(0, color.base);
    grad.addColorStop(0.5, color.mid);
    grad.addColorStop(1, color.tip);
    ctx.fillStyle = grad;
    ctx.fill();

    // Subtle delicate center rib
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.4);
    ctx.lineTo(0, size * 0.5);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draws a delicate 4-point micro gold star flare
   */
  drawLightGoldSpark(ctx, cx, cy, size, rotation, alpha) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.3);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.4, '#FFE58F');
    grad.addColorStop(0.8, '#D4AF37');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = grad;

    ctx.beginPath();
    const rLong = size;
    const rShort = size * 0.22;
    for (let i = 0; i < 4; i++) {
      const a1 = (i * Math.PI) / 2;
      const a2 = a1 + Math.PI / 4;
      ctx.lineTo(Math.cos(a1) * rLong, Math.sin(a1) * rLong);
      ctx.lineTo(Math.cos(a2) * rShort, Math.sin(a2) * rShort);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  /**
   * Draws a tiny micro fairy dust speck
   */
  drawMicroDust(ctx, cx, cy, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha * 0.65;
    ctx.fillStyle = '#FFEAA7';
    ctx.beginPath();
    ctx.arc(cx, cy, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  setFlightSpeed(isFast) {
    if (this.butterfly) {
      if (isFast) {
        this.butterfly.classList.add('flying');
        this.butterfly.classList.remove('hovering', 'perched');
        this.isEmittingTrail = true;
      } else {
        this.butterfly.classList.remove('flying');
        this.isEmittingTrail = false;
      }
    }
  }

  /**
   * Seamless transition from the Omni Hero Video
   * The video butterfly is at X ≈ 76%, Y ≈ 72% taking off
   */
  triggerVideoHandoff(videoContainer) {
    if (!this.butterfly || !window.gsap) return;
    if (this.state !== this.STATES.WAITING_FOR_VIDEO) return;

    this.state = this.STATES.TAKEOFF_FROM_VIDEO;
    const vRect = videoContainer ? videoContainer.getBoundingClientRect() : {
      left: 0, top: 0, width: window.innerWidth, height: window.innerHeight
    };

    const startX = vRect.left + vRect.width * 0.76;
    const startY = vRect.top + vRect.height * 0.72;

    gsap.set(this.butterfly, {
      x: startX,
      y: startY,
      scale: 0.85,
      rotation: 20,
      opacity: 0
    });

    this.setFlightSpeed(true);

    // Initial burst on Rahul's hand
    this.spawnRadialBurst(startX + 28, startY + 22, 28);

    // Soar gracefully from Rahul's hand to hover above the scroll cue
    const targetHoverX = vRect.left + vRect.width * 0.5 - 28;
    const targetHoverY = vRect.top + vRect.height - 130;

    gsap.timeline({
      onComplete: () => {
        this.state = this.STATES.HOVER_CUE;
        this.setFlightSpeed(false);
        this.butterfly.classList.add('hovering');
      }
    })
    .to(this.butterfly, {
      opacity: 1,
      duration: 0.4,
      ease: 'power1.out'
    })
    .to(this.butterfly, {
      x: vRect.left + vRect.width * 0.65,
      y: startY - 80,
      rotation: -10,
      scale: 1,
      duration: 1.0,
      ease: 'sine.out'
    })
    .to(this.butterfly, {
      x: targetHoverX,
      y: targetHoverY,
      rotation: 0,
      duration: 1.2,
      ease: 'power2.inOut'
    });
  }

  /**
   * Scans the viewport for the best visible word to perch on
   */
  findBestPerchWord() {
    const candidates = Array.from(document.querySelectorAll('.butterfly-perch-word'));
    if (!candidates.length) return null;

    const viewportH = window.innerHeight;
    const idealY = viewportH * 0.38; // Target ideal reading line in upper-middle screen

    let bestEl = null;
    let minDistance = Infinity;

    // First pass: find candidate comfortably inside middle viewport
    for (const el of candidates) {
      const rect = el.getBoundingClientRect();
      if (rect.top >= 60 && rect.bottom <= viewportH - 80) {
        const dist = Math.abs(rect.top - idealY);
        if (dist < minDistance) {
          minDistance = dist;
          bestEl = el;
        }
      }
    }

    // Fallback: any visible candidate
    if (!bestEl) {
      for (const el of candidates) {
        const rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= viewportH) {
          const dist = Math.abs(rect.top - idealY);
          if (dist < minDistance) {
            minDistance = dist;
            bestEl = el;
          }
        }
      }
    }

    return bestEl;
  }

  /**
   * Flies smoothly to the best visible word and perches on it
   */
  perchOnBestWord() {
    if (!this.butterfly || !window.gsap) return;
    const targetWord = this.findBestPerchWord();
    if (!targetWord) return;

    this.perchOnElement(targetWord);
  }

  /**
   * Animates the butterfly onto a specific word element.
   * Perches gracefully directly ON TOP of the word so words are NEVER covered or faded.
   */
  perchOnElement(wordEl) {
    if (!wordEl || !this.butterfly || !window.gsap) return;
    if (this.activePerchedWord === wordEl && this.state === this.STATES.PERCHED_ON_WORD) {
      return;
    }

    // Remove previous word active state
    if (this.activePerchedWord && this.activePerchedWord !== wordEl) {
      this.activePerchedWord.classList.remove('perched-word-active');
    }

    this.state = this.STATES.PERCHED_ON_WORD;
    this.activePerchedWord = wordEl;

    const rect = wordEl.getBoundingClientRect();
    // Landing position: perched directly ON TOP of the word, centered!
    // Butterfly width: 58px, height: 48px, scale: 0.72 -> effective width ~42px, height ~35px
    const landX = Math.max(12, Math.min(window.innerWidth - 52, rect.left + (rect.width * 0.5) - 22));
    const landY = Math.max(8, rect.top - 34);

    gsap.to(this.butterfly, {
      x: landX,
      y: landY,
      scale: 0.72,
      rotation: 0,
      duration: 0.65,
      ease: 'power2.out',
      overwrite: 'auto',
      onComplete: () => {
        if (this.state === this.STATES.PERCHED_ON_WORD && this.activePerchedWord === wordEl) {
          this.setFlightSpeed(false);
          this.butterfly.classList.add('perched');
          this.butterfly.classList.remove('hovering', 'flying');
          wordEl.classList.add('perched-word-active');
          // Softly drop 2-3 light rose petals / golden specks
          this.spawnRadialBurst(landX + 22, landY + 30, 3);
        }
      }
    });
  }

  /**
   * Lifts off from the word as soon as scroll begins
   */
  takeOffFromWord() {
    if (!this.butterfly || !window.gsap) return;

    if (this.activePerchedWord) {
      this.activePerchedWord.classList.remove('perched-word-active');
      this.activePerchedWord = null;
    }

    if (this.state === this.STATES.PERCHED_ON_WORD || this.state === this.STATES.HOVER_CUE) {
      const rect = this.butterfly.getBoundingClientRect();
      this.spawnRadialBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 3);
    }

    this.state = this.STATES.FLYING_SCROLL;
    this.butterfly.classList.remove('perched', 'hovering');
    this.setFlightSpeed(true);
  }
}

window.GlowingButterflyEngine = GlowingButterflyEngine;
