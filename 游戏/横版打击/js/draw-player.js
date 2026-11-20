function drawPlayer(ctx, p) {
  const cx = p.x + p.w / 2;
  const feet = p.y + p.h;
  const moving = Math.abs(p.vx) > 30 && p.onGround;
  const phase = p.anim * (moving ? 11 : 3.2);
  const bob = Math.sin(phase) * (moving ? 1.6 : 1.1);
  const squash = p.landSquash || 0;
  const sy = 1 - squash * 0.18;
  const sx = 1 + squash * 0.12;
  ctx.save();
  ctx.translate(cx, feet);
  ctx.scale(p.facing * sx, sy);
  if (p.airSpin > 0 && p.attackAnim <= 0) ctx.rotate(-Math.sin(p.airSpin * Math.PI) * 1.15);
  if (p.dashT > 0) ctx.rotate(-0.22);
  Anim.shadow(ctx, 0, 0, 17 + Math.abs(p.vx) * 0.02, 0.32);

  // 冲刺残影光
  if (p.dashT > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#e8dfd0";
    ctx.fillRect(-18, -52, 14, 48);
    ctx.restore();
  }

  const hip = { x: 0, y: -18 + bob };
  const chest = { x: moving ? 2 : 0, y: -38 + bob };
  const head = { x: chest.x + 1, y: chest.y - 16 };
  const tuck = p.airSpin > 0.12;
  const jumpLean = p.onGround ? 0 : (p.vy < 0 ? -0.35 : 0.28);
  drawLeg(ctx, hip, legPose(phase, moving, true, jumpLean, tuck), CFG.COLORS.clothDk);
  drawLeg(ctx, hip, legPose(phase, moving, false, jumpLean, tuck), CFG.COLORS.cloth);

  // 袍
  const robe = ctx.createLinearGradient(hip.x, chest.y, hip.x, hip.y + 8);
  robe.addColorStop(0, "#efe7da");
  robe.addColorStop(1, "#c4b6a4");
  ctx.fillStyle = robe;
  ctx.beginPath();
  ctx.moveTo(hip.x - 9, hip.y + 2);
  ctx.quadraticCurveTo(hip.x - 14, chest.y + 8, chest.x - 11, chest.y);
  ctx.lineTo(chest.x + 11, chest.y);
  ctx.quadraticCurveTo(hip.x + 14, chest.y + 8, hip.x + 9, hip.y + 2);
  ctx.quadraticCurveTo(hip.x, hip.y + 10, hip.x - 9, hip.y + 2);
  ctx.fill();
  ctx.fillStyle = CFG.COLORS.sash;
  ctx.fillRect(hip.x - 8, hip.y - 4, 16, 4);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(chest.x - 6, chest.y + 2, 4, 14);

  const arms = armPose(p, phase, moving);
  drawArm(ctx, chest, arms.back, CFG.COLORS.skinDk, true);
  drawHead(ctx, head, p);
  drawArm(ctx, chest, arms.front, CFG.COLORS.skin, false);
  drawWeapon(ctx, p, chest, arms.front);
  ctx.restore();
}

function legPose(phase, moving, isL, jumpLean, tuck) {
  const sign = isL ? 1 : -1;
  if (tuck) return { thigh: 0.25, shin: 2.35, lift: 8 };
  if (!moving) {
    return { thigh: 1.35 + jumpLean + sign * 0.08, shin: 1.45, lift: jumpLean < 0 ? -4 : 0 };
  }
  const swing = Math.sin(phase + (isL ? 0 : Math.PI));
  return {
    thigh: 1.15 + swing * 0.72,
    shin: 1.3 + Math.max(0, -swing) * 0.65,
    lift: Math.max(0, -swing) * 7,
  };
}

function drawLeg(ctx, hip, pose, color) {
  const kn = {
    x: hip.x + Math.cos(pose.thigh) * 12,
    y: hip.y + Math.sin(pose.thigh) * 12 - pose.lift,
  };
  const ft = {
    x: kn.x + Math.cos(pose.shin) * 12,
    y: kn.y + Math.sin(pose.shin) * 12,
  };
  Anim.limb(ctx, hip.x, hip.y, kn.x, kn.y, 7, color);
  Anim.limb(ctx, kn.x, kn.y, ft.x, ft.y, 6, color);
  ctx.fillStyle = CFG.COLORS.boot;
  Anim.oval(ctx, ft.x + 3, ft.y + 1, 6, 3);
}

function armPose(p, phase, moving) {
  const slash = p.attackAnim > 0 ? 1 - p.attackAnim / (p.swingDur || 0.16) : 0;
  const bow = p.weapon === "bow" ? slash : 0;
  let front = { ua: -0.4, fa: 0.6 };
  let back = { ua: -2.6, fa: 0.5 };
  if (p.weapon === "sword" && slash > 0 && p.move) {
    const t = Anim.easeOut(Anim.clamp01(slash));
    front = { ua: Anim.lerp(p.move.from, p.move.to, t), fa: 0.18 };
    back = { ua: -2.8, fa: 0.35 };
  } else if (p.airSpin > 0.12) {
    front = { ua: -2.4, fa: 0.8 }; back = { ua: -0.6, fa: 0.7 };
  } else if (p.weapon === "bow" && bow > 0) {
    const t = bow < 0.35 ? bow / 0.35 : 1 - (bow - 0.35) / 0.65;
    front = { ua: -0.15, fa: 0.1 };
    back = { ua: -Math.PI + 0.2, fa: Anim.lerp(0.1, 0.85, t) };
  } else if (!p.onGround) {
    front = { ua: -2.2, fa: 0.7 }; back = { ua: -0.8, fa: 0.5 };
  } else if (moving) {
    const s = Math.sin(phase);
    front = { ua: -0.6 - s * 0.5, fa: 0.55 };
    back = { ua: -2.5 + s * 0.5, fa: 0.55 };
  } else {
    front = { ua: -0.55 + Math.sin(phase) * 0.05, fa: 0.5 };
    back = { ua: -2.55, fa: 0.45 };
  }
  return { front, back };
}

function drawArm(ctx, chest, pose, color, isBack) {
  const sh = { x: chest.x + (isBack ? -6 : 7), y: chest.y + 2 };
  const el = { x: sh.x + Math.cos(pose.ua) * 11, y: sh.y + Math.sin(pose.ua) * 11 };
  const hn = {
    x: el.x + Math.cos(pose.ua + pose.fa) * 10,
    y: el.y + Math.sin(pose.ua + pose.fa) * 10,
  };
  Anim.limb(ctx, sh.x, sh.y, el.x, el.y, 5.5, color);
  Anim.limb(ctx, el.x, el.y, hn.x, hn.y, 5, color);
  pose._hand = hn;
}

function drawHead(ctx, head, p) {
  ctx.fillStyle = CFG.COLORS.hair;
  ctx.beginPath();
  ctx.moveTo(head.x - 9, head.y + 2);
  ctx.quadraticCurveTo(head.x - 12, head.y - 14, head.x, head.y - 16);
  ctx.quadraticCurveTo(head.x + 11, head.y - 12, head.x + 8, head.y + 4);
  ctx.quadraticCurveTo(head.x + 2, head.y + 8, head.x - 6, head.y + 6);
  ctx.fill();
  ctx.fillStyle = CFG.COLORS.skin;
  Anim.oval(ctx, head.x, head.y, 8, 9);
  ctx.fillStyle = CFG.COLORS.hair;
  Anim.oval(ctx, head.x - 1, head.y - 6, 7, 4);
  ctx.fillStyle = "#1a1520";
  Anim.oval(ctx, head.x + 3, head.y - 1, 1.4, 1.6);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  Anim.oval(ctx, head.x + 1, head.y - 2, 1.2, 0.8);
  if (p.weapon === "bow") {
    ctx.strokeStyle = CFG.COLORS.sash;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(head.x + 1, head.y + 2, 5, 0.2, 1.2);
    ctx.stroke();
  }
}
