const SK = {
  sword: [
    { key: "y", name: "连斩", cd: 4.2, time: 0.52, dmg: 8, kind: "flurry", sfx: "cut", color: "#f4efe6",
      cuts: [{ from: -2.25, to: 0.8 }, { from: 1.05, to: -1.9 }, { from: -1.65, to: 0.65 }, { from: 0.85, to: -2.2 }] },
    { key: "u", name: "突刺", cd: 4.6, time: 0.26, dmg: 26, kind: "thrust", lunge: 480, sfx: "rise", color: "#ffd7a0",
      pose: { from: -0.08, to: 0.16, len: 58, blade: 15, swing: 0.26, hitFrom: 0.16, hitTo: 0.9, thrust: true } },
    { key: "i", name: "升龙", cd: 6.2, time: 0.34, dmg: 28, kind: "rise", lift: -480, sfx: "cleave", color: "#ffb454",
      pose: { from: 1.2, to: -2.5, len: 48, blade: 18, swing: 0.34, hitFrom: 0.24, hitTo: 0.84, rise: true } },
    { key: "o", name: "反手", cd: 12, time: 0.5, dmg: 42, kind: "counter", ult: true, sfx: "cleave", color: "#ff6b4a",
      back: { from: 0.95, to: -2.3, len: 46, blade: 18, swing: 0.16, hitFrom: 0.28, hitTo: 0.82 } },
  ],
  bow: [
    { key: "y", name: "穿云", cd: 3.4, time: 0.16, dmg: 22, kind: "lane", sfx: "shot", color: "#e7d3b8" },
    { key: "u", name: "暴雨", cd: 6.2, time: 0.2, dmg: 8, kind: "rain", count: 8, sfx: "rain", color: "#ffd7a0" },
    { key: "i", name: "爆矢", cd: 6.4, time: 0.16, dmg: 16, kind: "bomb", len: 210, boom: 52, sfx: "twin", color: "#ffb454" },
    { key: "o", name: "扇幕", cd: 14, time: 0.24, dmg: 11, kind: "cone", reach: 210, count: 5, ult: true, sfx: "rain", color: "#ff6b4a" },
  ],
};

const Skills = {
  list(p) { return SK[p.weapon]; },

  cast(game, key) {
    const p = game.player;
    if (p.castLeft > 0 || p.dashT > 0) return;
    const sk = this.list(p).find((s) => s.key === key);
    if (!sk || p.cd[p.weapon][key] > 0) return;
    p.cd[p.weapon][key] = sk.cd;
    p.cast = sk;
    p.castLeft = sk.time;
    p.hitN = 0;
    p.riposted = false;
    p.buffer = false;
    if (sk.kind === "thrust" || sk.kind === "rise") this.arm(p, sk, 1, sk.pose);
    else if (sk.kind === "counter") {
      p.swingDur = sk.time;
      p.attackAnim = sk.time;
      p.move = { from: -1.4, to: -0.45, len: 34, color: sk.color, name: sk.name };
      p.vx = -p.facing * 70;
    } else if (sk.kind === "flurry") {
      p.move = { from: -2.1, to: -1.15, len: 40, color: sk.color, name: sk.name };
      p.swingDur = 0.1;
      p.attackAnim = 0.1;
    } else {
      p.attackAnim = sk.time;
      p.swingDur = sk.time;
      p.move = { from: -1.1, to: 0.4, len: 34, color: sk.color, name: sk.name };
    }
    if (sk.kind === "rise") p.vy = -320;
    Sfx.play(sk.sfx);
  },

  tick(game, dt) {
    const p = game.player;
    for (const w of ["sword", "bow"]) {
      for (const k of ["y", "u", "i", "o"]) {
        if (p.cd[w][k] > 0) p.cd[w][k] = Math.max(0, p.cd[w][k] - dt);
      }
    }
    if (p.cast && p.weapon === "sword") this.gleam(p);
    if (p.castLeft <= 0 || !p.cast) return;
    const sk = p.cast;
    const prog = 1 - p.castLeft / sk.time;
    if (sk.kind === "flurry") this.flurry(p, sk, prog);
    else if (sk.kind === "counter") this.watchCounter(game, sk, prog);
    else if (sk.kind !== "thrust" && sk.kind !== "rise" && p.hitN === 0 && prog >= 0.4) {
      p.hitN = 1;
      this.shot(game, sk);
    }
    p.castLeft -= dt;
    if (p.castLeft <= 0) {
      if (p.weapon === "bow") p.attackAnim = 0;
      p.cast = null;
    }
  },

  flurry(p, sk, prog) {
    const marks = [0.12, 0.32, 0.52, 0.74];
    while (p.hitN < sk.cuts.length && prog >= marks[p.hitN]) {
      this.arm(p, sk, 1, sk.cuts[p.hitN]);
      p.hitN += 1;
    }
  },

  watchCounter(game, sk, prog) {
    const p = game.player;
    for (const e of game.enemies) if (e.alive) this.riposte(game, e);
    if (!p.riposted && prog >= 0.86 && p.hitN === 0) {
      p.hitN = 1;
      this.arm(p, sk, 0.4, sk.back);
    }
  },

  riposte(game, enemy) {
    const p = game.player;
    const sk = p.cast;
    if (!sk || sk.kind !== "counter" || p.riposted) return false;
    const dx = enemy.x + enemy.w / 2 - (p.x + p.w / 2);
    if (dx * p.facing < -8) return false;
    if (!Combat.aabb(p.x - 6, p.y, p.w + 12, p.h, enemy.x, enemy.y, enemy.w, enemy.h)) return false;
    p.riposted = true;
    p.hitN = 1;
    p.vx = p.facing * 150;
    this.arm(p, sk, 1, sk.back);
    FX.flashAlpha = Math.max(FX.flashAlpha, 0.32);
    return true;
  },

  arm(p, sk, scale, pose) {
    const ult = !!sk.ult && scale >= 1;
    p.swingId += 1;
    p.swingDur = pose.swing || 0.12;
    p.attackAnim = p.swingDur;
    p.move = {
      from: pose.from, to: pose.to, len: pose.len || 42,
      blade: pose.blade || 16, hitFrom: pose.hitFrom ?? 0.32, hitTo: pose.hitTo ?? 0.8,
      color: sk.color, name: sk.name, thrust: !!pose.thrust, rise: !!pose.rise,
      dmg: Math.max(1, Math.round(sk.dmg * scale)),
      knock: ult ? 400 : 210, shake: ult ? 7 : 3.4,
      hitstop: ult ? 0.05 : 0.02, flash: ult ? 0.08 : 0.04,
      lift: scale >= 1 ? (sk.lift || 0) : 0, finisher: ult,
    };
  },

  gleam(p) {
    const mv = p.move;
    if (!mv || !mv.hitFrom || p.attackAnim <= 0) return;
    const prog = 1 - p.attackAnim / p.swingDur;
    if (prog < mv.hitFrom || prog > mv.hitTo) return;
    const b = Anim.swordBlade(p);
    const a = Anim.toWorld(p, b.hand);
    const c = Anim.toWorld(p, b.tip);
    FX.trail(a.x, a.y, c.x, c.y, mv.color, mv.rise ? 6.5 : 3.6);
  },

  shot(game, sk) {
    if (sk.kind === "lane") this.lane(game, sk);
    else if (sk.kind === "rain") this.rain(game, sk);
    else if (sk.kind === "bomb") this.bomb(game, sk);
    else if (sk.kind === "cone") this.cone(game, sk);
  },

  lane(game, sk) {
    const p = game.player;
    const a = this.arrow(p, sk, 0, p.x + (p.facing > 0 ? p.w + 6 : -10), p.y + p.h * 0.42);
    a.vx = p.facing * 1320;
    a.vy = 0;
    a.pierce = true;
    a.hitstop = 0;
    a.life = 1.15;
    game.arrows.push(a);
  },

  rain(game, sk) {
    const p = game.player;
    const cx = p.x + p.w / 2;
    const half = sk.count / 2;
    for (let i = 0; i < sk.count; i++) {
      const side = i < half ? 1 : -1;
      const slot = i % half;
      const a = this.arrow(p, sk, 0, cx + side * (22 + slot * 36), p.y - 80 - slot * 22);
      a.vx = side * 16;
      a.vy = 560;
      a.dir = side;
      game.arrows.push(a);
    }
  },

  bomb(game, sk) {
    const p = game.player;
    const a = this.arrow(p, sk, 0, p.x + (p.facing > 0 ? p.w : 0), p.y + p.h * 0.4);
    a.explode = true;
    a.boomR = sk.boom;
    a.maxDist = sk.len;
    game.arrows.push(a);
  },

  cone(game, sk) {
    const p = game.player;
    for (let i = 0; i < sk.count; i++) {
      const t = i / (sk.count - 1) - 0.5;
      const a = this.arrow(p, sk, t * 0.62, p.x + p.w / 2, p.y + p.h * 0.42);
      a.maxDist = sk.reach;
      game.arrows.push(a);
    }
  },

  arrow(p, sk, spread, x, y) {
    return createArrow(x, y, p.facing, {
      spread, speed: 760, dmg: sk.dmg, color: sk.color,
      knock: sk.ult ? 220 : 140, shake: sk.ult ? 4 : 3,
      hitstop: 0.02, flash: 0.04, finisher: !!sk.ult,
    });
  },
};
