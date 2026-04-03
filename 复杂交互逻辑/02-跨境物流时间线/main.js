/**
 * 物流时间线：每段 rail_line 连接圆点；滚轮在 scrollPad 内累计阈值步进；可选自动播放。
 */
const STEP_COUNT = 5;
const WHEEL_THRESHOLD = 100;

const state = {
  activeIndex: 0,
  playing: false,
  wheelAccum: 0
};

const els = {
  timeline: document.getElementById("timeline"),
  progressFill: document.getElementById("progressFill"),
  btnPlay: document.getElementById("btnPlay"),
  btnReset: document.getElementById("btnReset"),
  scrollPad: document.getElementById("scrollPad"),
  scrollPadStep: document.getElementById("scrollPadStep"),
  btnPrev: document.getElementById("btnPrev"),
  btnNext: document.getElementById("btnNext")
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const applySteps = () => {
  const steps = els.timeline.querySelectorAll(".step");
  steps.forEach((step, i) => {
    step.classList.remove("is-done", "is-current");
    if (i < state.activeIndex) {
      step.classList.add("is-done");
    } else if (i === state.activeIndex) {
      step.classList.add("is-current");
    }
  });

  const pct = ((state.activeIndex + 1) / STEP_COUNT) * 100;
  els.progressFill.style.width = `${Math.min(100, pct)}%`;

  if (els.scrollPadStep) {
    els.scrollPadStep.textContent = `当前节点：${state.activeIndex + 1} / ${STEP_COUNT}`;
  }
};

const stepBy = (delta) => {
  state.activeIndex = clamp(state.activeIndex + delta, 0, STEP_COUNT - 1);
  state.wheelAccum = 0;
  applySteps();
};

let playTimer = null;

const stopPlay = () => {
  if (playTimer !== null) {
    window.clearInterval(playTimer);
    playTimer = null;
  }
  state.playing = false;
  els.btnPlay.textContent = "自动播放";
  els.btnPlay.disabled = false;
};

const startPlay = () => {
  stopPlay();
  state.playing = true;
  state.activeIndex = 0;
  applySteps();
  els.btnPlay.textContent = "播放中…";
  els.btnPlay.disabled = true;

  playTimer = window.setInterval(() => {
    if (state.activeIndex >= STEP_COUNT - 1) {
      stopPlay();
      return;
    }
    state.activeIndex += 1;
    applySteps();
  }, 950);
};

els.btnPlay.addEventListener("click", () => {
  if (state.playing) {
    return;
  }
  startPlay();
});

els.btnReset.addEventListener("click", () => {
  stopPlay();
  state.activeIndex = 0;
  state.wheelAccum = 0;
  applySteps();
});

els.btnPrev.addEventListener("click", () => stepBy(-1));
els.btnNext.addEventListener("click", () => stepBy(1));

const onWheel = (e) => {
  if (state.playing) {
    return;
  }
  e.preventDefault();
  state.wheelAccum += e.deltaY;

  if (state.wheelAccum >= WHEEL_THRESHOLD) {
    if (state.activeIndex < STEP_COUNT - 1) {
      stepBy(1);
    } else {
      state.wheelAccum = 0;
    }
  } else if (state.wheelAccum <= -WHEEL_THRESHOLD) {
    if (state.activeIndex > 0) {
      stepBy(-1);
    } else {
      state.wheelAccum = 0;
    }
  }
};

els.scrollPad.addEventListener("wheel", onWheel, { passive: false });

let touchY = null;

els.scrollPad.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length === 1) {
      touchY = e.touches[0].clientY;
    }
  },
  { passive: true }
);

els.scrollPad.addEventListener(
  "touchend",
  (e) => {
    if (touchY === null || state.playing) {
      return;
    }
    const t = e.changedTouches[0];
    const dy = touchY - t.clientY;
    touchY = null;
    if (dy > 48) {
      stepBy(1);
    } else if (dy < -48) {
      stepBy(-1);
    }
  },
  { passive: true }
);

applySteps();
