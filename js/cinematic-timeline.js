/**
 * CHAPTER 2 — CINEMATIC BUTTERFLY WEDDING EXPERIENCE
 * Cinematic Timeline & Story Choreographer (GSAP, Scroll & Music Orchestration)
 */

class CinematicTimelineController {
  constructor(butterflyEngine, musicEngine) {
    this.butterflyEngine = butterflyEngine;
    this.musicEngine = musicEngine;
    this.butterflyEl = document.getElementById('glowingBlueButterfly');
    this.videoEl = document.getElementById('heroOmniVideo');
    this.videoContainer = document.getElementById('heroVideoContainer');
    this.scrollCueEl = document.getElementById('scrollStoryCue');
    this.wrapperEl = document.querySelector('.cinematic-stage-wrapper');

    this.hasHandoffOccurred = false;
    this.scrollStopTimeout = null;
    this.lastScrollY = window.scrollY;
    this.xTo = null;
    this.yTo = null;
    this.rotTo = null;

    // Track hero video musical milestones to prevent repeating
    this.heroMusicFlags = {
      approach: false,
      orbit: false,
      handExtension: false,
      landing: false,
      reveal: false
    };
  }

  init() {
    this.initHeroVideoSequence();
    this.initScrollStoryGuide();
    this.initSmoothScrollCue();
    this.initSectionMusicObserver();
  }

  /**
   * Orchestrates the Hero Video, Butterfly Handoff & Synchronized Music
   * 1. Autoplay Omni video & start background score at 18%
   * 2. Synchronize musical phrase transitions with video character actions
   * 3. At 7.6s, pause video on final frame (Rahul smiling) and handoff to interactive butterfly at 25% volume
   */
  initHeroVideoSequence() {
    if (!this.videoEl) return;

    // Start video playback
    const playPromise = this.videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback if browser requires user gesture
        const onFirstGesture = () => {
          this.videoEl.play().catch(() => {});
          if (this.musicEngine && !this.musicEngine.isPlaying) {
            this.musicEngine.audio.play().then(() => {
              this.musicEngine.isPlaying = true;
              this.musicEngine.updateButtonUI(true);
              this.musicEngine.fadeToVolume(this.musicEngine.VOLUMES.HERO_OPEN, 1.5);
            }).catch(() => {});
          }
        };

        document.body.addEventListener('touchstart', onFirstGesture, { once: true });
        document.body.addEventListener('click', onFirstGesture, { once: true });
      });
    }

    // Monitor playback for exact timestamps & musical phase synchronization
    this.videoEl.addEventListener('timeupdate', () => {
      const curTime = this.videoEl.currentTime;

      // Phase 2: Butterfly enters & approaches Rahul (t ≈ 2.5s) -> 20%
      if (!this.heroMusicFlags.approach && curTime >= 2.5) {
        this.heroMusicFlags.approach = true;
        if (this.musicEngine) {
          this.musicEngine.setSectionVolume(this.musicEngine.VOLUMES.BUTTERFLY_APPROACH, 1.2);
        }
      }

      // Phase 3: Butterfly orbits around Rahul (t ≈ 4.2s) -> 22%
      if (!this.heroMusicFlags.orbit && curTime >= 4.2) {
        this.heroMusicFlags.orbit = true;
        if (this.musicEngine) {
          this.musicEngine.setSectionVolume(this.musicEngine.VOLUMES.BUTTERFLY_ORBIT, 1.2);
        }
      }

      // Phase 5: Rahul extends his hand (t ≈ 5.5s) -> 24%
      if (!this.heroMusicFlags.handExtension && curTime >= 5.5) {
        this.heroMusicFlags.handExtension = true;
        if (this.musicEngine) {
          this.musicEngine.setSectionVolume(this.musicEngine.VOLUMES.HAND_EXTENSION, 1.0);
        }
      }

      // Phase 6: Butterfly lands on Rahul's hand (t ≈ 6.8s) -> momentary dip to 18%, then rise to 21%
      if (!this.heroMusicFlags.landing && curTime >= 6.8) {
        this.heroMusicFlags.landing = true;
        if (this.musicEngine) {
          this.musicEngine.fadeToVolume(this.musicEngine.VOLUMES.BUTTERFLY_LANDING, 0.6, () => {
            if (!this.hasHandoffOccurred) {
              this.musicEngine.fadeToVolume(this.musicEngine.VOLUMES.BUTTERFLY_POST_LAND, 0.6);
            }
          });
        }
      }

      // Phase 7 & 8: Handoff timestamp (7.6s) -> Rahul ❤️ Shristi Reveal & Takeoff (25%)
      if (!this.hasHandoffOccurred && curTime >= 7.6) {
        this.executeButterflyHandoff();
      }
    });

    // Fallback onended
    this.videoEl.addEventListener('ended', () => {
      if (!this.hasHandoffOccurred) {
        this.executeButterflyHandoff();
      }
    });
  }

  executeButterflyHandoff() {
    this.hasHandoffOccurred = true;
    if (this.videoEl) {
      this.videoEl.pause(); // Freeze on Rahul's final smiling frame
    }
    if (this.butterflyEngine) {
      this.butterflyEngine.triggerVideoHandoff(this.videoContainer);
    }
    // Musical reveal: 25%
    if (this.musicEngine) {
      this.musicEngine.setSectionVolume(this.musicEngine.VOLUMES.COUPLE_REVEAL, 1.0);
    }
  }

  /**
   * Choreographs the butterfly guiding the user down through the wedding chapters
   */
  initScrollStoryGuide() {
    let ticking = false;

    if (window.gsap && this.butterflyEl) {
      this.xTo = gsap.quickTo(this.butterflyEl, 'x', { duration: 0.55, ease: 'power2.out' });
      this.yTo = gsap.quickTo(this.butterflyEl, 'y', { duration: 0.55, ease: 'power2.out' });
      this.rotTo = gsap.quickTo(this.butterflyEl, 'rotation', { duration: 0.4, ease: 'power2.out' });
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.onUserScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  onUserScroll() {
    const scrollY = window.scrollY;
    const scrollDelta = scrollY - this.lastScrollY;
    this.lastScrollY = scrollY;

    // If user scrolls before 7.6s, instantly handoff so scrolling is never blocked!
    if (!this.hasHandoffOccurred && scrollY > 30) {
      this.executeButterflyHandoff();
    }

    if (!this.butterflyEl || !this.hasHandoffOccurred || !window.gsap) return;

    // Immediately take off from any perched word on scroll!
    this.butterflyEngine.takeOffFromWord();

    const wrapperRect = this.wrapperEl ? this.wrapperEl.getBoundingClientRect() : {
      left: 0, width: window.innerWidth
    };

    // When scrolled all the way back to the top
    if (scrollY < 40) {
      const startX = wrapperRect.left + wrapperRect.width * 0.76;
      const startY = window.innerHeight * 0.72;

      gsap.to(this.butterflyEl, {
        x: startX,
        y: startY,
        scale: 0.9,
        rotation: 15,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: () => {
          this.butterflyEngine.setFlightSpeed(false);
          this.butterflyEl.classList.add('perched');
        }
      });

      if (this.musicEngine) {
        this.musicEngine.setSectionVolume(this.musicEngine.VOLUMES.HERO_OPEN, 1.2);
      }
      return;
    }

    // Active flight mode during scrolling
    this.butterflyEngine.setFlightSpeed(true);

    // Calculate dynamic flight path:
    // Glides down along the content with an ultra-smooth organic sway
    const baseColX = wrapperRect.left + wrapperRect.width * 0.78;
    const swayOffset = Math.sin(scrollY * 0.0035) * (wrapperRect.width * 0.07);
    const targetFlightX = Math.max(wrapperRect.left + 15, Math.min(wrapperRect.left + wrapperRect.width - 60, baseColX + swayOffset));
    
    // Vertical position stays in pleasant reading view (28% to 35% of viewport)
    const verticalFloat = (window.innerHeight * 0.30) + Math.sin(scrollY * 0.003) * 12;

    // Fluid flight banking tilt based on actual scroll velocity
    const targetTilt = Math.max(-16, Math.min(16, scrollDelta * 0.35));

    if (this.xTo && this.yTo && this.rotTo) {
      this.xTo(targetFlightX);
      this.yTo(verticalFloat);
      this.rotTo(targetTilt);
    } else {
      gsap.to(this.butterflyEl, {
        x: targetFlightX,
        y: verticalFloat,
        rotation: targetTilt,
        scale: 1,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }

    // Detect when scrolling stops: butterfly glides smoothly onto the best word!
    clearTimeout(this.scrollStopTimeout);
    this.scrollStopTimeout = setTimeout(() => {
      if (this.rotTo) this.rotTo(0);
      this.onScrollStop();
    }, 320);
  }

  onScrollStop() {
    if (!this.butterflyEngine || !this.butterflyEl || !window.gsap) return;

    // Direct butterfly to seek and perch on the nearest prominent word in the current viewport!
    this.butterflyEngine.perchOnBestWord();
  }

  /**
   * Initializes IntersectionObserver to subtly modulate background music volume
   * based on which story section is currently centered on screen
   */
  initSectionMusicObserver() {
    if (!this.musicEngine || !('IntersectionObserver' in window)) return;

    const sectionTargets = [
      { selector: '#weddingStory', volume: this.musicEngine.VOLUMES.SCROLL_DEFAULT },
      { selector: '#familySection', volume: this.musicEngine.VOLUMES.FAMILY },
      { selector: '#venuesSection', volume: this.musicEngine.VOLUMES.VENUES },
      { selector: '#countdownSection', volume: this.musicEngine.VOLUMES.COUNTDOWN },
      { selector: '#shareSection', volume: this.musicEngine.VOLUMES.SCROLL_DEFAULT }
    ];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          const match = sectionTargets.find(t => entry.target.matches(t.selector));
          if (match && !this.musicEngine.isFadingOutAtEnd) {
            this.musicEngine.setSectionVolume(match.volume, 1.4);
          }
        }
      });
    }, { threshold: [0.35, 0.6] });

    sectionTargets.forEach(t => {
      const el = document.querySelector(t.selector);
      if (el) observer.observe(el);
    });

    // Detailed Timeline Milestones Observer (Haldi, Sangeet, Wedding Ceremony, Reception)
    const timelineCards = [
      { query: '.timeline-event-card:nth-of-type(1)', vol: this.musicEngine.VOLUMES.HALDI },     // Haldi: 17%
      { query: '.timeline-event-card:nth-of-type(2)', vol: this.musicEngine.VOLUMES.SANGEET },   // Sangeet: 20%
      { query: '.wedding-main-highlight', vol: this.musicEngine.VOLUMES.CEREMONY },              // Vivah Sanskar Climax: 26%
      { query: '.timeline-event-card:nth-of-type(4)', vol: this.musicEngine.VOLUMES.RECEPTION }  // Reception: 19%
    ];

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          const match = timelineCards.find(c => entry.target.matches(c.query));
          if (match && !this.musicEngine.isFadingOutAtEnd) {
            this.musicEngine.setSectionVolume(match.vol, 1.2);
          }
        }
      });
    }, { threshold: [0.4] });

    timelineCards.forEach(c => {
      const el = document.querySelector(c.query);
      if (el) cardObserver.observe(el);
    });

    // Closing Section Observer for the 4-6s gradual cinematic fade-out
    const closingEl = document.getElementById('closingSection');
    if (closingEl) {
      const closingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            this.musicEngine.triggerClosingFadeOut();
          } else if (!entry.isIntersecting && window.scrollY < closingEl.offsetTop - 200) {
            this.musicEngine.cancelClosingFadeOut();
          }
        });
      }, { threshold: [0.3] });

      closingObserver.observe(closingEl);
    }
  }

  /**
   * Smooth navigation from the hero cue
   */
  initSmoothScrollCue() {
    if (!this.scrollCueEl) return;

    this.scrollCueEl.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = document.getElementById('weddingStory');
      if (targetSection) {
        if (!this.hasHandoffOccurred) {
          this.executeButterflyHandoff();
        }
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

window.CinematicTimelineController = CinematicTimelineController;
