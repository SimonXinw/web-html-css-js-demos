function bindFeelToggles() {
  document.querySelectorAll("[data-feel]").forEach((el) => {
    const key = el.dataset.feel;
    if (!(key in Feel)) return;
    el.checked = !!Feel[key];
    el.addEventListener("change", () => {
      Feel[key] = el.checked;
      Sfx.ensure();
    });
  });
}

function bindPanel() {
  const btn = document.getElementById("btn-panel");
  const panel = document.getElementById("panel");
  if (!btn || !panel) return;

  const sync = () => {
    const desktop = window.matchMedia("(min-width: 900px)").matches;
    if (desktop) {
      panel.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  };

  btn.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });

  // 点舞台外关闭设置（手机）
  document.addEventListener("pointerdown", (e) => {
    if (window.matchMedia("(min-width: 900px)").matches) return;
    if (!panel.classList.contains("open")) return;
    if (panel.contains(e.target) || btn.contains(e.target)) return;
    panel.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  });

  sync();
  window.addEventListener("resize", sync);
}

function fitCanvas(canvas) {
  const stage = canvas.parentElement;
  if (!stage) return;
  const rect = stage.getBoundingClientRect();
  const scale = Math.min(rect.width / CFG.W, rect.height / CFG.H);
  canvas.style.width = `${Math.floor(CFG.W * scale)}px`;
  canvas.style.height = `${Math.floor(CFG.H * scale)}px`;
  canvas.style.margin = "0 auto";
}

function boot() {
  const canvas = document.getElementById("game");
  if (!canvas) return;
  Input.init();
  bindFeelToggles();
  bindPanel();
  fitCanvas(canvas);
  window.addEventListener("resize", () => fitCanvas(canvas));
  const unlock = () => Sfx.ensure();
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
  Game.start(canvas);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
