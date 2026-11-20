const Notes = {
  canvas: null,
  ctx: null,
  w: 0,
  h: 0,
  hitY: 0,
  laneW: 0,
  padX: 0,

  init() {
    this.canvas = document.getElementById("lane-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
  },

  resize() {
    const wrap = document.getElementById("stage-wrap");
    const r = wrap.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = Math.max(280, Math.floor(r.width));
    this.h = Math.max(360, Math.floor(r.height));
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.canvas.style.width = this.w + "px";
    this.canvas.style.height = this.h + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.hitY = this.h * CFG.HIT_Y_RATIO;
    this.padX = this.w * 0.08;
    this.laneW = (this.w - this.padX * 2) / CFG.LANES;
  },

  laneX(lane) {
    return this.padX + this.laneW * lane + this.laneW * 0.5;
  },

  yOf(noteT, now) {
    const dt = noteT - now;
    return this.hitY - (dt / CFG.APPROACH) * this.hitY;
  },

  draw(chart, now, held) {
    const ctx = this.ctx;
    const { w, h, hitY, laneW, padX } = this;
    ctx.clearRect(0, 0, w, h);

    // lanes
    for (let i = 0; i < CFG.LANES; i++) {
      const x = padX + laneW * i;
      ctx.fillStyle = held.has(i) ? "rgba(45,226,230,0.14)" : "rgba(255,255,255,0.03)";
      ctx.fillRect(x + 2, 0, laneW - 4, h);
      ctx.strokeStyle = "rgba(45,226,230,0.12)";
      ctx.strokeRect(x + 2, 0, laneW - 4, h);
    }

    // hit line
    ctx.strokeStyle = "rgba(45,226,230,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padX, hitY);
    ctx.lineTo(w - padX, hitY);
    ctx.stroke();

    // receptors
    for (let i = 0; i < CFG.LANES; i++) {
      const x = this.laneX(i);
      const active = held.has(i);
      ctx.beginPath();
      ctx.arc(x, hitY, active ? 24 : 20, 0, Math.PI * 2);
      ctx.strokeStyle = CFG.LANE_COLORS[i];
      ctx.lineWidth = active ? 3.5 : 2.5;
      ctx.globalAlpha = active ? 1 : 0.7;
      ctx.stroke();
      if (active) {
        ctx.fillStyle = CFG.LANE_COLORS[i];
        ctx.globalAlpha = 0.28;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#e8f1ff";
      ctx.font = "700 15px Orbitron, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(CFG.LANE_LABELS[i], x, hitY);
    }

    // notes
    for (const n of chart.notes) {
      if (n.hit && !n.hold) continue;
      if (n.missed && !n.hold) continue;
      if (n.hold && n.holdDone) continue;
      const y = this.yOf(n.t, now);
      const endY = n.hold ? this.yOf(n.t + n.dur, now) : y;
      if (y < -40 && endY < -40) continue;
      if (y > h + 40 && (!n.hold || endY > h + 40)) continue;
      this._drawNote(n, y, endY);
    }
  },

  _drawNote(n, y, endY) {
    const ctx = this.ctx;
    const x = this.laneX(n.lane);
    const color = CFG.LANE_COLORS[n.lane];
    const holding = n.hold && n.held && !n.holdDone;

    if (n.hold) {
      const top = Math.min(y, endY);
      const bot = Math.max(y, endY);
      ctx.save();
      ctx.globalAlpha = holding ? 0.95 : 0.65;
      ctx.fillStyle = color;
      ctx.fillRect(x - 7, top, 14, Math.max(10, bot - top));
      ctx.restore();
    }

    ctx.beginPath();
    this._arrow(ctx, x, y, n.lane, 18);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    this._arrow(ctx, x, y, n.lane, 10);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fill();
  },

  _arrow(ctx, x, y, lane, s) {
    ctx.save();
    ctx.translate(x, y);
    const rot = [Math.PI / 2, Math.PI, 0, -Math.PI / 2][lane];
    ctx.rotate(rot);
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.7, s * 0.2);
    ctx.lineTo(s * 0.25, s * 0.2);
    ctx.lineTo(s * 0.25, s);
    ctx.lineTo(-s * 0.25, s);
    ctx.lineTo(-s * 0.25, s * 0.2);
    ctx.lineTo(-s * 0.7, s * 0.2);
    ctx.closePath();
    ctx.restore();
  },
};
