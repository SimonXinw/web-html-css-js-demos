/**
 * 购物车拆单：针对目的地不同，同一批商品可能被分到本地仓或国内仓。
 * US有当地仓。如果选US，且商品在US有货，走US仓。
 */

// 购物车商品，stockType="both"代表中美两地都有货；"cn_only"代表只有中国有。
const CART_ITEMS = [
  { id: 1, name: "降噪耳机", price: 49.99, stockType: "both" },
  { id: 2, name: "人体工学键盘", price: 129.0, stockType: "cn_only" },
  { id: 3, name: "编织数据线 ×3", price: 12.5, stockType: "both" }
];

const els = {
  selDest: document.getElementById("selDest"),
  pkgContainer: document.getElementById("pkgContainer"),
  sumGoods: document.getElementById("sumGoods"),
  sumShip: document.getElementById("sumShip"),
  sumTotal: document.getElementById("sumTotal"),
  tplPkg: document.getElementById("tplPkg")
};

const format = (n) => "$" + n.toFixed(2);

const splitCart = (dest) => {
  const pkgs = [];
  
  if (dest === "US") {
    // US：分 US仓 和 CN仓
    const itemsUS = CART_ITEMS.filter((i) => i.stockType === "both");
    const itemsCN = CART_ITEMS.filter((i) => i.stockType === "cn_only");

    if (itemsUS.length > 0) {
      pkgs.push({
        id: "pkg-us",
        title: "包裹 1",
        badge: "美国发货",
        badgeClass: "pkg_badge--us",
        eta: "预计 2-4 天",
        shipFee: 4.99,
        items: itemsUS
      });
    }

    if (itemsCN.length > 0) {
      pkgs.push({
        id: "pkg-cn",
        title: "包裹 2",
        badge: "跨境直发",
        badgeClass: "pkg_badge--cn",
        eta: "预计 7-12 天",
        shipFee: 8.5,
        items: itemsCN
      });
    }
  } else {
    // 其他（UK）：全由 CN仓发
    pkgs.push({
      id: "pkg-uk-cn",
      title: "单一包裹",
      badge: "中国直发",
      badgeClass: "pkg_badge--cn",
      eta: "预计 8-15 天",
      shipFee: 15.0,
      items: CART_ITEMS
    });
  }

  return pkgs;
};

const render = () => {
  const dest = els.selDest.value;
  const pkgs = splitCart(dest);

  els.pkgContainer.innerHTML = "";
  
  let goodsTotal = 0;
  let shipTotal = 0;

  pkgs.forEach((p) => {
    const clone = els.tplPkg.content.cloneNode(true);
    
    clone.querySelector(".pkg_title").textContent = p.title;
    
    const badge = clone.querySelector(".pkg_badge");
    badge.textContent = p.badge;
    badge.classList.add(p.badgeClass);

    clone.querySelector(".pkg_eta").textContent = p.eta;
    
    const ul = clone.querySelector(".pkg_items");
    p.items.forEach((item) => {
      goodsTotal += item.price;
      const li = document.createElement("li");
      li.className = "item_row";
      li.innerHTML = `<span class="item_name">${item.name}</span><span class="item_price">${format(item.price)}</span>`;
      ul.appendChild(li);
    });

    shipTotal += p.shipFee;
    clone.querySelector(".pkg_ship_val").textContent = format(p.shipFee);

    els.pkgContainer.appendChild(clone);
  });

  els.sumGoods.textContent = format(goodsTotal);
  els.sumShip.textContent = format(shipTotal);
  els.sumTotal.textContent = format(goodsTotal + shipTotal);
};

els.selDest.addEventListener("change", render);

render();
