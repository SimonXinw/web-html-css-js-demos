/**
 * 禁运提示：购物车含 restricted 时结算打开抽屉；勾选后启用继续。
 */
const cart = [];

let idSeq = 0;

const els = {
  cartLines: document.getElementById("cartLines"),
  btnAddNormal: document.getElementById("btnAddNormal"),
  btnAddRestricted: document.getElementById("btnAddRestricted"),
  btnCheckout: document.getElementById("btnCheckout"),
  overlay: document.getElementById("overlay"),
  drawer: document.getElementById("drawer"),
  ackCheck: document.getElementById("ackCheck"),
  drawerContinue: document.getElementById("drawerContinue"),
  drawerClose: document.getElementById("drawerClose")
};

const hasRestricted = () => cart.some((item) => item.restricted);

const renderCart = () => {
  els.cartLines.innerHTML = "";
  if (cart.length === 0) {
    const li = document.createElement("li");
    li.className = "line";
    li.textContent = "购物车为空，点击下方按钮添加。";
    els.cartLines.appendChild(li);
    return;
  }

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.className = "line";
    li.dataset.id = String(item.id);

    const left = document.createElement("div");
    const name = document.createElement("span");
    name.className = "line_name";
    name.textContent = item.name;
    left.appendChild(name);

    if (item.restricted) {
      const tag = document.createElement("span");
      tag.className = "line_tag line_tag--risk";
      tag.textContent = "锂电";
      left.appendChild(document.createTextNode(" "));
      left.appendChild(tag);
    }

    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "line_remove";
    rm.textContent = "移除";
    rm.addEventListener("click", () => {
      const idx = cart.findIndex((x) => x.id === item.id);
      if (idx >= 0) {
        cart.splice(idx, 1);
        renderCart();
      }
    });

    li.appendChild(left);
    li.appendChild(rm);
    els.cartLines.appendChild(li);
  });
};

const openDrawer = () => {
  els.drawer.hidden = false;
  els.overlay.hidden = false;
  document.body.classList.add("drawer-open");
  els.ackCheck.checked = false;
  els.drawerContinue.disabled = true;

  window.requestAnimationFrame(() => {
    els.overlay.classList.add("is-visible");
    els.drawer.classList.add("is-open");
    const icon = els.drawer.querySelector(".warn_icon");
    if (icon) {
      icon.style.animation = "none";
      void icon.offsetWidth;
      icon.style.animation = "";
    }
  });
};

const closeDrawer = () => {
  els.overlay.classList.remove("is-visible");
  els.drawer.classList.remove("is-open");
  document.body.classList.remove("drawer-open");

  window.setTimeout(() => {
    els.drawer.hidden = true;
    els.overlay.hidden = true;
  }, 380);
};

els.btnAddNormal.addEventListener("click", () => {
  cart.push({ id: ++idSeq, name: "基础款 T 恤 ×1", restricted: false });
  renderCart();
});

els.btnAddRestricted.addEventListener("click", () => {
  cart.push({ id: ++idSeq, name: "蓝牙耳机 ×1", restricted: true });
  renderCart();
});

els.btnCheckout.addEventListener("click", () => {
  if (cart.length === 0) {
    window.alert("购物车为空。");
    return;
  }

  if (hasRestricted()) {
    openDrawer();
    return;
  }

  window.alert("无限制商品，直接进入结算（演示）。");
});

els.ackCheck.addEventListener("change", () => {
  els.drawerContinue.disabled = !els.ackCheck.checked;
});

els.drawerContinue.addEventListener("click", () => {
  closeDrawer();
  window.alert("已确认合规提示，进入支付（演示）。");
});

els.drawerClose.addEventListener("click", closeDrawer);

els.overlay.addEventListener("click", closeDrawer);

renderCart();
