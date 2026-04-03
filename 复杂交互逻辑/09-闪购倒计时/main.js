/**
 * 09 - 闪购倒计时 & 库存竞争
 * 功能：翻牌倒计时 · 库存模拟消耗 · 在线人数浮动 · 购买状态机
 */

const TOTAL_STOCK = 100;
const STOCK_DEDUCT_MS = 3000;
const WATCH_FLUCTUATE_MS = 2200;
const BUY_LOADING_MS = 1300;
const BUY_SUCCESS_HOLD_MS = 2000;

// DOM refs
const els = {
  h0: document.getElementById("d-h0"),
  h1: document.getElementById("d-h1"),
  m0: document.getElementById("d-m0"),
  m1: document.getElementById("d-m1"),
  s0: document.getElementById("d-s0"),
  s1: document.getElementById("d-s1"),
  stockBar: document.getElementById("stockBar"),
  stockCount: document.getElementById("stockCount"),
  stockBarTrack: document.querySelector(".stock_bar_track"),
  watchingCount: document.getElementById("watchingCount"),
  soldPct: document.getElementById("soldPct"),
  buyBtn: document.getElementById("buyBtn"),
  flashCard: document.getElementById("flashCard"),
};

let remaining = 47;
let watching = 128;
let isBuying = false;

// ─── Countdown ──────────────────────────────────────────────
// Set target 2.5 hours from page load
const targetMs = Date.now() + (2 * 3600 + 30 * 60) * 1000;

const tickDigit = (el, newChar) => {
  if (el.textContent === newChar) return;

  // Remove, force reflow, re-add class to restart animation
  el.classList.remove("is_ticking");
  void el.offsetWidth;
  el.classList.add("is_ticking");

  // Swap text at the midpoint of the animation (opaque → transparent)
  setTimeout(() => {
    el.textContent = newChar;
  }, 152); // ~40% of 380ms

  el.addEventListener("animationend", () => {
    el.classList.remove("is_ticking");
  }, { once: true });
};

const updateCountdown = () => {
  const diffMs = Math.max(0, targetMs - Date.now());
  const totalSec = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");

  tickDigit(els.h0, hh[0]);
  tickDigit(els.h1, hh[1]);
  tickDigit(els.m0, mm[0]);
  tickDigit(els.m1, mm[1]);
  tickDigit(els.s0, ss[0]);
  tickDigit(els.s1, ss[1]);

  if (diffMs === 0) triggerSoldOut("活动已结束");
};

setInterval(updateCountdown, 1000);
updateCountdown();

// ─── Stock depletion ─────────────────────────────────────────
const updateStockUI = () => {
  const pct = Math.round((remaining / TOTAL_STOCK) * 100);
  const soldPct = 100 - pct;

  els.stockBar.style.width = pct + "%";
  els.stockBar.setAttribute("aria-valuenow", pct);
  els.stockCount.textContent = remaining + " 件";
  els.soldPct.textContent = "已售 " + soldPct + "%";

  if (pct <= 20) {
    els.stockBar.classList.add("is_urgent");
    els.stockCount.style.color = "#ff4d4f";
  }
};

const stockTimer = setInterval(() => {
  if (remaining <= 0) { clearInterval(stockTimer); return; }
  remaining = Math.max(0, remaining - 1);
  updateStockUI();
  if (remaining === 0) triggerSoldOut("库存已售罄");
}, STOCK_DEDUCT_MS);

// ─── Watching fluctuation ─────────────────────────────────────
setInterval(() => {
  const delta = Math.round((Math.random() - 0.35) * 7);
  watching = Math.max(60, Math.min(350, watching + delta));
  els.watchingCount.textContent = watching;
}, WATCH_FLUCTUATE_MS);

// ─── Sold-out overlay ─────────────────────────────────────────
let soldOutTriggered = false;

const buildOverlay = () => {
  const ov = document.createElement("div");
  ov.className = "soldout_overlay";
  ov.id = "soldoutOverlay";
  ov.innerHTML = `
    <span class="soldout_emoji">😢</span>
    <span class="soldout_title">已售罄</span>
    <span class="soldout_desc">该商品已被抢光，加入到货提醒，补货时第一时间通知你</span>
    <button class="notify_btn" onclick="location.reload()">加入到货提醒</button>
  `;
  return ov;
};

const overlay = buildOverlay();
els.flashCard.appendChild(overlay);

const triggerSoldOut = (reason = "已售罄") => {
  if (soldOutTriggered) return;
  soldOutTriggered = true;
  clearInterval(stockTimer);

  setBtnState("soldout");
  els.buyBtn.classList.add("shake");
  setTimeout(() => els.buyBtn.classList.remove("shake"), 500);

  remaining = 0;
  updateStockUI();

  setTimeout(() => {
    overlay.classList.add("visible");
  }, 300);
};

// ─── Buy button state machine ─────────────────────────────────
const setBtnState = (state) => {
  els.buyBtn.dataset.state = state;
  els.buyBtn.disabled = (state === "loading" || state === "soldout");
};

const addRipple = (btn, e) => {
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement("span");
  ripple.className = "btn_ripple";
  ripple.style.cssText = `
    width:${size}px;height:${size}px;
    left:${e.clientX - rect.left - size / 2}px;
    top:${e.clientY - rect.top - size / 2}px;
  `;
  btn.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
};

els.buyBtn.addEventListener("click", (e) => {
  const state = els.buyBtn.dataset.state;
  if (state === "loading" || state === "soldout") return;

  if (remaining <= 0) {
    triggerSoldOut();
    return;
  }

  addRipple(els.buyBtn, e);
  setBtnState("loading");
  isBuying = true;

  setTimeout(() => {
    // 85% chance of success; if stock runs out show soldout
    const success = Math.random() > 0.15;

    if (!success || remaining <= 0) {
      triggerSoldOut();
      return;
    }

    setBtnState("success");
    remaining = Math.max(0, remaining - 1);
    updateStockUI();

    setTimeout(() => {
      if (!soldOutTriggered) {
        setBtnState("idle");
        isBuying = false;
      }
    }, BUY_SUCCESS_HOLD_MS);
  }, BUY_LOADING_MS);
});
