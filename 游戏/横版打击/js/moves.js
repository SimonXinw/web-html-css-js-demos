const Moves = {
  sword: [
    { name: "斩", sfx: "cut", dmg: 12, swing: 0.14, hitFrom: 0.4, hitTo: 0.72, from: -2.15, to: 0.65, blade: 26, len: 36, knock: 220, shake: 3.5, hitstop: 0.025, flash: 0.05, lunge: 100, color: "#f4efe6" },
    { name: "挑", sfx: "rise", dmg: 14, swing: 0.15, hitFrom: 0.32, hitTo: 0.7, from: 0.85, to: -2.15, blade: 28, len: 38, knock: 140, shake: 4.5, hitstop: 0.03, flash: 0.06, lift: -360, color: "#ffd7a0" },
    { name: "裂", sfx: "cleave", dmg: 22, swing: 0.18, hitFrom: 0.42, hitTo: 0.78, from: -2.55, to: 1.2, blade: 22, len: 46, knock: 360, shake: 6, hitstop: 0.04, flash: 0.08, lunge: 90, finisher: true, color: "#ffb454" },
  ],
  bow: [
    { name: "一矢", sfx: "shot", dmg: 11, swing: 0.16, speed: 780, count: 1, spread: 0, color: "#e7d3b8", shake: 2.2, hitstop: 0.016, knock: 120, flash: 0.03 },
    { name: "双矢", sfx: "twin", dmg: 8, swing: 0.18, speed: 700, count: 2, spread: 0.18, color: "#ffd7a0", shake: 2.6, hitstop: 0.018, knock: 100, flash: 0.03 },
    { name: "三矢", sfx: "rain", dmg: 7, swing: 0.22, speed: 640, count: 3, spread: 0.28, color: "#f4efe6", shake: 3.2, hitstop: 0.02, knock: 90, flash: 0.04 },
  ],
  airSword: { name: "坠斩", sfx: "cleave", dmg: 18, swing: 0.2, hitFrom: 0.35, hitTo: 0.8, from: -2.6, to: 1.1, blade: 22, len: 44, knock: 200, shake: 6, hitstop: 0.04, flash: 0.08, lift: 180, air: true, color: "#ffe0a8" },
  airBow: { name: "坠羽", sfx: "shot", dmg: 10, swing: 0.18, speed: 640, count: 1, spread: 0.2, color: "#ffd7a0", shake: 3, hitstop: 0.02, knock: 120, flash: 0.04, air: true },

  start(game) {
    const p = game.player;
    if (p.dashT > 0 || p.castLeft > 0) return;
    if (!p.onGround) {
      if (p.attackAnim > 0) return;
      this.fire(p, [p.weapon === "sword" ? this.airSword : this.airBow], true);
      if (p.weapon === "sword") p.vy = Math.min(p.vy, -80);
      return;
    }
    const list = this.list(p);
    if (p.attackAnim > 0) {
      const prog = 1 - p.attackAnim / p.swingDur;
      if (prog >= 0.52) this.fire(p, list);
      else p.buffer = true;
      return;
    }
    if (p.comboLeft <= 0) p.combo = 0;
    this.fire(p, list);
  },

  list(p) {
    return p.weapon === "sword" ? this.sword : this.bow;
  },

  fire(p, list, air) {
    const mv = air ? list[0] : list[p.combo % list.length];
    p.move = mv;
    p.swingDur = mv.swing;
    p.attackAnim = mv.swing;
    p.buffer = false;
    p.bowFired = false;
    p.swingId += 1;
    if (!air) p.combo = (p.combo + 1) % list.length;
    if (mv.lunge) p.vx = p.facing * mv.lunge;
    Sfx.play(mv.sfx);
  },

  tick(game, dt) {
    const p = game.player;
    if (p.castLeft > 0) return;
    if (p.attackAnim > 0) {
      p.wasSwinging = true;
      const prog = 1 - p.attackAnim / p.swingDur;
      if (p.buffer && prog >= 0.52) {
        this.fire(p, this.list(p));
        return;
      }
      if (p.weapon === "bow" && p.move && !p.bowFired && prog >= 0.38) {
        p.bowFired = true;
        this.release(game, p.move);
      }
      if (p.weapon === "sword" && p.move && prog > p.move.hitFrom && prog < p.move.hitTo) {
        this.streak(p);
      }
      return;
    }
    if (p.wasSwinging) {
      p.wasSwinging = false;
      p.comboLeft = 0.34;
    }
    if (p.comboLeft > 0) p.comboLeft -= dt;
    else p.combo = 0;
  },

  release(game, mv) {
    const p = game.player;
    const ax = p.x + (p.facing > 0 ? p.w - 2 : 2);
    const ay = p.y + p.h * 0.36;
    const n = mv.count;
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0 : i / (n - 1) - 0.5;
      game.arrows.push(createArrow(ax, ay, p.facing, {
        spread: t * mv.spread, speed: mv.speed, dmg: mv.dmg,
        pierce: !!mv.pierce, finisher: !!mv.finisher, color: mv.color,
        knock: mv.knock, shake: mv.shake, hitstop: mv.hitstop, flash: mv.flash,
      }));
    }
  },

  streak(p) {
    const b = Anim.swordBlade(p);
    const a = Anim.toWorld(p, b.hand);
    const c = Anim.toWorld(p, b.tip);
    FX.trail(a.x, a.y, c.x, c.y, p.move.color, p.move.finisher ? 6 : 3.2);
  },
};
