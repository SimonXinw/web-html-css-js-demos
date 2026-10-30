window.LOL = window.LOL || {};

LOL.Dps = {
  immortal: false,
  selfSafe: true,
  gap: 3,
  window: 5,
  rows: new Map(),
  labels: new Map(),

  bind() {
    const selfBtn = document.getElementById('cheat-self');
    selfBtn.onclick = () => {
      this.selfSafe = !this.selfSafe;
      selfBtn.classList.toggle('on', this.selfSafe);
      selfBtn.textContent = this.selfSafe ? '自己不死 开' : '自己不死 关';
    };
    const btn = document.getElementById('cheat-immortal');
    btn.onclick = () => {
      this.immortal = !this.immortal;
      btn.classList.toggle('on', this.immortal);
      btn.textContent = this.immortal ? '敌人不死 开' : '敌人不死 关';
      if (!this.immortal) return;
      for (const d of LOL.Game.dummies) {
        if (d.hp > 0) d.hp = d.maxHp;
      }
    };
  },

  note(id, dmg) {
    const now = performance.now() / 1000;
    let row = this.rows.get(id);
    if (!row || now - row.last >= this.gap) {
      row = { total: 0, start: now, shown: 0, shownAt: 0, times: [], rate: 0 };
    }
    row.times.push(now);
    row.total += dmg;
    row.last = now;
    this.rows.set(id, row);
  },

  rateOf(row, now) {
    const times = row.times;
    const cut = now - this.window;
    let i = 0;
    while (i < times.length && times[i] < cut) i += 1;
    if (i) times.splice(0, i);
    const n = times.length;
    if (n < 2) return 0;
    const span = times[n - 1] - times[0];
    if (span < 0.05) return 0;
    return (n - 1) / span;
  },

  clear(id) {
    this.rows.delete(id);
  },

  sample(id) {
    const row = this.rows.get(id);
    if (!row) return null;
    const now = performance.now() / 1000;
    if (now - row.last >= this.gap) {
      this.rows.delete(id);
      return null;
    }
    const span = Math.max(0.35, now - row.start);
    if (!row.shownAt || now - row.shownAt >= 1) {
      row.shown = row.total / span;
      row.rate = this.rateOf(row, now);
      row.shownAt = now;
    }
    return { total: row.total, dps: row.shown, rate: row.rate || 0 };
  },

  sync(dummies) {
    const scene = LOL.Scene3D.scene;
    const live = new Set();
    for (const d of dummies) {
      const stat = d.hp > 0 ? this.sample(d.id) : null;
      if (!stat) continue;
      live.add(d.id);
      const label = this.ensure(scene, d.id);
      label.visible = true;
      label.position.set(d.x, 16, d.y + 48);
      this.paint(label, stat);
    }
    for (const [id, mesh] of this.labels) {
      if (live.has(id)) continue;
      mesh.visible = false;
      mesh.scale.set(96, 36, 1);
      mesh.userData.dps = undefined;
      mesh.userData.punch = 0;
    }
  },

  ensure(scene, id) {
    const found = this.labels.get(id);
    if (found) return found;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    tex.premultiplyAlpha = false;
    const mat = new THREE.SpriteMaterial({
      map: tex, transparent: true, depthTest: false,
    });
    const mesh = new THREE.Sprite(mat);
    mesh.scale.set(96, 36, 1);
    mesh.renderOrder = 20;
    mesh.visible = false;
    mesh.userData.ctx = ctx;
    mesh.userData.key = '';
    scene.add(mesh);
    this.labels.set(id, mesh);
    return mesh;
  },

  paint(mesh, stat) {
    const total = Math.round(stat.total);
    const dps = Math.round(stat.dps);
    const u = mesh.userData;
    if (u.dps !== dps) {
      const p0 = u.punch || 0;
      const visual = u.dps == null
        ? dps
        : Math.round(u.from + (u.dps - u.from) * (1 - p0 * p0));
      u.from = visual;
      u.punch = u.dps == null ? 0.55 : 1;
      u.dps = dps;
    }
    if (u.punch > 0) u.punch = Math.max(0, u.punch - LOL.Anim.dt / 0.3);
    const p = u.punch || 0;
    const shown = Math.round(u.from + (u.dps - u.from) * (1 - p * p));
    const text = `${total}/${shown}`;
    const sheet = LOL.Game.player.stats().as;
    const actual = stat.rate || 0;
    const rateText = `${sheet.toFixed(2)}/${actual.toFixed(2)}`;
    const key = `${text}|${rateText}`;
    const s = 1 + p * 0.42;
    mesh.scale.set(96 * s, 36 * s, 1);
    mesh.position.y += p * 14;
    if (u.key === key && p === 0) return;
    u.key = key;
    this.ink(mesh, text, rateText, p);
  },

  ink(mesh, text, rateText, p) {
    const ctx = mesh.userData.ctx;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.font = '700 34px sans-serif';
    ctx.strokeText(text, w / 2, 32);
    const r = Math.round(90 + 165 * p);
    const g = Math.round(210 + 45 * p);
    ctx.fillStyle = `rgb(${r},${g},255)`;
    ctx.fillText(text, w / 2, 32);
    ctx.strokeText(rateText, w / 2, 80);
    ctx.fillStyle = '#ffd15a';
    ctx.fillText(rateText, w / 2, 80);
    mesh.material.map.needsUpdate = true;
  },
};
