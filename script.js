const STUDY_TOTAL = 50 * 60;
const SHORT_BREAK = 10 * 60;
const LONG_BREAK = 30 * 60;
const POMODORO_MAX = 4;

let studyTime = STUDY_TOTAL;
let breakTime = SHORT_BREAK;
let distractionTime = 0;
let pomodoros = 0;

let state = "study";
let paused = true;
let speed = 1;
let auto = true;

// UTIL
const formatTime = s =>
  `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

const now = () =>
  new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});

// HISTÓRICO
function addHistory(t){
  const li=document.createElement("li");
  li.textContent=`${now()} — ${t}`;
  historyList.prepend(li);
}
function clearHistory(){historyList.innerHTML="";}

// UI
function updateUI(){
  const timer=studyTimer;
  if(paused){
    timer.style.color="#888";
    stateEl.textContent="PAUSADO";
    stateEl.style.background="#555";
  } else if(state==="study"){
    timer.style.color="#20e070";
    stateEl.textContent="FOCANDO";
    stateEl.style.background="#20e070";
  } else if(state==="break"){
    timer.style.color="#3498db";
    stateEl.textContent="DESCANSO";
    stateEl.style.background="#3498db";
  } else {
    timer.style.color="#ff4d4d";
    stateEl.textContent="DISTRAÍDO";
    stateEl.style.background="#ff4d4d";
  }

  timer.textContent = state==="break" ? formatTime(breakTime) : formatTime(studyTime);
  distractionTimer.textContent=formatTime(distractionTime);
  pomodorosEl.textContent=pomodoros;
}

// CONTROLES
function togglePause(){paused=!paused;updateUI();}
function toggleAuto(){
  auto=!auto;
  autoBtn.style.opacity=auto?"1":"0.4";
}
function setSpeed(v){speed=+v;}
function distract(){if(!paused&&state==="study")state="distracted";}
function returnToFocus(){if(state==="distracted")state="study";}
function resetAll(){addHistory("Sessão resetada");studyTime=STUDY_TOTAL;breakTime=SHORT_BREAK;distractionTime=0;pomodoros=0;paused=true;}
function skipFocus(){if(state==="study"){addHistory("Foco pulado");startBreak();}}
function skipBreak(){if(state==="break"){addHistory("Descanso pulado");startStudy();}}

// TRANSIÇÕES
function startBreak(){
  addHistory("Foco concluído");
  pomodoros++;
  breakTime=pomodoros%POMODORO_MAX===0?LONG_BREAK:SHORT_BREAK;
  state="break";
  if(!auto)paused=true;
}
function startStudy(){
  addHistory("Descanso concluído");
  studyTime=STUDY_TOTAL;
  state="study";
  paused=true;
}

// LOOP
setInterval(()=>{
  if(paused)return;
  for(let i=0;i<speed;i++){
    if(state==="study"&&--studyTime<=0){startBreak();break;}
    if(state==="break"&&--breakTime<=0){startStudy();break;}
    if(state==="distracted")distractionTime++;
  }
  updateUI();
},1000);

// VOZ
let rec, listening=false;
function toggleVoice(){
  if(!("webkitSpeechRecognition"in window))return alert("Sem suporte");
  if(!rec){
    rec=new webkitSpeechRecognition();
    rec.lang="pt-BR";rec.continuous=true;
    rec.onresult=e=>{
      const c=e.results[e.results.length-1][0].transcript.toLowerCase();
      if(c.includes("play"))togglePause();
      if(c.includes("pause"))togglePause();
      if(c.includes("distrair"))distract();
      if(c.includes("voltar"))returnToFocus();
      if(c.includes("pular foco"))skipFocus();
      if(c.includes("pular descanso"))skipBreak();
      if(c.includes("reset"))resetAll();
    };
  }
  listening=!listening;
  listening?rec.start():rec.stop();
  voiceStatus.textContent=listening?"escutando":"desligado";
}

// INIT
updateUI();
