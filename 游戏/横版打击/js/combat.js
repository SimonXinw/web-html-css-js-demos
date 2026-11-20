const Combat = {
  updateSwordHit(game) {
    const p = game.player;
    const mv = p.move;
    if (p.weapon !== "sword" || !mv || !mv.hitFrom || p.attackAnim <= 0) return;
    const blade = Anim.swordBlade(p);
    if (blade.slash < mv.hitFrom || blade.slash > mv.hitTo) return;
    const hand = Anim.toWorld(p, blade.hand);
    const tip = Anim.toWorld(p, blade.tip);
    const spec = Object.assign({ weapon: "sword" }, mv);
    for (const e of game.enemies) {
      if (!e.alive || e.lastSwing === p.swingId) continue;
      const ex = e.x + e.w / 2;
      const ey = e.y + e.h * 0.45;
      const hit = this.segHit(ex, ey, hand.x, hand.y, tip.x, tip.y, mv.blade);
      if (!hit) continue;
      e.lastSwing = p.swingId;
      this.applyHit(game, e, p.facing, spec, hit.x, hit.y);
    }
  },

  segHit(px, py, ax, ay, bx, by, reach) {
    const abx = bx - ax;
    const aby = by - ay;
    if (!(reach > 0)) return null;
    const len2 = abx * abx + aby * aby || 1;
    let t = ((px - ax) * abx + (py - ay) * aby) / len2;
    t = Math.max(0, Math.min(1, t));
    const x = ax + abx * t;
    const y = ay + aby * t;
    if ((px - x) ** 2 + (py - y) ** 2 > reach * reach) return null;
    return { x, y };
  },

  updateArrows(game, dt) {
    for (let i = game.arrows.length - 1; i >= 0; i--) {
      const a = game.arrows[i];
      if (a.ox == null) { a.ox = a.x; a.oy = a.y; }
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      a.life -= dt;
      const traveled = Math.hypot(a.x - a.ox, a.y - a.oy);
      if (Feel.particles) FX.trail(a.x, a.y, a.x - a.vx * 0.02, a.y - a.vy * 0.02, a.color, 2);
      const pastGate = a.gate && a.vy > 200 && a.y > a.gate.y + a.gate.h + 8;
      const ended = a.life <= 0 || pastGate || a.x < -80 || a.x > CFG.WORLD + 80 || (a.maxDist && traveled > a.maxDist);
      if (a.explode) {
        if (ended || this.blastTouch(game, a)) { this.boom(game, a); game.arrows.splice(i, 1); }
        continue;
      }
      if (ended) { game.arrows.splice(i, 1); continue; }
      let spent = false;
      for (const e of game.enemies) {
        if (!e.alive || a.hits[e.id]) continue;
        if (!this.aabb(a.x - 4, a.y - 4, 16, 10, e.x, e.y, e.w, e.h)) continue;
        a.hits[e.id] = 1;
        this.applyHit(game, e, a.dir, {
          weapon: "bow", dmg: a.dmg, knock: a.knock, shake: a.shake,
          hitstop: a.hitstop, flash: a.flash, finisher: a.finisher,
        }, a.x, a.y);
        if (!a.pierce) { spent = true; break; }
      }
      if (spent) game.arrows.splice(i, 1);
    }
  },

  blastTouch(game, a) {
    const r = a.boomR || 54;
    for (const e of game.enemies) {
      if (!e.alive) continue;
      const dx = e.x + e.w / 2 - a.x;
      const dy = e.y + e.h / 2 - a.y;
      if (dx * dx + dy * dy <= r * r) return true;
    }
    return a.y > CFG.GROUND_Y - 8;
  },

  boom(game, a) {
    if (a.boomed) return;
    a.boomed = true;
    const r = a.boomR || 52;
    FX.ring(a.x, a.y, r, a.color);
    for (let n = 0; n < 8; n++) {
      const ang = (n / 8) * Math.PI * 2;
      FX.particles.push({
        x: a.x, y: a.y, vx: Math.cos(ang) * r * 3.4, vy: Math.sin(ang) * r * 3.4,
        life: 0.24, max: 0.24, size: 2.6, color: a.color || "#ffb454", glow: true, soft: true,
      });
    }
    for (const e of game.enemies) {
      if (!e.alive || a.hits[e.id]) continue;
      const dx = e.x + e.w / 2 - a.x;
      const dy = e.y + e.h / 2 - a.y;
      if (dx * dx + dy * dy > r * r) continue;
      a.hits[e.id] = 1;
      this.applyHit(game, e, a.dir, {
        weapon: "bow", dmg: Math.round(a.dmg * 0.85), knock: 260,
        shake: 5, hitstop: 0.03, flash: 0.07, finisher: true, color: a.color,
      }, a.x, a.y);
    }
  },

  applyHit(game, enemy, dir, spec, hx, hy) {
    let dmg = spec.dmg || 1;
    const crit = Math.random() < CFG.CRIT.chance;
    if (crit) dmg = Math.round(dmg * CFG.CRIT.mult);
    enemy.hp -= dmg;
    enemy.hurt = crit || spec.finisher ? 0.3 : 0.16;
    enemy.facing = dir > 0 ? -1 : 1;
    const kill = enemy.hp <= 0;
    if (kill) {
      enemy.alive = false;
      enemy.hp = 0;
      enemy.deathT = 0.55;
      if (!Feel.flash) enemy.flash = 0.01;
      game.kills += 1;
      if (game.kills % 8 === 0) game.wave += 1;
      game.spawnTimer = Math.min(game.spawnTimer, 0.45);
    }
    game.streak += 1;
    game.streakT = 1.8;
    FX.popNum(enemy.x + enemy.w / 2, enemy.y, dmg, !!spec.finisher, crit);
    if (Feel.particles) FX.ring(hx, hy, crit || spec.finisher ? 28 : 16, crit ? CFG.COLORS.crit : (spec.color || "#fff"));
    FX.onHit({ x: hx, y: hy, dir, weapon: spec.weapon, spec, target: enemy, kill, crit });
  },

  aabb(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  },

  enemyTouchPlayer(game) {
    const p = game.player;
    if (p.invuln > 0 || p.dashT > 0) return;
    for (const e of game.enemies) {
      if (!e.alive) continue;
      if (Skills.riposte(game, e)) break;
      if (!this.aabb(p.x, p.y, p.w, p.h, e.x, e.y, e.w, e.h)) continue;
      p.hp -= e.dmg || 1;
      p.invuln = 1;
      p.vx = (p.x < e.x ? -1 : 1) * 280;
      p.vy = -240;
      game.streak = 0;
      if (Feel.shake) FX.shakeAmp = Math.max(FX.shakeAmp, 6);
      FX.popNum(p.x + p.w / 2, p.y, e.dmg || 1, false, false);
      if (p.hp <= 0) game.respawnPlayer();
      break;
    }
  },
};
