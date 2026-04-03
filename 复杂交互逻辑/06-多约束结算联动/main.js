/**
 * 多约束结算：国家 × 货值 × 主体 × 物流 耦合；欧盟 VAT 面板；DDP 可用性；阻塞列表驱动提交按钮。
 */
const VALUE_TIERS = [
  { id: "low", label: "低 ($80)", usd: 80 },
  { id: "mid", label: "中 ($160)", usd: 160 },
  { id: "high", label: "高 ($320)", usd: 320 }
];

const ENTITIES = [
  { id: "consumer", label: "个人" },
  { id: "business", label: "企业" }
];

const COUNTRIES = [
  { id: "US", label: "美国" },
  { id: "DE", label: "德国（欧盟）" },
  { id: "JP", label: "日本" },
  { id: "AU", label: "澳大利亚" }
];

/** 物流方式：哪些国家禁用 + 原因；是否 DDP */
const SHIP_METHODS = [
  {
    id: "express",
    name: "国际快递",
    note: "时效快 · 可追踪",
    ddp: true,
    blockedIn: {
      AU: "澳大利亚线该渠道临时限重（演示），请选邮政或海运。"
    }
  },
  {
    id: "post",
    name: "邮政小包",
    note: "经济 · 合并清关",
    ddp: false,
    blockedIn: {}
  },
  {
    id: "sea",
    name: "海运拼箱",
    note: "大件 / 慢线",
    ddp: true,
    blockedIn: {
      JP: "日本个人件不接受该海运入口（演示规则）。"
    }
  }
];

const EU_THRESHOLD = 150;

const state = {
  countryId: "US",
  valueTierId: "mid",
  entityId: "consumer",
  shipId: "express",
  iossAck: false,
  vatId: ""
};

const els = {
  country: document.getElementById("country"),
  valueSeg: document.getElementById("valueSeg"),
  entitySeg: document.getElementById("entitySeg"),
  shipList: document.getElementById("shipList"),
  shipHint: document.getElementById("shipHint"),
  euPanel: document.getElementById("euPanel"),
  euExplain: document.getElementById("euExplain"),
  iossAck: document.getElementById("iossAck"),
  vatField: document.getElementById("vatField"),
  vatId: document.getElementById("vatId"),
  ddpPanel: document.getElementById("ddpPanel"),
  ddpExplain: document.getElementById("ddpExplain"),
  blockersList: document.getElementById("blockersList"),
  btnSubmit: document.getElementById("btnSubmit")
};

const isEu = (id) => id === "DE";

const getValueUsd = () => {
  const t = VALUE_TIERS.find((x) => x.id === state.valueTierId);
  return t ? t.usd : 0;
};

const getShip = () => SHIP_METHODS.find((s) => s.id === state.shipId);

const shipDisabledReason = (method) => method.blockedIn[state.countryId] || "";

const ensureValidShip = () => {
  const current = getShip();
  if (current && !shipDisabledReason(current)) {
    return;
  }
  const firstOk = SHIP_METHODS.find((m) => !shipDisabledReason(m));
  state.shipId = firstOk ? firstOk.id : SHIP_METHODS[0].id;
};

/**
 * 单一真相源：所有 UI 与按钮是否可点都从这里推导。
 */
const derive = () => {
  const usd = getValueUsd();
  const eu = isEu(state.countryId);
  const consumer = state.entityId === "consumer";
  const business = state.entityId === "business";
  const euHigh = eu && usd > EU_THRESHOLD;
  const ship = getShip();
  const shipInvalid = !ship || Boolean(shipDisabledReason(ship));

  const blockers = [];

  if (shipInvalid) {
    blockers.push({ ok: false, text: "请选择与目的国匹配的可用物流。" });
  } else {
    blockers.push({ ok: true, text: "物流方式与目的国匹配。" });
  }

  if (eu && consumer && euHigh) {
    blockers.push({
      ok: state.iossAck,
      text: state.iossAck
        ? "已确认欧盟高货值 VAT / IOSS 说明。"
        : `个人 + 欧盟 + 货值 $${usd} 超 $${EU_THRESHOLD}：须勾选知悉项。`
    });
  } else if (eu && business) {
    const vatOk = state.vatId.trim().length >= 8;
    blockers.push({
      ok: vatOk,
      text: vatOk ? "企业 VAT 号已通过演示校验（≥8 字符）。" : "企业购欧盟：请填写 VAT 号（≥8 字符）。"
    });
  } else {
    blockers.push({ ok: true, text: "VAT：当前组合无额外强制项。" });
  }

  if (ship && ship.ddp && !shipInvalid) {
    blockers.push({ ok: true, text: "当前方案含 DDP 线路（见绿色说明）。" });
  }

  const canSubmit = blockers.every((b) => b.ok);

  return {
    usd,
    eu,
    consumer,
    business,
    euHigh,
    ship,
    shipInvalid,
    blockers,
    canSubmit
  };
};

const renderBlockers = (blockers) => {
  els.blockersList.innerHTML = "";
  blockers.forEach((b) => {
    const li = document.createElement("li");
    li.textContent = b.text;
    li.className = b.ok ? "is-ok" : "is-bad";
    els.blockersList.appendChild(li);
  });
};

const renderEuPanel = (d) => {
  if (!d.eu) {
    els.euPanel.hidden = true;
    els.iossAck.checked = false;
    state.iossAck = false;
    els.vatField.hidden = true;
    els.vatId.value = "";
    state.vatId = "";
    return;
  }

  els.euPanel.hidden = false;

  if (d.consumer && d.euHigh) {
    els.euExplain.textContent =
      `演示：个人收件、货值 $${d.usd} 高于 $${EU_THRESHOLD}，需用户确认 VAT/IOSS 相关说明后方可提交。`;
    els.iossAck.disabled = false;
    els.iossAck.checked = state.iossAck;
    els.vatField.hidden = true;
    els.vatId.value = "";
    state.vatId = "";
  } else if (d.business) {
    els.euExplain.textContent = "企业收件：演示要求填写 VAT 号（B2B 场景简化校验）。";
    els.iossAck.checked = false;
    els.iossAck.disabled = true;
    state.iossAck = false;
    els.vatField.hidden = false;
  } else {
    els.euExplain.textContent = `个人 + 货值未超 $${EU_THRESHOLD}（演示）：无强制 IOSS 勾选。`;
    els.iossAck.checked = false;
    els.iossAck.disabled = true;
    state.iossAck = false;
    els.vatField.hidden = true;
    els.vatId.value = "";
    state.vatId = "";
  }
};

const renderDdpPanel = (ship, shipInvalid) => {
  if (ship && ship.ddp && !shipInvalid) {
    els.ddpPanel.hidden = false;
    els.ddpExplain.textContent =
      "DDP（演示）：报价意图含关税预缴。若改选非 DDP 线路，本区隐藏，阻塞项也会变化。";
  } else {
    els.ddpPanel.hidden = true;
  }
};

const syncSegButtons = (container, items, activeId) => {
  container.querySelectorAll(".seg_btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.id === activeId);
  });
};

const renderShipList = () => {
  els.shipList.innerHTML = "";
  els.shipHint.hidden = true;
  els.shipHint.textContent = "";

  SHIP_METHODS.forEach((m) => {
    const reason = shipDisabledReason(m);
    const disabled = Boolean(reason);

    const label = document.createElement("label");
    label.className = "ship_opt" + (state.shipId === m.id ? " is-selected" : "") + (disabled ? " is-disabled" : "");
    if (disabled) {
      label.title = reason;
    }

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "ship";
    input.value = m.id;
    input.checked = state.shipId === m.id;
    input.disabled = disabled;

    const body = document.createElement("div");
    body.className = "ship_body";
    const name = document.createElement("div");
    name.className = "ship_name";
    name.textContent = m.name;
    if (m.ddp) {
      const badge = document.createElement("span");
      badge.className = "ship_badge ship_badge--ddp";
      badge.textContent = "DDP";
      name.appendChild(badge);
    }
    const meta = document.createElement("div");
    meta.className = "ship_meta";
    meta.textContent = disabled ? `不可用：${reason}` : m.note;
    body.appendChild(name);
    body.appendChild(meta);

    label.appendChild(input);
    label.appendChild(body);

    if (!disabled) {
      label.addEventListener("click", () => {
        state.shipId = m.id;
        refresh();
      });
    }

    els.shipList.appendChild(label);
  });

  const cur = getShip();
  if (cur && shipDisabledReason(cur)) {
    els.shipHint.hidden = false;
    els.shipHint.textContent = "已自动切换到可用物流；灰显选项可悬停查看原因。";
  }
};

const refresh = () => {
  ensureValidShip();
  const d = derive();
  renderShipList();
  renderEuPanel(d);
  renderDdpPanel(d.ship, d.shipInvalid);
  renderBlockers(d.blockers);
  els.btnSubmit.disabled = !d.canSubmit;
  syncSegButtons(els.valueSeg, VALUE_TIERS, state.valueTierId);
  syncSegButtons(els.entitySeg, ENTITIES, state.entityId);
};

const init = () => {
  els.country.innerHTML = "";
  COUNTRIES.forEach((c) => {
    const o = document.createElement("option");
    o.value = c.id;
    o.textContent = c.label;
    els.country.appendChild(o);
  });
  els.country.value = state.countryId;

  els.valueSeg.innerHTML = "";
  VALUE_TIERS.forEach((t) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "seg_btn" + (t.id === state.valueTierId ? " is-active" : "");
    b.dataset.id = t.id;
    b.textContent = t.label;
    b.addEventListener("click", () => {
      state.valueTierId = t.id;
      refresh();
    });
    els.valueSeg.appendChild(b);
  });

  els.entitySeg.innerHTML = "";
  ENTITIES.forEach((e) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "seg_btn" + (e.id === state.entityId ? " is-active" : "");
    b.dataset.id = e.id;
    b.textContent = e.label;
    b.addEventListener("click", () => {
      state.entityId = e.id;
      refresh();
    });
    els.entitySeg.appendChild(b);
  });

  els.country.addEventListener("change", () => {
    state.countryId = els.country.value;
    refresh();
  });

  els.iossAck.addEventListener("change", () => {
    state.iossAck = els.iossAck.checked;
    refresh();
  });

  els.vatId.addEventListener("input", () => {
    state.vatId = els.vatId.value;
    refresh();
  });

  els.btnSubmit.addEventListener("click", () => {
    window.alert("演示通过：阻塞已清空，可对接真实下单接口。");
  });

  refresh();
};

init();
