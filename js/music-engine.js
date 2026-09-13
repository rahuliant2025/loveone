/**
 * CHAPTER 2 — CINEMATIC BUTTERFLY WEDDING EXPERIENCE
 * Centralized Cinematic Music Engine & Volume Orchestrator
 * Soundtrack: 'Ranjha' (Shershaah) — Single continuous background score
 */

class CinematicMusicEngine {
  constructor() {
    this.audioSrc = 'assets/music/ranjha.mp3';
    this.audio = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.hasUserInteracted = false;
    this.currentVolume = 0;
    this.targetVolume = 0.18;
    this.volumeTween = null;
    this.isFadingOutAtEnd = false;

    // Strict Target Volume Constants (Never exceed ~0.28)
    this.VOLUMES = {
      HERO_OPEN: 0.18,
      BUTTERFLY_APPROACH: 0.20,
      BUTTERFLY_ORBIT: 0.22,
      HAND_EXTENSION: 0.24,
      BUTTERFLY_LANDING: 0.18,
      BUTTERFLY_POST_LAND: 0.21,
      COUPLE_REVEAL: 0.25,
      WEDDING_DATE: 0.22,
      BUTTERFLY_LEAVES_HERO: 0.22,
      SCROLL_DEFAULT: 0.17,
      FAMILY: 0.15,
      HALDI: 0.17,
      MEHENDI: 0.17,
      SANGEET: 0.20,
      CEREMONY: 0.26, // Emotional climax (sacred Trisharan)
      RECEPTION: 0.19,
      VENUES: 0.17,
      COUNTDOWN: 0.17,
      FINAL_BLESSING_START: 0.18,
      SILENCE: 0.00
    };

    this.toggleBtn = null;
    this.waveBars = null;
    this.musicLabel = null;
  }

  init() {
    this.createAudioInstance();
    this.bindUIControls();
    this.setupAutoplayUnblocker();
  }

  /**
   * Instantiates a single, persistent HTML5 Audio element
   */
  createAudioInstance() {
    if (this.audio) return;

    this.audio = new Audio(this.audioSrc);
    this.audio.loop = true;
    this.audio.preload = 'auto';
    this.audio.volume = 0; // Starts at 0, smoothly fades in

    // Handle audio error gracefully
    this.audio.addEventListener('error', (e) => {
      console.warn('Cinematic audio file notice:', e);
    });
  }

  /**
   * Binds the floating music toggle button
   */
  bindUIControls() {
    this.toggleBtn = document.getElementById('musicToggleBtn');
    if (this.toggleBtn) {
      this.waveBars = this.toggleBtn.querySelector('.music-wave-bars');
      this.musicLabel = this.toggleBtn.querySelector('.music-label');

      this.toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePlayState();
      });
    }
  }

  /**
   * Modern browser autoplay unblocker
   * Plays silently or on first user gesture (touch, click, scroll)
   */
  setupAutoplayUnblocker() {
    // Attempt instant gentle autoplay
    const tryPlay = () => {
      if (this.isPlaying) return;
      const playPromise = this.audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.updateButtonUI(true);
            // Smooth fade-in: 0% -> 18% over 1.8 seconds
            this.fadeToVolume(this.VOLUMES.HERO_OPEN, 1.8);
          })
          .catch(() => {
            // Browser blocked unmuted autoplay; wait for first interaction
            this.updateButtonUI(false);
          });
      }
    };

    tryPlay();

    // Fallback listeners for first user interaction
    const unlockOnInteraction = () => {
      if (this.hasUserInteracted) return;
      this.hasUserInteracted = true;

      if (!this.isPlaying && !this.isMuted) {
        this.audio.play()
          .then(() => {
            this.isPlaying = true;
            this.updateButtonUI(true);
            this.fadeToVolume(this.targetVolume || this.VOLUMES.HERO_OPEN, 1.5);
          })
          .catch(() => {});
      }

      window.removeEventListener('touchstart', unlockOnInteraction);
      window.removeEventListener('click', unlockOnInteraction);
      window.removeEventListener('scroll', unlockOnInteraction);
    };

    window.addEventListener('touchstart', unlockOnInteraction, { passive: true, once: true });
    window.addEventListener('click', unlockOnInteraction, { once: true });
    window.addEventListener('scroll', unlockOnInteraction, { passive: true, once: true });
  }

  /**
   * Toggles play/pause (mute/unmute) with a smooth transition
   */
  togglePlayState() {
    if (!this.audio) return;
    this.hasUserInteracted = true;

    if (this.isMuted || !this.isPlaying) {
      // Unmute / Play
      this.isMuted = false;
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.updateButtonUI(true);
        this.fadeToVolume(this.targetVolume || this.VOLUMES.SCROLL_DEFAULT, 0.8);
      }).catch(err => console.warn('Audio play request failed:', err));
    } else {
      // Mute / Pause
      this.isMuted = true;
      this.fadeToVolume(0, 0.5, () => {
        this.audio.pause();
        this.isPlaying = false;
        this.updateButtonUI(false);
      });
    }
  }

  /**
   * Smooth volume tweening (GSAP or requestAnimationFrame)
   */
  fadeToVolume(targetVol, duration = 1.0, onComplete = null) {
    if (!this.audio || this.isMuted) {
      if (onComplete) onComplete();
      return;
    }

    // Never exceed 0.28 safety cap
    const safeTarget = Math.min(Math.max(targetVol, 0), 0.28);
    this.targetVolume = safeTarget;

    if (window.gsap) {
      if (this.volumeTween) this.volumeTween.kill();

      this.volumeTween = gsap.to(this.audio, {
        volume: safeTarget,
        duration: duration,
        ease: 'sine.inOut',
        onUpdate: () => {
          this.currentVolume = this.audio.volume;
        },
        onComplete: () => {
          this.volumeTween = null;
          if (onComplete) onComplete();
        }
      });
    } else {
      // Fallback manual interpolation
      const startVol = this.audio.volume;
      const startTime = performance.now();
      const ms = duration * 1000;

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / ms, 1);
        const smoothProgress = 0.5 - Math.cos(progress * Math.PI) / 2; // easeInOut
        this.audio.volume = startVol + (safeTarget - startVol) * smoothProgress;
        this.currentVolume = this.audio.volume;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          if (onComplete) onComplete();
        }
      };

      requestAnimationFrame(step);
    }
  }

  /**
   * Sets target volume for a given narrative section
   */
  setSectionVolume(volumeConstant, transitionDuration = 1.2) {
    if (this.isFadingOutAtEnd) return; // Do not override final blessing fade-out
    this.fadeToVolume(volumeConstant, transitionDuration);
  }

  /**
   * Performs the gradual 4–6 second cinematic fade-out at the closing blessing
   */
  triggerClosingFadeOut() {
    if (this.isFadingOutAtEnd || !this.audio) return;
    this.isFadingOutAtEnd = true;

    // 18% -> 12% -> 6% -> 0% over 5.0 seconds
    this.fadeToVolume(0, 5.0, () => {
      this.updateButtonUI(false);
    });
  }

  /**
   * Re-arms music if the visitor scrolls back up from the bottom
   */
  cancelClosingFadeOut() {
    if (!this.isFadingOutAtEnd) return;
    this.isFadingOutAtEnd = false;
    this.fadeToVolume(this.VOLUMES.SCROLL_DEFAULT, 1.5);
    this.updateButtonUI(true);
  }

  /**
   * Updates floating toggle button visual states (playing / paused)
   */
  updateButtonUI(isActive) {
    if (!this.toggleBtn) return;

    if (isActive) {
      this.toggleBtn.classList.add('playing');
      this.toggleBtn.setAttribute('aria-pressed', 'true');
      this.toggleBtn.setAttribute('title', 'Pause Wedding Music (Ranjha)');
      if (this.musicLabel) this.musicLabel.textContent = 'MUSIC';
    } else {
      this.toggleBtn.classList.remove('playing');
      this.toggleBtn.setAttribute('aria-pressed', 'false');
      this.toggleBtn.setAttribute('title', 'Play Wedding Music (Ranjha)');
      if (this.musicLabel) this.musicLabel.textContent = 'MUTED';
    }
  }
}

window.CinematicMusicEngine = CinematicMusicEngine;
