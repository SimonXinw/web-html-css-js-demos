window.LOL = window.LOL || {};

LOL.Models = {
  unit(opts) {
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({
      color: opts.body, roughness: 0.55, metalness: 0.12,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: opts.accent, roughness: 0.45, metalness: 0.2,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: opts.dark, roughness: 0.7, metalness: 0.05,
    });

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(opts.r * 1.15, 24),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.05;
    shadow.renderOrder = -1;
    g.add(shadow);

    const rig = new THREE.Group();
    rig.position.y = 16;
    g.add(rig);
    const legL = this.pivot(g, -opts.r * 0.42, 16, 0);
    const legR = this.pivot(g, opts.r * 0.42, 16, 0);
    const legGeo = new THREE.CylinderGeometry(opts.r * 0.28, opts.r * 0.38, 16, 8);
    this.hang(legL, legGeo, darkMat);
    this.hang(legR, legGeo, darkMat);

    const torso = this.mesh(new THREE.CapsuleGeometry(opts.r * 0.72, opts.h * 0.45, 6, 12), bodyMat, 0, 12, 0);
    const shoulder = this.mesh(new THREE.CapsuleGeometry(opts.r * 0.28, opts.r * 1.1, 4, 8), accentMat, 0, 20, 0);
    shoulder.rotation.z = Math.PI / 2;
    const head = this.mesh(new THREE.SphereGeometry(opts.r * 0.48, 14, 12), accentMat, 0, 34, 0);
    const nose = this.mesh(new THREE.ConeGeometry(5, 14, 8), accentMat, 0, 6, opts.r * 0.9);
    nose.rotation.x = Math.PI / 2;
    let weapon = null;
    if (opts.weapon) {
      weapon = this.mesh(new THREE.BoxGeometry(5, 5, 30), accentMat, opts.r * 0.95, 14, 12);
    }
    rig.add(torso, shoulder, head, nose);
    if (weapon) rig.add(weapon);

    const outline = new THREE.Mesh(
      new THREE.CapsuleGeometry(opts.r * 0.76, opts.h * 0.5, 5, 10),
      new THREE.MeshBasicMaterial({
        color: 0xff3344, side: THREE.BackSide, transparent: true, opacity: 0.28, depthWrite: false, blending: THREE.AdditiveBlending,
      })
    );
    outline.position.y = 12;
    outline.scale.setScalar(1.03);
    outline.visible = false;
    rig.add(outline);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(opts.r * 1.12, opts.r * 1.2, 28),
      new THREE.MeshBasicMaterial({
        color: 0xff3344, side: THREE.DoubleSide, transparent: true, opacity: 0.28, depthWrite: false,
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 1.4;
    ring.visible = false;
    g.add(ring);

    const hp = this.hpBar();
    hp.position.y = 66;
    g.add(hp);
    g.userData.hpBar = hp;
    g.userData.outline = outline;
    g.userData.targetRing = ring;
    g.userData.radius = opts.r;
    g.userData.rig = rig;
    g.userData.legL = legL;
    g.userData.legR = legR;
    g.userData.head = head;
    g.userData.weapon = weapon;
    g.userData.walk = 0;
    g.userData.swing = 0;
    g.userData.lean = 0;
    return g;
  },

  pivot(parent, x, y, z) {
    const p = new THREE.Group();
    p.position.set(x, y, z);
    parent.add(p);
    return p;
  },

  hang(pivot, geo, mat) {
    const m = new THREE.Mesh(geo, mat);
    m.position.y = -8;
    m.castShadow = true;
    pivot.add(m);
  },

  mesh(geo, mat, x, y, z) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    return m;
  },

  setMark(mesh, mode) {
    const outline = mesh.userData.outline;
    const ring = mesh.userData.targetRing;
    if (!outline || !ring) return;
    outline.visible = mode === 'target';
    ring.visible = mode !== 'off';
    const color = mode === 'target' ? 0xff3344 : 0xe7f0ea;
    ring.material.color.setHex(color);
    ring.material.opacity = mode === 'target' ? 0.34 : 0.22;
  },

  hero() {
    return this.unit({
      r: 16, h: 40, body: 0x16a34a, accent: 0x86efac, dark: 0x14532d, weapon: true,
    });
  },

  dummy() {
    return this.unit({
      r: 18, h: 42, body: 0xd08a84, accent: 0xf3d2ce, dark: 0x8f5a56, weapon: false,
    });
  },

  hpBar() {
    const g = new THREE.Group();
    const bg = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 4),
      new THREE.MeshBasicMaterial({ color: 0x1c1917, depthTest: false })
    );
    const fg = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 4),
      new THREE.MeshBasicMaterial({ color: 0x4ade80, depthTest: false })
    );
    fg.position.z = 0.1;
    bg.renderOrder = 10;
    fg.renderOrder = 11;
    g.add(bg);
    g.add(fg);
    g.userData.fg = fg;
    return g;
  },

  setHp(mesh, ratio) {
    const fg = mesh.userData.hpBar?.userData.fg;
    if (!fg) return;
    const r = Math.max(0, Math.min(1, ratio));
    fg.scale.x = r || 0.001;
    fg.position.x = -18 * (1 - r);
    fg.material.color.setHex(r > 0.35 ? 0x4ade80 : 0xf87171);
  },

  bolt(color, thick, opacity) {
    const g = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const pts = [0, 10, 7, 0, -6, -14, 5, -26, -2, -42];
    for (let i = 0; i < 4; i++) {
      const x0 = pts[i * 2];
      const y0 = pts[i * 2 + 1];
      const x1 = pts[i * 2 + 2];
      const y1 = pts[i * 2 + 3];
      const len = Math.hypot(x1 - x0, y1 - y0);
      const seg = new THREE.Mesh(new THREE.BoxGeometry(thick, len, thick), mat);
      seg.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0);
      seg.rotation.z = Math.atan2(x1 - x0, y1 - y0);
      g.add(seg);
    }
    g.userData.mat = mat;
    return g;
  },

  bullet() {
    const g = new THREE.Group();
    const bolt = new THREE.Group();
    bolt.add(this.bolt(0xff6a00, 4.8, 0.55));
    bolt.add(this.bolt(0xffe7a0, 2.4, 1));
    const foe = this.bolt(0xfb7185, 1.2, 0.22);
    foe.scale.setScalar(0.36);
    const shot = new THREE.Mesh(
      new THREE.SphereGeometry(8, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x5ec8ff })
    );
    g.add(bolt, foe, shot);
    g.userData.bolt = bolt;
    g.userData.foe = foe;
    g.userData.shot = shot;
    return g;
  },
};
