function drawWeapon(ctx, p, chest, front) {
  const hand = front._hand || { x: chest.x + 14, y: chest.y + 8 };
  if (p.weapon === "sword") drawSword(ctx, p, chest, hand, front);
  else drawBow(ctx, p, hand);
}

function drawSword(ctx, p, chest, hand, front) {
  const slash = p.attackAnim > 0 ? 1 - p.attackAnim / (p.swingDur || 0.16) : 0;
  const ang = front.ua + front.fa + (slash > 0 ? 0.2 : -0.9);
  const len = (p.move && p.move.len) || 34;
  const tip = {
    x: hand.x + Math.cos(ang) * len,
    y: hand.y + Math.sin(ang) * len,
  };

  // 刀光晕
  if (slash > 0.08 && slash < 0.92 && p.move) {
    const col = p.move.color || "#fff3d0";
    const fade = 1 - Math.abs(slash - 0.5);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    ctx.strokeStyle = col;
    if (p.move.thrust) {
      ctx.globalAlpha = 0.5 * fade;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(hand.x, hand.y);
      ctx.lineTo(tip.x + Math.cos(ang) * 16, tip.y + Math.sin(ang) * 16);
      ctx.stroke();
    } else {
      const sweep = p.move.rise ? 1.45 : 1;
      ctx.globalAlpha = 0.4 * fade;
      ctx.lineWidth = p.move.rise ? 12 : 9;
      ctx.beginPath();
      ctx.arc(chest.x + 4, chest.y + 2, len * 0.92, ang - sweep, ang + 0.12);
      ctx.stroke();
      ctx.globalAlpha = 0.75 * fade;
      ctx.lineWidth = 2.6;
      ctx.strokeStyle = "#fffaf0";
      ctx.stroke();
    }
    ctx.restore();
  }

  // 刃体
  const blade = ctx.createLinearGradient(hand.x, hand.y, tip.x, tip.y);
  blade.addColorStop(0, "#c8b9a0");
  blade.addColorStop(0.4, "#f7f1e6");
  blade.addColorStop(1, "#ffffff");
  ctx.strokeStyle = blade;
  ctx.lineWidth = 3.4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(hand.x, hand.y);
  ctx.lineTo(tip.x, tip.y);
  ctx.stroke();

  // 护手 / 柄
  ctx.strokeStyle = "#c23b22";
  ctx.lineWidth = 4.2;
  ctx.beginPath();
  ctx.moveTo(hand.x - Math.cos(ang) * 2, hand.y - Math.sin(ang) * 2);
  ctx.lineTo(hand.x + Math.cos(ang) * 5, hand.y + Math.sin(ang) * 5);
  ctx.stroke();
  ctx.strokeStyle = "#2a2430";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(hand.x - Math.cos(ang) * 1, hand.y - Math.sin(ang) * 1);
  ctx.lineTo(hand.x - Math.cos(ang) * 8, hand.y - Math.sin(ang) * 8);
  ctx.stroke();
}

function drawBow(ctx, p, hand) {
  const bow = p.attackAnim > 0 ? 1 - p.attackAnim / (p.swingDur || 0.2) : 0;
  const pull = bow < 0.4 ? bow / 0.4 : Math.max(0, 1 - (bow - 0.4) / 0.6);
  const bx = hand.x + 6;
  const by = hand.y;

  ctx.strokeStyle = "#6d5236";
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(bx, by - 17);
  ctx.quadraticCurveTo(bx + 12, by, bx, by + 17);
  ctx.stroke();
  ctx.strokeStyle = "#c8b89a";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(bx, by - 17);
  ctx.lineTo(bx - 8 - pull * 11, by);
  ctx.lineTo(bx, by + 17);
  ctx.stroke();

  if (pull > 0.12) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "rgba(255,215,160,0.55)";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(bx - 6 - pull * 9, by);
    ctx.lineTo(bx + 16, by);
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = "#f2ebe0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx - 6 - pull * 9, by);
    ctx.lineTo(bx + 16, by);
    ctx.stroke();
  }
}
