window.LOL = window.LOL || {};

LOL.Update = {
  player(player, dummies, projectiles, dt) {
    this.tick(player, dt);
    if (player.dash) {
      player.x += player.dash.vx * dt;
      player.y += player.dash.vy * dt;
      player.dash.t -= dt;
      if (player.dash.t <= 0) player.dash = null;
      this.clampPos(player);
      return;
    }
    if (player.atkState === 'windup') {
      this.windup(player, dummies, projectiles, dt);
      return;
    }

    const target = this.acquire(player, dummies);
    if (target && this.holdOrHit(player, target, dt)) return;

    if (player.moveTarget) {
      this.moveStep(player, player.moveTarget.x, player.moveTarget.y, dt);
    }
    if (!player.moveTarget && player.attackMoveTarget) {
      player.moveTarget = {
        x: player.attackMoveTarget.x,
        y: player.attackMoveTarget.y,
      };
    }
    this.clampPos(player);
  },

  tick(player, dt) {
    for (const k of Object.keys(player.cds)) {
      if (player.cds[k] > 0) player.cds[k] = Math.max(0, player.cds[k] - dt);
    }
    if (player.slowT > 0) {
      player.slowT -= dt;
      if (player.slowT <= 0) player.slowMul = 1;
    }
    if (player.recoverT > 0) player.recoverT = Math.max(0, player.recoverT - dt);
    if (player.invuln > 0) player.invuln = Math.max(0, player.invuln - dt);
  },

  windup(player, dummies, projectiles, dt) {
    const t = LOL.Combat.pickById(dummies, player.focusTargetId);
    if (!t) {
      player.atkState = 'idle';
      player.windupT = 0;
      return;
    }
    player.facing = Math.atan2(t.y - player.y, t.x - player.x);
    player.windupT -= dt;
    if (player.windupT <= 0) LOL.Combat.applyHit(player, t, projectiles);
  },

  acquire(player, dummies) {
    if (player.attackLock && player.focusTargetId != null) {
      const locked = LOL.Combat.pickById(dummies, player.focusTargetId);
      if (!locked) {
        player.focusTargetId = null;
        player.attackLock = false;
      }
      return locked;
    }
    if (player.attackMoveTarget) {
      return LOL.Combat.findNearest(player, dummies, player.stats().range);
    }
    return null;
  },

  /** 射程内：能打就打，后摇中站住。锁定目标在射程外则追。 */
  holdOrHit(player, target, dt) {
    const dist = LOL.Math.dist(player.x, player.y, target.x, target.y) - target.r;
    const inRange = dist <= player.stats().range;
    if (inRange && player.recoverT <= 0) {
      LOL.Combat.tryStartAttack(player, target);
      return true;
    }
    if (inRange) return true;
    if (player.attackLock) {
      this.moveStep(player, target.x, target.y, dt);
      this.clampPos(player);
      return true;
    }
    return false;
  },

  moveStep(player, tx, ty, dt) {
    const st = player.stats();
    const step = LOL.Math.moveToward(player.x, player.y, tx, ty, st.ms * dt);
    player.x = step.x;
    player.y = step.y;
    player.facing = Math.atan2(ty - player.y, tx - player.x);
    if (step.arrived) player.moveTarget = null;
  },

  clampPos(player) {
    const m = 40;
    player.x = LOL.Math.clamp(player.x, m, LOL.CONFIG.MAP_W - m);
    player.y = LOL.Math.clamp(player.y, m, LOL.CONFIG.MAP_H - m);
  },
};
