const Charts = {
  build(song) {
    const rng = this._rng(this._hash(song.id + ":" + song.bpm));
    const beat = 60 / song.bpm;
    const notes = [];
    let t = CFG.LEAD_IN;
    let lastLane = -1;
    const totalBeats = song.bars * 4;

    for (let i = 0; i < totalBeats; i++) {
      const phase = i % 8;
      const strong = phase === 0 || phase === 4;
      const chance = strong ? Math.min(1, song.density + 0.25) : song.density;
      if (rng() > chance) {
        t += beat;
        continue;
      }

      let lane = this._pickLane(lastLane, song, i, rng);
      lastLane = lane;

      const isHold = rng() < song.holds && strong;
      const note = { t, lane, hit: false, missed: false, hold: false };
      if (isHold) {
        note.hold = true;
        note.dur = beat * (1 + Math.floor(rng() * 2));
        note.held = false;
        note.holdDone = false;
      }
      notes.push(note);

      if (song.density > 0.8 && rng() < 0.22 && !isHold) {
        let lane2 = (lane + 1 + Math.floor(rng() * 3)) % 4;
        if (lane2 === lastLane) lane2 = (lane2 + 1) % 4;
        notes.push({ t, lane: lane2, hit: false, missed: false, hold: false });
      }

      t += beat;
    }

    notes.sort((a, b) => a.t - b.t || a.lane - b.lane);
    return { song, notes, duration: t + CFG.TAIL, beat };
  },

  _pickLane(last, song, i, rng) {
    if (song.style === "pulse") {
      return [0, 1, 2, 3, 1, 2, 0, 3][i % 8];
    }
    if (song.style === "rush") {
      const pattern = [0, 3, 1, 2, 0, 1, 3, 2, 1, 0, 2, 3];
      let lane = pattern[i % pattern.length];
      if (lane === last) lane = (lane + 2) % 4;
      return lane;
    }
    let lane = Math.floor(rng() * 4);
    if (lane === last) lane = (lane + 1 + Math.floor(rng() * 3)) % 4;
    return lane;
  },

  _hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  },

  _rng(seed) {
    let s = seed || 1;
    return () => {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  },
};
