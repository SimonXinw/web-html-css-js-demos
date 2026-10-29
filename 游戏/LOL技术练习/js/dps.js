window.LOL = window.LOL || {};

LOL.Dps = {
  immortal: false,
  gap: 3,
  rows: new Map(),
  labels: new Map(),

  bind() {
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
      row = { total: 0, start: now, shown: 0, shownAt: 0 };
    }
    row.total += dmg;
    row.last = now;
    this.rows.set(id, row);
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
      row.shownAt = now;
    }
    return { total: row.total, dps: row.shown };
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
      label.position.set(d.x, 22, d.y + 48);
      this.paint(label, stat);
    }
    for (const [id, mesh] of this.labels) {
      if (!live.has(id)) mesh.visible = false;
    }
  },

  ensure(scene, id) {
    const found = this.labels.get(id);
    if (found) return found;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    tex.premultiplyAlpha = false;
    const mat = new THREE.SpriteMaterial({
      map: tex, transparent: true, depthTest: false,
    });
    const mesh = new THREE.Sprite(mat);
    mesh.scale.set(96, 24, 1);
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
    const key = `${total}/${dps}`;
    if (mesh.userData.key === key) return;
    mesh.userData.key = key;
    const ctx = mesh.userData.ctx;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.textAlign = 'center';
    ctx.font = '700 36px sans-serif';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.strokeText(key, w / 2, 44);
    ctx.fillStyle = '#ff4d4d';
    ctx.fillText(key, w / 2, 44);
    mesh.material.map.needsUpdate = true;
  },
};
