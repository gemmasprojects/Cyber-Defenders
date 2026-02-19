/* ============================================================
   CYBER DEFENDERS HUB — GAME.JS
   No XP, no levels, secret bonus unlock
============================================================ */

/* ------------------------------
   GLOBAL STATE
------------------------------ */

const state = {
  soundOn: true,
  completed: {
    phishing: false,
    password: false,
    logs: false
  },
  bonusUnlocked: false,
  bonusCompleted: false
};

/* ------------------------------
   SAVE / LOAD
------------------------------ */

function saveState() {
  localStorage.setItem("cdh_state", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("cdh_state");
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
  } catch {}
}

/* ------------------------------
   SOUND SYSTEM
------------------------------ */

const sounds = {
  correct: document.getElementById("sound-correct"),
  wrong: document.getElementById("sound-wrong"),
  levelcomplete: document.getElementById("sound-levelcomplete")
};

function playSound(name) {
  if (!state.soundOn) return;
  const audio = sounds[name];
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

/* ------------------------------
   GEORGE SYSTEM
------------------------------ */

const dragonEl = document.getElementById("dragon-avatar");
const dragonSpeechEl = document.getElementById("dragon-speech");
let dragonTimeout = null;

function dragonSpeak(message, mood = "calm", duration = 4500) {
  dragonEl.className = mood;
  dragonSpeechEl.textContent = message;

  if (dragonTimeout) clearTimeout(dragonTimeout);

  dragonTimeout = setTimeout(() => {
    if (!dragonEl.classList.contains("final-form")) {
      dragonEl.className = "calm";
      dragonSpeechEl.textContent =
        "George says: stay curious — every click teaches you something new.";
    }
  }, duration);
}

/* ------------------------------
   CONFETTI
------------------------------ */

function launchConfetti(count = 40, rainbow = false) {
  const colours = rainbow
    ? ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"]
    : ["var(--mint)", "var(--lavender)"];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.setProperty("--confetti-x", `${(Math.random() - 0.5) * 300}px`);
    piece.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
    piece.style.background = colours[Math.floor(Math.random() * colours.length)];
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1500);
  }
}

/* ------------------------------
   SCREENS + CARDS
------------------------------ */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

const introCardEl = document.getElementById("intro-card");
const introTextEl = document.getElementById("intro-text");

const wisdomCardEl = document.getElementById("wisdom-card");
const wisdomTextEl = document.getElementById("wisdom-text");

const congratsCardEl = document.getElementById("congrats-card");
const congratsTextEl = document.getElementById("congrats-text");

const fullCompletionCardEl = document.getElementById("full-completion-card");
const sharePanelEl = document.getElementById("share-panel");

const gameContentEl = document.getElementById("game-content");

function showIntro(text, onContinue) {
  introTextEl.textContent = text;
  introCardEl.classList.remove("hidden");
  wisdomCardEl.classList.add("hidden");
  congratsCardEl.classList.add("hidden");
  fullCompletionCardEl.classList.add("hidden");
  sharePanelEl.classList.add("hidden");
  gameContentEl.classList.add("hidden");

  const btn = document.getElementById("intro-continue");
  const handler = () => {
    introCardEl.classList.add("hidden");
    btn.removeEventListener("click", handler);
    onContinue();
  };
  btn.addEventListener("click", handler);
}

function showWisdom(text, onContinue) {
  wisdomTextEl.textContent = text;
  wisdomCardEl.classList.remove("hidden");
  introCardEl.classList.add("hidden");

  const btn = document.getElementById("wisdom-continue");
  const handler = () => {
    wisdomCardEl.classList.add("hidden");
    btn.removeEventListener("click", handler);
    gameContentEl.classList.remove("hidden");
    onContinue();
  };
  btn.addEventListener("click", handler);
}

function showCongratulations(message) {
  congratsTextEl.textContent = message;
  congratsCardEl.classList.remove("hidden");
  gameContentEl.classList.add("hidden");

  dragonSpeak("George says: brilliant work — you handled that challenge perfectly!", "proud");
  playSound("levelcomplete");
  launchConfetti(60);
}

function showFullCompletionCinematic() {
  fullCompletionCardEl.classList.remove("hidden");
  sharePanelEl.classList.remove("hidden");
  gameContentEl.classList.add("hidden");

  dragonEl.className = "final-form";
  dragonSpeak(
    "George says: You’ve completed every mission. Your dedication is inspiring.",
    "proud",
    9000
  );

  launchConfetti(120, true);
}

/* ------------------------------
   BONUS UNLOCK LOGIC
------------------------------ */

const bonusNavBtn = document.getElementById("nav-bonus");

function checkBonusUnlock() {
  const allDone =
    state.completed.phishing &&
    state.completed.password &&
    state.completed.logs;

  if (allDone && !state.bonusUnlocked) {
    state.bonusUnlocked = true;
    saveState();
    bonusNavBtn.classList.remove("hidden");
    dragonSpeak("George says: you’ve unlocked a secret bonus investigation.", "excited", 6000);
  }
}

/* ============================================================
   PHISHING PATROL
============================================================ */

const phishingGameEl = document.getElementById("phishing-game");
const phishingEmailEl = document.getElementById("phishing-email");
const phishingFeedbackEl = document.getElementById("phishing-feedback");
const phishingTipEl = document.getElementById("phishing-tip");

const phishingSafeBtn = document.getElementById("phishing-safe");
const phishingPhishBtn = document.getElementById("phishing-phish");

const phishingScenarios = [
  {
    intro: "Welcome to Phishing Patrol!",
    wisdom: "Phishing emails often create urgency or fear.",
    tip: "Check the sender, links, spelling, and tone.",
    email: { text: "Your package delivery has failed. Click here to reschedule.", suspicious: true }
  },
  {
    intro: "Some phishing emails look very convincing.",
    wisdom: "Attackers mimic real companies — but small details give them away.",
    tip: "Hover over links and check the domain.",
    email: { text: "Your PayPal account has unusual activity. Log in at paypa1-security.com.", suspicious: true }
  },
  {
    intro: "Not every unexpected email is dangerous.",
    wisdom: "Legitimate companies rarely ask for sensitive info by email.",
    tip: "If in doubt, contact the company directly.",
    email: { text: "Your subscription receipt is attached. Thank you!", suspicious: false }
  }
];

let currentPhishingScenario = null;

function pickRandomPhishingScenario() {
  currentPhishingScenario = phishingScenarios[Math.floor(Math.random() * phishingScenarios.length)];
}

function startPhishingGame() {
  pickRandomPhishingScenario();
  const data = currentPhishingScenario;

  showScreen("game-screen");
  document.getElementById("game-title").textContent = "Phishing Patrol";
  document.getElementById("game-subtitle").textContent = "Spot suspicious emails with George.";

  showIntro(data.intro, () => {
    showWisdom(data.wisdom, () => setupPhishingLevel());
  });
}

function setupPhishingLevel() {
  const data = currentPhishingScenario;

  phishingTipEl.textContent = data.tip;
  phishingGameEl.classList.remove("hidden");
  phishingEmailEl.textContent = data.email.text;
  phishingFeedbackEl.textContent = "";

  passwordGameEl.classList.add("hidden");
  logsGameEl.classList.add("hidden");
  bonusGameEl.classList.add("hidden");
}

phishingSafeBtn.addEventListener("click", () => handlePhishingChoice(false));
phishingPhishBtn.addEventListener("click", () => handlePhishingChoice(true));

function handlePhishingChoice(userThinksSuspicious) {
  const data = currentPhishingScenario;
  const correct = userThinksSuspicious === data.email.suspicious;

  if (correct) {
    phishingFeedbackEl.textContent = "Correct! George is impressed.";
    phishingFeedbackEl.style.color = "var(--success)";
    playSound("correct");
    dragonSpeak("George says: great instincts — you're spotting the clues!", "excited");

    state.completed.phishing = true;
    saveState();
    checkBonusUnlock();

    setTimeout(() => showCongratulations("You completed this Phishing Patrol challenge!"), 800);
  } else {
    phishingFeedbackEl.textContent = "Not quite — look again at the clues.";
    phishingFeedbackEl.style.color = "var(--danger)";
    playSound("wrong");
    dragonSpeak("George says: take another look — something feels off here.", "warning");
  }
}

/* ============================================================
   PASSWORD FORGE
============================================================ */

const passwordGameEl = document.getElementById("password-game");
const passwordInputEl = document.getElementById("password-input");
const passwordFeedbackEl = document.getElementById("password-feedback");
const passwordTipEl = document.getElementById("password-tip");
const passwordCheckBtn = document.getElementById("password-check");

const passwordScenarios = [
  {
    intro: "Welcome to Password Forge!",
    wisdom: "Short passwords are easy to guess. Longer ones are much safer.",
    tip: "Aim for at least 12 characters.",
    minLength: 8
  },
  {
    intro: "Attackers try common words first.",
    wisdom: "Avoid dictionary words — they’re easy to crack.",
    tip: "Mix unrelated words or use a passphrase.",
    minLength: 10
  },
  {
    intro: "Complexity helps, but length matters more.",
    wisdom: "A long passphrase beats a short complex password.",
    tip: "Try combining 3–4 random words.",
    minLength: 12
  }
];

let currentPasswordScenario = null;

function pickRandomPasswordScenario() {
  currentPasswordScenario = passwordScenarios[Math.floor(Math.random() * passwordScenarios.length)];
}

function startPasswordGame() {
  pickRandomPasswordScenario();
  const data = currentPasswordScenario;

  showScreen("game-screen");
  document.getElementById("game-title").textContent = "Password Forge";
  document.getElementById("game-subtitle").textContent = "Forge strong passwords with George.";

  showIntro(data.intro, () => {
    showWisdom(data.wisdom, () => setupPasswordLevel());
  });
}

function setupPasswordLevel() {
  const data = currentPasswordScenario;

  passwordTipEl.textContent = data.tip;
  passwordGameEl.classList.remove("hidden");
  passwordInputEl.value = "";
  passwordFeedbackEl.textContent = "";

  phishingGameEl.classList.add("hidden");
  logsGameEl.classList.add("hidden");
  bonusGameEl.classList.add("hidden");
}

passwordCheckBtn.addEventListener("click", handlePasswordCheck);

function handlePasswordCheck() {
  const data = currentPasswordScenario;
  const pwd = passwordInputEl.value.trim();

  if (!pwd) {
    passwordFeedbackEl.textContent = "Enter a password or passphrase.";
    passwordFeedbackEl.style.color = "var(--danger)";
    return;
  }

  if (evaluatePasswordStrength(pwd, data.minLength)) {
    passwordFeedbackEl.textContent = "Strong password! George approves.";
    passwordFeedbackEl.style.color = "var(--success)";
    playSound("correct");
    dragonSpeak("George says: excellent — that’s a strong and memorable choice!", "excited");

    state.completed.password = true;
    saveState();
    checkBonusUnlock();

    setTimeout(() => showCongratulations("You completed this Password Forge challenge!"), 800);
  } else {
    passwordFeedbackEl.textContent =
      `Not strong enough — aim for at least ${data.minLength} characters.`;
    passwordFeedbackEl.style.color = "var(--danger)";
    playSound("wrong");
    dragonSpeak("George says: try making it longer or more unique.", "warning");
  }
}

function evaluatePasswordStrength(pwd, minLength) {
  if (pwd.length < minLength) return false;
  const commonPatterns = ["123", "password", "qwerty", "letmein"];
  return !commonPatterns.some(p => pwd.toLowerCase().includes(p));
}

/* ============================================================
   LOG HUNTER
============================================================ */

const logsGameEl = document.getElementById("logs-game");
const logsListEl = document.getElementById("logs-list");
const logsOptionsEl = document.getElementById("logs-options");
const logsFeedbackEl = document.getElementById("logs-feedback");
const logsTipEl = document.getElementById("logs-tip");

const logScenarios = [
  {
    intro: "Welcome to Log Hunter!",
    wisdom: "Logs tell a story — look for unusual patterns or unexpected behaviour.",
    tip: "Check for odd login times or unknown IPs.",
    logs: [
      "User alice logged in from 192.168.1.10",
      "User bob logged in from 10.0.0.5",
      "User guest failed login from 203.0.113.55",
      "User admin logged in from 10.0.0.5 at 03:12 AM"
    ],
    suspiciousIndex: 3
  },
  {
    intro: "Attackers often try multiple passwords.",
    wisdom: "Repeated failed logins can indicate brute‑force attempts.",
    tip: "Look for repeated failures from the same IP.",
    logs: [
      "Failed login for user alice from 192.168.1.10",
      "Failed login for user alice from 192.168.1.10",
      "Failed login for user alice from 192.168.1.10",
      "User bob logged in successfully"
    ],
    suspiciousIndex: 0
  },
  {
    intro: "Privilege escalation is a major red flag.",
    wisdom: "If a normal user suddenly gains admin rights, investigate immediately.",
    tip: "Look for role changes or new admin accounts.",
    logs: [
      "User alice changed password",
      "User bob updated profile picture",
      "User guest created new admin account",
      "System backup completed"
    ],
    suspiciousIndex: 2
  }
];

let currentLogScenario = null;

function pickRandomLogScenario() {
  currentLogScenario = logScenarios[Math.floor(Math.random() * logScenarios.length)];
}

function startLogsGame() {
  pickRandomLogScenario();
  const data = currentLogScenario;

  showScreen("game-screen");
  document.getElementById("game-title").textContent = "Log Hunter";
  document.getElementById("game-subtitle").textContent = "Investigate suspicious activity with George.";

  showIntro(data.intro, () => {
    showWisdom(data.wisdom, () => setupLogsLevel());
  });
}

function setupLogsLevel() {
  const data = currentLogScenario;

  logsTipEl.textContent = data.tip;
  logsGameEl.classList.remove("hidden");
  logsFeedbackEl.textContent = "";
  logsListEl.innerHTML = "";
  logsOptionsEl.innerHTML = "";

  data.logs.forEach((log, index) => {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.textContent = log;
    logsListEl.appendChild(div);

    const btn = document.createElement("button");
    btn.className = "cdh-btn secondary";
    btn.textContent = `Select Log ${index + 1}`;
    btn.addEventListener("click", () => handleLogChoice(index));
    logsOptionsEl.appendChild(btn);
  });

  phishingGameEl.classList.add("hidden");
  passwordGameEl.classList.add("hidden");
  bonusGameEl.classList.add("hidden");
}

function handleLogChoice(index) {
  const data = currentLogScenario;
  const correct = index === data.suspiciousIndex;

  if (correct) {
    logsFeedbackEl.textContent = "Correct! That log is suspicious.";
    logsFeedbackEl.style.color = "var(--success)";
    playSound("correct");
    dragonSpeak("George says: sharp eyes — you spotted the anomaly!", "excited");

    state.completed.logs = true;
    saveState();
    checkBonusUnlock();

    setTimeout(() => showCongratulations("You completed this Log Hunter challenge!"), 800);
  } else {
    logsFeedbackEl.textContent = "Not quite — look for unusual behaviour.";
    logsFeedbackEl.style.color = "var(--danger)";
    playSound("wrong");
    dragonSpeak("George says: take another look — something feels off.", "warning");
  }
}

/* ============================================================
   BONUS LEVEL (SECRET)
============================================================ */

const bonusGameEl = document.getElementById("bonus-game");
const bonusContentEl = document.getElementById("bonus-content");
const bonusChoicesEl = document.getElementById("bonus-choices");
const bonusFeedbackEl = document.getElementById("bonus-feedback");
const bonusTipEl = document.getElementById("bonus-tip");

let bonusStep = 1;

const bonusSteps = {
  1: {
    text: "A strange pattern appears in the logs. What is the FIRST suspicious event in this attack chain?",
    tip: "Think about what attackers usually do first.",
    choices: [
      "Password reset email sent to user",
      "New admin account created",
      "Large data export detected",
      "Failed login from unknown IP"
    ],
    correct: 3
  },
  2: {
    text: "What is the attacker’s LIKELY goal based on the pattern?",
    tip: "Look at the sequence of events.",
    choices: [
      "To update their profile picture",
      "To gain persistent access",
      "To improve system performance",
      "To test the network speed"
    ],
    correct: 1
  },
  3: {
    text: "To stop this attack, what should you investigate or fix FIRST?",
    tip: "Think about the root cause.",
    choices: [
      "Delete all logs immediately",
      "Reset the compromised user’s password",
      "Block the suspicious IP and check access",
      "Reboot the server"
    ],
    correct: 2
  }
};

function startBonusLevel() {
  if (!state.bonusUnlocked) {
    dragonSpeak("George says: keep training — the secret mission unlocks after all three challenges.", "warning");
    return;
  }

  bonusStep = 1;
  showScreen("game-screen");

  document.getElementById("game-title").textContent = "Secret Bonus Level";
  document.getElementById("game-subtitle").textContent =
    "A final investigation guided by George.";

  introCardEl.classList.add("hidden");
  wisdomCardEl.classList.add("hidden");
  congratsCardEl.classList.add("hidden");
  fullCompletionCardEl.classList.add("hidden");
  sharePanelEl.classList.add("hidden");

  gameContentEl.classList.remove("hidden");

  phishingGameEl.classList.add("hidden");
  passwordGameEl.classList.add("hidden");
  logsGameEl.classList.add("hidden");

  bonusGameEl.classList.remove("hidden");

  loadBonusStep();
}

function loadBonusStep() {
  const step = bonusSteps[bonusStep];

  bonusContentEl.textContent = step.text;
  bonusTipEl.textContent = step.tip;
  bonusFeedbackEl.textContent = "";
  bonusChoicesEl.innerHTML = "";

  step.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.className = "cdh-btn secondary";
    btn.textContent = choice;
    btn.addEventListener("click", () => handleBonusChoice(index));
    bonusChoicesEl.appendChild(btn);
  });
}

function handleBonusChoice(index) {
  const step = bonusSteps[bonusStep];

  if (index === step.correct) {
    bonusFeedbackEl.textContent = "Correct! George approves.";
    bonusFeedbackEl.style.color = "var(--success)";
    playSound("correct");
    dragonSpeak("George says: excellent reasoning — you're thinking like an analyst.", "excited");

    if (bonusStep < 3) {
      bonusStep++;
      setTimeout(() => loadBonusStep(), 900);
    } else {
      completeBonusLevel();
    }
  } else {
    bonusFeedbackEl.textContent = "Not quite — think about the attacker’s behaviour.";
    bonusFeedbackEl.style.color = "var(--danger)";
    playSound("wrong");
    dragonSpeak("George says: you're close — look at the sequence again.", "warning");
  }
}

function completeBonusLevel() {
  state.bonusCompleted = true;
  saveState();

  dragonSpeak(
    "George says: you solved the entire attack chain — outstanding work!",
    "proud",
    6000
  );

  launchConfetti(120, true);

  setTimeout(() => showFullCompletionCinematic(), 1200);
}

/* ============================================================
   NAV + INIT
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  loadState();

  if (state.bonusUnlocked) {
    bonusNavBtn.classList.remove("hidden");
  }

  const phishingBtn = document.getElementById("nav-phishing");
  const passwordBtn = document.getElementById("nav-password");
  const logsBtn = document.getElementById("nav-logs");
  const homeBtn = document.getElementById("nav-home");
  const soundToggle = document.getElementById("sound-toggle");
  const congratsHomeBtn = document.getElementById("congrats-home");

  phishingBtn.addEventListener("click", startPhishingGame);
  passwordBtn.addEventListener("click", startPasswordGame);
  logsBtn.addEventListener("click", startLogsGame);
  bonusNavBtn.addEventListener("click", startBonusLevel);

  homeBtn.addEventListener("click", () => {
    showScreen("home-screen");
    gameContentEl.classList.add("hidden");
    dragonSpeak("George says: ready when you are — pick your next mission.", "calm");
  });

  congratsHomeBtn.addEventListener("click", () => {
    showScreen("home-screen");
    gameContentEl.classList.add("hidden");
    dragonSpeak("George says: nice work — what will you tackle next?", "calm");
  });

  soundToggle.addEventListener("click", () => {
    state.soundOn = !state.soundOn;
    saveState();
    soundToggle.textContent = state.soundOn ? "Sound: On" : "Sound: Off";
  });
  soundToggle.textContent = state.soundOn ? "Sound: On" : "Sound: Off";

  showScreen("home-screen");
  dragonSpeak("George says: welcome back to the Cyber Defenders Hub.", "calm");
});
