window.LOL = window.LOL || {};

LOL.Anim = {
  dt: 0.016,
  last: 0,

  frame() {
    const now = performance.now() / 1000;
    this.dt = this.last ? Math.min(0.05, now - this.last) : 0.016;
    this.last = now;
  },

  pose(mesh, unit) {
    const u = mesh.userData;
    if (!u.rig) return;
    const dt = this.dt;
    const dx = unit.x - (u.px ?? unit.x);
    const dy = unit.y - (u.py ?? unit.y);
    u.px = unit.x;
    u.py = unit.y;
    const moving = !unit.dash && Math.hypot(dx, dy) > 0.4;
    u.walk += moving ? dt * 12 : 0;
    const step = moving ? Math.sin(u.walk) : 0;
    u.legL.rotation.x = step * 0.9;
    u.legR.rotation.x = -step * 0.9;
    const idle = Math.sin(performance.now() / 420) * 0.4;
    u.rig.position.y = 16 + (moving ? Math.abs(step) * 2 : idle);
    u.rig.rotation.z = step * 0.07;
    u.head.rotation.x = -step * 0.18;

    if (unit.attackPulse) {
      u.swing = 1;
      unit.attackPulse = 0;
    } else u.swing = Math.max(0, u.swing - dt * 5.2);

    const winding = unit.atkState === 'windup' && unit.windupMax > 0;
    const pull = winding ? 1 - unit.windupT / unit.windupMax : 0;
    const punch = Math.sin(u.swing * Math.PI);
    const leanTo = unit.dash ? 0.5 : (winding ? -0.9 * pull : 0.95 * punch);
    u.lean += (leanTo - u.lean) * Math.min(1, dt * 16);
    u.rig.rotation.x = u.lean;
    u.rig.position.z = winding ? -6 * pull : 8 * punch;
    if (!u.weapon) return;
    u.weapon.rotation.x = winding ? -1.55 * pull : 1.7 * punch;
    u.weapon.position.z = 12 + (winding ? -10 * pull : 12 * punch);
  },
};
