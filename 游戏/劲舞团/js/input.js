const Input = {
  down: new Set(),
  held: new Set(),
  listeners: [],
  padEls: [],

  init() {
    this.padEls = [...document.querySelectorAll(".pad-key")];
    window.addEventListener("keydown", (e) => this._key(e, true));
    window.addEventListener("keyup", (e) => this._key(e, false));

    this.padEls.forEach((btn) => {
      const lane = Number(btn.dataset.lane);
      const on = (ev) => {
        ev.preventDefault();
        this._lane(lane, true);
        btn.classList.add("pressed");
      };
      const off = (ev) => {
        ev.preventDefault();
        this._lane(lane, false);
        btn.classList.remove("pressed");
      };
      btn.addEventListener("pointerdown", on);
      btn.addEventListener("pointerup", off);
      btn.addEventListener("pointerleave", off);
      btn.addEventListener("pointercancel", off);
    });
  },

  onLane(fn) {
    this.listeners.push(fn);
  },

  _key(e, isDown) {
    const lane = CFG.LANE_KEYS[e.code];
    if (lane == null) return;
    e.preventDefault();
    this._lane(lane, isDown);
    const btn = this.padEls[lane];
    if (btn) btn.classList.toggle("pressed", isDown);
  },

  _lane(lane, isDown) {
    if (isDown) {
      if (this.down.has(lane)) return;
      this.down.add(lane);
      this.held.add(lane);
      this.listeners.forEach((fn) => fn(lane, true));
    } else {
      this.down.delete(lane);
      this.held.delete(lane);
      this.listeners.forEach((fn) => fn(lane, false));
    }
  },

  isHeld(lane) {
    return this.held.has(lane);
  },

  reset() {
    this.down.clear();
    this.held.clear();
    this.padEls.forEach((b) => b.classList.remove("pressed"));
  },
};
