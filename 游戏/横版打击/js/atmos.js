const Atmos = {
  motes: [],
  t: 0,

  init() {
    this.motes = [];
    for (let i = 0; i < 70; i++) {
      this.motes.push({
        x: Math.random() * CFG.WORLD,
        y: 40 + Math.random() * (CFG.GROUND_Y - 80),
        r: 0.6 + Math.random() * 1.8,
        sp: 8 + Math.random() * 22,
        wob: Math.random() * Math.PI * 2,
        a: 0.08 + Math.random() * 0.18,
        warm: Math.random() > 0.55,
      });
    }
  },

  update(dt) {
    this.t += dt;
    for (const m of this.motes) {
      m.y -= m.sp * dt * 0.35;
      m.x += Math.sin(this.t * 0.7 + m.wob) * 12 * dt;
      if (m.y < 20) {
        m.y = CFG.GROUND_Y - 30 - Math.random() * 40;
        m.x = Cam.x - 40 + Math.random() * (CFG.W + 80);
      }
    }
  },

  drawBack(ctx, camX) {
    // 月光晕
    const mx = camX + CFG.W * 0.72;
    const my = 78;
    const moon = ctx.createRadialGradient(mx, my, 8, mx, my, 120);
    moon.addColorStop(0, "rgba(240,230,210,0.55)");
    moon.addColorStop(0.2, "rgba(210,220,240,0.18)");
    moon.addColorStop(1, "rgba(210,220,240,0)");
    ctx.fillStyle = moon;
    ctx.beginPath();
    ctx.arc(mx, my, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f2ebe0";
    ctx.beginPath();
    ctx.arc(mx, my, 18, 0, Math.PI * 2);
    ctx.fill();

    // 雾带
    for (let i = 0; i < 4; i++) {
      const fy = 160 + i * 55;
      const fog = ctx.createLinearGradient(camX, fy, camX, fy + 50);
      fog.addColorStop(0, "rgba(40,48,68,0)");
      fog.addColorStop(0.5, `rgba(55,62,82,${0.08 + i * 0.02})`);
      fog.addColorStop(1, "rgba(40,48,68,0)");
      ctx.fillStyle = fog;
      ctx.fillRect(camX - 20, fy, CFG.W + 40, 50);
    }
  },

  drawFront(ctx, camX) {
    for (const m of this.motes) {
      if (m.x < camX - 20 || m.x > camX + CFG.W + 20) continue;
      ctx.globalAlpha = m.a * (0.7 + 0.3 * Math.sin(this.t * 2 + m.wob));
      ctx.fillStyle = m.warm ? "#ffd7a0" : "#dfe6f2";
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 灯笼光点
    for (let i = 1; i <= 5; i++) {
      const lx = i * 480 + 40;
      if (lx < camX - 60 || lx > camX + CFG.W + 60) continue;
      const ly = CFG.GROUND_Y - 78;
      const glow = ctx.createRadialGradient(lx, ly, 2, lx, ly, 55);
      glow.addColorStop(0, "rgba(255,170,80,0.35)");
      glow.addColorStop(1, "rgba(255,170,80,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(lx, ly, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#c23b22";
      ctx.fillRect(lx - 5, ly - 10, 10, 14);
      ctx.fillStyle = "#d4a35c";
      ctx.fillRect(lx - 6, ly - 12, 12, 3);
      ctx.fillRect(lx - 6, ly + 4, 12, 2);
    }
  },
};
