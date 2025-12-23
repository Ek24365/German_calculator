const tests = [
  { name: "小テスト1", max: 35 },
  { name: "小テスト2", max: 58 },
  { name: "小テスト3", max: 70 },
  { name: "小テスト4", max: 38.5 },
  { name: "小テスト5", max: 80 },
  { name: "小テスト6", max: 35 },
  { name: "小テスト7", max: 54 },
  { name: "小テスト8", max: 70 },
  { name: "小テスト9", max: 70 },
  { name: "期末試験", max: 150 }
];

const area = document.getElementById("score-area");
const saveOption = document.getElementById("saveOption");
const resetBtn = document.getElementById("resetBtn");


tests.forEach((test, i) => {
  const div = document.createElement("div");
  div.className = "score-item";
  div.innerHTML = `
    <label>
      ${test.name}（満点 ${test.max}）
      <input type="number" class="score" data-index="${i}">
    </label>
  `;
  area.appendChild(div);
});

const maxTotal = tests.reduce((sum, t) => sum + t.max, 0);
document.getElementById("maxTotal").textContent = maxTotal;


if (localStorage.getItem("saveEnabled") === "true") {
  saveOption.checked = true;
  resetBtn.style.display = "block";

  document.querySelectorAll(".score").forEach(input => {
    const saved = localStorage.getItem("score_" + input.dataset.index);
    if (saved !== null) input.value = saved;
  });

  const bonusSaved = localStorage.getItem("bonus");
  if (bonusSaved !== null) document.getElementById("bonus").value = bonusSaved;
}


function calculate() {
  let total = 0;

  document.querySelectorAll(".score").forEach(input => {
    const v = Number(input.value);
    if (!isNaN(v)) total += v;
  });

  const bonus = Number(document.getElementById("bonus").value);
  if (!isNaN(bonus)) total += bonus;

  const rate = (total / maxTotal) * 100;

  let grade = "D";
  if (rate >= 90) grade = "S";
  else if (rate >= 80) grade = "A";
  else if (rate >= 70) grade = "B";
  else if (rate >= 60) grade = "C";

  document.getElementById("total").textContent = total.toFixed(1);
  document.getElementById("rate").textContent = rate.toFixed(1);
  document.getElementById("grade").textContent = grade;

  const sNeed = Math.max(0, Math.ceil(0.9 * maxTotal - total));
  const aNeed = Math.max(0, Math.ceil(0.8 * maxTotal - total));

  document.getElementById("toS").textContent =
    sNeed === 0 ? "S評価に到達しています" : `S評価まであと ${sNeed} 点`;

  document.getElementById("toA").textContent =
    aNeed === 0 ? "A評価に到達しています" : `A評価まであと ${aNeed} 点`;

  document.getElementById("message").textContent =
    rate >= 90 ? "もう良くないですか🥺" : "";

  // 保存するかどうかの分岐
  if (saveOption.checked) {
    localStorage.setItem("saveEnabled", "true");

    document.querySelectorAll(".score").forEach(input => {
      localStorage.setItem("score_" + input.dataset.index, input.value);
    });
    localStorage.setItem("bonus", document.getElementById("bonus").value);

    resetBtn.style.display = "block";
  }
}


function resetData() {
  localStorage.clear();
  location.reload();
}
