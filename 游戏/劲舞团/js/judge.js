const Judge = {
  createState() {
    return {
      score: 0,
      combo: 0,
      maxCombo: 0,
      perfect: 0,
      great: 0,
      cool: 0,
      miss: 0,
      judged: 0,
      total: 0,
      meter: 50,
    };
  },

  windowOf(dt) {
    const a = Math.abs(dt);
    if (a <= CFG.WINDOWS.perfect) return "perfect";
    if (a <= CFG.WINDOWS.great) return "great";
    if (a <= CFG.WINDOWS.cool) return "cool";
    return null;
  },

  apply(state, grade) {
    state.judged += 1;
    if (grade === "miss") {
      state.miss += 1;
      state.combo = 0;
      state.meter = Math.max(0, state.meter - 8);
      return;
    }
    state[grade] += 1;
    state.combo += 1;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    const base = CFG.SCORE[grade];
    const mult = 1 + Math.min(2, state.combo * 0.02);
    state.score += Math.round(base * mult);
    const gain = grade === "perfect" ? 3 : grade === "great" ? 2 : 1;
    state.meter = Math.min(100, state.meter + gain);
  },

  holdTick(state) {
    state.score += CFG.HOLD_TICK;
  },

  gradeLetter(state) {
    if (state.total === 0) return "C";
    const acc = (state.perfect * 1 + state.great * 0.75 + state.cool * 0.4) / state.total;
    const missRatio = state.miss / state.total;
    if (acc >= 0.95 && missRatio < 0.02) return "SS";
    if (acc >= 0.88) return "S";
    if (acc >= 0.75) return "A";
    if (acc >= 0.58) return "B";
    return "C";
  },
};
