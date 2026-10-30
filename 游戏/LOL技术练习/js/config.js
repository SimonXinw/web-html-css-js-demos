window.LOL = window.LOL || {};

LOL.CONFIG = {
  MAP_W: 3200,
  MAP_H: 2400,
  BASE: {
    ad: 62,
    as: 0.66,
    range: 420,
    ms: 340,
    hp: 600,
    windup: 0.22,
  },
  PER_LEVEL: { ad: 4, as: 0.03, hp: 90, ms: 2 },
  AS_MIN: 0.2,
  AS_MAX: 100,
  GOLD_PER_HIT: 8,
  GOLD_KILL: 40,
  DUMMY_HP: 800,
};

LOL.ITEMS = [
  { id: 'dagger', name: '短匕', cost: 300, as: 0.12, desc: '+12% 攻速' },
  { id: 'longsword', name: '长剑', cost: 350, ad: 15, desc: '+15 攻击力' },
  { id: 'boots', name: '草鞋', cost: 300, ms: 25, desc: '+25 移速' },
  { id: 'berserker', name: '狂战士胫甲', cost: 1100, as: 0.35, ms: 45, desc: '+35%攻速 +45移速' },
  { id: 'pickaxe', name: '十字镐', cost: 875, ad: 25, desc: '+25 攻击力' },
  { id: 'zeal', name: '狂热', cost: 1200, as: 0.18, ms: 7, desc: '+18%攻速 +7移速' },
  { id: 'pd', name: '幻影之舞', cost: 2600, as: 0.45, ms: 10, ad: 20, desc: '攻速核心装' },
  { id: 'ie', name: '无尽之刃', cost: 3400, ad: 70, desc: '+70 攻击力' },
  { id: 'rfc', name: '疾射火炮', cost: 2600, as: 0.3, range: 100, ms: 10, desc: '+攻速 +射程' },
];

LOL.ABILITIES = {
  Q: {
    name: '穿刺', key: 'Q', cd: 5, cost: 0, range: 900, width: 60, speed: 1600,
    dmg: 80, type: 'skillshot', color: '#5ec8ff',
  },
  W: {
    name: '锁定', key: 'W', cd: 8, cost: 0, range: 650, dmg: 60,
    type: 'targeted', slow: 0.4, slowDur: 1.2, color: '#c084fc',
  },
  E: {
    name: '闪步', key: 'E', cd: 10, cost: 0, dash: 350,
    type: 'dash', color: '#34d399',
  },
  R: {
    name: '裁决', key: 'R', cd: 40, cost: 0, range: 500, dmg: 200,
    type: 'aoe', color: '#fbbf24',
  },
};
