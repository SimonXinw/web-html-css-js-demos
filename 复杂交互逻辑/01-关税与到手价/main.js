/**
 * 关税到手价：目的国 + DDP/DAP 驱动 breakdown，行 stagger 显示 + 数字缓动。
 */
const COUNTRIES = [
  { id: "us", label: "美国", shipping: 18.5, dutyRate: 0.08, note: "美国：演示按从价 8% 关税 + 简化州税不计入。" },
  { id: "eu", label: "欧盟", shipping: 22, dutyRate: 0.12, note: "欧盟：VAT 与关税在真实场景需分国别；此处合并为估算比例。" },
  { id: "jp", label: "日本", shipping: 14, dutyRate: 0.05, note: "日本：演示关税比例偏低，仅作动效与交互参考。" },
  { id: "au", label: "澳大利亚", shipping: 20, dutyRate: 0.1, note: "澳大利亚：GST 场景可另拆一行；本 Demo 合并展示。" }
];

const GOODS_USD = 129;
const FEE_RATE = 0.012;

const state = {
  countryId: "us",
  term: "ddp"
};

const els = {
  countryChips: document.getElementById("countryChips"),
  termDdp: document.getElementById("termDdp"),
  termDap: document.getElementById("termDap"),
  breakdown: document.getElementById("breakdown"),
  rowShipping: document.getElementById("rowShipping"),
  rowDuty: document.getElementById("rowDuty"),
  rowFee: document.getElementById("rowFee"),
  rowTotal: document.getElementById("rowTotal"),
  fineprint: document.getElementById("fineprint"),
  dutyTipBtn: document.getElementById("dutyTipBtn"),
  dutyTip: document.getElementById("dutyTip"),
  card: document.querySelector(".card")
};

const formatMoney = (n) => n.toFixed(2);

const animateNumber = (el, to, duration = 520) => {
  const from = parseFloat(el.dataset.value || "0") || 0;
  el.dataset.value = String(to);
  const start = performance.now();

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - t) ** 3;
    const v = from + (to - from) * eased;
    el.textContent = formatMoney(v);
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = formatMoney(to);
    }
  };

  requestAnimationFrame(tick);
};

const compute = () => {
  const c = COUNTRIES.find((x) => x.id === state.countryId) || COUNTRIES[0];
  const shipping = c.shipping;
  const duty = GOODS_USD * c.dutyRate;

  if (state.term === "ddp") {
    const upfront = GOODS_USD + shipping + duty;
    const fee = upfront * FEE_RATE;
    const total = upfront + fee;
    return { c, shipping, duty, dutyBuyerPays: false, fee, total };
  }

  const upfront = GOODS_USD + shipping;
  const fee = upfront * FEE_RATE;
  const total = upfront + fee;
  return { c, shipping, duty, dutyBuyerPays: true, fee, total };
};

let staggerToken = 0;

const refresh = () => {
  const token = ++staggerToken;
  const { c, shipping, duty, fee, total, dutyBuyerPays } = compute();

  els.card.classList.toggle("term-dap", state.term === "dap");

  const rows = els.breakdown.querySelectorAll(".breakdown_row, .breakdown_total");
  rows.forEach((row) => row.classList.remove("is-visible"));

  els.fineprint.textContent =
    c.note +
    (dutyBuyerPays
      ? " DAP：下方实付不含关税，关税由物流/海关向收件人收取（演示数值仅供参考）。"
      : " DDP：关税计入实付总额（演示简化）。");

  const totalLabel = document.getElementById("totalLabel");
  if (totalLabel) {
    totalLabel.textContent = dutyBuyerPays ? "预计实付（不含到付关税）" : "预计实付（USD）";
  }

  const dutySuffix = document.getElementById("dutySuffix");
  if (dutySuffix) {
    dutySuffix.hidden = !dutyBuyerPays;
  }

  const showRow = (selector, delay) => {
    window.setTimeout(() => {
      if (token !== staggerToken) {
        return;
      }
      const row = els.breakdown.querySelector(selector);
      if (row) {
        row.classList.add("is-visible");
      }
    }, delay);
  };

  showRow('[data-row="shipping"]', 80);
  showRow('[data-row="duty"]', 200);
  showRow('[data-row="service"]', 340);
  showRow('[data-row="total"]', 480);

  window.setTimeout(() => {
    if (token !== staggerToken) {
      return;
    }
    animateNumber(els.rowShipping, shipping, 400);
    animateNumber(els.rowDuty, duty, 480);
    animateNumber(els.rowFee, fee, 420);
    animateNumber(els.rowTotal, total, 600);
  }, 100);
};

const renderChips = () => {
  els.countryChips.innerHTML = "";
  COUNTRIES.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (c.id === state.countryId ? " is-active" : "");
    b.textContent = c.label;
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", c.id === state.countryId ? "true" : "false");
    b.addEventListener("click", () => {
      state.countryId = c.id;
      renderChips();
      refresh();
    });
    els.countryChips.appendChild(b);
  });
};

els.termDdp.addEventListener("click", () => {
  state.term = "ddp";
  els.termDdp.classList.add("is-active");
  els.termDap.classList.remove("is-active");
  refresh();
});

els.termDap.addEventListener("click", () => {
  state.term = "dap";
  els.termDap.classList.add("is-active");
  els.termDdp.classList.remove("is-active");
  refresh();
});

els.dutyTipBtn.addEventListener("click", (e) => {
  const open = els.dutyTip.hasAttribute("hidden");
  if (open) {
    const rect = els.dutyTipBtn.getBoundingClientRect();
    els.dutyTip.removeAttribute("hidden");
    els.dutyTip.style.left = `${Math.min(window.innerWidth - 280, rect.left)}px`;
    els.dutyTip.style.top = `${rect.bottom + 8}px`;
    els.dutyTipBtn.setAttribute("aria-expanded", "true");
  } else {
    els.dutyTip.setAttribute("hidden", "");
    els.dutyTipBtn.setAttribute("aria-expanded", "false");
  }
  e.stopPropagation();
});

document.addEventListener("click", () => {
  els.dutyTip.setAttribute("hidden", "");
  els.dutyTipBtn.setAttribute("aria-expanded", "false");
});

renderChips();
els.rowShipping.dataset.value = "0";
els.rowDuty.dataset.value = "0";
els.rowFee.dataset.value = "0";
els.rowTotal.dataset.value = "0";
refresh();
