// ===============================
// CONFIGURAÇÕES
// ===============================
const STUDY_TOTAL = 50 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

// ===============================
// ESTADO GLOBAL
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

  if (state === "study") {
    stateEl.style.background = "#20e070";
    stateEl.style.color = "#0a2";
  } else if (state === "distracted") {
    stateEl.style.background = "#ff4d4d";
    stateEl.style.color = "#300";
  } else {
    stateEl.style.background = "#555";
    stateEl.style.color = "#eee";
  }
}

// ===============================
// CONTROLES
// ===============================
function togglePause() {
  // PLAY
  if (paused) {
    paused = false;

    // Se estava parado ou distraído, volta a focar
    if (state === "idle" || state === "distracted") {
      state = "study";
    }
  }
  // PAUSE
  else {
    paused = true;
  }

  updateUI();
}

function distract() {
  if (state === "study") {
    state = "distracted";
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
// LOOP PRINCIPAL
// ===============================
setInterval(() => {
  if (paused) return;

  if (state === "study") {
    studyTime--;

    if (studyTime <= 0) {
      pomodoros++;

      if (pomodoros === 4) {
        state = "longBreak";
        studyTime = LONG_BREAK;
      } else {
        state = "shortBreak";
        studyTime = SHORT_BREAK;
      }
    }
  }

  else if (state === "distracted") {
    distractionTime++;
  }

  else if (state === "shortBreak" || state === "longBreak") {
    studyTime--;

    if (studyTime <= 0) {
      studyTime = STUDY_TOTAL;
      state = "idle";
      paused = true;
    }
  }

  updateUI();
}, 1000);

// ===============================
// INIT
// ===============================
updateUI();
