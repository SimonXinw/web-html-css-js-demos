window.LOL = window.LOL || {};

LOL.Dummy = {
  _id: 1,

  spawn(x, y, mode) {
    return {
      id: this._id++,
      x, y, r: 40,
      hp: LOL.CONFIG.DUMMY_HP,
      maxHp: LOL.CONFIG.DUMMY_HP,
      mode: mode || 'still',
      ox: x, oy: y,
      phase: Math.random() * Math.PI * 2,
      facing: 0,
      speed: 100 + Math.random() * 30,
      radius: 150,
      atkRange: 380,
      ad: 42,
      as: 0.62,
      atkState: 'idle',
      windupT: 0,
      windupMax: 0,
      recoverT: 0,
      busy: false,
      slowMul: 1,
      slowT: 0,
    };
  },

  seedTraining() {
    const W = LOL.CONFIG.MAP_W;
    const H = LOL.CONFIG.MAP_H;
    const list = [];
    list.push(this.spawn(W * 0.5, H * 0.5, 'still'));
    list.push(this.spawn(W * 0.58, H * 0.42, 'chase'));
    list.push(this.spawn(W * 0.58, H * 0.58, 'chase'));
    list.push(this.spawn(W * 0.42, H * 0.34, 'patrol'));
    list.push(this.spawn(W * 0.42, H * 0.66, 'patrol'));
    list.push(this.spawn(W * 0.7, H * 0.5, 'circle'));
    return list;
  },

  update(d, dt, player) {
    if (d.slowT > 0) {
      d.slowT -= dt;
      if (d.slowT <= 0) d.slowMul = 1;
    }
    if (d.hp <= 0 || d.busy) return;
    const px = d.x;
    const py = d.y;
    const sp = d.speed * d.slowMul * dt;
    if (d.mode === 'patrol') {
      d.phase += dt * 0.85;
      d.x = d.ox + Math.sin(d.phase) * d.radius;
      d.y = d.oy + Math.cos(d.phase * 0.5) * 40;
    } else if (d.mode === 'circle') {
      d.phase += sp / d.radius;
      d.x = d.ox + Math.cos(d.phase) * d.radius;
      d.y = d.oy + Math.sin(d.phase) * d.radius;
    } else if (d.mode === 'chase' && player) {
      const dx = player.x - d.x;
      const dy = player.y - d.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist > d.atkRange - 20) {
        d.x += (dx / dist) * sp;
        d.y += (dy / dist) * sp;
      }
    }
    if (d.x !== px || d.y !== py) d.facing = Math.atan2(d.y - py, d.x - px);
  },

  respawn(d) {
    d.hp = d.maxHp;
    d.x = d.ox;
    d.y = d.oy;
    d.atkState = 'idle';
    d.windupT = 0;
    d.busy = false;
  },
};
