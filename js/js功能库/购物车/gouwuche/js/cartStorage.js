/**
 * 购物车 localStorage：{ items: [{ code, qty }, ...] }
 * 兼容旧版 { code: ["abc1", "abc2"] }
 */
(function () {
  const CART_KEY = "goods";

  function migrateLegacy(parsed) {
    if (!parsed || typeof parsed !== "object") {
      return [];
    }

    if (Array.isArray(parsed.items)) {
      return parsed.items
        .filter((x) => x && x.code)
        .map((x) => ({
          code: String(x.code),
          qty: Math.max(1, parseInt(x.qty, 10) || 1),
        }));
    }

    if (Array.isArray(parsed.code)) {
      const counts = {};

      parsed.code.forEach((c) => {
        const k = String(c);

        counts[k] = (counts[k] || 0) + 1;
      });

      return Object.keys(counts).map((code) => ({ code, qty: counts[code] }));
    }

    return [];
  }

  window.CartStorage = {
    load() {
      try {
        const raw = localStorage.getItem(CART_KEY);

        if (!raw) {
          return [];
        }

        return migrateLegacy(JSON.parse(raw));
      } catch (e) {
        return [];
      }
    },

    save(items) {
      localStorage.setItem(CART_KEY, JSON.stringify({ items }));
    },

    addToCart(code) {
      const c = String(code);
      const items = this.load();
      const found = items.find((x) => x.code === c);

      if (found) {
        found.qty += 1;
      } else {
        items.push({ code: c, qty: 1 });
      }

      this.save(items);
    },

    setQty(code, qty) {
      const c = String(code);
      const n = Math.max(0, parseInt(qty, 10) || 0);
      let items = this.load();
      const found = items.find((x) => x.code === c);

      if (!found) {
        return;
      }

      if (n <= 0) {
        items = items.filter((x) => x.code !== c);
      } else {
        found.qty = n;
      }

      this.save(items);
    },

    remove(code) {
      const c = String(code);
      const items = this.load().filter((x) => x.code !== c);

      this.save(items);
    },

    clear() {
      this.save([]);
    },

    totalCount(items) {
      return items.reduce((s, x) => s + x.qty, 0);
    },
  };
})();
