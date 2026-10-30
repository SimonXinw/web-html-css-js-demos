window.LOL = window.LOL || {};

LOL.createPlayer = function createPlayer() {
  const C = LOL.CONFIG.BASE;
  return {
    x: LOL.CONFIG.MAP_W * 0.35,
    y: LOL.CONFIG.MAP_H * 0.5,
    spawnX: LOL.CONFIG.MAP_W * 0.35,
    spawnY: LOL.CONFIG.MAP_H * 0.5,
    invuln: 0,
    r: 36,
    level: 1,
    gold: 500,
    xp: 0,
    items: [],
    hp: C.hp,
    maxHp: C.hp,
    moveTarget: null,
    attackMoveTarget: null,
    focusTargetId: null,
    attackLock: false,
    atkState: 'idle',
    windupT: 0,
    windupMax: 0,
    recoverT: 0,
    facing: 0,
    cds: { Q: 0, W: 0, E: 0, R: 0 },
    dash: null,
    slowMul: 1,
    slowT: 0,
    hits: 0,
    cancels: 0,
    kiteOk: 0,
    tune: { ad: 0, as: 0, ms: 0, range: 0, windup: 0 },

    parts() {
      const b = LOL.CONFIG.BASE;
      const pl = LOL.CONFIG.PER_LEVEL;
      const lv = this.level - 1;
      const out = {
        ad: b.ad + pl.ad * lv,
        as: b.as + pl.as * lv,
        range: b.range,
        ms: b.ms + pl.ms * lv,
        hp: b.hp + pl.hp * lv,
        windup: b.windup,
      };
      for (const id of this.items) {
        const it = LOL.ITEMS.find((i) => i.id === id);
        if (!it) continue;
        out.ad += it.ad || 0;
        out.as += it.as || 0;
        out.range += it.range || 0;
        out.ms += it.ms || 0;
      }
      return out;
    },

    stats() {
      const p = this.parts();
      const t = this.tune;
      const as = Math.min(LOL.CONFIG.AS_MAX, Math.max(LOL.CONFIG.AS_MIN, p.as + t.as));
      const windup = Math.min(0.55, Math.max(0.08, p.windup + t.windup));
      return {
        ad: Math.max(1, p.ad + t.ad),
        as,
        range: Math.max(80, p.range + t.range),
        ms: Math.max(60, (p.ms + t.ms) * this.slowMul),
        hp: p.hp,
        windup,
      };
    },

    period() {
      return 1 / this.stats().as;
    },
  };
};
