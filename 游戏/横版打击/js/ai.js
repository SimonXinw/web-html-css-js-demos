const AI = {
  pickKind() {
    const r = Math.random();
    if (r < 0.55) return "grunt";
    if (r < 0.82) return "brute";
    return "bat";
  },

  spawn(game, side) {
    const kind = this.pickKind();
    const edge = side === "left" ? Cam.x - 60 : Cam.x + CFG.W + 40;
    const e = createEnemy(edge, kind);
    if (kind === "bat") e.y = 140 + Math.random() * 120;
    game.enemies.push(e);
  },

  update(e, p, dt) {
    if (e.tele > 0) e.tele -= dt;
    if (e.kind === "bat") return this.bat(e, p, dt);
    if (e.kind === "brute") return this.brute(e, p, dt);
    return this.grunt(e, p, dt);
  },

  grunt(e, p, dt) {
    const dx = (p.x + p.w / 2) - (e.x + e.w / 2);
    const dir = dx > 0 ? 1 : -1;
    const walk = dir * e.speed;
    if (Math.abs(e.vx) < e.speed * 1.6) {
      if (e.vx < walk - 20) e.vx = Math.min(walk, e.vx + 700 * dt);
      else if (e.vx > walk + 20) e.vx = Math.max(walk, e.vx - 700 * dt);
      else e.vx = walk;
    }
    e.facing = e.vx >= 0 ? 1 : -1;
    this.ground(e, dt);
  },

  brute(e, p, dt) {
    const dx = (p.x + p.w / 2) - (e.x + e.w / 2);
    const dist = Math.abs(dx);
    if (e.chargeT > 0) {
      e.chargeT -= dt;
      e.vx = e.facing * e.speed * 3.2;
    } else if (dist < 260 && dist > 70 && e.tele <= 0 && Math.random() < dt * 0.7) {
      e.facing = dx > 0 ? 1 : -1;
      e.tele = 0.35;
      e.chargeT = 0.42;
    } else {
      const walk = (dx > 0 ? 1 : -1) * e.speed;
      e.vx += (walk - e.vx) * Math.min(1, 4 * dt);
      e.facing = e.vx >= 0 ? 1 : -1;
    }
    if (e.tele > 0.05 && e.chargeT <= 0 && Feel.particles && Math.random() < dt * 20) {
      FX.particles.push({
        x: e.x + e.w / 2, y: e.y + e.h,
        vx: -e.facing * 20, vy: -30, life: 0.2, max: 0.2, size: 2, color: "#8b5a9a",
      });
    }
    this.ground(e, dt);
  },

  bat(e, p, dt) {
    const tx = p.x + p.w / 2;
    const ty = p.y + 10;
    const dx = tx - (e.x + e.w / 2);
    const dy = ty - (e.y + e.h / 2);
    e.vx += (Math.sign(dx) * e.speed - e.vx) * Math.min(1, 2.2 * dt);
    e.vy += (Math.sin(e.anim * 4) * 40 + Math.sign(dy) * 50 - e.vy) * Math.min(1, 2 * dt);
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    e.y = Math.max(80, Math.min(CFG.GROUND_Y - e.h - 30, e.y));
    e.facing = e.vx >= 0 ? 1 : -1;
  },

  ground(e, dt) {
    e.vy += CFG.GRAVITY * dt;
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    const floor = CFG.GROUND_Y - e.h;
    if (e.y >= floor) {
      e.y = floor;
      e.vy = 0;
    }
  },
};
