const Flow = {
  autoMiss(game, now) {
    let missed = 0;
    let lane = 0;
    for (const n of game.chart.notes) {
      if (n.hit || n.missed) continue;
      if (now - n.t <= CFG.WINDOWS.cool) continue;
      n.missed = true;
      if (n.hold) n.holdDone = true;
      Judge.apply(game.state, "miss");
      lane = n.lane;
      missed += 1;
    }
    if (!missed) return;
    FX.judge("miss");
    Dancer.hit(lane, "miss");
    try { AudioX.hit("miss"); } catch (_) {}
    HUD.update(game.state);
  },

  holdProgress(game, now) {
    for (const n of game.chart.notes) {
      if (!n.hold || !n.held || n.holdDone) continue;
      if (!Input.isHeld(n.lane)) continue;
      if (now >= n.t + n.dur) {
        n.holdDone = true;
        Judge.holdTick(game.state);
        Judge.holdTick(game.state);
        FX.laneBurst(n.lane);
        Dancer.celebrate();
      } else {
        const tick = Math.floor((now - n.t) * 8);
        if (tick !== n._tick) {
          n._tick = tick;
          Judge.holdTick(game.state);
        }
      }
    }
  },
};
