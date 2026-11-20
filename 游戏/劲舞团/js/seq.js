const Seq = {
  build(song) {
    const rng = Charts._rng(Charts._hash(song.id + ":classic"));
    const beat = 60 / song.bpm;
    const slack = song.diff === "easy" ? 3 : song.diff === "hard" ? 1.55 : 2.1;
    const minL = song.diff === "easy" ? 3 : song.diff === "hard" ? 5 : 4;
    const maxL = song.diff === "easy" ? 4 : song.diff === "hard" ? 7 : 6;
    const phrases = [];
    let t = CFG.LEAD_IN;
    const rounds = Math.max(8, Math.round(song.bars * 0.65));

    for (let i = 0; i < rounds; i++) {
      const len = minL + Math.floor(rng() * (maxL - minL + 1));
      const arrows = [];
      let prev = -1;
      for (let k = 0; k < len; k++) {
        let lane = Math.floor(rng() * 4);
        if (lane === prev) lane = (lane + 1 + Math.floor(rng() * 3)) % 4;
        arrows.push(lane);
        prev = lane;
      }
      const preview = 0.5;
      const window = beat * (len * 0.85 + slack);
      const gap = len * 0.16 + 0.55;
      phrases.push({
        show: t,
        start: t + preview,
        end: t + preview + window,
        arrows,
        typed: 0,
        state: "wait",
      });
      t += preview + window + gap;
    }
    return { phrases, duration: t + 0.8, beat };
  },
};
