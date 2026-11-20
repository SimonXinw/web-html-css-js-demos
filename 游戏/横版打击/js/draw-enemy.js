function drawEnemy(ctx, e) {
  if (!e.alive && e.deathT <= 0) return;
  const cx = e.x + e.w / 2;
  const feet = e.y + e.h;
  const dying = !e.alive;
  const death = dying ? Anim.clamp01(1 - e.deathT / 0.55) : 0;
  const hurt = e.hurt || 0;
  const phase = e.anim * (e.kind === "bat" ? 12 : 7.5);
  const limp = Math.sin(phase);
  const flash = e.flash > 0 && Feel.flash;
  const facing = e.facing || -1;
  const skin = flash ? "#ffffff" : (CFG.KINDS[e.kind]?.color || CFG.COLORS.mobSkin);
  const hide = flash ? "#ffffff" : CFG.COLORS.mobHide;
  const claw = flash ? "#ffffff" : CFG.COLORS.mobClaw;
  const eye = flash ? "#fff7d6" : CFG.COLORS.mobEye;

  ctx.save();
  ctx.translate(cx, feet);
  ctx.rotate(facing * death * 1.15);
  ctx.translate(0, death * 10);
  ctx.scale(facing * (1 + hurt * 0.15), 1 - hurt * 0.2 - death * 0.15);
  ctx.globalAlpha = dying ? Math.max(0, 1 - death * 1.1) : 1;
  Anim.shadow(ctx, 0, 0, e.kind === "bat" ? 12 : 18, 0.3 * (1 - death));

  if (e.kind === "bat") drawBat(ctx, limp, skin, hide, eye, claw);
  else drawGroundMob(ctx, e, limp, skin, hide, eye, claw);

  ctx.restore();
  if (e.alive) {
    const ratio = Math.max(0, e.hp / e.maxHp);
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(e.x, e.y - 12, e.w, 4);
    ctx.fillStyle = e.kind === "brute" ? "#9b59b6" : CFG.COLORS.blood;
    ctx.fillRect(e.x, e.y - 12, e.w * ratio, 4);
    if (e.tele > 0) {
      ctx.strokeStyle = `rgba(255,180,80,${0.5 + e.tele})`;
      ctx.strokeRect(e.x - 2, e.y - 2, e.w + 4, e.h + 4);
    }
  }
}

function drawGroundMob(ctx, e, limp, skin, hide, eye, claw) {
  const scale = e.kind === "brute" ? 1.12 : 1;
  const hip = { x: 0, y: (-16 + Math.abs(limp) * 1.5) * scale };
  const chest = { x: 3, y: (-34 + limp * 1.2) * scale };
  const head = { x: chest.x + 4, y: chest.y - 14 * scale };
  drawMobLeg(ctx, hip, 1.1 + limp * 0.4, 1.4, hide, scale);
  drawMobLeg(ctx, hip, 1.35 - limp * 0.4, 1.5, skin, scale);
  ctx.fillStyle = hide;
  ctx.beginPath();
  ctx.moveTo(hip.x - 10 * scale, hip.y);
  ctx.quadraticCurveTo(hip.x - 16 * scale, chest.y + 6, chest.x - 12 * scale, chest.y - 2);
  ctx.quadraticCurveTo(chest.x + 2, chest.y - 10 * scale, chest.x + 14 * scale, chest.y + 2);
  ctx.quadraticCurveTo(hip.x + 16 * scale, chest.y + 10, hip.x + 11 * scale, hip.y + 2);
  ctx.closePath();
  ctx.fill();
  const sh = { x: chest.x + 8 * scale, y: chest.y + 2 };
  const swing = -0.3 + limp * 0.35;
  const el = { x: sh.x + Math.cos(swing) * 13 * scale, y: sh.y + Math.sin(swing) * 13 * scale };
  const hn = { x: el.x + Math.cos(swing + 0.9) * 12 * scale, y: el.y + Math.sin(swing + 0.9) * 12 * scale };
  Anim.limb(ctx, sh.x, sh.y, el.x, el.y, 7 * scale, hide);
  Anim.limb(ctx, el.x, el.y, hn.x, hn.y, 6 * scale, skin);
  drawClaw(ctx, hn, swing + 0.9, claw);
  ctx.fillStyle = hide;
  Anim.oval(ctx, head.x, head.y, 11 * scale, 10 * scale);
  ctx.fillStyle = skin;
  Anim.oval(ctx, head.x + 2, head.y + 2, 7 * scale, 6 * scale);
  ctx.fillStyle = claw;
  ctx.beginPath();
  ctx.moveTo(head.x - 4, head.y - 6);
  ctx.lineTo(head.x - 8, head.y - 16 * scale);
  ctx.lineTo(head.x + 1, head.y - 8);
  ctx.fill();
  ctx.fillStyle = eye;
  Anim.oval(ctx, head.x + 5, head.y - 1, 2.4, 2.8);
}

function drawBat(ctx, limp, skin, hide, eye, claw) {
  const flap = Math.sin(limp * 3) * 0.7;
  ctx.fillStyle = hide;
  Anim.oval(ctx, 0, -14, 10, 8);
  ctx.fillStyle = skin;
  Anim.oval(ctx, 4, -12, 6, 5);
  ctx.fillStyle = eye;
  Anim.oval(ctx, 6, -14, 2, 2.2);
  ctx.fillStyle = claw;
  ctx.beginPath();
  ctx.moveTo(-2, -18); ctx.lineTo(-6, -28); ctx.lineTo(2, -20); ctx.fill();
  ctx.fillStyle = hide;
  ctx.beginPath();
  ctx.moveTo(-4, -14);
  ctx.quadraticCurveTo(-28, -24 + flap * 18, -8, -6);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(4, -14);
  ctx.quadraticCurveTo(28, -24 - flap * 18, 8, -6);
  ctx.closePath();
  ctx.fill();
}

function drawMobLeg(ctx, hip, thighA, shinA, color, scale) {
  scale = scale || 1;
  const kn = { x: hip.x + Math.cos(thighA) * 11 * scale, y: hip.y + Math.sin(thighA) * 11 * scale };
  const ft = { x: kn.x + Math.cos(shinA) * 11 * scale, y: kn.y + Math.sin(shinA) * 11 * scale };
  Anim.limb(ctx, hip.x, hip.y, kn.x, kn.y, 8 * scale, color);
  Anim.limb(ctx, kn.x, kn.y, ft.x, ft.y, 7 * scale, color);
  ctx.fillStyle = CFG.COLORS.mobClaw;
  Anim.oval(ctx, ft.x + 4, ft.y + 1, 7 * scale, 3.2 * scale);
}

function drawClaw(ctx, hand, ang, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  for (let i = -1; i <= 1; i++) {
    const a = ang + i * 0.35;
    ctx.beginPath();
    ctx.moveTo(hand.x, hand.y);
    ctx.lineTo(hand.x + Math.cos(a) * 10, hand.y + Math.sin(a) * 10);
    ctx.stroke();
  }
}

function drawArrow(ctx, a) {
  ctx.save();
  ctx.translate(a.x, a.y);
  ctx.rotate(Math.atan2(a.vy || 0, a.vx || a.dir || 1));
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = a.color || CFG.COLORS.arrow;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-2, 0);
  ctx.lineTo(20, 0);
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.strokeStyle = a.color || CFG.COLORS.arrow;
  ctx.fillStyle = a.color || CFG.COLORS.arrow;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(22, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(22, 0);
  ctx.lineTo(16, -4);
  ctx.lineTo(16, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
