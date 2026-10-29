window.LOL = window.LOL || {};

LOL.Math = {
  dist(ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    return Math.hypot(dx, dy);
  },
  norm(dx, dy) {
    const len = Math.hypot(dx, dy) || 1;
    return { x: dx / len, y: dy / len };
  },
  moveToward(x, y, tx, ty, dist) {
    const d = this.dist(x, y, tx, ty);
    if (d <= dist || d < 0.001) return { x: tx, y: ty, arrived: true };
    const n = this.norm(tx - x, ty - y);
    return { x: x + n.x * dist, y: y + n.y * dist, arrived: false };
  },
  clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  },
  lerp(a, b, t) {
    return a + (b - a) * t;
  },
  pointSegDist(px, py, ax, ay, bx, by) {
    const abx = bx - ax;
    const aby = by - ay;
    const apx = px - ax;
    const apy = py - ay;
    const ab2 = abx * abx + aby * aby || 1;
    let t = (apx * abx + apy * aby) / ab2;
    t = this.clamp(t, 0, 1);
    return Math.hypot(px - (ax + abx * t), py - (ay + aby * t));
  },
};
