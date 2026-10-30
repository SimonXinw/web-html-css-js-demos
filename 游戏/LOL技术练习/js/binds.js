window.LOL = window.LOL || {};

LOL.Binds = {
  store: 'lol-train-binds',
  listening: null,
  arm: Object.create(null),
  map: { attack: 'KeyA', move: 'KeyZ', stop: 'KeyS', shop: 'KeyB' },
  rows: [
    ['attack', '走砍'],
    ['move', '移动'],
    ['stop', '停止'],
    ['shop', '商店'],
  ],

  defaults() {
    return { attack: 'KeyA', move: 'KeyZ', stop: 'KeyS', shop: 'KeyB' };
  },

  ok(code) {
    return typeof code === 'string' && code && code !== 'Space' && code !== 'Escape';
  },

  load() {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(this.store) || 'null'); } catch (err) { raw = null; }
    if (!raw || typeof raw !== 'object') return;
    const seen = new Set();
    for (const [id] of this.rows) {
      if (!(id in raw)) {
        if (this.map[id]) seen.add(this.map[id]);
        continue;
      }
      const code = raw[id];
      if (code !== '' && !this.ok(code)) continue;
      if (code && seen.has(code)) {
        this.map[id] = '';
        continue;
      }
      this.map[id] = code;
      if (code) seen.add(code);
    }
  },

  save() {
    localStorage.setItem(this.store, JSON.stringify(this.map));
  },

  face(id) {
    const code = this.map[id];
    if (!code) return '无';
    if (code.startsWith('Key')) return code.slice(3);
    if (code.startsWith('Digit')) return code.slice(5);
    if (code.startsWith('Numpad')) return `键${code.slice(6)}`;
    const named = {
      ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→',
      ShiftLeft: 'Shift', ShiftRight: '右Shift',
      ControlLeft: 'Ctrl', ControlRight: '右Ctrl',
      AltLeft: 'Alt', AltRight: '右Alt',
      Tab: 'Tab', Enter: 'Enter', Backquote: '`',
    };
    return named[code] || code;
  },

  owns(code) {
    return this.rows.some(([id]) => this.map[id] === code);
  },

  down(id) {
    const code = this.map[id];
    return !!(code && LOL.Input.codes[code]);
  },

  press(code) { this.arm[code] = true; },

  take(id) {
    const code = this.map[id];
    if (!code || !this.arm[code]) return false;
    this.arm[code] = false;
    return true;
  },

  capture(e) {
    if (!this.listening) return false;
    e.preventDefault();
    e.stopPropagation();
    if (e.repeat) return true;
    if (e.code === 'Escape') {
      this.listening = null;
      this.paint();
      return true;
    }
    if (e.code === 'Space') {
      LOL.UI.toast('空格留给镜头');
      return true;
    }
    const id = this.listening;
    if (e.code === 'Backspace' || e.code === 'Delete') this.map[id] = '';
    else {
      const prev = this.map[id];
      for (const [other] of this.rows) {
        if (other !== id && this.map[other] === e.code) this.map[other] = prev;
      }
      this.map[id] = e.code;
    }
    this.listening = null;
    this.save();
    this.paint();
    return true;
  },

  bind() {
    this.load();
    const root = document.getElementById('binds');
    document.getElementById('btn-binds').onclick = () => root.classList.toggle('open');
    document.getElementById('binds-reset').onclick = () => {
      this.map = this.defaults();
      this.listening = null;
      this.save();
      this.paint();
    };
    root.querySelectorAll('[data-bind]').forEach((btn) => {
      btn.onclick = () => {
        this.listening = btn.dataset.bind;
        this.paint();
      };
    });
    this.paint();
  },

  paint() {
    const shop = document.getElementById('btn-shop');
    if (shop) shop.textContent = `商店 (${this.face('shop')})`;
    for (const [id] of this.rows) {
      const btn = document.querySelector(`[data-bind="${id}"]`);
      if (!btn) continue;
      const on = this.listening === id;
      btn.classList.toggle('listen', on);
      btn.textContent = on ? '请按键' : this.face(id);
    }
  },
};
