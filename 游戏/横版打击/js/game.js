const Game = {
  canvas: null, ctx: null, player: null,
  enemies: [], arrows: [],
  spawnTimer: 0.8, kills: 0, wave: 1,
  streak: 0, streakT: 0, last: 0, running: false,

  start(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.reset();
    this.running = true;
    this.last = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  },

  reset() {
    this.player = createPlayer();
    this.enemies = [createEnemy(560, "grunt"), createEnemy(780, "brute")];
    this.arrows = [];
    this.waves = [];
    this.spawnTimer = 1.2;
    this.kills = 0;
    this.wave = 1;
    this.streak = 0;
    this.streakT = 0;
    FX.reset();
    Atmos.init();
    Cam.reset(this.player);
  },

  respawnPlayer() {
    const cd = this.player.cd;
    const weapon = this.player.weapon;
    const { kills, wave } = this;
    this.player = createPlayer();
    this.player.invuln = 1.4;
    this.player.cd = cd;
    this.player.weapon = weapon;
    this.kills = kills;
    this.wave = wave;
    this.streak = 0;
    Cam.reset(this.player);
  },

  loop(now) {
    if (!this.running) return;
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (dt > 0.05) dt = 0.05;
    this.update(dt);
    this.draw();
    requestAnimationFrame((t) => this.loop(t));
  },

  update(dt) {
    FX.update(dt);
    if (this.streakT > 0) {
      this.streakT -= dt;
      if (this.streakT <= 0) this.streak = 0;
    }
    if (FX.frozen()) {
      Input.endFrame();
      return;
    }
    this.updatePlayer(dt);
    Atmos.update(dt);
    this.updateEnemies(dt);
    Combat.updateSwordHit(this);
    Combat.updateArrows(this, dt);
    Combat.enemyTouchPlayer(this);
    Cam.update(this.player, dt);
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      const alive = this.enemies.filter((e) => e.alive).length;
      if (alive < CFG.ENEMY.maxAlive) {
        AI.spawn(this, Math.random() < 0.35 ? "left" : "right");
      }
      this.spawnTimer = Math.max(0.7, CFG.ENEMY.spawnGap - this.wave * 0.08);
    }
    this.enemies = this.enemies.filter((e) => e.alive || e.deathT > 0 || e.flash > 0);
    Input.endFrame();
  },

  equip(p, weapon) {
    p.weapon = weapon;
    p.combo = 0;
    p.comboLeft = 0;
    p.attackAnim = 0;
    p.buffer = false;
  },

  updatePlayer(dt) {
    const p = this.player;
    const slots = [null, "sword", "bow"];
    const picked = Input.weaponSlot ? slots[Input.weaponSlot] : null;
    if (picked && picked !== p.weapon) this.equip(p, picked);
    if (Input.switchPressed) {
      this.equip(p, p.weapon === "sword" ? "bow" : "sword");
    }
    if (Input.dashPressed && p.dashCd <= 0 && p.dashT <= 0) {
      p.dashT = CFG.DASH.time;
      p.dashCd = CFG.DASH.cd;
      p.vx = p.facing * CFG.DASH.speed;
      p.vy = 0;
      p.invuln = Math.max(p.invuln, CFG.DASH.time + 0.04);
      p.attackAnim = 0;
      p.buffer = false;
      p.cast = null;
      p.castLeft = 0;
      Sfx.play("dash");
      FX.ring(p.x + p.w / 2, p.y + p.h * 0.5, 22, "#e8dfd0");
    }
    const move = (Input.right ? 1 : 0) - (Input.left ? 1 : 0);
    if (p.dashT > 0) {
      p.vx = p.facing * CFG.DASH.speed;
      if (Feel.particles && Math.random() < 0.6) {
        FX.ghost(p.x + p.w / 2, p.y + p.h * 0.55, p.facing, "#e8dfd0");
      }
    } else if (move !== 0 && !(p.cast && p.cast.kind === "thrust")) {
      p.facing = move;
      p.vx = move * CFG.MOVE_SPEED;
    }
    if (p.cast && p.cast.kind === "thrust" && p.castLeft > p.cast.time * 0.32) {
      p.vx = p.facing * p.cast.lunge;
    }
    if (Input.jumpPressed && p.onGround) {
      p.vy = CFG.JUMP_V; p.onGround = false; p.jumps = 1; Sfx.play("hop");
    } else if (Input.jumpPressed && p.jumps > 0) {
      p.vy = CFG.JUMP2_V; p.jumps = 0; p.airSpin = 1; Sfx.play("hop");
      this.hopRing(p);
    }
    if (Input.skill) Skills.cast(this, Input.skill);
    if (Input.attackPressed) Moves.start(this);
    if (p.invuln > 0) p.invuln -= dt;
    updateActorPhysics(p, dt);
    if (p.onGround) p.jumps = 1;
    updatePlayerAnim(p, dt);
    Moves.tick(this, dt);
    Skills.tick(this, dt);
    p.x = Math.max(8, Math.min(CFG.WORLD - p.w - 8, p.x));
  },

  hopRing(p) {
    if (!Feel.particles) return;
    const x = p.x + p.w / 2;
    const y = p.y + p.h * 0.45;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      FX.particles.push({
        x, y, vx: Math.cos(a) * 90, vy: Math.sin(a) * 90,
        life: 0.28, max: 0.28, size: 2.4, color: "#d4a35c",
      });
    }
  },

  updateEnemies(dt) {
    for (const e of this.enemies) {
      if (e.flash > 0) e.flash -= dt;
      if (e.hurt > 0) e.hurt = Math.max(0, e.hurt - dt);
      if (e.deathT > 0) e.deathT = Math.max(0, e.deathT - dt);
      e.anim += dt;
      if (!e.alive) continue;
      AI.update(e, this.player, dt);
      if (e.x < -120 || e.x > CFG.WORLD + 120) {
        e.alive = false;
        e.deathT = 0;
      }
    }
  },

  draw() {
    const ctx = this.ctx;
    const p = this.player;
    ctx.save();
    Cam.apply(ctx);
    World.drawBackground(ctx, Cam.x);
    for (const e of this.enemies) drawEnemy(ctx, e);
    for (const a of this.arrows) drawArrow(ctx, a);
    if (p.invuln <= 0 || Math.floor(p.invuln * 14) % 2 === 0) drawPlayer(ctx, p);
    Atmos.drawFront(ctx, Cam.x);
    FX.draw(ctx);
    World.drawVignette(ctx, Cam.x);
    ctx.restore();
    HUD.draw(ctx, this);
  },
};
