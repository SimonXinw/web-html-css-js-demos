window.LOL = window.LOL || {};

LOL.Input = {
  mouse: { x: 0, y: 0, worldX: 0, worldY: 0, downL: false, downR: false, downM: false },
  keys: Object.create(null),
  codes: Object.create(null),
  aMode: false,
  shopOpen: false,
  unitHoverId: null,
  pointerInside: false,

  bind(canvas) {
    const toLocal = (e) => {
      const r = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left;
      this.mouse.y = e.clientY - r.top;
      if (LOL.Scene3D?.unproject) {
        const w = LOL.Scene3D.unproject(this.mouse.x, this.mouse.y);
        this.mouse.worldX = w.x;
        this.mouse.worldY = w.y;
      }
    };

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('auxclick', (e) => e.preventDefault());
    canvas.addEventListener('mouseenter', () => { this.pointerInside = true; });
    canvas.addEventListener('mouseleave', () => { this.pointerInside = false; });
    canvas.addEventListener('mousemove', (e) => toLocal(e));
    canvas.addEventListener('mousedown', (e) => {
      toLocal(e);
      if (e.button === 0) this.mouse.downL = true;
      if (e.button === 1) {
        this.mouse.downM = true;
        e.preventDefault();
      }
      if (e.button === 2) this.mouse.downR = true;
    });
    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouse.downL = false;
      if (e.button === 1) this.mouse.downM = false;
      if (e.button === 2) this.mouse.downR = false;
    });
    window.addEventListener('keydown', (e) => {
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (LOL.Binds && LOL.Binds.capture(e)) return;
      if (e.code === 'Space') e.preventDefault();
      if (e.repeat) return;
      const k = e.key.toLowerCase();
      this.keys[k] = true;
      this.codes[e.code] = true;
      if (LOL.Binds) LOL.Binds.press(e.code);
      if (e.code === 'Escape') this.shopOpen = false;
    }, true);
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.codes[e.code] = false;
    });
  },

  consumeClick(btn) {
    if (btn === 'L' && this.mouse.downL) {
      this.mouse.downL = false;
      return true;
    }
    if (btn === 'R' && this.mouse.downR) {
      this.mouse.downR = false;
      return true;
    }
    return false;
  },
};
