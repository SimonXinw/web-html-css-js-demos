const AudioX = {
  ctx: null,
  master: null,
  musicGain: null,
  sfxGain: null,
  playing: false,
  startAt: 0,
  pauseAt: 0,
  song: null,
  timers: [],
  nodes: [],

  ensure() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.55;
    this.musicGain.connect(this.master);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.7;
    this.sfxGain.connect(this.master);
  },

  async resume() {
    this.ensure();
    if (this.ctx.state === "suspended") await this.ctx.resume();
  },

  now() {
    return this.ctx ? this.ctx.currentTime : 0;
  },

  songTime() {
    if (!this.playing || !this.ctx) return this.pauseAt;
    return this.ctx.currentTime - this.startAt;
  },

  stopMusic() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    this.nodes.forEach((n) => {
      try { n.stop(); } catch (_) {}
      try { n.disconnect(); } catch (_) {}
    });
    this.nodes = [];
    this.playing = false;
  },

  playSong(song, duration) {
    this.stopMusic();
    this.ensure();
    this.song = song;
    this.playing = true;
    this.startAt = this.ctx.currentTime;
    this.pauseAt = 0;
    this._scheduleBeat(song, duration);
  },

  _scheduleBeat(song, duration) {
    const beat = 60 / song.bpm;
    const start = this.ctx.currentTime;
    const end = start + duration;
    let t = start + CFG.LEAD_IN;
    let step = 0;

    while (t < end) {
      this._kick(t);
      this._hat(t + beat * 0.5);
      if (step % 2 === 1 || song.style !== "pulse") this._snare(t + beat);
      this._bass(t, song, step);
      if (song.style === "rush") this._hat(t + beat * 1.5);
      if (song.style === "fever") {
        this._lead(t + beat * 0.25, step);
        this._lead(t + beat * 0.75, step + 1);
      }
      step += 1;
      t += beat * 2;
    }
  },

  _tone(type, freq, t, dur, gain, dest, track) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    const peak = Math.max(0.001, gain);
    g.gain.setValueAtTime(0.001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, t + Math.max(0.03, dur));
    o.connect(g);
    g.connect(dest || this.musicGain);
    o.start(t);
    o.stop(t + dur + 0.03);
    if (track !== false) this.nodes.push(o);
  },

  _kick(t) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.14);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g); g.connect(this.musicGain);
    o.start(t); o.stop(t + 0.2);
    this.nodes.push(o);
  },

  _hat(t) {
    this._tone("square", 6200, t, 0.04, 0.07);
  },

  _snare(t) {
    this._tone("triangle", 220, t, 0.08, 0.18);
    this._tone("square", 180, t, 0.06, 0.08);
  },

  _bass(t, song, step) {
    const roots = song.style === "fever" ? [55, 61, 65, 49]
      : song.style === "rush" ? [62, 55, 69, 62] : [49, 55, 49, 41];
    const root = roots[step % roots.length];
    this._tone("sawtooth", root, t, 0.28, 0.11);
    this._tone("sawtooth", root * 1.5, t + 0.35, 0.18, 0.07);
  },

  _lead(t, step) {
    const scale = [0, 3, 5, 7, 10, 12, 15, 17];
    const n = scale[step % scale.length];
    const f = 220 * Math.pow(2, n / 12);
    this._tone("square", f, t, 0.11, 0.055);
  },

  hit(grade) {
    this.ensure();
    const t = this.ctx.currentTime;
    const map = { perfect: 880, great: 660, cool: 520, miss: 120 };
    const f = map[grade] || 400;
    if (grade === "miss") {
      this._tone("sawtooth", f, t, 0.12, 0.16, this.sfxGain, false);
      return;
    }
    this._tone("sine", f, t, 0.08, 0.22, this.sfxGain, false);
    this._tone("triangle", f * 2, t, 0.06, 0.1, this.sfxGain, false);
  },

  tap() {
    this.ensure();
    const t = this.ctx.currentTime;
    this._tone("square", 440, t, 0.03, 0.08, this.sfxGain, false);
  },
};
