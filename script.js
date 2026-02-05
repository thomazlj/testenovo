let mode = "focus"; // focus | break
let running = false;
let seconds = 50 * 60;
let cycles = 0;
let interval = null;
let speed = 1;

const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");
const cyclesEl = document.getElementById("cycles");
const distractionEl = document.getElementById("distraction");
const historyEl = document.getElementById("history");
const beep = document.getElementById("beep");

function format(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateUI() {
  timerEl.textContent = format(seconds);
  cyclesEl.textContent = `${cycles}/4`;

  if (!running) {
    statusEl.textContent = "PAUSADO";
    timerEl.style.color = "#aaa";
  } else if (mode === "focus") {
    statusEl.textContent = "FOCO";
    timerEl.style.color = "#3f3";
  } else {
    statusEl.textContent = "DESCANSO";
    timerEl.style.color = "#4af";
  }
}

function tick() {
  seconds -= speed;
  if (seconds <= 0) finishStage();
  updateUI();
}

function start() {
  if (running) return;
  running = true;
  interval = setInterval(tick, 1000);
  updateUI();
}

function pause() {
  running = false;
  clearInterval(interval);
  updateUI();
}

function finishStage() {
  pause();
  beep.play();
  saveHistory();

  if (mode === "focus") {
    cycles++;
    mode = "break";
    seconds = cycles % 4 === 0 ? 30 * 60 : 10 * 60;
  } else {
    mode = "focus";
    seconds = 50 * 60;
  }

  updateUI();
}

function skipStage() {
  finishStage();
}

function reset() {
  pause();
  mode = "focus";
  seconds = 50 * 60;
  cycles = 0;
  updateUI();
}

function saveHistory() {
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()} — ${mode}`;
  historyEl.prepend(li);
}

document.getElementById("play").onclick = start;
document.getElementById("pause").onclick = pause;
document.getElementById("skip").onclick = skipStage;
document.getElementById("reset").onclick = reset;

document.getElementById("speed").onchange = e => {
  speed = Number(e.target.value);
};

document.getElementById("clearHistory").onclick = () => {
  historyEl.innerHTML = "";
};

updateUI();
