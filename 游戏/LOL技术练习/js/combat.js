window.LOL = window.LOL || {};

LOL.Combat = {
  findNearest(player, dummies, maxRange) {
    let best = null;
    let bestD = maxRange;
    for (const d of dummies) {
      if (d.hp <= 0) continue;
      const dist = LOL.Math.dist(player.x, player.y, d.x, d.y) - d.r;
      if (dist <= bestD) {
        bestD = dist;
        best = d;
      }
    }
    return best;
  },

  pickById(dummies, id) {
    return dummies.find((d) => d.id === id && d.hp > 0) || null;
  },

  issueMove(player, x, y) {
    if (player.atkState === 'windup') {
      player.cancels += 1;
      player.atkState = 'idle';
      player.windupT = 0;
    }
    player.moveTarget = { x, y };
    player.attackMoveTarget = null;
    player.focusTargetId = null;
    player.attackLock = false;
  },

  issueAttackMove(player, x, y) {
    if (player.atkState === 'windup') {
      player.cancels += 1;
      player.atkState = 'idle';
      player.windupT = 0;
    }
    player.attackMoveTarget = { x, y };
    player.moveTarget = { x, y };
    player.focusTargetId = null;
    player.attackLock = false;
  },

  issueAttackUnit(player, dummy) {
    if (player.atkState === 'windup' && player.focusTargetId !== dummy.id) {
      player.cancels += 1;
      player.atkState = 'idle';
      player.windupT = 0;
    }
    player.focusTargetId = dummy.id;
    player.attackLock = true;
    player.attackMoveTarget = null;
    player.moveTarget = null;
  },

  issueStop(player) {
    player.moveTarget = null;
    player.attackMoveTarget = null;
    if (player.atkState === 'windup') {
      player.cancels += 1;
      player.atkState = 'idle';
      player.windupT = 0;
    }
    player.focusTargetId = null;
    player.attackLock = false;
  },

  highlightId(player, dummies) {
    if (player.atkState === 'windup' || player.attackLock) return player.focusTargetId;
    if (!player.attackMoveTarget) return null;
    const near = this.findNearest(player, dummies, player.stats().range);
    return near ? near.id : null;
  },

  tryStartAttack(player, target) {
    if (player.atkState !== 'idle' || player.recoverT > 0 || player.dash) return false;
    const st = player.stats();
    const dist = LOL.Math.dist(player.x, player.y, target.x, target.y) - target.r;
    if (dist > st.range) return false;
    player.atkState = 'windup';
    player.windupMax = player.period() * st.windup;
    player.windupT = player.windupMax;
    player.focusTargetId = target.id;
    player.moveTarget = null;
    player.facing = Math.atan2(target.y - player.y, target.x - player.x);
    return true;
  },

  applyHit(player, target, projectiles) {
    const st = player.stats();
    player.hits += 1;
    player.gold += LOL.CONFIG.GOLD_PER_HIT;
    projectiles.push({
      x: player.x, y: player.y, tx: target.id, kind: 'aa',
      speed: 1400, dmg: st.ad, r: 6, color: '#fde68a',
    });
    const period = player.period();
    player.recoverT = period - player.windupMax;
    player.atkState = 'idle';
    player.kiteOk += 1;
    player.attackPulse = 1;
    if (!player.attackLock) player.focusTargetId = null;
  },

  hurtDummy(dummy, dmg, player, grantHitGold) {
    if (!dummy || dummy.hp <= 0 || dmg <= 0) return;
    LOL.Dps.note(dummy.id, dmg);
    if (grantHitGold) player.gold += LOL.CONFIG.GOLD_PER_HIT;
    if (LOL.Dps.immortal) {
      dummy.hp = dummy.maxHp;
      return;
    }
    dummy.hp = Math.max(0, dummy.hp - dmg);
    if (dummy.hp > 0) return;
    LOL.Dps.clear(dummy.id);
    player.gold += LOL.CONFIG.GOLD_KILL;
    setTimeout(() => LOL.Dummy.respawn(dummy), 1500);
  },

  hurtPlayer(player, dmg) {
    if (player.invuln > 0 || player.hp <= 0 || dmg <= 0) return;
    const next = player.hp - dmg;
    if (LOL.Dps.selfSafe) {
      player.hp = next > 0 ? next : player.maxHp;
      return;
    }
    player.hp = Math.max(0, next);
    if (player.hp > 0) return;
    player.hp = player.maxHp;
    player.x = player.spawnX;
    player.y = player.spawnY;
    player.invuln = 1.5;
    player.moveTarget = null;
    player.attackMoveTarget = null;
    player.focusTargetId = null;
    player.attackLock = false;
    player.atkState = 'idle';
    player.windupT = 0;
    player.dash = null;
    LOL.UI.toast('被击倒，已回到出生点');
  },
};
