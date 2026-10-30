window.LOL = window.LOL || {};

LOL.Game = {
  init(canvas) {
    this.canvas = canvas;
    this.player = LOL.createPlayer();
    this.dummies = LOL.Dummy.seedTraining();
    this.projectiles = [];
    this.effects = [];
    this.last = performance.now();
    LOL.Scene3D.init(canvas);
    LOL.Input.bind(canvas);
    LOL.UI.bind();
    LOL.Binds.bind();
    LOL.Cheat.bind(this.player);
    LOL.Dps.bind();
    window.addEventListener('resize', () => LOL.Scene3D.resize());
    this.bindHud();
    requestAnimationFrame((t) => this.frame(t));
  },

  bindHud() {
    document.getElementById('btn-level').onclick = () => {
      LOL.UI.toast(LOL.Shop.levelUp(this.player).msg);
      this.refreshShop();
    };
    document.getElementById('btn-shop').onclick = () => {
      LOL.Input.shopOpen = !LOL.Input.shopOpen;
      this.refreshShop();
    };
    document.getElementById('btn-cam').onclick = () => {
      const cam = LOL.Camera;
      if (cam.pinned || !cam.free) {
        cam.pinned = false;
        cam.free = true;
      } else {
        cam.pinned = true;
        cam.free = false;
      }
    };
    document.getElementById('btn-reset-stats').onclick = () => {
      this.player.hits = 0;
      this.player.cancels = 0;
      this.player.kiteOk = 0;
    };
    this.refreshShop();
  },

  refreshShop() {
    LOL.Shop.renderList(LOL.UI.els.shopList, this.player, (id) => {
      LOL.UI.toast(LOL.Shop.buy(this.player, id).msg);
      this.refreshShop();
    });
  },

  hoverDummy() {
    const m = LOL.Input.mouse;
    let best = null;
    let bestD = 64;
    for (const d of this.dummies) {
      if (d.hp <= 0) continue;
      const dist = LOL.Math.dist(m.worldX, m.worldY, d.x, d.y);
      if (dist < bestD) {
        bestD = dist;
        best = d;
      }
    }
    return best;
  },

  orderPointer(kind) {
    const p = this.player;
    const m = LOL.Input.mouse;
    const hover = this.hoverDummy();
    if (hover) {
      LOL.Combat.issueAttackUnit(p, hover);
      return;
    }
    if (kind === 'move') LOL.Combat.issueMove(p, m.worldX, m.worldY);
    else LOL.Combat.issueAttackMove(p, m.worldX, m.worldY);
  },

  handleInput() {
    const p = this.player;
    const m = LOL.Input.mouse;
    const hover = this.hoverDummy();
    LOL.Input.unitHoverId = hover ? hover.id : null;
    if (LOL.Binds.take('shop')) {
      LOL.Input.shopOpen = !LOL.Input.shopOpen;
      this.refreshShop();
    }
    if (LOL.Input.shopOpen) {
      LOL.Input.consumeClick('L');
      LOL.Input.consumeClick('R');
      LOL.Binds.take('range');
      LOL.Binds.take('quick');
      LOL.Binds.take('move');
      LOL.Binds.take('stop');
      return;
    }
    if (LOL.Binds.take('range') || LOL.Binds.down('range')) LOL.Input.aMode = true;
    const right = LOL.Input.consumeClick('R');
    const move = LOL.Binds.take('move');
    if (right || move) {
      LOL.Input.aMode = false;
      this.orderPointer('move');
    }
    const left = LOL.Input.consumeClick('L');
    const quick = LOL.Binds.take('quick');
    if (left && LOL.Input.aMode) {
      LOL.Input.aMode = false;
      this.orderPointer('attack');
    } else if (quick) {
      LOL.Input.aMode = false;
      this.orderPointer('attack');
    }
    if (LOL.Binds.take('stop')) {
      LOL.Input.aMode = false;
      LOL.Combat.issueStop(p);
    }
    const skills = { q: 'KeyQ', w: 'KeyW', e: 'KeyE', r: 'KeyR' };
    for (const k of Object.keys(skills)) {
      if (!LOL.Input.keys[k]) continue;
      LOL.Input.keys[k] = false;
      if (LOL.Binds.owns(skills[k])) continue;
      const ok = LOL.Abilities.cast(
        k.toUpperCase(), p, m.worldX, m.worldY,
        this.dummies, this.projectiles, this.effects
      );
      if (!ok) LOL.UI.toast(`${k.toUpperCase()} 无法释放`);
    }
  },

  frame(now) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.handleInput();
    LOL.Enemy.update(this.dummies, this.player, this.projectiles, dt);
    for (const d of this.dummies) LOL.Dummy.update(d, dt, this.player);
    LOL.Update.player(this.player, this.dummies, this.projectiles, dt);
    LOL.Collision.resolve(this.player, this.dummies);
    LOL.Projectiles.update(this.projectiles, this.dummies, this.player, dt);
    for (let i = this.effects.length - 1; i >= 0; i--) {
      this.effects[i].life -= dt;
      if (this.effects[i].life <= 0) this.effects.splice(i, 1);
    }
    LOL.Camera.update(this.player, dt);
    LOL.Scene3D.sync({
      player: this.player,
      dummies: this.dummies,
      projectiles: this.projectiles,
      effects: this.effects,
      input: LOL.Input,
    });
    LOL.Dps.sync(this.dummies);
    LOL.Scene3D.render();
    const w = LOL.Scene3D.unproject(LOL.Input.mouse.x, LOL.Input.mouse.y);
    LOL.Input.mouse.worldX = w.x;
    LOL.Input.mouse.worldY = w.y;
    LOL.UI.sync(this.player, LOL.Input);
    requestAnimationFrame((t) => this.frame(t));
  },
};
