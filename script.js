const questions = [
  {
    category: "Passwords",
    text: "Which is the safest password?",
    answers: [
      "password123",
      "Gem2024",
      "T!m3_to_R3@d_B00ks!",
      "123456"
    ],
    correctIndex: 2,
    explanation:
      "Long, unusual passwords with a mix of letters, numbers, and symbols are much harder to guess.",
    hint: "George says: Strong passwords are like dragon treasure — rare, long, and hard to guess."
  },
  {
    category: "Phishing",
    text: "You get an email saying you won a prize and must click a link and enter your password. What should you do?",
    answers: [
      "Click the link quickly before it expires.",
      "Reply with your password instead.",
      "Delete the email or check with the official website directly.",
      "Forward it to all your friends."
    ],
    correctIndex: 2,
    explanation:
      "Unexpected messages asking for passwords or urgent clicks are often scams. Go to the official site yourself.",
    hint: "George says: If a message feels suspicious, trust your instincts. Dragons can smell danger."
  },
  {
    category: "Updates",
    text: "Why are software updates important for cyber security?",
    answers: [
      "They only change the colours of apps.",
      "They fix security holes that attackers might use.",
      "They slow your device down on purpose.",
      "They delete your old files."
    ],
    correctIndex: 1,
    explanation:
      "Updates often patch security vulnerabilities, making it harder for attackers to break in.",
    hint: "George says: Updates patch weaknesses. Even dragons need strong scales."
  },
  {
    category: "Public Wi‑Fi",
    text: "You are on free public Wi‑Fi at a café. What is the safest option?",
    answers: [
      "Log in to your bank and shop online.",
      "Use it only for low‑risk browsing, and avoid entering passwords if possible.",
      "Share the Wi‑Fi with strangers by giving them your accounts.",
      "Turn off all security settings to make it faster."
    ],
    correctIndex: 1,
    explanation:
      "Public Wi‑Fi can be risky. Avoid sensitive logins like banking unless you use extra protection like a VPN.",
    hint: "George says: Public Wi‑Fi is like an open cave — be careful what treasure you reveal."
  },
  {
    category: "Devices",
    text: "What is a simple way to protect your phone or laptop?",
    answers: [
      "Leave it unlocked so friends can use it.",
      "Use a screen lock (PIN, password, fingerprint, or face ID).",
      "Write your password on a sticky note on the screen.",
      "Share your PIN with anyone who asks."
    ],
    correctIndex: 1,
    explanation:
      "A screen lock helps keep your data safe if your device is lost or someone else picks it up.",
    hint: "George says: Lock your device like you’d lock a treasure chest."
  },
  {
    category: "Downloads",
    text: "A website offers a 'free cracked' version of an expensive game. What is the safest choice?",
    answers: [
      "Download it—free is always good.",
      "Download it only if a friend already has it.",
      "Avoid it; it could contain malware and is likely illegal.",
      "Turn off antivirus first so it doesn’t block it."
    ],
    correctIndex: 2,
    explanation:
      "Cracked software is often illegal and can hide malware. Stick to official stores and trusted sources.",
    hint: "George says: Free cracked downloads often hide traps. Stick to safe, trusted sources."
  }
];

let currentIndex = 0;
let score = 0;
let hasAnswered = false;

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const scoreText = document.getElementById("score-text");
const summaryText = document.getElementById("summary-text");

const companionText = document.getElementById("companion-text");
const companionEnd = document.getElementById("companion-end");
const companionEndText = document.getElementById("companion-end-text");

startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", handleNext);
restartBtn.addEventListener("click", restartGame);

function startGame() {
  currentIndex = 0;
  score = 0;
  startScreen.classList.add("hidden");
  endScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  loadQuestion();
}

function loadQuestion() {
  hasAnswered = false;
  nextBtn.disabled = true;
  feedback.textContent = "";

  const q = questions[currentIndex];
  questionText.textContent = `${q.category}: ${q.text}`;

  // George gives a hint
  companionText.textContent = q.hint;

  progressText.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  progressFill.style.width = `${progressPercent}%`;

  answersContainer.innerHTML = "";
  q.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.classList.add("btn", "answer-btn");
    btn.textContent = answer;
    btn.addEventListener("click", () => selectAnswer(index));
    answersContainer.appendChild(btn);
  });
}

function selectAnswer(selectedIndex) {
  if (hasAnswered) return;
  hasAnswered = true;

  const q = questions[currentIndex];
  const buttons = Array.from(
    answersContainer.querySelectorAll(".answer-btn")
  );

  buttons.forEach((btn, index) => {
    btn.disabled = true;
    if (index === selectedIndex) {
      btn.classList.add("selected");
    }
    if (index === q.correctIndex) {
      btn.classList.add("correct");
    } else if (index === selectedIndex && index !== q.correctIndex) {
      btn.classList.add("incorrect");
    }
  });

  if (selectedIndex === q.correctIndex) {
    score++;
    feedback.textContent = "Correct! " + q.explanation;
  } else {
    feedback.textContent = "Not quite. " + q.explanation;
  }

  nextBtn.textContent =
    currentIndex === questions.length - 1 ? "See Results" : "Next Question";
  nextBtn.disabled = false;
}

function handleNext() {
  currentIndex++;
  if (currentIndex >= questions.length) {
    endGame();
  } else {
    loadQuestion();
  }
}

function endGame() {
  gameScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");

  scoreText.textContent = `You scored ${score} out of ${questions.length}.`;

  let message = "";
  const ratio = score / questions.length;

  if (ratio === 1) {
    message = "Excellent! You’ve got strong cyber security instincts.";
  } else if (ratio >= 0.7) {
    message = "Great job! A few tweaks and you’ll be a cyber pro.";
  } else if (ratio >= 0.4) {
    message = "Nice start. Keep practising these habits to stay safer online.";
  } else {
    message = "This is a good first step. Replay the game and watch how your score improves.";
  }

  summaryText.textContent = message;

  // George's final message
  companionEnd.classList.remove("hidden");

  if (ratio === 1) {
    companionEndText.textContent = "Flawless! George bows to your cyber‑skills.";
  } else if (ratio >= 0.7) {
    companionEndText.textContent = "Great job! George says your digital armour is getting strong.";
  } else if (ratio >= 0.4) {
    companionEndText.textContent = "Nice effort! George believes practice sharpens your claws.";
  } else {
    companionEndText.textContent = "Every dragon starts small. George knows you’ll grow stronger.";
  }
}

function restartGame() {
  startGame();
}