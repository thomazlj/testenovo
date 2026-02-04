// ===============================
// CONFIG
// ===============================
const STUDY_TOTAL = 50 * 60;
const POMODORO_MAX = 4;

// ===============================
// ESTADO
// ===============================
let studyTime = STUDY_TOTAL;
let distractionTime = 0;
let pomodoros = 0;

let state = "study"; // study | distracted
let paused = false;

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
  document.getElementById("studyTimer").textContent = formatTime(studyTime);
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
  } else {
    stateEl.textContent = "DISTRAÍDO";
    stateEl.style.background = "#ff4d4d";
  }

  document.getElementById("distractBtn").style.display =
    !paused && state === "study" ? "inline-block" : "none";

  document.getElementById("focusBtn").style.display =
    !paused && state === "distracted" ? "inline-block" : "none";
}

// ===============================
// CONTROLES
// ===============================
function distract() {
  if (state === "study") state = "distracted";
  updateUI();
}

function returnToFocus() {
  if (state === "distracted") state = "study";
  updateUI();
}

function togglePause() {
  paused = !paused;
  updateUI();
}

function resetAll() {
  addHistory();
  studyTime = STUDY_TOTAL;
  distractionTime = 0;
  pomodoros = 0;
  state = "study";
  paused = false;
  updateUI();
}

// ===============================
// HISTÓRICO
// ===============================
function addHistory() {
  const li = document.createElement("li");
  li.textContent = `Foco: ${formatTime(STUDY_TOTAL - studyTime)} | Distração: ${formatTime(distractionTime)}`;
  document.getElementById("historyList").prepend(li);
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
      studyTime = STUDY_TOTAL;
    }
  } else {
    distractionTime++;
  }

  updateUI();
}, 1000);

// INIT
updateUI();
