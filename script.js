// ===============================
// CONFIG
// ===============================
const STUDY_TOTAL = 50 * 60;

// ===============================
// ESTADO
// ===============================
let studyTime = STUDY_TOTAL;
let distractionTime = 0;
let pomodoros = 0;

let state = "study"; // study | distracted

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

  const stateEl = document.getElementById("state");

  if (state === "study") {
    stateEl.textContent = "FOCANDO";
    stateEl.style.background = "#20e070";
    document.getElementById("distractBtn").style.display = "inline-block";
    document.getElementById("focusBtn").style.display = "none";
  } else {
    stateEl.textContent = "DISTRAÍDO";
    stateEl.style.background = "#ff4d4d";
    document.getElementById("distractBtn").style.display = "none";
    document.getElementById("focusBtn").style.display = "inline-block";
  }
}

// ===============================
// CONTROLES
// ===============================
function distract() {
  state = "distracted";
  updateUI();
}

function focus() {
  state = "study";
  updateUI();
}

// ===============================
// LOOP
// ===============================
setInterval(() => {
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

// ===============================
// INIT
// ===============================
updateUI();
