window.LOL = window.LOL || {};

/** 单位软碰撞：重叠时互相推开，便于看出遮挡与站位 */
LOL.Collision = {
  resolve(player, dummies) {
    const units = [{ x: player.x, y: player.y, r: player.r, ref: player, solid: true }];
    for (const d of dummies) {
      if (d.hp <= 0) continue;
      units.push({ x: d.x, y: d.y, r: d.r, ref: d, solid: true });
    }
    for (let i = 0; i < units.length; i++) {
      for (let j = i + 1; j < units.length; j++) {
        this.pair(units[i], units[j]);
      }
    }
    for (const u of units) {
      u.ref.x = u.x;
      u.ref.y = u.y;
    }
    const m = 40;
    player.x = LOL.Math.clamp(player.x, m, LOL.CONFIG.MAP_W - m);
    player.y = LOL.Math.clamp(player.y, m, LOL.CONFIG.MAP_H - m);
  },

  pair(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    let dist = Math.hypot(dx, dy);
    const min = a.r + b.r;
    if (dist >= min) return;
    let nx;
    let ny;
    if (dist < 0.001) {
      const ang = Math.random() * Math.PI * 2;
      nx = Math.cos(ang);
      ny = Math.sin(ang);
      dist = 0;
    } else {
      nx = dx / dist;
      ny = dy / dist;
    }
    const push = (min - dist) * 0.55;
    const aHero = Array.isArray(a.ref.items);
    const bHero = Array.isArray(b.ref.items);
    let aw = 0.5;
    if (aHero && !bHero) aw = 0.28;
    else if (!aHero && bHero) aw = 0.72;
    const bw = 1 - aw;
    a.x -= nx * push * aw;
    a.y -= ny * push * aw;
    b.x += nx * push * bw;
    b.y += ny * push * bw;
  },
};
