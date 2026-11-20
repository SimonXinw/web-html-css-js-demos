const Sfx = {
  ctx: null,

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  },

  play(kind) {
    if (!Feel.sfx) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t = ctx.currentTime;
    if (kind === "cut") this._noiseBurst(ctx, t, 0.05, 1200, 2400, 0.18);
    if (kind === "rise") this._noiseBurst(ctx, t, 0.06, 700, 2600, 0.2);
    if (kind === "cleave") this._noiseBurst(ctx, t, 0.1, 360, 1500, 0.3);
    if (kind === "shot" || kind === "bow") this._pluck(ctx, t, 680, 0.07, 0.16);
    if (kind === "twin") this._pluck(ctx, t, 520, 0.08, 0.16);
    if (kind === "rain") this._pluck(ctx, t, 340, 0.14, 0.22);
    if (kind === "hop") this._thud(ctx, t, 240, 0.05, 0.1);
    if (kind === "dash") this._noiseBurst(ctx, t, 0.08, 400, 1800, 0.2);
    if (kind === "swordHit") this._thud(ctx, t, 90, 0.1, 0.32);
    if (kind === "arrowHit") this._thud(ctx, t, 160, 0.07, 0.22);
    if (kind === "die") this._noiseBurst(ctx, t, 0.16, 200, 600, 0.28);
  },

  _thud(ctx, t, freq, dur, vol) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.4, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  },

  _pluck(ctx, t, freq, dur, vol) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.7, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  },

  _noiseBurst(ctx, t, dur, f0, f1, vol) {
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(f0, t);
    filter.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    src.start(t);
    src.stop(t + dur + 0.02);
  },
};
