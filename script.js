// ===============================
// CONFIG
// ===============================
const STUDY_TOTAL = 50 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

// ===============================
// ESTADO
// ===============================
let studyTime = STUDY_TOTAL;
let distractionTime = 0;
let pomodoros = 0;

let state = "idle"; // idle | study | distracted | shortBreak | longBreak
let paused = true;

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

  const labels = {
    idle: "PARADO",
    study: "FOCANDO",
    distracted: "DISTRAÍDO",
    shortBreak: "PAUSA CURTA",
    longBreak: "PAUSA LONGA"
  };

  const stateEl = document.getElementById("state");
  stateEl.textContent = labels[state];

  // cores
  if (state === "study") {
    stateEl.style.background = "#20e070";
  } else if (state === "distracted") {
    stateEl.style.background = "#ff4d4d";
  } else {
    stateEl.style.background = "#555";
  }

  // BOTÕES VISÍVEIS
  document.getElementById("distractBtn").style.display =
    state === "study" ? "inline-block" : "none";

  document.getElementById("focusBtn").style.display =
    state === "distracted" ? "inline-block" : "none";
}

// ===============================
// CONTROLES
// ===============================
function togglePause() {
  paused = !paused;
}

function distract() {
  if (state === "study") {
    state = "distracted";
    paused = false;
    updateUI();
  }
}

function returnToStudy() {
  if (state === "distracted") {
    state = "study";
    paused = false;
    updateUI();
  }
}

function resetAll() {
  studyTime = STUDY_TOTAL;
  distractionTime = 0;
  pomodoros = 0;
  state = "idle";
  paused = true;
  updateUI();
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
      state = pomodoros === 4
