const Cam = {
  x: 0,
  target: 0,

  reset(p) {
    this.target = this._aim(p);
    this.x = this.target;
  },

  _aim(p) {
    const lead = p.facing * 70;
    let x = p.x + p.w / 2 - CFG.W * 0.42 + lead;
    return Math.max(0, Math.min(CFG.WORLD - CFG.W, x));
  },

  update(p, dt) {
    this.target = this._aim(p);
    this.x += (this.target - this.x) * Math.min(1, 6 * dt);
  },

  apply(ctx) {
    ctx.translate(-Math.round(this.x) + FX.shakeX, FX.shakeY);
  },
};
