const CFG = {
  W: 960,
  H: 540,
  WORLD: 2800,
  GROUND_Y: 430,
  GRAVITY: 2200,
  MOVE_SPEED: 300,
  JUMP_V: -640,
  JUMP2_V: -560,
  DASH: { speed: 720, time: 0.13, cd: 0.5 },
  CRIT: { chance: 0.18, mult: 1.8 },
  PLAYER: { w: 36, h: 58, maxHp: 6 },
  ENEMY: { spawnGap: 1.55, maxAlive: 6 },
  KINDS: {
    grunt: { w: 40, h: 54, hp: 40, speed: 78, dmg: 1, color: "#6e3a42" },
    brute: { w: 52, h: 64, hp: 80, speed: 48, dmg: 2, color: "#4a2a55" },
    bat: { w: 34, h: 28, hp: 28, speed: 110, dmg: 1, color: "#5c3d4a", fly: true },
  },
  SWORD: { hitstop: 0.03, shake: 5, knock: 260, flash: 0.06 },
  BOW: { speed: 700, hitstop: 0.02, shake: 3, knock: 160, flash: 0.04 },
  COLORS: {
    skyTop: "#1a2233", skyBot: "#0f131b",
    ground: "#2a2430", groundLine: "#4a3f4f",
    skin: "#e7d3b8", skinDk: "#cbb396",
    cloth: "#d9cfc0", clothDk: "#b7aa98",
    sash: "#c23b22", hair: "#1c1822", boot: "#2a2430",
    sword: "#f2ebe0", bow: "#8a6a45", arrow: "#c8b89a",
    mobSkin: "#6e3a42", mobHide: "#3d242c",
    mobClaw: "#c9a27a", mobEye: "#ffb454",
    spark: "#ffd7a0", blood: "#c23b22", crit: "#ff6b4a",
  },
};

const Feel = {
  hitstop: true, shake: true, flash: true,
  knockback: true, particles: true, sfx: true,
};
