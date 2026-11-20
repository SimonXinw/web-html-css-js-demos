const Anim = {
  easeOut(t) {
    return 1 - (1 - t) * (1 - t);
  },

  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
  },

  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  clamp01(t) {
    return Math.max(0, Math.min(1, t));
  },

  /** 画椭圆填充 */
  oval(ctx, x, y, rx, ry) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  },

  /** 圆角肢体段 */
  limb(ctx, x0, y0, x1, y1, width, color) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 0.001;
    const nx = -dy / len;
    const ny = dx / len;
    const hw = width / 2;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x0 + nx * hw, y0 + ny * hw);
    ctx.lineTo(x1 + nx * hw, y1 + ny * hw);
    ctx.lineTo(x1 - nx * hw, y1 - ny * hw);
    ctx.lineTo(x0 - nx * hw, y0 - ny * hw);
    ctx.closePath();
    ctx.fill();
    this.oval(ctx, x0, y0, hw * 0.95, hw * 0.95);
    this.oval(ctx, x1, y1, hw * 0.85, hw * 0.85);
  },

  /** 由角度展开关节链，返回关节点 */
  chain(origin, segs) {
    const pts = [{ x: origin.x, y: origin.y }];
    let ang = 0;
    let x = origin.x;
    let y = origin.y;
    for (const s of segs) {
      ang += s.a;
      x += Math.cos(ang) * s.len;
      y += Math.sin(ang) * s.len;
      pts.push({ x, y });
    }
    return pts;
  },

  /** 刀刃在角色本地坐标（脚底为原点，朝右） */
  swordBlade(p) {
    const mv = p.move || { from: -2.15, to: 0.65, len: 36 };
    const dur = p.swingDur || mv.swing || 0.16;
    const slash = p.attackAnim > 0 ? 1 - p.attackAnim / dur : 0;
    const t = this.easeOut(this.clamp01(slash));
    const ua = this.lerp(mv.from, mv.to, t);
    const fa = 0.18;
    const sh = { x: 7, y: -36 };
    const el = {
      x: sh.x + Math.cos(ua) * 11,
      y: sh.y + Math.sin(ua) * 11,
    };
    const hand = {
      x: el.x + Math.cos(ua + fa) * 10,
      y: el.y + Math.sin(ua + fa) * 10,
    };
    const ang = ua + fa + 0.2;
    const len = mv.len || 36;
    const tip = {
      x: hand.x + Math.cos(ang) * len,
      y: hand.y + Math.sin(ang) * len,
    };
    return { slash, hand, tip };
  },

  toWorld(p, pt) {
    return {
      x: p.x + p.w / 2 + p.facing * pt.x,
      y: p.y + p.h + pt.y,
    };
  },

  shadow(ctx, x, y, w, alpha) {
    ctx.save();
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y, w, w * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
};
