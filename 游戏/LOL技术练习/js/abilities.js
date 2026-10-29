window.LOL = window.LOL || {};

LOL.Abilities = {
  cast(key, player, aimX, aimY, dummies, projectiles, effects) {
    const ab = LOL.ABILITIES[key];
    if (!ab || player.cds[key] > 0 || player.dash) return false;
    const lvScale = 1 + (player.level - 1) * 0.12;
    const dmg = (ab.dmg || 0) * lvScale;

    if (ab.type === 'skillshot') {
      const n = LOL.Math.norm(aimX - player.x, aimY - player.y);
      projectiles.push({
        kind: 'skill', x: player.x, y: player.y,
        vx: n.x * ab.speed, vy: n.y * ab.speed,
        life: ab.range / ab.speed, dmg, r: ab.width / 2,
        color: ab.color, pierce: true,
      });
    } else if (ab.type === 'targeted') {
      const t = LOL.Combat.findNearest(player, dummies, ab.range);
      if (!t) return false;
      LOL.Combat.hurtDummy(t, dmg, player, true);
      t.slowMul = 1 - ab.slow;
      t.slowT = ab.slowDur;
      effects.push({ x: t.x, y: t.y, life: 0.35, color: ab.color, r: 40 });
    } else if (ab.type === 'dash') {
      const n = LOL.Math.norm(aimX - player.x, aimY - player.y);
      player.dash = {
        vx: n.x * (ab.dash / 0.18),
        vy: n.y * (ab.dash / 0.18),
        t: 0.18,
      };
      if (player.atkState === 'windup') {
        player.cancels += 1;
        player.atkState = 'idle';
        player.windupT = 0;
      }
      player.moveTarget = null;
    } else if (ab.type === 'aoe') {
      const cx = aimX;
      const cy = aimY;
      if (LOL.Math.dist(player.x, player.y, cx, cy) > 700) return false;
      effects.push({ x: cx, y: cy, life: 0.45, color: ab.color, r: ab.range });
      for (const d of dummies) {
        if (d.hp <= 0) continue;
        if (LOL.Math.dist(cx, cy, d.x, d.y) <= ab.range) {
          LOL.Combat.hurtDummy(d, dmg, player, true);
        }
      }
    }

    player.cds[key] = ab.cd;
    return true;
  },
};
