const FX = {
  hitstopLeft: 0, shakeAmp: 0, shakeX: 0, shakeY: 0, flashAlpha: 0,
  particles: [], numbers: [], trails: [], rings: [], ghosts: [],

  reset() {
    this.hitstopLeft = 0; this.shakeAmp = 0; this.shakeX = 0; this.shakeY = 0;
    this.flashAlpha = 0;
    this.particles.length = 0;
    this.numbers.length = 0;
    this.trails.length = 0;
    this.rings.length = 0;
    this.ghosts.length = 0;
  },

  popNum(x, y, dmg, finisher, crit) {
    this.numbers.push({
      x: x + (Math.random() - 0.5) * 14, y: y - 10,
      vy: -100 - Math.random() * 35, sx: crit ? 1.35 : 1,
      text: crit ? `${dmg}!` : String(dmg),
      life: crit ? 0.95 : 0.72, max: crit ? 0.95 : 0.72,
      finisher: !!finisher, crit: !!crit,
    });
  },

  trail(x0, y0, x1, y1, color, w) {
    this.trails.push({ x0, y0, x1, y1, color, w: w || 3, life: 0.18, max: 0.18 });
  },

  ring(x, y, r, color) {
    this.rings.push({ x, y, r, color, life: 0.28, max: 0.28 });
  },

  ghost(x, y, facing, color) {
    this.ghosts.push({ x, y, facing, color, life: 0.22, max: 0.22 });
  },

  onHit(opts) {
    const { x, y, dir = 1, weapon = "sword", target = null, kill = false, spec = {}, crit = false } = opts;
    const base = weapon === "bow" ? CFG.BOW : CFG.SWORD;
    const hitstop = (spec.hitstop ?? base.hitstop) * (crit ? 1.35 : 1);
    const shake = (spec.shake ?? base.shake) * (crit ? 1.45 : 1);
    const knock = (spec.knock ?? base.knock) * (crit ? 1.2 : 1);
    const flash = spec.flash ?? base.flash;
    if (Feel.hitstop) this.hitstopLeft = Math.max(this.hitstopLeft, hitstop);
    if (Feel.shake) this.shakeAmp = Math.max(this.shakeAmp, shake * (kill ? 1.4 : 1));
    if (Feel.flash) {
      this.flashAlpha = Math.max(this.flashAlpha, kill || crit ? 0.38 : flash * 2.8);
      if (target) target.flash = Math.max(target.flash || 0, crit ? 0.22 : 0.14);
    }
    if (Feel.knockback && target) {
      target.vx = dir * knock * (kill ? 1.25 : 1);
      target.vy = spec.lift != null ? spec.lift : Math.min(target.vy, -90);
    }
    if (Feel.particles) {
      this.burst(x, y, dir, kill || crit);
      this.spark(x, y, dir, crit || !!spec.finisher);
    }
    Sfx.play(weapon === "bow" ? "arrowHit" : "swordHit");
    if (kill) Sfx.play("die");
  },

  burst(x, y, dir, big) {
    const n = big ? 20 : 10;
    for (let i = 0; i < n; i++) {
      const a = (Math.random() - 0.5) * 1.6 + (dir > 0 ? 0 : Math.PI);
      const sp = 100 + Math.random() * (big ? 300 : 170);
      this.particles.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 70,
        life: 0.28 + Math.random() * 0.32, max: 0.6,
        size: 1.8 + Math.random() * 3.4, soft: true,
        color: Math.random() > 0.4 ? CFG.COLORS.blood : CFG.COLORS.spark,
      });
    }
  },

  spark(x, y, dir, big) {
    const n = big ? 10 : 5;
    for (let i = 0; i < n; i++) {
      const a = (Math.random() - 0.5) * 0.9 + (dir > 0 ? 0 : Math.PI);
      this.particles.push({
        x, y, vx: Math.cos(a) * (180 + Math.random() * 160),
        vy: Math.sin(a) * 80 - 40, life: 0.16, max: 0.16,
        size: 1.2 + Math.random() * 1.6, soft: true, glow: true,
        color: "#fff3d0",
      });
    }
  },

  update(dt) {
    if (this.hitstopLeft > 0) this.hitstopLeft = Math.max(0, this.hitstopLeft - dt);
    if (this.shakeAmp > 0.15) {
      this.shakeX = (Math.random() - 0.5) * 2 * this.shakeAmp;
      this.shakeY = (Math.random() - 0.5) * 2 * this.shakeAmp * 0.7;
      this.shakeAmp *= Math.pow(0.015, dt);
    } else { this.shakeAmp = 0; this.shakeX = 0; this.shakeY = 0; }
    if (this.flashAlpha > 0) this.flashAlpha = Math.max(0, this.flashAlpha - dt * 3.6);
    this._tick(this.particles, dt, (p) => {
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 420 * dt; p.vx *= 0.98;
    });
    this._tick(this.numbers, dt, (n) => {
      n.y += n.vy * dt; n.vy *= 0.97; n.sx += (1 - n.sx) * 8 * dt;
    });
    this._tick(this.trails, dt);
    this._tick(this.rings, dt);
    this._tick(this.ghosts, dt);
  },

  _tick(arr, dt, fn) {
    for (let i = arr.length - 1; i >= 0; i--) {
      const o = arr[i];
      o.life -= dt;
      if (fn) fn(o);
      if (o.life <= 0) arr.splice(i, 1);
    }
  },

  frozen() { return Feel.hitstop && this.hitstopLeft > 0; },

  draw(ctx) {
    for (const g of this.ghosts) {
      ctx.globalAlpha = 0.35 * (g.life / g.max);
      ctx.fillStyle = g.color;
      ctx.fillRect(g.x - 8 * g.facing, g.y - 28, 16, 40);
    }
    ctx.globalCompositeOperation = "lighter";
    for (const t of this.trails) {
      const k = t.life / t.max;
      ctx.globalAlpha = k * 0.35;
      ctx.strokeStyle = t.color;
      ctx.lineWidth = t.w * 2.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(t.x0, t.y0);
      ctx.lineTo(t.x1, t.y1);
      ctx.stroke();
      ctx.globalAlpha = k;
      ctx.lineWidth = t.w * 0.7;
      ctx.strokeStyle = "#fff8e8";
      ctx.stroke();
    }
    for (const p of this.particles) {
      if (!p.glow) continue;
      const a = p.life / p.max;
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.6 + a), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    for (const r of this.rings) {
      const k = r.life / r.max;
      ctx.globalAlpha = k * 0.85;
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 2.5 + (1 - k) * 4;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r * (1.35 - k * 0.55), 0, Math.PI * 2);
      ctx.stroke();
    }
    for (const p of this.particles) {
      if (p.glow) continue;
      const a = p.life / p.max;
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      if (p.soft) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
        ctx.fill();
      } else ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    for (const n of this.numbers) {
      const k = n.life / n.max;
      ctx.save();
      ctx.globalAlpha = Math.min(1, k * 1.2);
      ctx.translate(n.x, n.y);
      ctx.scale(n.sx, n.sx);
      ctx.textAlign = "center";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.font = n.crit ? "700 26px JetBrains Mono, monospace"
        : n.finisher ? "700 21px JetBrains Mono, monospace"
          : "600 16px JetBrains Mono, monospace";
      ctx.strokeText(n.text, 0, 0);
      ctx.fillStyle = n.crit ? CFG.COLORS.crit : (n.finisher ? "#ffb454" : "#f7f1e6");
      ctx.fillText(n.text, 0, 0);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    if (this.flashAlpha > 0 && Feel.flash) {
      ctx.fillStyle = `rgba(255,248,230,${this.flashAlpha})`;
      ctx.fillRect(Cam.x, 0, CFG.W, CFG.H);
    }
  },
};
