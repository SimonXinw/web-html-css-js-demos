const HUD = {
  els: {},

  init() {
    const ids = [
      "hud-score", "hud-combo", "hud-song", "meter-fill",
      "st-p", "st-g", "st-c", "st-m",
      "result-grade", "result-title",
      "r-score", "r-combo", "r-p", "r-g", "r-c", "r-m",
    ];
    ids.forEach((id) => { this.els[id] = document.getElementById(id); });
  },

  setSong(name) {
    this.els["hud-song"].textContent = name;
  },

  update(state) {
    this.els["hud-score"].textContent = state.score.toLocaleString();
    this.els["hud-combo"].textContent = state.combo;
    this.els["meter-fill"].style.width = state.meter + "%";
    this.els["st-p"].textContent = state.perfect;
    this.els["st-g"].textContent = state.great;
    this.els["st-c"].textContent = state.cool;
    this.els["st-m"].textContent = state.miss;
  },

  showResult(state, song) {
    const grade = Judge.gradeLetter(state);
    this.els["result-grade"].textContent = grade;
    this.els["result-title"].textContent =
      grade === "SS" || grade === "S" ? "完美舞台！" : song.title + " 完成";
    this.els["r-score"].textContent = state.score.toLocaleString();
    this.els["r-combo"].textContent = state.maxCombo;
    this.els["r-p"].textContent = state.perfect;
    this.els["r-g"].textContent = state.great;
    this.els["r-c"].textContent = state.cool;
    this.els["r-m"].textContent = state.miss;
  },
};
