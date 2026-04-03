/**
 * 10 - 购物车飞入动效
 * 功能：抛物线飞入 · 弹簧徽章 · 侧边栏滑入 · 数量控制 · 价格滚动
 */

const PRODUCTS = [
  { id: 1, name: "ANC Pro 降噪耳机",   emoji: "🎧", price: 39.99 },
  { id: 2, name: "人体工学键盘",         emoji: "⌨️", price: 129.0 },
  { id: 3, name: "编织数据线 ×3",       emoji: "🔌", price: 12.5  },
  { id: 4, name: "机械臂台灯",           emoji: "💡", price: 28.99 },
  { id: 5, name: "无线充电板",           emoji: "🔋", price: 19.99 },
  { id: 6, name: "蓝牙音响",             emoji: "🔊", price: 55.0  },
];

const SHIPPING_FEE = 4.99;

// ── State ──────────────────────────────────────────────────────
const cart = {}; // { productId: quantity }

// ── DOM refs ───────────────────────────────────────────────────
const els = {
  cartIconBtn:   document.getElementById("cartIconBtn"),
  cartBadge:     document.getElementById("cartBadge"),
  cartOverlay:   document.getElementById("cartOverlay"),
  cartPanel:     document.getElementById("cartPanel"),
  cartCloseBtn:  document.getElementById("cartCloseBtn"),
  cartItemsList: document.getElementById("cartItemsList"),
  cartEmpty:     document.getElementById("cartEmpty"),
  cartSummary:   document.getElementById("cartSummary"),
  sumSubtotal:   document.getElementById("sumSubtotal"),
  sumTotal:      document.getElementById("sumTotal"),
  checkoutBtn:   document.getElementById("checkoutBtn"),
  productGrid:   document.getElementById("productGrid"),
};

// ── Render product grid ────────────────────────────────────────
const renderProducts = () => {
  PRODUCTS.forEach((p) => {
    const li = document.createElement("li");
    li.className = "product_card";
    li.dataset.id = p.id;
    li.innerHTML = `
      <div class="product_card_emoji" data-emoji="${p.emoji}">${p.emoji}</div>
      <div class="product_card_name">${p.name}</div>
      <div class="product_card_price">$${p.price.toFixed(2)}</div>
      <button class="add_btn" data-product-id="${p.id}">+ 加入购物车</button>
    `;
    els.productGrid.appendChild(li);
  });
};

renderProducts();

// ── Parabolic fly animation ────────────────────────────────────
const flyToCart = (startX, startY, emoji, onComplete) => {
  const cartRect = els.cartIconBtn.getBoundingClientRect();
  const endX = cartRect.left + cartRect.width / 2 - 12;
  const endY = cartRect.top + cartRect.height / 2 - 12;

  // Control point: arc upward and toward cart
  const cpX = (startX + endX) / 2;
  const cpY = Math.min(startY, endY) - 140;

  const particle = document.createElement("span");
  particle.className = "fly_particle";
  particle.textContent = emoji;
  particle.style.left = startX + "px";
  particle.style.top = startY + "px";
  document.body.appendChild(particle);

  const DURATION = 680; // ms
  const startTime = performance.now();

  const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  const animate = (now) => {
    const elapsed = now - startTime;
    const rawT = Math.min(1, elapsed / DURATION);
    const t = easeInOutQuad(rawT);

    // Quadratic Bezier
    const x = (1 - t) ** 2 * startX + 2 * (1 - t) * t * cpX + t ** 2 * endX;
    const y = (1 - t) ** 2 * startY + 2 * (1 - t) * t * cpY + t ** 2 * endY;

    // Scale down and fade near end
    const scale = 1 - t * 0.55;
    const opacity = t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1;

    particle.style.transform = `translate(${x - startX}px, ${y - startY}px) scale(${scale})`;
    particle.style.opacity = opacity;

    if (rawT < 1) {
      requestAnimationFrame(animate);
    } else {
      particle.remove();
      onComplete();
    }
  };

  requestAnimationFrame(animate);
};

// ── Cart badge ─────────────────────────────────────────────────
const getTotalQty = () => Object.values(cart).reduce((s, q) => s + q, 0);

const updateBadge = () => {
  const total = getTotalQty();
  els.cartBadge.textContent = total;

  // Spring pop
  els.cartBadge.classList.remove("pop");
  void els.cartBadge.offsetWidth;
  if (total > 0) els.cartBadge.classList.add("pop");
};

// ── Cart panel ─────────────────────────────────────────────────
const openCart = () => {
  els.cartPanel.classList.add("open");
  els.cartPanel.setAttribute("aria-hidden", "false");
  els.cartOverlay.classList.add("visible");
  document.body.style.overflow = "hidden";
};

const closeCart = () => {
  els.cartPanel.classList.remove("open");
  els.cartPanel.setAttribute("aria-hidden", "true");
  els.cartOverlay.classList.remove("visible");
  document.body.style.overflow = "";
};

els.cartIconBtn.addEventListener("click", openCart);
els.cartCloseBtn.addEventListener("click", closeCart);
els.cartOverlay.addEventListener("click", closeCart);

// ── Price formatting & rolling ─────────────────────────────────
const fmt = (n) => "$" + n.toFixed(2);

const rollPrice = (el, newText) => {
  if (el.textContent === newText) return;
  el.classList.remove("changed");
  void el.offsetWidth;
  el.classList.add("changed");

  // Swap text at midpoint of animation
  setTimeout(() => { el.textContent = newText; }, 120);
  el.addEventListener("animationend", () => el.classList.remove("changed"), { once: true });
};

const updateSummary = () => {
  const subtotal = PRODUCTS.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0);
  const total = subtotal + SHIPPING_FEE;

  rollPrice(els.sumSubtotal, fmt(subtotal));
  rollPrice(els.sumTotal, fmt(total));

  const hasItems = getTotalQty() > 0;
  els.cartEmpty.style.display = hasItems ? "none" : "";
  els.cartSummary.hidden = !hasItems;
};

// ── Cart item rendering ────────────────────────────────────────
const renderCartItems = () => {
  // Rerender only changed items (simple: full re-render with entry animation)
  const existing = Array.from(els.cartItemsList.querySelectorAll(".cart_item"));
  const existingIds = new Set(existing.map((el) => el.dataset.productId));
  const cartIds = new Set(Object.keys(cart).filter((id) => cart[id] > 0));

  // Remove items no longer in cart
  existing.forEach((el) => {
    if (!cartIds.has(el.dataset.productId)) {
      el.classList.add("removing");
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }
  });

  // Add new items or update existing
  PRODUCTS.forEach((p) => {
    const qty = cart[p.id] || 0;
    if (!qty) return;

    let itemEl = els.cartItemsList.querySelector(`[data-product-id="${p.id}"]`);

    if (!itemEl) {
      // Create new item
      itemEl = document.createElement("li");
      itemEl.className = "cart_item entering";
      itemEl.dataset.productId = p.id;
      els.cartItemsList.appendChild(itemEl);
      itemEl.addEventListener("animationend", () => itemEl.classList.remove("entering"), { once: true });
    }

    itemEl.innerHTML = `
      <div class="cart_item_emoji">${p.emoji}</div>
      <div class="cart_item_info">
        <div class="cart_item_name">${p.name}</div>
        <div class="cart_item_price">$${p.price.toFixed(2)} / 件</div>
      </div>
      <div class="cart_item_right">
        <div class="qty_ctrl">
          <button class="qty_btn" data-action="dec" data-id="${p.id}" aria-label="减少数量">−</button>
          <span class="qty_val" id="qty-${p.id}">${qty}</span>
          <button class="qty_btn" data-action="inc" data-id="${p.id}" aria-label="增加数量">+</button>
        </div>
        <div class="cart_item_line_total" id="line-${p.id}">${fmt(qty * p.price)}</div>
        <button class="remove_btn" data-action="remove" data-id="${p.id}" aria-label="移除">移除</button>
      </div>
    `;
  });

  updateSummary();
};

// ── Cart item interactions ─────────────────────────────────────
const changeQty = (productId, delta) => {
  const p = PRODUCTS.find((x) => x.id === +productId);
  if (!p) return;

  cart[productId] = Math.max(0, (cart[productId] || 0) + delta);

  if (cart[productId] === 0) {
    // Remove with animation
    const itemEl = els.cartItemsList.querySelector(`[data-product-id="${productId}"]`);
    if (itemEl) {
      itemEl.classList.add("removing");
      itemEl.addEventListener("animationend", () => {
        delete cart[productId];
        renderCartItems();
        updateBadge();
      }, { once: true });
    }
    return;
  }

  // Update qty display
  const qtyEl = document.getElementById(`qty-${productId}`);
  const lineEl = document.getElementById(`line-${productId}`);
  if (qtyEl) {
    qtyEl.classList.remove("bump");
    void qtyEl.offsetWidth;
    qtyEl.classList.add("bump");
    qtyEl.textContent = cart[productId];
    qtyEl.addEventListener("animationend", () => qtyEl.classList.remove("bump"), { once: true });
  }
  if (lineEl) rollPrice(lineEl, fmt(cart[productId] * p.price));

  updateSummary();
  updateBadge();
};

els.cartItemsList.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const { action, id } = btn.dataset;
  if (action === "inc")    changeQty(id, +1);
  if (action === "dec")    changeQty(id, -1);
  if (action === "remove") changeQty(id, -(cart[id] || 0));
});

// ── Add to cart from product grid ─────────────────────────────
els.productGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add_btn");
  if (!btn) return;

  const productId = +btn.dataset.productId;
  const p = PRODUCTS.find((x) => x.id === productId);
  if (!p) return;

  // Button feedback
  btn.classList.remove("added");
  void btn.offsetWidth;
  btn.classList.add("added");
  btn.addEventListener("animationend", () => btn.classList.remove("added"), { once: true });

  // Get start position from emoji in card
  const emojiEl = btn.closest(".product_card").querySelector(".product_card_emoji");
  const rect = emojiEl.getBoundingClientRect();
  const startX = rect.left + rect.width / 2 - 12;
  const startY = rect.top + rect.height / 2 - 12;

  // Fly animation, then update cart
  flyToCart(startX, startY, p.emoji, () => {
    cart[productId] = (cart[productId] || 0) + 1;
    updateBadge();
    renderCartItems();
  });
});

// ── Checkout state machine ─────────────────────────────────────
els.checkoutBtn.addEventListener("click", () => {
  if (els.checkoutBtn.dataset.state !== "idle") return;

  els.checkoutBtn.dataset.state = "loading";
  els.checkoutBtn.disabled = true;

  setTimeout(() => {
    els.checkoutBtn.dataset.state = "success";
    setTimeout(() => {
      els.checkoutBtn.dataset.state = "idle";
      els.checkoutBtn.disabled = false;
    }, 2500);
  }, 1500);
});

// ── Init ───────────────────────────────────────────────────────
updateSummary();
