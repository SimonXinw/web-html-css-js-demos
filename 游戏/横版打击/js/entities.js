function createPlayer() {
  return {
    x: 220,
    y: CFG.GROUND_Y - CFG.PLAYER.h,
    w: CFG.PLAYER.w,
    h: CFG.PLAYER.h,
    vx: 0,
    vy: 0,
    facing: 1,
    onGround: true,
    weapon: "sword",
    attackAnim: 0,
    swingDur: 0.16,
    swingId: 0,
    combo: 0,
    comboLeft: 0,
    move: null,
    buffer: false,
    wasSwinging: false,
    bowFired: false,
    trailAcc: 0,
    jumps: 1,
    airSpin: 0,
    dashT: 0,
    dashCd: 0,
    cd: { sword: { y: 0, u: 0, i: 0, o: 0 }, bow: { y: 0, u: 0, i: 0, o: 0 } },
    cast: null,
    castLeft: 0,
    castFired: false,
    anim: 0,
    landSquash: 0,
    wasGround: true,
    hp: CFG.PLAYER.maxHp,
    invuln: 0,
  };
}

let enemySeq = 1;

function createEnemy(x, kind) {
  kind = kind || "grunt";
  const k = CFG.KINDS[kind];
  return {
    id: enemySeq++,
    kind,
    x: x ?? CFG.WORLD - 80,
    y: CFG.GROUND_Y - k.h,
    w: k.w,
    h: k.h,
    vx: 0,
    vy: 0,
    speed: k.speed,
    dmg: k.dmg,
    facing: -1,
    hp: k.hp,
    maxHp: k.hp,
    flash: 0,
    hurt: 0,
    hitCd: 0,
    lastSwing: 0,
    tele: 0,
    chargeT: 0,
    anim: Math.random() * 10,
    deathT: 0,
    alive: true,
  };
}

function createArrow(x, y, dir, opt = {}) {
  const spread = opt.spread || 0;
  const speed = opt.speed || CFG.BOW.speed;
  return {
    x, y, w: 18, h: 4,
    vx: Math.cos(spread) * speed * dir,
    vy: Math.sin(spread) * speed,
    dir, dmg: opt.dmg || 8,
    pierce: !!opt.pierce,
    finisher: !!opt.finisher,
    color: opt.color || CFG.COLORS.arrow,
    knock: opt.knock || 140,
    shake: opt.shake || 3,
    hitstop: opt.hitstop || 0.02,
    flash: opt.flash || 0.04,
    hits: {},
    life: 1.3,
  };
}

function updateActorPhysics(e, dt) {
  if (!(e.dashT > 0)) e.vy += CFG.GRAVITY * dt;
  e.x += e.vx * dt;
  e.y += e.vy * dt;
  const floor = CFG.GROUND_Y - e.h;
  if (e.y >= floor) {
    e.y = floor;
    e.vy = 0;
    if ("onGround" in e) e.onGround = true;
  } else if ("onGround" in e) {
    e.onGround = false;
  }
  if (e.dashT > 0) return;
  e.vx *= e.onGround === false ? 0.985 : 0.82;
}

function updatePlayerAnim(p, dt) {
  p.anim += dt;
  if (p.attackAnim > 0) p.attackAnim = Math.max(0, p.attackAnim - dt);
  if (p.airSpin > 0) p.airSpin = Math.max(0, p.airSpin - dt * 2.6);
  if (p.dashT > 0) p.dashT = Math.max(0, p.dashT - dt);
  if (p.dashCd > 0) p.dashCd = Math.max(0, p.dashCd - dt);
  if (p.landSquash > 0) p.landSquash = Math.max(0, p.landSquash - dt * 4);
  if (p.onGround && !p.wasGround) {
    p.landSquash = 1;
    if (Feel.particles) {
      for (let i = 0; i < 6; i++) {
        FX.particles.push({
          x: p.x + p.w / 2 + (Math.random() - 0.5) * 18,
          y: p.y + p.h, vx: (Math.random() - 0.5) * 70,
          vy: -50, life: 0.22, max: 0.22, size: 2.2, color: "#6a5f6e",
        });
      }
    }
  }
  p.wasGround = p.onGround;
  if (p.dashT > 0 && Feel.particles) {
    FX.particles.push({
      x: p.x + p.w / 2, y: p.y + p.h * 0.45,
      vx: -p.facing * 40, vy: (Math.random() - 0.5) * 40,
      life: 0.2, max: 0.2, size: 3.2, soft: true, glow: true, color: "#fff3d0",
    });
  }
}
