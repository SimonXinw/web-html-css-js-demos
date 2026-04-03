/**
 * 体积重计费：对比 Actual vs Volumetric，取 MAX 计费，柱状图高度与数字更新。
 */
const VOL_DIVISOR = 5000;
const RATE_PER_KG = 15;
const MAX_DISP_KG = 25; // 进度条满格阈值

let totalActualKg = 0;
let totalVolumeCm3 = 0;

const els = {
  btnAddDumbbell: document.getElementById("btnAddDumbbell"),
  btnAddPillow: document.getElementById("btnAddPillow"),
  btnClear: document.getElementById("btnClear"),
  barActual: document.getElementById("barActual"),
  barVol: document.getElementById("barVol"),
  valActual: document.getElementById("valActual"),
  valVol: document.getElementById("valVol"),
  basisText: document.getElementById("basisText"),
  billWeight: document.getElementById("billWeight"),
  totalFee: document.getElementById("totalFee"),
  volSum: document.getElementById("volSum"),
  volRes: document.getElementById("volRes")
};

const updateUI = () => {
  const volKg = totalVolumeCm3 / VOL_DIVISOR;
  const billKg = Math.max(totalActualKg, volKg);
  const fee = billKg * RATE_PER_KG;

  const actualWin = totalActualKg >= volKg && totalActualKg > 0;
  const volWin = volKg > totalActualKg && volKg > 0;

  // Update numbers
  els.valActual.textContent = totalActualKg.toFixed(2) + " kg";
  els.valVol.textContent = volKg.toFixed(2) + " kg";
  els.volSum.textContent = totalVolumeCm3;
  els.volRes.textContent = volKg.toFixed(2);
  els.billWeight.textContent = billKg.toFixed(2) + " kg";
  els.totalFee.textContent = "$" + fee.toFixed(2);

  if (billKg === 0) {
    els.basisText.textContent = "—";
  } else {
    els.basisText.textContent = actualWin ? "实重 (Actual)" : "体积重 (Volumetric 抛重)";
  }

  // Update bars (clamp to 100%)
  const pActual = Math.min(100, (totalActualKg / MAX_DISP_KG) * 100);
  const pVol = Math.min(100, (volKg / MAX_DISP_KG) * 100);
  els.barActual.style.height = `${pActual}%`;
  els.barVol.style.height = `${pVol}%`;

  // Toggle winner classes
  els.barActual.classList.toggle("is-winner", actualWin);
  els.valActual.classList.toggle("is-winner", actualWin);
  els.barVol.classList.toggle("is-winner", volWin);
  els.valVol.classList.toggle("is-winner", volWin);
};

// 哑铃：重 5kg，体积 10*10*20 = 2000cm³ (体积重 0.4kg)
els.btnAddDumbbell.addEventListener("click", () => {
  totalActualKg += 5;
  totalVolumeCm3 += 2000;
  updateUI();
});

// 羽绒枕：重 1kg，体积 40*40*15 = 24000cm³ (体积重 4.8kg)
els.btnAddPillow.addEventListener("click", () => {
  totalActualKg += 1;
  totalVolumeCm3 += 24000;
  updateUI();
});

els.btnClear.addEventListener("click", () => {
  totalActualKg = 0;
  totalVolumeCm3 = 0;
  updateUI();
});

updateUI();