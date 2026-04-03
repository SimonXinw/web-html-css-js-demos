/**
 * 国家 → 二级行政区选项与邮编行显隐；美国邮编校验 + 抖动。
 */
const REGION_DATA = {
  US: {
    label: "州 / State",
    options: ["California", "New York", "Texas", "Washington", "Florida"],
    zip: true
  },
  JP: {
    label: "都道府県",
    options: ["東京都", "大阪府", "神奈川県", "福岡県", "北海道"],
    zip: false
  },
  AU: {
    label: "州 / Territory",
    options: ["NSW", "VIC", "QLD", "WA", "SA"],
    zip: false
  },
  CN: {
    label: "省 / 直辖市",
    options: ["广东省", "浙江省", "江苏省", "上海市", "北京市"],
    zip: false
  }
};

const els = {
  form: document.getElementById("addrForm"),
  country: document.getElementById("country"),
  regionShell: document.getElementById("regionShell"),
  regionLabel: document.getElementById("regionLabel"),
  region: document.getElementById("region"),
  zipField: document.getElementById("zipField"),
  zip: document.getElementById("zip"),
  msg: document.getElementById("formMsg")
};

const setRegionOptions = (country) => {
  const data = REGION_DATA[country];
  els.region.innerHTML = "";
  if (!data) {
    return;
  }
  const ph = document.createElement("option");
  ph.value = "";
  ph.textContent = "请选择";
  els.region.appendChild(ph);
  data.options.forEach((name) => {
    const o = document.createElement("option");
    o.value = name;
    o.textContent = name;
    els.region.appendChild(o);
  });
  els.regionLabel.textContent = data.label;
};

const onCountryChange = () => {
  const v = els.country.value;
  els.msg.textContent = "";
  els.msg.classList.remove("is-ok");
  els.zip.value = "";

  if (!v || !REGION_DATA[v]) {
    els.regionShell.classList.remove("is-open");
    els.regionShell.setAttribute("aria-hidden", "true");
    els.zipField.classList.remove("is-visible");
    els.zipField.hidden = true;
    return;
  }

  setRegionOptions(v);
  els.regionShell.classList.add("is-open");
  els.regionShell.setAttribute("aria-hidden", "false");

  if (REGION_DATA[v].zip) {
    els.zipField.hidden = false;
    window.requestAnimationFrame(() => {
      els.zipField.classList.add("is-visible");
    });
  } else {
    els.zipField.classList.remove("is-visible");
    els.zipField.hidden = true;
  }
};

els.country.addEventListener("change", onCountryChange);

els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  els.msg.textContent = "";
  els.msg.classList.remove("is-ok");

  if (!els.country.value) {
    els.msg.textContent = "请先选择国家。";
    return;
  }

  if (!els.region.value) {
    els.msg.textContent = "请选择二级行政区。";
    return;
  }

  if (els.country.value === "US") {
    const z = els.zip.value.trim();
    if (!/^\d{5}$/.test(z)) {
      els.msg.textContent = "美国地址需填写 5 位数字邮编。";
      els.zip.classList.remove("shake");
      void els.zip.offsetWidth;
      els.zip.classList.add("shake");
      els.zip.focus();
      window.setTimeout(() => els.zip.classList.remove("shake"), 500);
      return;
    }
  }

  els.msg.textContent = "已保存（演示）：" + els.country.value + " · " + els.region.value;
  els.msg.classList.add("is-ok");
});
