/**
 * 多币种：基准 CNY，切换时价格层 class 交替触发 CSS 过渡。
 */
const BASE_CNY = 599;

const CURRENCIES = [
  { code: "CNY", label: "CNY ¥", sym: "¥", rateFromCny: 1, feeNote: "境内收款无跨境费（演示）" },
  { code: "USD", label: "USD $", sym: "$", rateFromCny: 0.138, feeNote: "约 0.8% 跨境手续费已折算进展示价" },
  { code: "EUR", label: "EUR €", sym: "€", rateFromCny: 0.128, feeNote: "约 0.8% + 汇差保护（演示文案）" },
  { code: "JPY", label: "JPY", sym: "JP¥", rateFromCny: 21.2, feeNote: "日元展示整数化（演示）" }
];

const state = { code: "CNY" };

const els = {
  tabs: document.getElementById("currencyTabs"),
  priceLayer: document.getElementById("priceLayer"),
  priceSym: document.getElementById("priceSym"),
  priceNum: document.getElementById("priceNum"),
  rateText: document.getElementById("rateText"),
  feeText: document.getElementById("feeText")
};

const formatForCurrency = (code, valueCny) => {
  const c = CURRENCIES.find((x) => x.code === code);
  if (!c) {
    return "";
  }
  const raw = valueCny * c.rateFromCny;
  if (code === "JPY") {
    return Math.round(raw).toLocaleString("ja-JP");
  }
  return raw.toFixed(2);
};

const flashPrice = (sym, numStr, withMotion) => {
  if (!withMotion) {
    els.priceSym.textContent = sym;
    els.priceNum.textContent = numStr;
    els.priceLayer.classList.remove("is-exit");
    els.priceLayer.classList.add("is-active");
    return;
  }

  els.priceLayer.classList.remove("is-active");
  els.priceLayer.classList.add("is-exit");

  window.requestAnimationFrame(() => {
    els.priceSym.textContent = sym;
    els.priceNum.textContent = numStr;
    els.priceLayer.classList.remove("is-exit");
    void els.priceLayer.offsetWidth;
    els.priceLayer.classList.add("is-active");
  });
};

const applyCurrency = (code, options = {}) => {
  const { initial = false } = options;
  const prev = state.code;
  state.code = code;
  const c = CURRENCIES.find((x) => x.code === code);
  if (!c) {
    return;
  }

  const motion = !initial && prev !== code;
  flashPrice(c.sym, formatForCurrency(code, BASE_CNY), motion);

  if (code === "CNY") {
    els.rateText.textContent = "1 CNY = 1.00 CNY";
  } else {
    els.rateText.textContent = `1 CNY ≈ ${c.rateFromCny} ${code}（演示汇率）`;
  }
  els.feeText.textContent = c.feeNote;

  els.tabs.querySelectorAll(".cur_tab").forEach((btn) => {
    const on = btn.dataset.code === code;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
};

const buildTabs = () => {
  els.tabs.innerHTML = "";
  CURRENCIES.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cur_tab" + (c.code === state.code ? " is-active" : "");
    b.dataset.code = c.code;
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", c.code === state.code ? "true" : "false");
    b.textContent = c.label;
    b.addEventListener("click", () => applyCurrency(c.code, {}));
    els.tabs.appendChild(b);
  });
};

document.getElementById("btnCart").addEventListener("click", () => {
  const c = CURRENCIES.find((x) => x.code === state.code);
  const msg = c ? `已加入（演示）：${c.code} ${formatForCurrency(state.code, BASE_CNY)}` : "";
  window.alert(msg);
});

buildTabs();
applyCurrency("CNY", { initial: true });
