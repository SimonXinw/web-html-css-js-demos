const World = {
  drawBackground(ctx, camX) {
    const g = ctx.createLinearGradient(0, 0, 0, CFG.H);
    g.addColorStop(0, "#141c2c");
    g.addColorStop(0.45, "#1a2233");
    g.addColorStop(1, "#0c1018");
    ctx.fillStyle = g;
    ctx.fillRect(camX, 0, CFG.W, CFG.H);

    // 星点
    ctx.fillStyle = "rgba(232,223,208,0.55)";
    for (let i = 0; i < 48; i++) {
      const x = camX + ((i * 97 + camX * 0.02) % CFG.W);
      const y = 20 + (i * 37) % 160;
      const s = 0.8 + (i % 3) * 0.4;
      ctx.globalAlpha = 0.25 + (i % 5) * 0.08;
      ctx.fillRect(x, y, s, s);
    }
    ctx.globalAlpha = 1;

    Atmos.drawBack(ctx, camX);

    const far = camX * 0.22;
    ctx.fillStyle = "rgba(16, 20, 30, 0.85)";
    this._range(ctx, far, [
      [-80, 180, 130], [200, 280, 190], [560, 250, 150],
      [960, 300, 200], [1380, 240, 140], [1780, 310, 210],
      [2200, 260, 160], [2520, 290, 180],
    ]);

    const mid = camX * 0.5;
    this._pineBelt(ctx, mid);

    // 地面地层
    const soil = ctx.createLinearGradient(0, CFG.GROUND_Y, 0, CFG.H);
    soil.addColorStop(0, "#35303a");
    soil.addColorStop(0.15, "#2a2430");
    soil.addColorStop(1, "#161218");
    ctx.fillStyle = soil;
    ctx.fillRect(0, CFG.GROUND_Y, CFG.WORLD, CFG.H - CFG.GROUND_Y);

    ctx.fillStyle = "#5a4d58";
    ctx.fillRect(0, CFG.GROUND_Y, CFG.WORLD, 3);
    ctx.fillStyle = "rgba(212,163,92,0.35)";
    ctx.fillRect(0, CFG.GROUND_Y, CFG.WORLD, 1);

    // 草丛 / 碎石
    for (let x = 0; x < CFG.WORLD; x += 28) {
      if (x < camX - 40 || x > camX + CFG.W + 40) continue;
      const h = 5 + (x * 13) % 10;
      ctx.strokeStyle = "rgba(90,120,90,0.45)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, CFG.GROUND_Y);
      ctx.quadraticCurveTo(x + 2, CFG.GROUND_Y - h, x + 4, CFG.GROUND_Y - h * 0.4);
      ctx.stroke();
      if ((x / 28) % 5 === 0) {
        ctx.fillStyle = "rgba(90,80,95,0.5)";
        ctx.fillRect(x + 8, CFG.GROUND_Y + 6, 5, 3);
      }
    }

    // 里程碑石灯
    ctx.font = "600 12px JetBrains Mono, monospace";
    for (let i = 1; i <= 5; i++) {
      const mx = i * 480;
      ctx.fillStyle = "#3a3340";
      ctx.fillRect(mx - 6, CFG.GROUND_Y - 34, 12, 34);
      ctx.fillStyle = "rgba(232,223,208,0.55)";
      ctx.fillText(`M${i}`, mx + 10, CFG.GROUND_Y - 18);
    }
  },

  _pineBelt(ctx, scroll) {
    for (let i = 0; i < 14; i++) {
      const x = scroll + i * 210 - 40;
      const h = 90 + (i % 4) * 18;
      ctx.fillStyle = i % 2 ? "rgba(24,30,40,0.92)" : "rgba(30,26,38,0.9)";
      ctx.beginPath();
      ctx.moveTo(x, CFG.GROUND_Y);
      ctx.lineTo(x + 36, CFG.GROUND_Y - h);
      ctx.lineTo(x + 72, CFG.GROUND_Y);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 12, CFG.GROUND_Y - h * 0.45);
      ctx.lineTo(x + 36, CFG.GROUND_Y - h * 1.15);
      ctx.lineTo(x + 60, CFG.GROUND_Y - h * 0.45);
      ctx.closePath();
      ctx.fill();
    }
  },

  _range(ctx, scroll, list) {
    for (const [x, w, h] of list) {
      ctx.beginPath();
      ctx.moveTo(x + scroll, CFG.GROUND_Y);
      ctx.lineTo(x + scroll + w * 0.42, CFG.GROUND_Y - h);
      ctx.lineTo(x + scroll + w, CFG.GROUND_Y);
      ctx.closePath();
      ctx.fill();
    }
  },

  drawVignette(ctx, camX) {
    const g = ctx.createRadialGradient(
      camX + CFG.W / 2, CFG.H * 0.48, CFG.H * 0.18,
      camX + CFG.W / 2, CFG.H * 0.5, CFG.H * 0.82,
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.7, "rgba(0,0,0,0.18)");
    g.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(camX, 0, CFG.W, CFG.H);

    // 胶片暗角暖边
    const warm = ctx.createLinearGradient(camX, CFG.H - 90, camX, CFG.H);
    warm.addColorStop(0, "rgba(80,40,30,0)");
    warm.addColorStop(1, "rgba(60,25,20,0.22)");
    ctx.fillStyle = warm;
    ctx.fillRect(camX, CFG.H - 90, CFG.W, 90);
  },
};
