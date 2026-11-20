const ClassicView = {
  init() {
    this.box = document.getElementById("classic-arrows");
    this.hint = document.getElementById("classic-hint");
    this.dock = document.getElementById("classic-dock");
    this.anchor = document.getElementById("classic-anchor");
    this.popEl = document.getElementById("classic-pop");
    this.spaceBtn = document.getElementById("pad-space");
    this.slots = [];
  },

  countdown() {
    return new Promise((resolve) => {
      const el = document.getElementById("countdown");
      const steps = ["3", "2", "1", "GO"];
      let i = 0;
      el.classList.remove("hidden");
      const tick = () => {
        if (i >= steps.length) {
          el.classList.add("hidden");
          resolve();
          return;
        }
        el.textContent = steps[i];
        i += 1;
        setTimeout(tick, 450);
      };
      tick();
    });
  },

  show(phrase) {
    this.box.innerHTML = "";
    this.slots = phrase.arrows.map((lane, i) => {
      const el = document.createElement("div");
      const turn = [-90, 180, 0, 90][lane];
      el.className = "arrow-slot" + (i === 0 ? " current" : "");
      el.dataset.dir = String(lane);
      el.style.animationDelay = i * 50 + "ms";
      el.innerHTML = '<svg class="arrow-glyph" viewBox="0 0 24 24" style="transform:rotate(' +
        turn + 'deg)"><path fill="currentColor" d="M12 1 22.5 12H16.2V23H7.8V12H1.5z"/></svg>';
      this.box.appendChild(el);
      return el;
    });
    this.arm(false);
    this.dock.classList.remove("bad", "hot", "perfect-hot");
    this.anchor.style.left = "0%";
    this.popEl.className = "rail-pop";
    this.hintText("看清舞步");
  },

  mark(index) {
    const el = this.slots[index];
    if (!el) return;
    el.classList.remove("current");
    el.classList.add("ok");
    const next = this.slots[index + 1];
    if (next) next.classList.add("current");
  },

  missSlot(index) {
    const el = this.slots[index];
    if (el) el.classList.add("bad");
    this.dock.classList.remove("bad");
    void this.dock.offsetWidth;
    this.dock.classList.add("bad");
  },

  arm(on) {
    this.spaceBtn.classList.toggle("armed", on);
    this.dock.classList.toggle("armed", on);
    if (!on) this.spaceBtn.classList.remove("hot");
    if (on) this.hintText("等锚点进入亮区");
  },

  hintText(text) {
    this.hint.textContent = text;
  },

  pos(phrase, now) {
    if (!phrase || phrase.state === "preview" || now < phrase.start) return 0;
    const span = Math.max(0.001, phrase.end - phrase.start);
    return (now - phrase.start) / span;
  },

  grade(pos) {
    const d = Math.abs(pos - 0.84);
    if (d > 0.06) return null;
    if (d <= 0.014) return "perfect";
    if (d <= 0.032) return "great";
    return "cool";
  },

  pop(grade, pos) {
    const el = this.popEl;
    const name = { perfect: "PERFECT", great: "GOOD", cool: "COOL", miss: "MISS" };
    const at = Math.max(0.08, Math.min(0.92, pos || 0));
    el.style.left = at * 100 + "%";
    el.textContent = name[grade] || "MISS";
    el.className = "rail-pop " + (grade || "miss");
    void el.offsetWidth;
    el.classList.add("show");
  },

  paint(phrase, now) {
    if (!phrase || phrase.state === "wait" || phrase.state === "dance" || phrase.state === "fail") {
      return;
    }
    const pos = Math.max(0, Math.min(1, this.pos(phrase, now)));
    this.anchor.style.left = pos * 100 + "%";
    const g = this.grade(pos);
    const hot = !!g && phrase.state === "armed";
    this.dock.classList.toggle("hot", hot);
    this.dock.classList.toggle("perfect-hot", hot && g === "perfect");
    this.spaceBtn.classList.toggle("hot", hot);
    if (phrase.state !== "armed") return;
    this.hintText(g ? "按空格" : "等锚点进入亮区");
  },

  dance(arrows, grade, token, getToken) {
    let i = 0;
    const step = () => {
      if (token !== getToken()) return;
      if (i >= arrows.length) {
        if (grade === "perfect") Dancer.celebrate();
        return;
      }
      Dancer.hit(arrows[i], grade);
      FX.sparks(0.5, 0.55, "#ff6b8a");
      i += 1;
      setTimeout(step, 120);
    };
    step();
  },

  clear() {
    this.box.innerHTML = "";
    this.slots = [];
    this.arm(false);
    this.hintText("准备");
    this.anchor.style.left = "0%";
    this.popEl.className = "rail-pop";
    this.dock.classList.remove("bad", "armed", "hot", "perfect-hot");
  },
};
