const HUD = {
  draw(ctx, game) {
    const p = game.player;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 左上信息板
    ctx.fillStyle = "rgba(10,12,18,0.55)";
    this.round(ctx, 10, 8, 176, 78, 10);
    ctx.fill();
    ctx.strokeStyle = "rgba(232,223,208,0.18)";
    this.round(ctx, 10, 8, 176, 78, 10);
    ctx.stroke();

    // HP
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    this.round(ctx, 20, 18, 152, 12, 6);
    ctx.fill();
    const ratio = Math.max(0, p.hp / CFG.PLAYER.maxHp);
    const hg = ctx.createLinearGradient(20, 18, 172, 18);
    hg.addColorStop(0, "#e85a3a");
    hg.addColorStop(1, "#c23b22");
    ctx.fillStyle = hg;
    this.round(ctx, 20, 18, 152 * ratio, 12, 6);
    ctx.fill();
    ctx.fillStyle = "#e8dfd0";
    ctx.font = "600 11px JetBrains Mono, monospace";
    ctx.fillText(`HP ${p.hp}/${CFG.PLAYER.maxHp}`, 22, 48);

    const wpn = p.weapon === "sword" ? "刀" : "弓";
    const label = p.cast ? p.cast.name : (p.attackAnim > 0 && p.move ? p.move.name : "");
    const mv = label ? ` · ${label}` : "";
    ctx.fillStyle = "#d4a35c";
    ctx.fillText(`${wpn}${mv}`, 22, 64);
    ctx.fillStyle = "#9a9082";
    ctx.fillText(`击杀 ${game.kills} · 波次 ${game.wave}`, 22, 78);

    if (game.streak > 1) {
      const k = Math.min(1, game.streakT);
      ctx.save();
      ctx.globalAlpha = k;
      ctx.translate(CFG.W / 2, 42);
      ctx.scale(0.95 + k * 0.12, 0.95 + k * 0.12);
      ctx.textAlign = "center";
      ctx.font = "700 26px Noto Serif SC, serif";
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 4;
      ctx.strokeText(`${game.streak} HIT`, 0, 0);
      ctx.fillStyle = "#ffb454";
      ctx.fillText(`${game.streak} HIT`, 0, 0);
      ctx.restore();
    }

    // 冲刺
    const dashReady = p.dashCd <= 0;
    ctx.fillStyle = "rgba(10,12,18,0.5)";
    this.round(ctx, CFG.W - 104, 12, 90, 34, 8);
    ctx.fill();
    ctx.fillStyle = dashReady ? "#2f8f7b" : "rgba(232,223,208,0.2)";
    this.round(ctx, CFG.W - 96, 20, 74, 7, 4);
    ctx.fill();
    if (!dashReady) {
      ctx.fillStyle = "#d4a35c";
      this.round(ctx, CFG.W - 96, 20, 74 * (1 - p.dashCd / CFG.DASH.cd), 7, 4);
      ctx.fill();
    }
    ctx.fillStyle = "#e8dfd0";
    ctx.font = "600 10px JetBrains Mono, monospace";
    ctx.textAlign = "right";
    ctx.fillText(dashReady ? "冲刺 L" : "冷却中", CFG.W - 20, 40);
    ctx.textAlign = "left";

    this.skills(ctx, p);
    ctx.restore();
  },

  skills(ctx, p) {
    const list = SK[p.weapon];
    const cds = p.cd[p.weapon];
    const x0 = CFG.W / 2 - 164;
    list.forEach((sk, i) => {
      const x = x0 + i * 82;
      const y = CFG.H - 52;
      const ready = cds[sk.key] <= 0;
      ctx.fillStyle = "rgba(8,10,16,0.72)";
      this.round(ctx, x, y, 74, 42, 10);
      ctx.fill();
      if (sk.ult) {
        ctx.strokeStyle = ready ? "#ffb454" : "rgba(212,163,92,0.35)";
        ctx.lineWidth = 1.6;
      } else {
        ctx.strokeStyle = ready ? "rgba(232,223,208,0.35)" : "rgba(232,223,208,0.14)";
        ctx.lineWidth = 1;
      }
      this.round(ctx, x, y, 74, 42, 10);
      ctx.stroke();
      if (!ready) {
        const h = 42 * (cds[sk.key] / sk.cd);
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(x, y, 74, h);
      } else if (sk.ult) {
        ctx.fillStyle = "rgba(194,59,34,0.22)";
        this.round(ctx, x, y, 74, 42, 10);
        ctx.fill();
      }
      ctx.fillStyle = ready ? "#f4efe6" : "#7a7268";
      ctx.font = "700 12px JetBrains Mono, monospace";
      ctx.fillText(sk.key.toUpperCase(), x + 8, y + 18);
      ctx.font = "600 12px Noto Serif SC, serif";
      ctx.fillText(sk.name, x + 26, y + 18);
      ctx.fillStyle = ready ? "#9a9082" : "#d4a35c";
      ctx.font = "600 10px JetBrains Mono, monospace";
      ctx.fillText(ready ? "就绪" : `${cds[sk.key].toFixed(1)}s`, x + 8, y + 34);
    });
  },

  round(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  },
};
