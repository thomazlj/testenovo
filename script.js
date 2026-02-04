// ===============================
// CONFIG
// ===============================
const STUDY_TOTAL = 50 * 60;
const BREAK_TOTAL = 10 * 60;
const POMODORO_MAX = 4;

// ===============================
// ESTADO
// ===============================
let studyTime = STUDY_TOTAL;
let breakTime = BREAK_TOTAL;
let distractionTime = 0;
let pomodoros = 0;

let state = "study"; // study | distracted | break
let paused = true;   // começa pausado

// ===============================
// UTIL
// ===============================
function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// ===============================
// UI
// ===============================
function updateUI() {
  const timerEl = document.getElementById("studyTimer");

  if (state === "break") {
    timerEl.textContent = formatTime(breakTime);
  } else {
    timerEl.textContent = formatTime(studyTime);
  }

  document.getElementById("distractionTimer").textContent = formatTime(distractionTime);
  document.getElementById("pomodoros").textContent = pomodoros;
  document.getElementById("pomodoroMax").textContent = POMODORO_MAX;

  const stateEl = document.getElementById("state");

  if (paused) {
    stateEl.textContent = "PAUSADO";
    stateEl.style.background = "#555";
  } else if (state === "study") {
    stateEl.textContent = "FOCANDO";
    stateEl.style.background = "#20e070";
  } else if (state === "break") {
    stateEl.textContent = "DESCANSO";
    stateEl.style.background = "#3498db";
  } else {
    stateEl.textContent = "DISTRAÍDO";
    stateEl.style.background = "#ff4d4d";
  }

  // BOTÕES
  document.getElementById("distractBtn").style.display =
    !paused && state === "study" ? "inline-block" : "none";

  document.getElementById("focusBtn").style.display =
    !paused && state === "distracted" ? "inline-block" : "none";

  document.getElementById("skipBreakBtn").style.display =
    !paused && state === "break" ? "inline-block" : "none";
}

// ===============================
// CONTROLES
// ===============================
function togglePause() {
  paused = !paused;
  updateUI();
}

function distract() {
  if (!paused && state === "study") {
    state = "distracted";
    updateUI();
  }
}

function returnToFocus() {
  if (!paused && state === "distracted") {
    state = "study";
    updateUI();
  }
}

function skipBreak() {
  if (state === "break") {
    breakTime = BREAK_TOTAL;
    studyTime = STUDY_TOTAL;
    state = "study";
    paused = true;
    updateUI();
  }
}

function resetAll() {
  addHistory();
  studyTime = STUDY_TOTAL;
  breakTime = BREAK_TOTAL;
  distractionTime = 0;
  pomodoros = 0;
  state = "study";
  paused = true;
  updateUI();
}

// ===============================
// HISTÓRICO
// ===============================
function addHistory() {
  if (studyTime === STUDY_TOTAL && distractionTime === 0) return;

  const li = document.createElement("li");
  li.textContent = `Foco: ${formatTime(STUDY_TOTAL - studyTime)} | Distração: ${formatTime(distractionTime)}`;
  document.getElementById("historyList").prepend(li);
}

function clearHistory() {
  document.getElementById("historyList").innerHTML = "";
}

// ===============================
// LOOP
// ===============================
setInterval(() => {
  if (paused) return;

  if (state === "study") {
    studyTime--;
    if (studyTime <= 0) {
      pomodoros++;
      state = "break";
      breakTime = BREAK_TOTAL;
    }
  }

  else if (state === "break") {
    breakTime--;
    if (breakTime <= 0) {
      studyTime = STUDY_TOTAL;
      state = "study";
      paused = true; // você decide quando voltar
    }
  }

  else if (state === "distracted") {
    distractionTime++;
  }

  updateUI();
}, 1000);

// INIT
updateUI();
