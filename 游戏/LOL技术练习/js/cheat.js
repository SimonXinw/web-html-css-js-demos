window.LOL = window.LOL || {};

LOL.Cheat = {
  steps: {
    as: [0.1, 0.2, 2.5],
    windup: [0.02, 0.08, 0.55],
    ad: [5, 1, 500],
    ms: [20, 100, 900],
    range: [25, 125, 900],
  },

  bind(player) {
    const root = document.getElementById('cheat');
    document.getElementById('cheat-toggle').onclick = () => root.classList.toggle('open');
    if (window.matchMedia('(max-width: 700px)').matches) root.classList.remove('open');
    root.querySelectorAll('.tune').forEach((row) => {
      row.querySelectorAll('button').forEach((btn) => {
        btn.onclick = () => this.nudge(player, row.dataset.key, Number(btn.dataset.dir));
      });
      const label = row.querySelector('b');
      label.title = '点击直接改';
      label.addEventListener('click', () => this.edit(player, row.dataset.key, label));
    });
  },

  edit(player, key, label) {
    if (label.dataset.editing === '1') return;
    label.dataset.editing = '1';
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'tune-edit';
    input.step = key === 'as' || key === 'windup' ? '0.01' : '1';
    input.value = this.plain(player, key);
    label.replaceWith(input);
    input.focus();
    input.select();
    let closed = false;
    const finish = (save) => {
      if (closed) return;
      closed = true;
      if (save) this.apply(player, key, input.value);
      if (input.isConnected) input.replaceWith(label);
      label.dataset.editing = '';
    };
    input.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') finish(true);
      if (e.key === 'Escape') finish(false);
    });
    input.addEventListener('blur', () => finish(true));
  },

  plain(player, key) {
    const st = player.stats();
    if (key === 'as') return st.as.toFixed(2);
    if (key === 'windup') return (st.windup / st.as).toFixed(2);
    if (key === 'gold') return String(Math.floor(player.gold));
    if (key === 'ms') return String(Math.round(st.ms));
    if (key === 'range') return String(Math.round(st.range));
    return String(Math.round(st.ad));
  },

  apply(player, key, raw) {
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    if (key === 'gold') {
      player.gold = Math.min(99999, Math.max(0, Math.round(n)));
      if (LOL.Input.shopOpen) LOL.Game.refreshShop();
      return;
    }
    if (key === 'windup') {
      const ratio = Math.min(0.55, Math.max(0.08, n * player.stats().as));
      player.tune.windup = Math.round((ratio - player.parts().windup) * 1000) / 1000;
      return;
    }
    const spec = this.steps[key];
    if (!spec) return;
    const next = Math.min(spec[2], Math.max(spec[1], n));
    player.tune[key] = Math.round((next - player.parts()[key]) * 100) / 100;
  },

  nudge(player, key, dir) {
    if (key === 'gold') {
      player.gold = Math.min(99999, Math.max(0, player.gold + dir * 100));
      if (LOL.Input.shopOpen) LOL.Game.refreshShop();
      return;
    }
    const spec = this.steps[key];
    if (!spec) return;
    const [step, min, max] = spec;
    const base = player.parts()[key];
    const shown = player.stats()[key];
    const next = Math.min(max, Math.max(min, Math.round((shown + dir * step) * 100) / 100));
    player.tune[key] = Math.round((next - base) * 100) / 100;
  },
};
