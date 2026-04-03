/**
 * 11 - 商品规格对比
 * 功能：勾选商品 → 底部对比条弹出 → 抽屉上滑 · 行逐步入场 · 胜者高亮 · SVG雷达图
 */

// ── Data ───────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1, emoji: "🎧", name: "ANC Pro 降噪耳机", price: 39.99,
    specs: {
      品牌:      "SoundCo",
      续航:      "40h",
      降噪等级:  "主动 ANC",
      蓝牙版本:  "5.3",
      重量:      "245g",
      保修:      "2年",
      评分:      4.8,
    },
    scores: { 音质: 88, 降噪: 92, 舒适: 80, 续航: 90, 性价比: 95 },
  },
  {
    id: 2, emoji: "🎵", name: "Studio HD 监听耳机", price: 89.99,
    specs: {
      品牌:      "AudioPro",
      续航:      "38h",
      降噪等级:  "被动隔音",
      蓝牙版本:  "5.2",
      重量:      "310g",
      保修:      "1年",
      评分:      4.6,
    },
    scores: { 音质: 96, 降噪: 72, 舒适: 75, 续航: 85, 性价比: 60 },
  },
  {
    id: 3, emoji: "🎶", name: "Lite 轻量无线耳机", price: 19.99,
    specs: {
      品牌:      "EarBudz",
      续航:      "28h",
      降噪等级:  "无",
      蓝牙版本:  "5.0",
      重量:      "185g",
      保修:      "6月",
      评分:      4.1,
    },
    scores: { 音质: 68, 降噪: 30, 舒适: 85, 续航: 70, 性价比: 78 },
  },
  {
    id: 4, emoji: "🎼", name: "ProMax 旗舰耳机",  price: 159.99,
    specs: {
      品牌:      "EliteAudio",
      续航:      "60h",
      降噪等级:  "自适应 ANC",
      蓝牙版本:  "5.3",
      重量:      "280g",
      保修:      "3年",
      评分:      4.9,
    },
    scores: { 音质: 98, 降噪: 97, 舒适: 88, 续航: 98, 性价比: 55 },
  },
];

// Spec fields where a HIGHER numeric value wins; or list of preferred values in order
const SPEC_WIN = {
  续航:     "higher_num",   // "40h" → extract 40
  蓝牙版本: "higher_num",
  重量:     "lower_num",    // lower is better
  评分:     "higher_num",
  保修:     "higher_warranty",
  降噪等级: ["自适应 ANC", "主动 ANC", "被动隔音", "无"],
};

const MAX_COMPARE = 4;

// ── State ───────────────────────────────────────────────────────
const selected = new Set(); // product ids

// ── DOM ─────────────────────────────────────────────────────────
const els = {
  productGrid:     document.getElementById("productGrid"),
  compareBar:      document.getElementById("compareBar"),
  compareBarChips: document.getElementById("compareBarChips"),
  compareStartBtn: document.getElementById("compareStartBtn"),
  drawerOverlay:   document.getElementById("drawerOverlay"),
  compDrawer:      document.getElementById("compDrawer"),
  drawerClose:     document.getElementById("drawerClose"),
  drawerBody:      document.getElementById("drawerBody"),
  selectHint:      document.getElementById("selectHint"),
};

// ── Render Product Grid ─────────────────────────────────────────
const renderGrid = () => {
  PRODUCTS.forEach((p) => {
    const starsCount = Math.round(p.specs.评分);
    const stars = "★".repeat(starsCount) + "☆".repeat(5 - starsCount);
    const li = document.createElement("li");
    li.className = "product_card";
    li.dataset.id = p.id;
    li.setAttribute("role", "checkbox");
    li.setAttribute("aria-checked", "false");
    li.setAttribute("tabindex", "0");
    li.innerHTML = `
      <div class="card_check" aria-hidden="true">✓</div>
      <div class="card_emoji">${p.emoji}</div>
      <div class="card_name">${p.name}</div>
      <div class="card_price">$${p.price.toFixed(2)}</div>
      <div class="card_rating">
        <span class="card_stars">${stars}</span> ${p.specs.评分}
      </div>
    `;
    els.productGrid.appendChild(li);
  });
};

renderGrid();

// ── Selection Logic ─────────────────────────────────────────────
const updateUI = () => {
  // Update card states
  document.querySelectorAll(".product_card").forEach((card) => {
    const id = +card.dataset.id;
    const isSelected = selected.has(id);
    card.classList.toggle("selected", isSelected);
    card.setAttribute("aria-checked", isSelected);
  });

  // Update hint text
  if (selected.size === 0) {
    els.selectHint.textContent = "勾选 2 到 4 件商品开始对比";
    els.selectHint.classList.remove("ready");
  } else if (selected.size === 1) {
    els.selectHint.textContent = "还需再选 1 件商品";
    els.selectHint.classList.remove("ready");
  } else {
    els.selectHint.textContent = `已选 ${selected.size} 件，可点击「开始对比」`;
    els.selectHint.classList.add("ready");
  }

  // Compare bar
  const canCompare = selected.size >= 2;

  if (selected.size > 0) {
    els.compareBar.removeAttribute("hidden");
    requestAnimationFrame(() => els.compareBar.classList.add("slide_up"));
  } else {
    els.compareBar.classList.remove("slide_up");
    setTimeout(() => {
      if (selected.size === 0) els.compareBar.setAttribute("hidden", "");
    }, 380);
  }

  // Rebuild chips
  els.compareBarChips.innerHTML = "";
  selected.forEach((id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    const chip = document.createElement("div");
    chip.className = "compare_chip";
    chip.innerHTML = `
      <span class="compare_chip_emoji">${p.emoji}</span>
      <span>${p.name.slice(0, 8)}</span>
      <button class="chip_remove" data-id="${id}" aria-label="移除 ${p.name}">✕</button>
    `;
    els.compareBarChips.appendChild(chip);
  });

  els.compareStartBtn.disabled = !canCompare;
};

els.productGrid.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip_remove");
  if (chip) { selected.delete(+chip.dataset.id); updateUI(); return; }

  const card = e.target.closest(".product_card");
  if (!card) return;

  const id = +card.dataset.id;
  if (selected.has(id)) {
    selected.delete(id);
  } else {
    if (selected.size >= MAX_COMPARE) return; // max 4
    selected.add(id);
  }
  updateUI();
});

els.productGrid.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.target.closest(".product_card")?.click();
  }
});

els.compareBarChips.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip_remove");
  if (!btn) return;
  selected.delete(+btn.dataset.id);
  updateUI();
});

// ── Comparison Drawer ────────────────────────────────────────────
const openDrawer = () => {
  buildComparison();
  els.compDrawer.classList.add("open");
  els.compDrawer.setAttribute("aria-hidden", "false");
  els.drawerOverlay.classList.add("visible");
  document.body.style.overflow = "hidden";
};

const closeDrawer = () => {
  els.compDrawer.classList.remove("open");
  els.compDrawer.setAttribute("aria-hidden", "true");
  els.drawerOverlay.classList.remove("visible");
  document.body.style.overflow = "";
};

els.compareStartBtn.addEventListener("click", openDrawer);
els.drawerClose.addEventListener("click", closeDrawer);
els.drawerOverlay.addEventListener("click", closeDrawer);

// ── Spec winner logic ───────────────────────────────────────────
const extractNum = (str) => parseFloat(String(str).replace(/[^\d.]/g, "")) || 0;

const warrantyMonths = (str) => {
  const s = String(str);
  if (s.includes("年")) return extractNum(s) * 12;
  if (s.includes("月")) return extractNum(s);
  return 0;
};

const determineWinner = (key, values) => {
  const rule = SPEC_WIN[key];
  if (!rule) return null; // no winner for text fields like brand

  if (rule === "higher_num") {
    const nums = values.map(extractNum);
    const max = Math.max(...nums);
    return nums.map((n) => n === max);
  }

  if (rule === "lower_num") {
    const nums = values.map(extractNum);
    const min = Math.min(...nums);
    return nums.map((n) => n === min);
  }

  if (rule === "higher_warranty") {
    const months = values.map(warrantyMonths);
    const max = Math.max(...months);
    return months.map((m) => m === max);
  }

  if (Array.isArray(rule)) {
    const ranks = values.map((v) => {
      const idx = rule.indexOf(v);
      return idx === -1 ? Infinity : idx;
    });
    const best = Math.min(...ranks);
    return ranks.map((r) => r === best);
  }

  return null;
};

// ── Build comparison table ─────────────────────────────────────
const buildComparison = () => {
  const products = PRODUCTS.filter((p) => selected.has(p.id));
  const specKeys = Object.keys(PRODUCTS[0].specs);
  const scoreKeys = Object.keys(PRODUCTS[0].scores);

  els.drawerBody.innerHTML = "";

  // ── Table ──────────────────────────────────────────────────
  const table = document.createElement("table");
  table.className = "cmp_table";

  // Header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.className = "cmp_header_row";

  const thLabel = document.createElement("th");
  thLabel.textContent = "规格";
  headerRow.appendChild(thLabel);

  products.forEach((p) => {
    const th = document.createElement("th");
    th.innerHTML = `
      <div class="cmp_prod_head">
        <span class="cmp_prod_emoji">${p.emoji}</span>
        <span class="cmp_prod_name">${p.name}</span>
        <span class="cmp_prod_price">$${p.price.toFixed(2)}</span>
      </div>
    `;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement("tbody");

  specKeys.forEach((key, rowIdx) => {
    const tr = document.createElement("tr");
    tr.className = "cmp_row";

    const tdLabel = document.createElement("td");
    tdLabel.textContent = key;
    tr.appendChild(tdLabel);

    const values = products.map((p) => p.specs[key]);
    const winners = determineWinner(key, values);

    values.forEach((val, i) => {
      const td = document.createElement("td");
      td.textContent = val;

      if (winners) {
        const isWinner = winners[i];
        const allSame = winners.every((w) => w);
        if (!allSame) {
          td.classList.add(isWinner ? "winner" : "loser");
        }
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);

    // Staggered animation
    setTimeout(() => tr.classList.add("visible"), 80 + rowIdx * 60);
  });

  table.appendChild(tbody);
  els.drawerBody.appendChild(table);

  // ── Radar charts ──────────────────────────────────────────
  const radarsSection = document.createElement("div");
  radarsSection.style.cssText = "margin-top:28px;";

  const radarTitle = document.createElement("p");
  radarTitle.style.cssText = "font-size:0.82rem;color:var(--muted);margin-bottom:16px;";
  radarTitle.textContent = "综合评分雷达图";
  radarsSection.appendChild(radarTitle);

  const radarWrap = document.createElement("div");
  radarWrap.className = "radar_wrap";

  const COLORS = ["#3d9eff", "#52c41a", "#ff7a00", "#bf6fff"];

  products.forEach((p, pi) => {
    const item = document.createElement("div");
    item.className = "radar_item";
    item.style.opacity = "0";
    item.style.transform = "scale(0.85)";
    item.style.transition = `opacity 0.4s ease ${300 + pi * 100}ms, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${300 + pi * 100}ms`;

    const svg = buildRadar(p.scores, scoreKeys, COLORS[pi]);
    const label = document.createElement("div");
    label.className = "radar_label";
    label.innerHTML = `<span style="color:${COLORS[pi]}">${p.emoji}</span> ${p.name.slice(0, 8)}`;

    item.appendChild(svg);
    item.appendChild(label);
    radarWrap.appendChild(item);

    // Trigger animation
    requestAnimationFrame(() => {
      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "scale(1)";
      }, 350 + pi * 100);
    });
  });

  radarsSection.appendChild(radarWrap);
  els.drawerBody.appendChild(radarsSection);

  // ── Best value banner ─────────────────────────────────────
  const totalScores = products.map((p) =>
    Object.values(p.scores).reduce((s, v) => s + v, 0)
  );
  const bestIdx = totalScores.indexOf(Math.max(...totalScores));
  const bestProd = products[bestIdx];

  const banner = document.createElement("div");
  banner.className = "best_value_banner";
  banner.innerHTML = `
    <span class="best_value_banner_icon">🏆</span>
    <span>综合评分最高：<strong>${bestProd.name}</strong>，总分 ${totalScores[bestIdx]} 分</span>
  `;
  els.drawerBody.appendChild(banner);

  setTimeout(() => banner.classList.add("visible"), 600);
};

// ── SVG Radar Chart ────────────────────────────────────────────
const buildRadar = (scores, keys, color) => {
  const SIZE = 110;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 44;
  const n = keys.length;

  const angleOf = (i) => (i * 2 * Math.PI) / n - Math.PI / 2;
  const point = (i, r) => {
    const a = angleOf(i);
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
  };

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", SIZE);
  svg.setAttribute("height", SIZE);
  svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);
  svg.className.baseVal = "radar_svg";

  // Background grid
  [0.25, 0.5, 0.75, 1].forEach((frac) => {
    const pts = keys.map((_, i) => point(i, R * frac));
    const polygon = document.createElementNS(svgNS, "polygon");
    polygon.setAttribute("points", pts.map((p) => `${p.x},${p.y}`).join(" "));
    polygon.setAttribute("fill", "none");
    polygon.setAttribute("stroke", "rgba(255,255,255,0.08)");
    polygon.setAttribute("stroke-width", "1");
    svg.appendChild(polygon);
  });

  // Axes
  keys.forEach((_, i) => {
    const p = point(i, R);
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", CX); line.setAttribute("y1", CY);
    line.setAttribute("x2", p.x); line.setAttribute("y2", p.y);
    line.setAttribute("stroke", "rgba(255,255,255,0.1)");
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);
  });

  // Axis labels
  keys.forEach((key, i) => {
    const p = point(i, R + 10);
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", p.x);
    text.setAttribute("y", p.y);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("font-size", "7");
    text.setAttribute("fill", "rgba(255,255,255,0.45)");
    text.textContent = key;
    svg.appendChild(text);
  });

  // Data polygon
  const dataPts = keys.map((key, i) => {
    const val = (scores[key] || 0) / 100;
    return point(i, R * val);
  });

  const polygon = document.createElementNS(svgNS, "polygon");
  polygon.setAttribute("points", dataPts.map((p) => `${p.x},${p.y}`).join(" "));
  polygon.setAttribute("fill", color.replace(")", ",0.2)").replace("rgb", "rgba").replace("#", ""));

  // Hex color to rgba fill
  polygon.setAttribute("fill", hexToRgba(color, 0.2));
  polygon.setAttribute("stroke", color);
  polygon.setAttribute("stroke-width", "2");
  polygon.setAttribute("stroke-linejoin", "round");

  // Animate stroke-dasharray
  const perimeter = dataPts.reduce((total, p, i) => {
    const next = dataPts[(i + 1) % dataPts.length];
    return total + Math.hypot(next.x - p.x, next.y - p.y);
  }, 0);
  polygon.setAttribute("stroke-dasharray", perimeter);
  polygon.setAttribute("stroke-dashoffset", perimeter);
  polygon.style.transition = "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)";

  svg.appendChild(polygon);

  // Data dots
  dataPts.forEach((p) => {
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", p.x);
    circle.setAttribute("cy", p.y);
    circle.setAttribute("r", "2.5");
    circle.setAttribute("fill", color);
    svg.appendChild(circle);
  });

  // Trigger animation after mount
  requestAnimationFrame(() => {
    setTimeout(() => polygon.setAttribute("stroke-dashoffset", "0"), 50);
  });

  return svg;
};

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};
