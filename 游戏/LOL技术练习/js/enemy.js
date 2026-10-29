window.LOL = window.LOL || {};

LOL.Enemy = {
  update(dummies, player, projectiles, dt) {
    for (const d of dummies) this.one(d, player, projectiles, dt);
  },

  one(d, player, projectiles, dt) {
    d.busy = false;
    if (d.hp <= 0) {
      d.atkState = 'idle';
      return;
    }
    if (d.recoverT > 0) d.recoverT = Math.max(0, d.recoverT - dt);
    const dist = LOL.Math.dist(d.x, d.y, player.x, player.y) - player.r;
    const inRange = player.hp > 0 && player.invuln <= 0 && dist <= d.atkRange;

    if (d.atkState === 'windup') {
      d.busy = true;
      d.facing = Math.atan2(player.y - d.y, player.x - d.x);
      d.windupT -= dt;
      if (d.windupT <= 0) this.fire(d, projectiles);
      return;
    }
    if (!inRange) return;
    d.busy = true;
    d.facing = Math.atan2(player.y - d.y, player.x - d.x);
    if (d.recoverT <= 0) this.start(d);
  },

  start(d) {
    const period = 1 / d.as;
    d.atkState = 'windup';
    d.windupMax = period * 0.28;
    d.windupT = d.windupMax;
  },

  fire(d, projectiles) {
    d.atkState = 'idle';
    d.attackPulse = 1;
    d.recoverT = Math.max(0.05, (1 / d.as) - d.windupMax);
    projectiles.push({
      kind: 'eaa', x: d.x, y: d.y, speed: 1200, dmg: d.ad, r: 6, color: '#fb7185',
    });
  },
};
