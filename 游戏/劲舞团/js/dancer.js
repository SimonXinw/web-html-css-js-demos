const Dancer = {
  el: null,
  timer: null,
  laneClass: ["hit-left", "hit-down", "hit-up", "hit-right"],

  init() {
    this.el = document.getElementById("dancer");
    this.idle();
  },

  idle() {
    clearTimeout(this.timer);
    this.el.className = "dancer idle";
  },

  hit(lane, grade) {
    clearTimeout(this.timer);
    const pose = this.laneClass[lane] || "hit-down";
    let extra = "";
    if (grade === "perfect") extra = " perfect";
    if (grade === "miss") {
      this.el.className = "dancer miss-pose";
      this.timer = setTimeout(() => this.idle(), 360);
      return;
    }
    this.el.className = "dancer " + pose + extra;
    this.timer = setTimeout(() => this.idle(), 220);
  },

  celebrate() {
    clearTimeout(this.timer);
    this.el.className = "dancer spin perfect";
    this.timer = setTimeout(() => this.idle(), 600);
  },

  reset() {
    this.idle();
  },
};
