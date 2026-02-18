const FOCUS_TIME = 50 * 60;
const BREAK_TIME = 10 * 60;

let timeLeft = FOCUS_TIME;
let isRunning = false;
let isFocus = true;
let interval = null;
let cycles = 0;
let distractionSeconds = 0;
let dailyFocusSeconds = 0;
let speedMultiplier = 1;
let autoStart = false;

const timerEl = document.getElementById("timer");
const stateLabel = document.getElementById("stateLabel");
const playPauseBtn = document.getElementById("playPauseBtn");
const resetBtn = document.getElementById("resetBtn");
const pipBtn = document.getElementById("pipBtn");
const autoStartBtn = document.getElementById("autoStartBtn");
const speedSelect = document.getElementById("speedSelect");
const distractionTimeEl = document.getElementById("distractionTime");
const cycleCountEl = document.getElementById("cycleCount");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const dailyTotalEl = document.getElementById("dailyTotal");
const resetDayBtn = document.getElementById("resetDayBtn");

/* ===========================
   🔥 LOCAL STORAGE
=========================== */

function saveData() {
  localStorage.setItem("history", historyList.innerHTML);
  localStorage.setItem("dailyFocusSeconds", dailyFocusSeconds);
}

function loadData() {
  const savedHistory = localStorage.getItem("history");
  const savedTotal = localStorage.getItem("dailyFocusSeconds");

  if (savedHistory) historyList.innerHTML = savedHistory;
  if (savedTotal) dailyFocusSeconds = parseInt(savedTotal);
}

loadData();

/* ===========================
   FORMATADORES
=========================== */

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function updateDisplay() {
  timerEl.textContent = formatTime(timeLeft);
  distractionTimeEl.textContent = formatTime(distractionSeconds);
  cycleCountEl.textContent = `${cycles}/4`;
  dailyTotalEl.textContent = formatTime(dailyFocusSeconds);
}

/* ===========================
   HISTÓRICO
=========================== */

function addHistory(text) {
  const li = document.createElement("li");
  const now = new Date().toLocaleTimeString();
  li.textContent = `${now} — ${text}`;
  historyList.appendChild(li);
  saveData();
}

/* ===========================
   TIMER
=========================== */

function tick() {
  timeLeft -= speedMultiplier;

  if (isFocus && isRunning) {
    dailyFocusSeconds += speedMultiplier;
  }

  if (timeLeft <= 0) {
    clearInterval(interval);
    isRunning = false;

    if (isFocus) {
      cycles++;
      addHistory("Foco concluído");
      isFocus = false;
      timeLeft = BREAK_TIME;
      stateLabel.textContent = "DESCANSO";
    } else {
      addHistory("Descanso concluído");
      isFocus = true;
      timeLeft = FOCUS_TIME;
      stateLabel.textContent = "FOCANDO";
    }

    if (autoStart) {
      startTimer();
    }

    saveData();
  }

  updateDisplay();
}

function startTimer() {
  if (!interval) {
    interval = setInterval(tick, 1000);
  }
  isRunning = true;
  playPauseBtn.textContent = "⏸";
}

function pauseTimer() {
  isRunning = false;
  playPauseBtn.textContent = "▶";
}

playPauseBtn.addEventListener("click", () => {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
  isRunning = false;
  timeLeft = isFocus ? FOCUS_TIME : BREAK_TIME;
  playPauseBtn.textContent = "▶";
  updateDisplay();
});

/* ===========================
   🔥 ZERAR DIA
=========================== */

resetDayBtn.addEventListener("click", () => {
  if (dailyFocusSeconds > 0) {
    addHistory(`Total do dia zerado (${formatTime(dailyFocusSeconds)})`);
  }
  dailyFocusSeconds = 0;
  saveData();
  updateDisplay();
});

/* ===========================
   OUTROS
=========================== */

autoStartBtn.addEventListener("click", () => {
  autoStart = !autoStart;
  autoStartBtn.textContent = autoStart ? "ON" : "OFF";
});

speedSelect.addEventListener("change", (e) => {
  speedMultiplier = parseInt(e.target.value);
});

clearHistoryBtn.addEventListener("click", () => {
  historyList.innerHTML = "";
  saveData();
});

pipBtn.addEventListener("click", async () => {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  } else {
    await document.documentElement.requestPictureInPicture();
  }
});

updateDisplay();
