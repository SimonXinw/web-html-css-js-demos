const Input = {
  left: false,
  right: false,
  jump: false,
  jumpPressed: false,
  attack: false,
  attackPressed: false,
  switchPressed: false,
  dashPressed: false,
  skill: null,
  weaponSlot: 0,
  _map: {
    KeyA: "left", ArrowLeft: "left",
    KeyD: "right", ArrowRight: "right",
    KeyW: "jump", KeyK: "jump", ArrowUp: "jump", Space: "jump",
    KeyJ: "attack",
    KeyL: "dash", ShiftLeft: "dash", ShiftRight: "dash",
    KeyY: "y", KeyU: "u", KeyI: "i", KeyO: "o", KeyP: "o",
    Digit1: "w1", Digit2: "w2", Digit3: "w3", Digit4: "w4", Digit5: "w5",
    Numpad1: "w1", Numpad2: "w2", Numpad3: "w3", Numpad4: "w4", Numpad5: "w5",
  },

  init() {
    window.addEventListener("keydown", (e) => this._key(e, true));
    window.addEventListener("keyup", (e) => this._key(e, false));
    this._bindPad();
  },

  _key(e, down) {
    const act = this._map[e.code];
    if (!act) return;
    if (e.repeat) return;
    e.preventDefault();
    if (act === "jump") {
      if (down && !this.jump) this.jumpPressed = true;
      this.jump = down;
    } else if (act === "attack") {
      if (down && !this.attack) this.attackPressed = true;
      this.attack = down;
    } else if (act === "switch") {
      if (down) this.switchPressed = true;
    } else if (act === "dash") {
      if (down) this.dashPressed = true;
    } else if (act === "y" || act === "u" || act === "i" || act === "o") {
      if (down) this.skill = act;
    } else if (act[0] === "w" && act.length === 2) {
      if (down) this.weaponSlot = Number(act[1]);
    } else {
      this[act] = down;
    }
  },

  _bindPad() {
    const pad = document.getElementById("pad");
    if (!pad) return;
    pad.querySelectorAll("[data-act]").forEach((btn) => {
      const act = btn.dataset.act;
      const set = (down) => {
        btn.classList.toggle("active", down);
        if (act === "left" || act === "right") this[act] = down;
        if (act === "jump") {
          if (down && !this.jump) this.jumpPressed = true;
          this.jump = down;
        }
        if (act === "attack") {
          if (down && !this.attack) this.attackPressed = true;
          this.attack = down;
        }
        if (act === "switch" && down) this.switchPressed = true;
        if (act === "dash" && down) this.dashPressed = true;
        if ((act === "y" || act === "u" || act === "i" || act === "o") && down) this.skill = act;
      };
      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        btn.setPointerCapture(e.pointerId);
        set(true);
      });
      btn.addEventListener("pointerup", () => set(false));
      btn.addEventListener("pointercancel", () => set(false));
      btn.addEventListener("lostpointercapture", () => set(false));
    });
  },

  endFrame() {
    this.jumpPressed = false;
    this.attackPressed = false;
    this.switchPressed = false;
    this.dashPressed = false;
    this.skill = null;
    this.weaponSlot = 0;
  },
};
