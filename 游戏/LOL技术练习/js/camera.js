window.LOL = window.LOL || {};

LOL.Camera = {
  x: 0,
  y: 0,
  ready: false,
  free: false,
  pinned: false,
  wasSpace: false,
  dragX: 0,
  dragY: 0,

  update(player, dt) {
    if (!this.ready) {
      this.x = player.x;
      this.y = player.y;
      this.ready = true;
    }
    const space = !!LOL.Input.keys[' '];
    if (space || this.pinned) {
      this.free = false;
      this.wasSpace = space;
      this.glide(player, dt);
      this.syncDrag();
      return;
    }
    if (this.wasSpace) this.free = true;
    this.wasSpace = false;
    if (this.panEdge(dt) || this.panDrag()) this.free = true;
    if (this.free) this.clamp();
    else this.glide(player, dt);
  },

  glide(player, dt) {
    const t = Math.min(1, dt * 12);
    this.x += (player.x - this.x) * t;
    this.y += (player.y - this.y) * t;
  },

  syncDrag() {
    this.dragX = LOL.Input.mouse.x;
    this.dragY = LOL.Input.mouse.y;
  },

  panEdge(dt) {
    if (!LOL.Input.pointerInside) return false;
    const canvas = LOL.Scene3D.canvas;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const margin = Math.max(28, Math.min(w, h) * 0.045);
    const mx = LOL.Input.mouse.x;
    const my = LOL.Input.mouse.y;
    let ax = 0;
    let ay = 0;
    if (mx < margin) ax = -((margin - mx) / margin);
    else if (mx > w - margin) ax = (mx - (w - margin)) / margin;
    if (my < margin) ay = -((margin - my) / margin);
    else if (my > h - margin) ay = (my - (h - margin)) / margin;
    if (!ax && !ay) return false;
    const len = Math.hypot(ax, ay) || 1;
    this.x += (ax / len) * 1700 * dt;
    this.y += (ay / len) * 1700 * dt;
    return true;
  },

  panDrag() {
    const m = LOL.Input.mouse;
    if (!m.downM) {
      this.syncDrag();
      return false;
    }
    const a = LOL.Scene3D.unproject(this.dragX, this.dragY);
    const b = LOL.Scene3D.unproject(m.x, m.y);
    this.syncDrag();
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    if (Math.hypot(dx, dy) < 0.5) return false;
    this.x -= dx;
    this.y -= dy;
    return true;
  },

  clamp() {
    const pad = 160;
    this.x = LOL.Math.clamp(this.x, pad, LOL.CONFIG.MAP_W - pad);
    this.y = LOL.Math.clamp(this.y, pad, LOL.CONFIG.MAP_H - pad);
  },
};
