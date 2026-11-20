const Classic = {
  pack: null,
  state: null,
  song: null,
  phrase: null,
  running: false,
  paused: false,
  raf: 0,
  onEnd: null,
  token: 0,

  init() {
    ClassicView.init();
    const space = document.getElementById("pad-space");
    space.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      this.onSpace();
    });
    window.addEventListener("keydown", (e) => {
      if (e.code !== "Space" || e.repeat) return;
      e.preventDefault();
      this.onSpace();
    });
  },

  async start(song) {
    this.song = song;
    this.pack = Seq.build(song);
    this.state = Judge.createState();
    this.state.total = this.pack.phrases.length;
    this.phrase = null;
    this.running = false;
    this.paused = false;
    this.token += 1;
    Input.reset();
    FX.clear();
    Dancer.reset();
    ClassicView.clear();
    HUD.setSong("经典 · " + song.title);
    HUD.update(this.state);
    await AudioX.resume();
    await ClassicView.countdown();
    AudioX.playSong(song, this.pack.duration);
    this.running = true;
    this._watch();
    this._loop();
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
    this.token += 1;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    clearInterval(this._watchId);
    AudioX.stopMusic();
    document.getElementById("pause-overlay").classList.add("hidden");
    document.getElementById("countdown").classList.add("hidden");
    ClassicView.clear();
  },

  onKey(lane, isDown) {
    if (!isDown || !this.running || this.paused) return;
    const p = this.phrase;
    if (!p || (p.state !== "input" && p.state !== "preview")) return;
    if (lane !== p.arrows[p.typed]) {
      this._fail(p);
      return;
    }
    ClassicView.mark(p.typed);
    Dancer.hit(lane, "cool");
    AudioX.tap();
    p.typed += 1;
    if (p.typed < p.arrows.length) return;
    p.state = "armed";
    ClassicView.arm(true);
  },

  onSpace() {
    if (!this.running || this.paused) return;
    const p = this.phrase;
    if (!p || p.state === "preview") return;
    if (AudioX.songTime() < p.start) return;
    if (p.state !== "input" && p.state !== "armed") return;
    if (p.typed < p.arrows.length) {
      this._fail(p);
      return;
    }
    const pos = ClassicView.pos(p, AudioX.songTime());
    const grade = ClassicView.grade(pos);
    if (!grade) this._fail(p, pos);
    else this._ok(p, grade, pos);
  },

  _ok(p, grade, pos) {
    if (p.state === "dance" || p.state === "fail") return;
    p.state = "dance";
    ClassicView.arm(false);
    ClassicView.pop(grade, pos);
    Judge.apply(this.state, grade);
    FX.judge(grade);
    AudioX.hit(grade);
    if (grade === "perfect") FX.flash(0.5, 0.45);
    FX.combo(this.state.combo);
    ClassicView.dance(p.arrows, grade, this.token, () => this.token);
    ClassicView.hintText("起舞");
    HUD.update(this.state);
  },

  _fail(p, pos) {
    if (p.state === "dance" || p.state === "fail") return;
    p.state = "fail";
    const at = pos == null ? ClassicView.pos(p, AudioX.songTime()) : pos;
    ClassicView.pop("miss", at);
    ClassicView.arm(false);
    ClassicView.missSlot(p.typed);
    Judge.apply(this.state, "miss");
    FX.judge("miss");
    FX.shake(true);
    Dancer.hit(p.arrows[p.typed] || 0, "miss");
    try { AudioX.hit("miss"); } catch (_) {}
    ClassicView.hintText("MISS");
    HUD.update(this.state);
  },

  _advance(now) {
    for (const p of this.pack.phrases) {
      if (p.state === "wait" && now >= p.show) {
        p.state = "preview";
        this.phrase = p;
        ClassicView.show(p);
      }
      if (p.state === "preview" && now >= p.start) {
        p.state = p.typed >= p.arrows.length ? "armed" : "input";
        if (p.state === "input") ClassicView.hintText("按顺序点亮");
      }
      const open = p.state === "input" || p.state === "armed";
      if (open && now >= p.end) this._fail(p, ClassicView.pos(p, now));
    }
  },

  _loop() {
    if (!this.running || this.paused) return;
    const now = AudioX.songTime();
    this._advance(now);
    ClassicView.paint(this.phrase, now);
    if (now >= this.pack.duration) {
      this._finish();
      return;
    }
    this.raf = requestAnimationFrame(() => this._loop());
  },

  _watch() {
    clearInterval(this._watchId);
    this._watchId = setInterval(() => {
      if (!this.running || this.paused) return;
      const now = AudioX.songTime();
      this._advance(now);
      ClassicView.paint(this.phrase, now);
      if (now >= this.pack.duration) this._finish();
    }, 200);
  },

  _finish() {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.raf);
    clearInterval(this._watchId);
    AudioX.stopMusic();
    Dancer.celebrate();
    HUD.showResult(this.state, this.song);
    if (this.onEnd) this.onEnd(this.state);
  },
};
