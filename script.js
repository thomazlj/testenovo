const STUDY = 50 * 60;
const BREAK = 10 * 60;
const LONG_BREAK = 30 * 60;
const MAX = 4;

let study = STUDY;
let breakT = BREAK;
let distraction = 0;
let cycles = 0;

let state = "paused"; // paused | study | break | distracted
let auto = true;
let speed = 1;

// UTIL
const fmt = s =>
  `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

const now = () =>
  new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});

// UI
function update() {
  timer.textContent = state === "break" ? fmt(breakT) : fmt(study);

  if (state === "paused") {
    stateEl("PAUSADO", "#555", "#888");
  } else if (state === "study") {
    stateEl("FOCANDO", "#20e070", "#20e070");
  } else if (state === "break") {
    stateEl("DESCANSO", "#3498db", "#3498db");
  } else {
    stateEl("DISTRAÍDO", "#ff4d4d", "#ff4d4d");
  }

  distractionEl.textContent = fmt(distraction);
  cyclesEl.textContent = cycles;
}

function stateEl(txt, bg, color) {
  state.textContent = txt;
  state.style.background = bg;
  timer.style.color = color;
}

// CONTROLES
function togglePlay() {
  state = state === "paused" ? "study" : "paused";
  update();
}

function distract() {
  if (state === "study") state = "distracted";
}

function skipFocus() {
  if (state === "study") startBreak();
}

function skipBreak() {
  if (state === "break") startStudy();
}

function toggleAuto() {
  auto = !auto;
  autoBtn.style.opacity = auto ? "1" : "0.4";
}

function resetAll() {
  study = STUDY;
  breakT = BREAK;
  distraction = 0;
  cycles = 0;
  state = "paused";
  history.innerHTML = "";
  update();
}

// TRANSIÇÕES
function startBreak() {
  history.prepend(li("Foco concluído"));
  cycles++;
  breakT = cycles % MAX === 0 ? LONG_BREAK : BREAK;
  state = auto ? "break" : "paused";
}

function startStudy() {
  history.prepend(li("Descanso concluído"));
  study = STUDY;
  state = "paused";
}

// LOOP
setInterval(() => {
  for (let i = 0; i < speed; i++) {
    if (state === "study" && --study <= 0) startBreak();
    if (state === "break" && --breakT <= 0) startStudy();
    if (state === "distracted") distraction++;
  }
  update();
}, 1000);

// HISTÓRICO
function li(t) {
  const e = document.createElement("li");
  e.textContent = `${now()} — ${t}`;
  return e;
}

// VOZ
let rec, listening=false;
function toggleVoice() {
  if (!("webkitSpeechRecognition" in window))
    return alert("Use Chrome.");

  if (!rec) {
    rec = new webkitSpeechRecognition();
    rec.lang = "pt-BR";
    rec.continuous = true;
    rec.onresult = e => {
      const c = e.results[e.results.length-1][0].transcript.toLowerCase();
      if (c.includes("play")) togglePlay();
      if (c.includes("pause")) togglePlay();
      if (c.includes("distrair")) distract();
      if (c.includes("pular foco")) skipFocus();
      if (c.includes("pular descanso")) skipBreak();
      if (c.includes("reset")) resetAll();
    };
  }

  listening = !listening;
  listening ? rec.start() : rec.stop();
  voiceStatus.textContent = listening ? "escutando" : "desligado";
}

// INIT
update();
