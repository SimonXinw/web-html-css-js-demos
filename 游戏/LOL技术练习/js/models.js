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
      new THREE.CapsuleGeometry(opts.r * 0.95, opts.h * 0.62, 5, 10),
      new THREE.MeshBasicMaterial({
        color: 0xffe566, side: THREE.BackSide, transparent: true, opacity: 0.95,
      })
    );
    outline.position.y = 16;
    outline.scale.setScalar(1.16);
    outline.visible = false;
    rig.add(outline);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(opts.r * 1.05, opts.r * 1.45, 28),
      new THREE.MeshBasicMaterial({
        color: 0xffe566, side: THREE.DoubleSide, transparent: true, opacity: 0.9,
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
    const color = mode === 'target' ? 0xffe566 : 0xe7f0ea;
    ring.material.color.setHex(color);
    ring.material.opacity = mode === 'target' ? 0.95 : 0.4;
  },

  hero() {
    return this.unit({
      r: 16, h: 40, body: 0x2a8fd6, accent: 0x7dd3fc, dark: 0x1e3a5f, weapon: true,
    });
  },

  dummy(mode) {
    const warm = mode === 'still';
    return this.unit({
      r: 18, h: 42,
      body: warm ? 0xc44b4b : 0xd97706,
      accent: warm ? 0xfca5a5 : 0xfdba74,
      dark: warm ? 0x7f1d1d : 0x9a3412,
      weapon: false,
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

  bullet(color) {
    const g = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(9, 12, 10),
      new THREE.MeshBasicMaterial({ color })
    );
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(18, 12, 10),
      new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.42, depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    const tail = new THREE.Mesh(
      new THREE.CylinderGeometry(5, 1.4, 46, 8),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, depthWrite: false })
    );
    tail.geometry.translate(0, -23, 0);
    g.add(glow, core, tail);
    g.userData.core = core;
    g.userData.glow = glow;
    g.userData.tail = tail;
    return g;
  },
};
