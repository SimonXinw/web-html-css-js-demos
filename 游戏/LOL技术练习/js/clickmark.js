window.LOL = window.LOL || {};

LOL.ClickMark = {
  pool: [],

  init(scene) {
    this.scene = scene;
    this.geo = this.arrowGeo();
    for (let i = 0; i < 3; i++) this.pool.push(this.make());
  },

  arrowGeo() {
    const s = new THREE.Shape();
    s.moveTo(0, 16);
    s.lineTo(8, 2);
    s.lineTo(3.2, 2);
    s.lineTo(3.2, -12);
    s.lineTo(-3.2, -12);
    s.lineTo(-3.2, 2);
    s.lineTo(-8, 2);
    s.closePath();
    return new THREE.ShapeGeometry(s);
  },

  make() {
    const g = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({
      color: 0x146b34, transparent: true, opacity: 0,
      depthWrite: false, side: THREE.DoubleSide,
    });
    for (let i = 0; i < 4; i++) {
      const pivot = new THREE.Group();
      pivot.rotation.y = i * Math.PI / 2;
      const arrow = new THREE.Mesh(this.geo, mat);
      arrow.rotation.x = -Math.PI / 2;
      arrow.position.z = 40;
      pivot.add(arrow);
      g.add(pivot);
    }
    g.visible = false;
    g.userData.mat = mat;
    g.userData.life = 0;
    g.userData.dur = 0.28;
    g.renderOrder = 6;
    this.scene.add(g);
    return g;
  },

  play(x, y, kind) {
    let g = this.pool.find((m) => m.userData.life <= 0);
    if (!g) g = this.pool.reduce((a, b) => (a.userData.life < b.userData.life ? a : b));
    g.visible = true;
    g.position.set(x, 0, y);
    g.userData.life = g.userData.dur;
    g.userData.mat.color.setHex(kind === 'attack' ? 0xb4232a : 0x146b34);
    g.userData.mat.opacity = 0.94;
    this.pose(g, 0);
  },

  pose(g, t) {
    const k = 1 - (1 - t) * (1 - t) * (1 - t);
    const radius = 86 - k * 70;
    const height = 6 * (1 - k) + 0.6;
    const tilt = -Math.PI / 2 - (1 - k) * 0.35;
    for (const pivot of g.children) {
      const arrow = pivot.children[0];
      arrow.position.z = radius;
      arrow.position.y = height;
      arrow.rotation.x = tilt;
    }
    const fade = t < 0.75 ? 0.95 : 0.95 * (1 - (t - 0.75) / 0.25);
    g.userData.mat.opacity = Math.max(0, fade);
  },

  update(dt) {
    for (const g of this.pool) {
      if (g.userData.life <= 0) continue;
      g.userData.life -= dt;
      if (g.userData.life <= 0) {
        g.visible = false;
        continue;
      }
      this.pose(g, 1 - g.userData.life / g.userData.dur);
    }
  },
};
