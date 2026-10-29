window.LOL = window.LOL || {};

LOL.UI = {
  els: null,

  bind() {
    this.els = {
      gold: document.getElementById('stat-gold'),
      lv: document.getElementById('stat-lv'),
      ad: document.getElementById('stat-ad'),
      as: document.getElementById('stat-as'),
      ms: document.getElementById('stat-ms'),
      range: document.getElementById('stat-range'),
      hp: document.getElementById('stat-hp'),
      hits: document.getElementById('stat-hits'),
      cancels: document.getElementById('stat-cancels'),
      kite: document.getElementById('stat-kite'),
      windup: document.getElementById('stat-windup'),
      period: document.getElementById('stat-period'),
      cheat: {
        as: document.getElementById('cheat-as'),
        windup: document.getElementById('cheat-windup'),
        ad: document.getElementById('cheat-ad'),
        ms: document.getElementById('cheat-ms'),
        range: document.getElementById('cheat-range'),
        gold: document.getElementById('cheat-gold'),
      },
      bag: document.getElementById('bag'),
      shop: document.getElementById('shop-panel'),
      shopList: document.getElementById('shop-list'),
      toast: document.getElementById('toast'),
      cds: {
        Q: document.getElementById('cd-Q'),
        W: document.getElementById('cd-W'),
        E: document.getElementById('cd-E'),
        R: document.getElementById('cd-R'),
      },
      aHint: document.getElementById('a-hint'),
      cam: document.getElementById('btn-cam'),
    };
  },

  toast(msg) {
    const el = this.els.toast;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._tt);
    this._tt = setTimeout(() => el.classList.remove('show'), 1400);
  },

  sync(player, input) {
    const st = player.stats();
    this.els.gold.textContent = Math.floor(player.gold);
    this.els.lv.textContent = player.level;
    this.els.ad.textContent = Math.round(st.ad);
    this.els.as.textContent = st.as.toFixed(2);
    this.els.ms.textContent = Math.round(st.ms);
    this.els.range.textContent = Math.round(st.range);
    this.els.hp.textContent = `${Math.ceil(player.hp)}/${Math.ceil(player.maxHp)}`;
    const windupS = st.windup / st.as;
    this.els.windup.textContent = `${windupS.toFixed(2)}s · ${Math.round(st.windup * 100)}%`;
    this.els.period.textContent = `${(1 / st.as).toFixed(2)}s`;
    this.els.cheat.as.textContent = st.as.toFixed(2);
    this.els.cheat.windup.textContent = `${windupS.toFixed(2)}s`;
    this.els.cheat.ad.textContent = Math.round(st.ad);
    this.els.cheat.ms.textContent = Math.round(st.ms);
    this.els.cheat.range.textContent = Math.round(st.range);
    this.els.cheat.gold.textContent = Math.floor(player.gold);
    this.els.hits.textContent = player.hits;
    this.els.cancels.textContent = player.cancels;
    this.els.kite.textContent = player.kiteOk;
    this.els.aHint.classList.toggle('on', input.aMode);
    const locked = LOL.Camera.pinned || !LOL.Camera.free;
    this.els.cam.textContent = locked ? '镜头锁定' : '镜头自由';
    this.els.cam.classList.toggle('on', locked);
    this.els.shop.classList.toggle('open', input.shopOpen);

    for (const k of ['Q', 'W', 'E', 'R']) {
      const cd = player.cds[k];
      const el = this.els.cds[k];
      el.classList.toggle('ready', cd <= 0);
      el.querySelector('.cd-num').textContent = cd > 0 ? cd.toFixed(1) : k;
    }

    this.els.bag.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const slot = document.createElement('div');
      slot.className = 'bag-slot';
      const id = player.items[i];
      if (id) {
        const it = LOL.ITEMS.find((x) => x.id === id);
        slot.textContent = it ? it.name.slice(0, 2) : '?';
        slot.title = it ? it.name : '';
      }
      this.els.bag.appendChild(slot);
    }
  },
};
