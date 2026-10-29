window.LOL = window.LOL || {};

LOL.Shop = {
  buy(player, itemId) {
    const it = LOL.ITEMS.find((i) => i.id === itemId);
    if (!it) return { ok: false, msg: '装备不存在' };
    if (player.gold < it.cost) return { ok: false, msg: '金币不足' };
    if (player.items.filter((id) => id === itemId).length >= 2) {
      return { ok: false, msg: '同名装最多2件' };
    }
    if (player.items.length >= 6) return { ok: false, msg: '背包已满(6格)' };
    player.gold -= it.cost;
    player.items.push(itemId);
    return { ok: true, msg: `购买 ${it.name}` };
  },

  levelUp(player) {
    if (player.level >= 18) return { ok: false, msg: '已满级' };
    const cost = 50 + player.level * 25;
    if (player.gold < cost) return { ok: false, msg: `升级需 ${cost} 金` };
    player.gold -= cost;
    player.level += 1;
    const st = player.stats();
    player.maxHp = st.hp;
    player.hp = st.hp;
    return { ok: true, msg: `升到 ${player.level} 级` };
  },

  renderList(el, player, onBuy) {
    el.innerHTML = '';
    for (const it of LOL.ITEMS) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'shop-item';
      row.disabled = player.gold < it.cost || player.items.length >= 6;
      row.innerHTML = `<span>${it.name}</span><span class="cost">${it.cost}g</span><small>${it.desc}</small>`;
      row.addEventListener('click', () => onBuy(it.id));
      el.appendChild(row);
    }
  },
};
