const questions = [
    {
        question: "Which of these is the strongest password?",
        answers: [
            "Password123",
            "Summer2024",
            "T!g3r$9&Qp",
            "MyNameIsJohn"
        ],
        correct: 2,
        learn: "Strong passwords mix symbols, numbers, and unpredictable patterns."
    },
    {
        question: "You receive an email saying you’ve won a free iPhone. What should you do?",
        answers: [
            "Click the link to claim it",
            "Delete it – it's likely a scam",
            "Reply asking if it’s real",
            "Forward it to friends"
        ],
        correct: 1,
        learn: "Unexpected prizes are a common phishing trick. Real companies don’t email random winners."
    },
    {
        question: "What is malware?",
        answers: [
            "A type of secure software",
            "Software designed to cause harm",
            "A safe browser extension",
            "A password manager"
        ],
        correct: 1,
        learn: "Malware is harmful software — like viruses or spyware — designed to damage or steal."
    },
    {
        question: "Which website URL is safest?",
        answers: [
            "http://mybank-login.com",
            "https://www.mybank.com",
            "http://secure-mybank.net",
            "mybank.freeoffers.ru"
        ],
        correct: 1,
        learn: "Look for https:// and official domains when logging into important accounts."
    }
];

let current = 0;
let score = 0;

const introEl = document.getElementById("intro");
const startBtn = document.getElementById("startBtn");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const scoreEl = document.getElementById("score");

startBtn.onclick = () => {
    startBtn.classList.add("hidden");
    introEl.classList.add("hidden");
    questionEl.classList.remove("hidden");
    loadQuestion();
};

function loadQuestion() {
    const q = questions[current];
    questionEl.textContent = q.question;
    answersEl.innerHTML = "";
    feedbackEl.textContent = "";
    nextBtn.classList.add("hidden");

    q.answers.forEach((answer, index) => {
        const btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("answer-btn");
        btn.onclick = () => checkAnswer(index);
        answersEl.appendChild(btn);
    });
}

function checkAnswer(selected) {
    const q = questions[current];

    if (selected === q.correct) {
        feedbackEl.textContent = "Correct! 🎉 " + q.learn;
        feedbackEl.style.color = "#2ea043";
        score++;
    } else {
        feedbackEl.textContent = "Not quite! ❌ " + q.learn;
        feedbackEl.style.color = "#f85149";
    }

    nextBtn.classList.remove("hidden");
}

nextBtn.onclick = () => {
    current++;
    if (current < questions.length) {
        loadQuestion();
    } else {
        endGame();
    }
};

function endGame() {
    questionEl.textContent = "You completed Cyber Defenders!";
    answersEl.innerHTML = "";
    feedbackEl.textContent = "";
    nextBtn.classList.add("hidden");

    scoreEl.textContent = `Your Score: ${score} / ${questions.length}`;
    scoreEl.classList.remove("hidden");
}
