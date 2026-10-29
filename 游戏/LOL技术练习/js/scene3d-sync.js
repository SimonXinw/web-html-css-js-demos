window.LOL = window.LOL || {};

Object.assign(LOL.Scene3D, {
  ensureUnits(player, dummies) {
    if (!this.heroMesh) {
      this.heroMesh = LOL.Models.hero();
      this.scene.add(this.heroMesh);
    }
    for (const d of dummies) {
      if (this.dummyMeshes.has(d.id)) continue;
      const mesh = LOL.Models.dummy(d.mode);
      mesh.userData.id = d.id;
      this.scene.add(mesh);
      this.dummyMeshes.set(d.id, mesh);
    }
  },

  sync(state) {
    const { player, dummies, projectiles, effects, input } = state;
    LOL.Anim.frame();
    this.ensureUnits(player, dummies);
    const st = player.stats();

    this.place(this.heroMesh, player.x, player.y, player.facing);
    LOL.Anim.pose(this.heroMesh, player);
    LOL.Models.setHp(this.heroMesh, player.hp / player.maxHp);
    this.heroMesh.visible = true;

    this.syncRange(player, st.range, input.aMode);

    const hid = LOL.Combat.highlightId(player, dummies);
    for (const [id, mesh] of this.dummyMeshes) {
      const d = dummies.find((x) => x.id === id);
      if (!d || d.hp <= 0) {
        mesh.visible = false;
        LOL.Models.setMark(mesh, 'off');
        continue;
      }
      mesh.visible = true;
      this.place(mesh, d.x, d.y, d.facing || 0);
      LOL.Anim.pose(mesh, d);
      LOL.Models.setHp(mesh, d.hp / d.maxHp);
      const mode = hid === id ? 'target' : (input.unitHoverId === id ? 'hover' : 'off');
      LOL.Models.setMark(mesh, mode);
    }

    this.syncMarks(player, input);
    this.syncWindup(player);
    this.syncProjectiles(projectiles);
    this.syncFx(effects);
    this.follow();
    this.billboardHp();
  },

  syncRange(player, range, aMode) {
    this.rangeFill.visible = !!aMode;
    this.rangeRing.visible = !!aMode;
    this.rangeRing.material.opacity = 0.95;
    this.rangeFill.position.set(player.x, 0.45, player.y);
    this.rangeRing.position.set(player.x, 0.7, player.y);
    if (this._range === range) return;
    this._range = range;
    this.rangeFill.geometry.dispose();
    this.rangeRing.geometry.dispose();
    this.rangeFill.geometry = new THREE.CircleGeometry(range, 64);
    this.rangeRing.geometry = new THREE.RingGeometry(range - 6, range + 6, 72);
  },

  place(mesh, x, z, facing) {
    mesh.position.set(x, 0, z);
    mesh.rotation.y = -facing + Math.PI;
    mesh.scale.setScalar(2.2);
  },

  syncMarks(player, input) {
    if (player.moveTarget) {
      this.moveMark.visible = true;
      this.moveMark.position.set(player.moveTarget.x, 0.8, player.moveTarget.y);
    } else this.moveMark.visible = false;

    if (player.attackMoveTarget) {
      this.aMark.visible = true;
      this.aMark.position.set(player.attackMoveTarget.x, 0.9, player.attackMoveTarget.y);
    } else this.aMark.visible = false;

    if (input.aMode) {
      this.aMark.visible = true;
      this.aMark.position.set(input.mouse.worldX, 1.2, input.mouse.worldY);
    }
  },

  syncWindup(player) {
    if (player.atkState === 'windup' && player.windupMax > 0) {
      this.windup.visible = true;
      this.windup.position.set(player.x, 78, player.y);
      const t = 1 - player.windupT / player.windupMax;
      this.windup.scale.setScalar(0.8 + t * 0.5);
      this.windup.rotation.x = Math.PI / 2;
      this.windup.rotation.z = t * Math.PI * 2;
    } else this.windup.visible = false;
  },

  syncProjectiles(list) {
    while (this.projMeshes.length < list.length) {
      const m = LOL.Models.bullet(0xfde68a);
      this.scene.add(m);
      this.projMeshes.push(m);
    }
    for (let i = 0; i < this.projMeshes.length; i++) {
      const m = this.projMeshes[i];
      const p = list[i];
      if (!p) { m.visible = false; m.userData.prev = null; continue; }
      m.visible = true;
      m.position.set(p.x, 64, p.y);
      const tint = p.color || '#fde68a';
      m.userData.core.material.color.set(tint);
      m.userData.glow.material.color.set(tint);
      m.userData.tail.material.color.set(tint);
      this.aimTail(m, p);
    }
  },

  syncFx(list) {
    while (this.fxMeshes.length < list.length) {
      const m = new THREE.Mesh(
        new THREE.RingGeometry(10, 16, 32),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
      );
      m.rotation.x = -Math.PI / 2;
      this.scene.add(m);
      this.fxMeshes.push(m);
    }
    for (let i = 0; i < this.fxMeshes.length; i++) {
      const m = this.fxMeshes[i];
      const e = list[i];
      if (!e) { m.visible = false; continue; }
      m.visible = true;
      m.position.set(e.x, 1.5, e.y);
      const s = Math.max(0.2, (e.r || 40) / 40) * (1.3 - e.life);
      m.scale.setScalar(s);
      m.material.opacity = Math.max(0, e.life * 1.5);
      if (e.color) m.material.color.set(e.color);
    }
  },

  aimTail(mesh, p) {
    const tail = mesh.userData.tail;
    const prev = mesh.userData.prev || { x: p.x, z: p.y };
    const dir = new THREE.Vector3(p.x - prev.x, 0, p.y - prev.z);
    mesh.userData.prev = { x: p.x, z: p.y };
    if (dir.lengthSq() < 0.04) {
      tail.visible = false;
      return;
    }
    tail.visible = true;
    dir.normalize();
    tail.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  },

  follow() {
    const anchor = LOL.Camera;
    const pitch = 48 * Math.PI / 180;
    const dist = this.canvas.clientWidth < 700 ? 1180 : 1360;
    const height = Math.sin(pitch) * dist;
    const back = Math.cos(pitch) * dist;
    const lead = 280;
    this.camTarget.set(anchor.x, 0, anchor.y - lead);
    this.camera.position.set(anchor.x, height, anchor.y + back);
    this.camera.lookAt(this.camTarget);
    if (this.sun) this.sun.target.position.copy(this.camTarget);
  },

  billboardHp() {
    if (!this._invQ) this._invQ = new THREE.Quaternion();
    const units = [this.heroMesh, ...this.dummyMeshes.values()];
    for (const mesh of units) {
      if (!mesh?.visible) continue;
      const bar = mesh.userData.hpBar;
      if (!bar) continue;
      mesh.updateMatrixWorld();
      mesh.getWorldQuaternion(this._invQ);
      bar.quaternion.copy(this._invQ.invert()).multiply(this.camera.quaternion);
    }
  },

  render() {
    this.renderer.render(this.scene, this.camera);
  },
});
