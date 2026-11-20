const UI = {
  screens: {},
  lastSong: null,
  mode: "fall",
  desc: {
    fall: "音符落到判定线时按下对应方向键",
    classic: "点亮圆形按键，锚点进入右侧区间再按空格",
  },
  hint: {
    fall: "键盘 ←↓↑→ 或 A S W D · 手机点触屏键",
    classic: "先点亮圆键，锚点进右侧再按空格",
  },

  engine() {
    return this.mode === "classic" ? Classic : Game;
  },

  init() {
    ["title", "select", "play", "result"].forEach((name) => {
      this.screens[name] = document.getElementById("screen-" + name);
    });

    FX.init();
    Dancer.init();
    Notes.init();
    HUD.init();
    Input.init();
    Classic.init();
    Input.onLane((lane, down) => {
      if (this.mode === "classic") Classic.onKey(lane, down);
      else Game.onInput(lane, down);
    });
    Game.onEnd = () => this.show("result");
    Classic.onEnd = () => this.show("result");

    document.getElementById("btn-enter").addEventListener("click", async () => {
      await AudioX.resume();
      this.renderSongs();
      this.show("select");
    });
    document.getElementById("btn-back-title").addEventListener("click", () => {
      this.show("title");
    });
    document.getElementById("btn-pause").addEventListener("click", () => this.engine().pause());
    document.getElementById("btn-resume").addEventListener("click", () => this.engine().resume());
    document.getElementById("btn-quit").addEventListener("click", () => {
      this.engine().quit();
      this.show("select");
    });
    document.getElementById("btn-retry").addEventListener("click", () => {
      if (this.lastSong) this.play(this.lastSong);
    });
    document.getElementById("btn-to-select").addEventListener("click", () => {
      this.show("select");
    });
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => this.setMode(btn.dataset.mode));
    });

    document.addEventListener("visibilitychange", () => {
      const eng = this.engine();
      if (document.hidden || !eng.running || eng.paused) return;
      eng.raf = 0;
      eng._loop();
    });

    this.show("title");
  },

  setMode(mode) {
    this.mode = mode === "classic" ? "classic" : "fall";
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.classList.toggle("on", btn.dataset.mode === this.mode);
    });
    document.getElementById("app").classList.toggle("is-classic", this.mode === "classic");
    document.getElementById("mode-desc").textContent = this.desc[this.mode];
    document.getElementById("hint-keys").textContent = this.hint[this.mode];
  },

  show(name) {
    Object.values(this.screens).forEach((el) => el.classList.remove("active"));
    this.screens[name].classList.add("active");
    if (name === "play") requestAnimationFrame(() => Notes.resize());
  },

  renderSongs() {
    const list = document.getElementById("song-list");
    list.innerHTML = "";
    SONGS.forEach((song) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "song-card";
      btn.innerHTML =
        "<div><h3>" + song.title + "</h3><p>" + song.subtitle +
        " · " + song.bpm + " BPM</p></div>" +
        "<span class=\"diff " + song.diff + "\">" + song.diff.toUpperCase() + "</span>";
      btn.addEventListener("click", () => this.play(song));
      list.appendChild(btn);
    });
  },

  async play(song) {
    this.lastSong = song;
    document.getElementById("app").classList.toggle("is-classic", this.mode === "classic");
    this.show("play");
    if (this.mode === "classic") await Classic.start(song);
    else await Game.start(song);
  },
};

document.addEventListener("DOMContentLoaded", () => UI.init());
