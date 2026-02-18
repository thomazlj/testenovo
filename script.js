// ===============================
// CONFIG
// ===============================
const STUDY_TOTAL = 50 * 60;
const SHORT_BREAK = 10 * 60;
const LONG_BREAK = 30 * 60;
const POMODORO_MAX = 4;

// ===============================
// ESTADO
// ===============================
let studyTime = STUDY_TOTAL;
let breakTime = SHORT_BREAK;
let distractionTime = 0;

let pomodoros = 0;
let state = "study";
let paused = true;

let speed = 1;
let autoStart = false;

// flags
let focusStartedLogged = false;
let breakStartedLogged = false;
let isLongBreak = false;

// ⏱️ TOTAL DO DIA
let dailyTotalSeconds = 0;

// ===============================
// AUDIO
// ===============================
let audioCtx = null;

function beep(duration = 200, frequency = 880, volume = 0.2) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  osc.start();
  osc.stop(audioCtx.currentTime + duration / 1000);
}

function focusEndSound() {
  beep(200, 880);
  setTimeout(() => beep(200, 880), 300);
}

function breakEndSound() {
  beep(500, 523);
}

// ===============================
// UTIL
// ===============================
function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function formatHours(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  return `${h}:${m}`;
}

function now() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

// ===============================
// HISTÓRICO
// ===============================
function addHistory(text) {
  const li = document.createElement("li");
  li.textContent = `${now()} — ${text}`;
  document.getElementById("historyList").prepend(li);
}

function clearHistory() {
  document.getElementById("historyList").innerHTML = "";
}

// ===============================
// UI
// ===============================
function updateUI() {
  document.getElementById("studyTimer").textContent =
    state === "break" ? formatTime(breakTime) : formatTime(studyTime);

  document.getElementById("distractionTimer").textContent =
    formatTime(distractionTime);

  document.getElementById("pomodoros").textContent = pomodoros;
  document.getElementById("pomodoroMax").textContent = POMODORO_MAX;

  document.getElementById("dailyTotal").textContent =
    formatHours(dailyTotalSeconds);

  const s = document.getElementById("state");

  if (paused) {
    s.textContent = "PAUSADO";
    s.style.background = "#555";
  } else if (state === "study") {
    s.textContent = "FOCANDO";
    s.style.background = "#20e070";
  } else if (state === "break") {
    s.textContent = isLongBreak ? "DESCANSO LONGO" : "DESCANSO";
    s.style.background = "#3498db";
  } else {
    s.textContent = "DISTRAÍDO";
    s.style.background = "#ff4d4d";
  }

  drawPiP();
}

// ===============================
// CONTROLES
// ===============================
function resetDailyTotal() {
  addHistory(`⏱️ Total do dia zerado — ${formatHours(dailyTotalSeconds)}`);
  dailyTotalSeconds = 0;
  updateUI();
}

// ======= RESTO DO CÓDIGO ORIGINAL =======
// (nenhuma lógica alterada, só o loop abaixo incrementa o total)

// ===============================
// LOOP
// ===============================
setInterval(() => {
  if (!paused && state === "study") {
    dailyTotalSeconds++;
  }

  if (paused) return;

  for (let i = 0; i < speed; i++) {
    if (state === "study") {
      studyTime--;
    } else if (state === "break") {
      breakTime--;
    } else if (state === "distracted") {
      distractionTime++;
    }
  }

  updateUI();
}, 1000);

// INIT
updateUI();
