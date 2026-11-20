const FX = {
  layer: null,
  stage: null,
  judgeEl: null,
  comboEl: null,

  init() {
    this.layer = document.getElementById("fx-layer");
    this.stage = document.getElementById("stage-wrap");
    this.judgeEl = document.getElementById("judge-pop");
    this.comboEl = document.createElement("div");
    this.comboEl.className = "combo-flare";
    this.stage.appendChild(this.comboEl);
  },

  judge(grade) {
    const el = this.judgeEl;
    el.className = "judge-pop show " + grade;
    el.textContent = grade.toUpperCase();
    clearTimeout(this._jt);
    this._jt = setTimeout(() => { el.className = "judge-pop"; }, 560);
  },

  laneBurst(lane) {
    const el = document.createElement("div");
    el.className = "fx-lane-burst l" + lane;
    this.layer.appendChild(el);
    setTimeout(() => el.remove(), 300);
  },

  sparks(xRatio, yRatio, color) {
    const n = 8;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("div");
      s.className = "fx-spark";
      s.style.left = xRatio * 100 + "%";
      s.style.top = yRatio * 100 + "%";
      s.style.background = color;
      const ang = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      const dist = 28 + Math.random() * 36;
      s.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      s.style.setProperty("--dy", Math.sin(ang) * dist + "px");
      this.layer.appendChild(s);
      setTimeout(() => s.remove(), 460);
    }
  },

  ring(xRatio, yRatio, color) {
    const r = document.createElement("div");
    r.className = "fx-ring";
    r.style.left = xRatio * 100 + "%";
    r.style.top = yRatio * 100 + "%";
    r.style.width = "40px";
    r.style.height = "40px";
    r.style.borderColor = color;
    this.layer.appendChild(r);
    setTimeout(() => r.remove(), 420);
  },

  flash(xRatio, yRatio) {
    const f = document.createElement("div");
    f.className = "fx-flash";
    f.style.setProperty("--fx", xRatio * 100 + "%");
    f.style.setProperty("--fy", yRatio * 100 + "%");
    this.layer.appendChild(f);
    setTimeout(() => f.remove(), 240);
  },

  shake(hard) {
    this.stage.classList.remove("shake");
    void this.stage.offsetWidth;
    this.stage.classList.add("shake");
    if (!hard) setTimeout(() => this.stage.classList.remove("shake"), 300);
  },

  combo(n) {
    if (n < 10 || n % 10 !== 0) return;
    this.comboEl.textContent = n + " COMBO";
    this.comboEl.classList.remove("show");
    void this.comboEl.offsetWidth;
    this.comboEl.classList.add("show");
  },

  clear() {
    this.layer.innerHTML = "";
    this.judgeEl.className = "judge-pop";
    this.comboEl.classList.remove("show");
  },
};
