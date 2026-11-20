const Game = {
  chart: null,
  state: null,
  song: null,
  running: false,
  paused: false,
  raf: 0,
  onEnd: null,

  async start(song) {
    this.song = song;
    this.chart = Charts.build(song);
    this.state = Judge.createState();
    this.state.total = this.chart.notes.length;
    this.running = false;
    this.paused = false;
    Input.reset();
    FX.clear();
    Dancer.reset();
    HUD.setSong("下落 · " + song.title);
    HUD.update(this.state);
    Notes.resize();

    await AudioX.resume();
    Notes.draw(this.chart, 0, Input.held);
    await this._countdown();
    AudioX.playSong(song, this.chart.duration);
    this.running = true;
    this._watch();
    this._loop();
  },

  _countdown() {
    return new Promise((resolve) => {
      const el = document.getElementById("countdown");
      const steps = ["3", "2", "1", "GO"];
      let i = 0;
      el.classList.remove("hidden");
      const tick = () => {
        el.textContent = steps[i];
        Notes.draw(this.chart, Math.max(0, CFG.LEAD_IN - (4 - i) * 0.45), Input.held);
        i += 1;
        if (i > steps.length) {
          el.classList.add("hidden");
          resolve();
          return;
        }
        setTimeout(tick, 450);
      };
      tick();
    });
  },

  pause() {
    if (!this.running || this.paused) return;
    this.paused = true;
    cancelAnimationFrame(this.raf);
    if (AudioX.ctx) AudioX.ctx.suspend();
    document.getElementById("pause-overlay").classList.remove("hidden");
  },

  resume() {
    if (!this.paused) return;
    document.getElementById("pause-overlay").classList.add("hidden");
    this.paused = false;
    AudioX.resume().then(() => {
      this.running = true;
      this._loop();
    });
  },

  quit() {
    this.running = false;
    this.paused = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    clearInterval(this._watchId);
    AudioX.stopMusic();
    document.getElementById("pause-overlay").classList.add("hidden");
    document.getElementById("countdown").classList.add("hidden");
  },

  onInput(lane, isDown) {
    if (!this.running || this.paused) return;
    if (!isDown) {
      this._releaseHold(lane);
      return;
    }
    AudioX.tap();
    const now = AudioX.songTime();
    const note = this._nearest(lane, now);
    if (!note) {
      FX.laneBurst(lane);
      return;
    }
    const dt = now - note.t;
    const grade = Judge.windowOf(dt);
    if (!grade) return;

    note.hit = true;
    if (note.hold) {
      note.held = true;
      note.holdStart = now;
    }
    Judge.apply(this.state, grade);
    this._feedback(lane, grade);
  },

  _nearest(lane, now) {
    let best = null;
    let bestAbs = 999;
    for (const n of this.chart.notes) {
      if (n.lane !== lane || n.hit || n.missed) continue;
      const a = Math.abs(n.t - now);
      if (a < bestAbs && a <= CFG.WINDOWS.cool + 0.02) {
        bestAbs = a;
        best = n;
      }
    }
    return best;
  },

  _releaseHold(lane) {
    for (const n of this.chart.notes) {
      if (n.lane !== lane || !n.hold || !n.held || n.holdDone) continue;
      const now = AudioX.songTime();
      const end = n.t + n.dur;
      if (now >= end - CFG.WINDOWS.cool) {
        n.holdDone = true;
        Judge.holdTick(this.state);
        Judge.holdTick(this.state);
        FX.combo(this.state.combo);
      } else {
        n.holdDone = true;
        Judge.apply(this.state, "miss");
        this._feedback(lane, "miss");
      }
    }
  },

  _feedback(lane, grade) {
    AudioX.hit(grade);
    FX.judge(grade);
    FX.laneBurst(lane);
    const x = (lane + 0.5) / CFG.LANES;
    FX.sparks(0.1 + x * 0.8, CFG.HIT_Y_RATIO, CFG.LANE_COLORS[lane]);
    FX.ring(0.1 + x * 0.8, CFG.HIT_Y_RATIO, CFG.LANE_COLORS[lane]);
    if (grade === "perfect") FX.flash(0.5, 0.5);
    if (grade === "miss") FX.shake(true);
    Dancer.hit(lane, grade);
    FX.combo(this.state.combo);
    if (this.state.combo > 0 && this.state.combo % 25 === 0) Dancer.celebrate();
    HUD.update(this.state);
  },

  _loop() {
    if (!this.running || this.paused) return;
    try {
      const now = AudioX.songTime();
      Flow.autoMiss(this, now);
      Flow.holdProgress(this, now);
      Notes.draw(this.chart, now, Input.held);
      HUD.update(this.state);
      if (now >= this.chart.duration) {
        this._finish();
        return;
      }
    } catch (_) {}
    this.raf = requestAnimationFrame(() => this._loop());
  },

  _watch() {
    clearInterval(this._watchId);
    this._watchId = setInterval(() => {
      if (!this.running || this.paused) return;
      const now = AudioX.songTime();
      Flow.autoMiss(this, now);
      HUD.update(this.state);
      if (now >= this.chart.duration) this._finish();
    }, 250);
  },

  _finish() {
    this.running = false;
    this.raf = 0;
    clearInterval(this._watchId);
    AudioX.stopMusic();
    Dancer.celebrate();
    HUD.showResult(this.state, this.song);
    if (this.onEnd) this.onEnd(this.state);
  },
};
