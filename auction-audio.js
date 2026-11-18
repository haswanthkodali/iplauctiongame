/**
 * IPL AUCTION GAME - AUDIO ENGINE (Web Audio API)
 * ============================================================================
 * Provides realistic zero-dependency synthesized audio:
 * - Gavel / Wood hammer strikes with acoustic impulse resonance
 * - Bidding chime & paddle raise pings
 * - Countdown ticking & heartbeats for final 3 seconds
 * - Triumphant stadium fanfare on SOLD
 * - Unsold double-tap gavel
 * - Toggle mute/unmute with persistent state
 * ============================================================================
 */

class AuctionAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;

    // Load persisted mute preference
    try {
      const saved = localStorage.getItem('ipl_auction_muted');
      if (saved !== null) {
        this.muted = saved === 'true';
      }
    } catch (e) {}
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    try {
      localStorage.setItem('ipl_auction_muted', String(this.muted));
    } catch (e) {}
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  /**
   * Authentic wooden gavel / hammer strike on oak block
   */
  playHammerStrike(power = 1.0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const gain = this.ctx.createGain();
    gain.connect(this.ctx.destination);

    // Initial sharp transient click
    const oscClick = this.ctx.createOscillator();
    oscClick.type = 'triangle';
    oscClick.frequency.setValueAtTime(380, t);
    oscClick.frequency.exponentialRampToValueAtTime(70, t + 0.08);

    const gainClick = this.ctx.createGain();
    gainClick.gain.setValueAtTime(0.8 * power, t);
    gainClick.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    oscClick.connect(gainClick);
    gainClick.connect(gain);

    // Deep wooden body resonance
    const oscBody = this.ctx.createOscillator();
    oscBody.type = 'sine';
    oscBody.frequency.setValueAtTime(140, t);
    oscBody.frequency.exponentialRampToValueAtTime(45, t + 0.22);

    const gainBody = this.ctx.createGain();
    gainBody.gain.setValueAtTime(0.9 * power, t);
    gainBody.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    oscBody.connect(gainBody);
    gainBody.connect(gain);

    // Noise burst for wood fiber impact
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.Q.setValueAtTime(3, t);

    const gainNoise = this.ctx.createGain();
    gainNoise.gain.setValueAtTime(0.5 * power, t);
    gainNoise.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    noise.connect(filter);
    filter.connect(gainNoise);
    gainNoise.connect(gain);

    oscClick.start(t);
    oscBody.start(t);
    noise.start(t);

    oscClick.stop(t + 0.15);
    oscBody.stop(t + 0.28);
    noise.stop(t + 0.06);
  }

  /**
   * Crisp UI bell / bid chime on paddle raise
   */
  playBidPaddle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(659.25, t); // E5
    osc1.frequency.exponentialRampToValueAtTime(880, t + 0.08); // A5

    osc2.frequency.setValueAtTime(1318.5, t); // E6
    osc2.frequency.exponentialRampToValueAtTime(1760, t + 0.1); // A6

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.36);
    osc2.stop(t + 0.36);
  }

  /**
   * Countdown tick (with heartbeat suspense if time <= 3s)
   */
  playCountdownTick(isUrgent = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (isUrgent) {
      // Deep suspenseful heartbeat thud
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.18);
      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    } else {
      // Gentle wooden clock click
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + (isUrgent ? 0.22 : 0.06));
  }

  /**
   * Triumphant fanfare when player is SOLD!
   */
  playSoldFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.12 }, // C5
      { freq: 659.25, time: 0.10, dur: 0.12 }, // E5
      { freq: 783.99, time: 0.20, dur: 0.16 }, // G5
      { freq: 1046.50, time: 0.34, dur: 0.45 } // C6
    ];

    const t = this.ctx.currentTime;
    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, t + n.time);

      gain.gain.setValueAtTime(0, t + n.time);
      gain.gain.linearRampToValueAtTime(0.35, t + n.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.time + n.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + n.time);
      osc.stop(t + n.time + n.dur + 0.05);
    });

    // Followed by double hammer strike
    setTimeout(() => this.playHammerStrike(1.2), 350);
  }

  /**
   * Somber double tap when player goes UNSOLD
   */
  playUnsoldDrop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    this.playHammerStrike(0.6);
    setTimeout(() => {
      this.playHammerStrike(0.7);
    }, 220);
  }

  /**
   * Rapid card/token riffle shuffle sound for Set Swaps
   */
  playShuffleSound() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const count = 7;
    for (let i = 0; i < count; i++) {
      const offset = i * 0.038;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400 + Math.random() * 600, t + offset);
      osc.frequency.exponentialRampToValueAtTime(150, t + offset + 0.03);

      gain.gain.setValueAtTime(0.25, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + offset);
      osc.stop(t + offset + 0.04);
    }

    // Finished with a crisp bell chime
    setTimeout(() => {
      this.playBidPaddle();
    }, 260);
  }
}

// Global instance
window.AuctionAudio = new AuctionAudioEngine();
