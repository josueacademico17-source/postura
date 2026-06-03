export class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.ambientGain = null;
  }

  init() {
    if (this.ctx || !this.enabled) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.setupAmbient();
    } catch {
      this.enabled = false;
    }
  }

  resume() {
    if (this.ctx?.state === 'suspended') this.ctx.resume();
  }

  beep(freq, duration, type = 'sine', volume = 0.1) {
    if (!this.enabled || !this.ctx) return;
    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    oscillator.connect(gain);
    gain.connect(this.ctx.destination);
    oscillator.type = type;
    oscillator.frequency.value = freq;
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    oscillator.start();
    oscillator.stop(this.ctx.currentTime + duration);
  }

  sweep(from, to, duration, type = 'sawtooth', volume = 0.08) {
    if (!this.enabled || !this.ctx) return;
    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, this.ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(to, this.ctx.currentTime + duration);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration + 0.05);
    oscillator.start();
    oscillator.stop(this.ctx.currentTime + duration + 0.1);
  }

  playScanner() {
    this.sweep(150, 900, 0.35, 'sawtooth', 0.07);
  }

  playBadPosture() {
    this.beep(200, 0.24, 'square', 0.08);
    setTimeout(() => this.beep(160, 0.18, 'square', 0.07), 270);
  }

  playGoodPosture() {
    this.beep(880, 0.12, 'sine', 0.1);
    setTimeout(() => this.beep(1100, 0.18, 'sine', 0.08), 130);
  }

  playPurchase() {
    [523, 659, 784].forEach((freq, index) => setTimeout(() => this.beep(freq, 0.28, 'sine', 0.12), index * 80));
  }

  playAchievement() {
    [523, 659, 784, 1047].forEach((freq, index) => setTimeout(() => this.beep(freq, 0.35, 'triangle', 0.14), index * 90));
  }

  playEmail() {
    this.beep(660, 0.1, 'sine', 0.08);
    setTimeout(() => this.beep(880, 0.14, 'sine', 0.06), 110);
  }

  playVictory() {
    [523, 659, 784, 523, 659, 784, 1047, 1175].forEach((freq, index) => {
      setTimeout(() => this.beep(freq, 0.45, 'triangle', 0.15), index * 110);
    });
  }

  setAmbient(productivityRatio) {
    if (this.ambientGain) this.ambientGain.gain.value = Math.max(0.005, productivityRatio * 0.04);
  }

  setupAmbient() {
    const sampleRate = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, sampleRate * 3, sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;
    for (let i = 0; i < data.length; i += 1) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.025;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.5;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    source.start();
    this.ambientGain = gain;
  }
}
