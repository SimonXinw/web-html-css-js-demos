window.LOL = window.LOL || {};

LOL.Projectiles = {
  update(list, dummies, player, dt) {
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      if (p.kind === 'aa') {
        const t = dummies.find((d) => d.id === p.tx);
        if (!t || t.hp <= 0) {
          list.splice(i, 1);
          continue;
        }
        const step = LOL.Math.moveToward(p.x, p.y, t.x, t.y, p.speed * dt);
        p.x = step.x;
        p.y = step.y;
        if (step.arrived) {
          LOL.Combat.hurtDummy(t, p.dmg, player, false);
          list.splice(i, 1);
        }
        continue;
      }

      if (p.kind === 'eaa') {
        if (player.hp <= 0) {
          list.splice(i, 1);
          continue;
        }
        const step = LOL.Math.moveToward(p.x, p.y, player.x, player.y, p.speed * dt);
        p.x = step.x;
        p.y = step.y;
        if (step.arrived || LOL.Math.dist(p.x, p.y, player.x, player.y) <= player.r) {
          LOL.Combat.hurtPlayer(player, p.dmg);
          list.splice(i, 1);
        }
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      let hit = false;
      for (const d of dummies) {
        if (d.hp <= 0) continue;
        if (LOL.Math.dist(p.x, p.y, d.x, d.y) <= d.r + p.r) {
          LOL.Combat.hurtDummy(d, p.dmg, player, true);
          hit = true;
          if (!p.pierce) break;
        }
      }
      if (hit && !p.pierce) list.splice(i, 1);
      else if (p.life <= 0) list.splice(i, 1);
    }
  },
};
