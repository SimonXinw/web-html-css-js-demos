window.LOL = window.LOL || {};

LOL.Update = {
  player(player, dummies, projectiles, dt) {
    this.tick(player, dt);
    if (player.dash) {
      this.ageRecover(player, dt);
      player.x += player.dash.vx * dt;
      player.y += player.dash.vy * dt;
      player.dash.t -= dt;
      if (player.dash.t <= 0) player.dash = null;
      this.clampPos(player);
      return;
    }
    if (this.fight(player, dummies, projectiles, dt)) return;
    this.ageRecover(player, dt);

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
    if (player.invuln > 0) player.invuln = Math.max(0, player.invuln - dt);
  },

  ageRecover(player, dt) {
    if (player.recoverT > 0) player.recoverT = Math.max(0, player.recoverT - dt);
  },

  inRange(player, target) {
    const dist = LOL.Math.dist(player.x, player.y, target.x, target.y) - target.r;
    return dist <= player.stats().range;
  },

  fight(player, dummies, projectiles, dt) {
    const first = player.atkState === 'windup' ? null : this.acquire(player, dummies);
    if (player.atkState !== 'windup' && !first) return false;
    if (player.atkState !== 'windup' && !this.inRange(player, first)) {
      if (!player.attackLock) return false;
      this.ageRecover(player, dt);
      this.moveStep(player, first.x, first.y, dt);
      this.clampPos(player);
      return true;
    }
    let left = dt;
    for (let n = 0; n < 16 && left > 0; n++) {
      if (player.atkState === 'windup') {
        const rest = this.windup(player, dummies, projectiles, left);
        if (rest == null) return true;
        left = rest;
        continue;
      }
      if (player.recoverT > 0) {
        if (player.recoverT >= left) {
          player.recoverT -= left;
          return true;
        }
        left -= player.recoverT;
        player.recoverT = 0;
      }
      const target = this.acquire(player, dummies);
      if (!target || !this.inRange(player, target)) return true;
      if (!LOL.Combat.tryStartAttack(player, target)) return true;
    }
    return true;
  },

  windup(player, dummies, projectiles, dt) {
    const t = LOL.Combat.pickById(dummies, player.focusTargetId);
    if (!t) {
      player.atkState = 'idle';
      player.windupT = 0;
      return null;
    }
    player.facing = Math.atan2(t.y - player.y, t.x - player.x);
    if (player.windupT > dt) {
      player.windupT -= dt;
      return null;
    }
    const rest = dt - Math.max(0, player.windupT);
    LOL.Combat.applyHit(player, t, projectiles);
    return rest;
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
