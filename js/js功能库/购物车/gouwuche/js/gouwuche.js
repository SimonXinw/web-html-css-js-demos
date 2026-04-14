(function () {
  const listEl = document.getElementById("cart-list");
  const emptyEl = document.getElementById("cart-empty");
  const panelEl = document.getElementById("cart-panel");
  const badgeEl = document.getElementById("cart-badge");
  const summaryCountEl = document.getElementById("summary-count");
  const grandTotalEl = document.getElementById("grand-total");
  const toastEl = document.getElementById("toast");
  const btnClear = document.getElementById("btn-clear");
  const btnCheckout = document.getElementById("btn-checkout");

  let goodsCatalog = [];
  let toastTimer = 0;

  function escapeHtml(text) {
    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
  }

  function parsePriceYuan(str) {
    const n = parseFloat(String(str).replace(/[^\d.]/g, ""));

    return Number.isFinite(n) ? n : 0;
  }

  function formatYuan(n) {
    const v = Math.round(n * 100) / 100;

    return `￥${v.toFixed(v % 1 === 0 ? 0 : 2)}`;
  }

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is_visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toastEl.classList.remove("is_visible");
    }, 2200);
  }

  function findGoods(code) {
    return goodsCatalog.find((g) => g.code === code);
  }

  function renderCart() {
    let items = CartStorage.load();

    if (goodsCatalog.length > 0) {
      const filtered = items.filter((row) => findGoods(row.code));

      if (filtered.length !== items.length) {
        CartStorage.save(filtered);
        items = filtered;
      }
    }

    if (items.length === 0) {
      emptyEl.hidden = false;
      panelEl.hidden = true;
      badgeEl.textContent = "0 件";
      summaryCountEl.textContent = "0";
      grandTotalEl.textContent = "￥0";

      return;
    }

    emptyEl.hidden = true;
    panelEl.hidden = false;

    const frag = document.createDocumentFragment();

    items.forEach((row) => {
      const g = findGoods(row.code);

      if (!g) {
        return;
      }

      const unit = parsePriceYuan(g.price);
      const sub = unit * row.qty;
      const li = document.createElement("li");

      li.className = "cart_item";
      li.dataset.code = row.code;
      li.innerHTML = `
        <img class="cart_item_img" src="${escapeHtml(g.imgurl)}" alt="${escapeHtml(g.title)}" loading="lazy" width="88" height="88" />
        <div class="cart_stack">
          <h3 class="cart_item_title">${escapeHtml(g.title)}</h3>
          <p class="cart_unit">${escapeHtml(g.price)}</p>
          <div class="cart_row_actions">
            <div class="qty_wrap" role="group" aria-label="数量">
              <button type="button" class="qty_minus" aria-label="减少">−</button>
              <span class="qty_val" aria-live="polite">${row.qty}</span>
              <button type="button" class="qty_plus" aria-label="增加">+</button>
            </div>
            <span class="cart_item_sub">${formatYuan(sub)}</span>
            <button type="button" class="btn_remove">移除</button>
          </div>
        </div>
      `;

      frag.appendChild(li);
    });

    listEl.innerHTML = "";
    listEl.appendChild(frag);

    updateSummary();
  }

  function updateSummary() {
    const items = CartStorage.load();
    const totalQty = CartStorage.totalCount(items);
    let sum = 0;

    items.forEach((row) => {
      const g = findGoods(row.code);

      if (!g) {
        return;
      }

      sum += parsePriceYuan(g.price) * row.qty;
    });

    badgeEl.textContent = `${totalQty} 件`;
    summaryCountEl.textContent = String(totalQty);
    grandTotalEl.textContent = formatYuan(sum);

    if (items.length === 0) {
      emptyEl.hidden = false;
      panelEl.hidden = true;
    }
  }

  listEl.addEventListener("click", (e) => {
    const target = e.target;
    const item = target.closest(".cart_item");

    if (!item) {
      return;
    }

    const code = item.dataset.code;

    if (!code) {
      return;
    }

    if (target.classList.contains("btn_remove")) {
      CartStorage.remove(code);
      showToast("已从购物车移除");
      renderCart();

      return;
    }

    if (target.classList.contains("qty_minus")) {
      const items = CartStorage.load();
      const row = items.find((x) => x.code === code);

      if (!row) {
        return;
      }

      CartStorage.setQty(code, row.qty - 1);
      renderCart();

      return;
    }

    if (target.classList.contains("qty_plus")) {
      const items = CartStorage.load();
      const row = items.find((x) => x.code === code);

      if (!row) {
        return;
      }

      CartStorage.setQty(code, row.qty + 1);
      renderCart();
    }
  });

  btnClear.addEventListener("click", () => {
    const items = CartStorage.load();

    if (items.length === 0) {
      return;
    }

    if (!window.confirm("确定清空购物车？")) {
      return;
    }

    CartStorage.clear();
    showToast("购物车已清空");
    renderCart();
  });

  btnCheckout.addEventListener("click", () => {
    const items = CartStorage.load();

    if (items.length === 0) {
      showToast("购物车是空的");

      return;
    }

    const totalQty = CartStorage.totalCount(items);
    const totalText = grandTotalEl.textContent;

    showToast(`演示：应付 ${totalText}（共 ${totalQty} 件）`);
  });

  function init() {
    fetch("data/goods.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("load goods failed");
        }

        return res.json();
      })
      .then((json) => {
        goodsCatalog = Array.isArray(json) ? json : [];
        renderCart();
      })
      .catch(() => {
        goodsCatalog = [];
        listEl.innerHTML = "";
        emptyEl.hidden = false;
        panelEl.hidden = true;
        showToast("商品数据加载失败，请检查路径或网络");
      });
  }

  init();
})();
