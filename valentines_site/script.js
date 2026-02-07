const card = document.getElementById("card");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const noHint = document.getElementById("noHint");
const celebration = document.getElementById("celebration");
const secondYesBtn = document.getElementById("secondYes");
const secondNoBtn = document.getElementById("secondNo");
const hugBtn = document.getElementById("hugBtn");
const countdownWidget = document.getElementById("countdownWidget");
const countdownValue = countdownWidget.querySelector(".countdown-value");
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

let noButtonRunning = false;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function startNoButtonRunMode() {
  if (noButtonRunning) {
    return;
  }

  const cardRect = card.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  noBtn.classList.add("is-running");
  noBtn.style.left = `${noRect.left - cardRect.left}px`;
  noBtn.style.top = `${noRect.top - cardRect.top}px`;

  noHint.classList.remove("hidden");
  noButtonRunning = true;
}

function moveNoButtonAway() {
  startNoButtonRunMode();

  const cardRect = card.getBoundingClientRect();
  const padding = 12;
  const maxX = cardRect.width - noBtn.offsetWidth - padding;
  const maxY = cardRect.height - noBtn.offsetHeight - padding;

  const nextX = padding + Math.random() * (maxX - padding);
  const nextY = padding + Math.random() * (maxY - padding);

  noBtn.style.left = `${clamp(nextX, padding, maxX)}px`;
  noBtn.style.top = `${clamp(nextY, padding, maxY)}px`;
}

noBtn.addEventListener("mouseenter", moveNoButtonAway);
noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButtonAway();
});
noBtn.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  moveNoButtonAway();
});

const confettiParticles = [];
const confettiColors = ["#ff406d", "#ffd166", "#06d6a0", "#118ab2", "#f4a261", "#ffffff"];
let fireworksActive = false;

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function createConfetti(count = 240) {
  for (let i = 0; i < count; i += 1) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      w: 6 + Math.random() * 8,
      h: 8 + Math.random() * 12,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedY: 2 + Math.random() * 6,
      speedX: -2 + Math.random() * 4,
      rotation: Math.random() * Math.PI,
      rotationSpeed: -0.2 + Math.random() * 0.4,
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  if (fireworksActive) {
    confettiParticles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();

      if (p.y > confettiCanvas.height + 20) {
        p.y = -10;
        p.x = Math.random() * confettiCanvas.width;
      }
    });
  }

  requestAnimationFrame(drawConfetti);
}

function startMassFireworks() {
  fireworksActive = true;
  confettiParticles.length = 0;
  createConfetti(360);
}

function updateCountdown() {
  const now = new Date();
  const target = new Date(2026, 6, 21, 0, 0, 0);
  const diffMs = Math.max(0, target - now);
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  countdownValue.textContent = `${days} дней ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


function showCountdown() {
  updateCountdown();
  countdownWidget.classList.remove("hidden");
  hugBtn.classList.add("hidden");
  if (!countdownWidget.dataset.timerStarted) {
    countdownWidget.dataset.timerStarted = "true";
    setInterval(updateCountdown, 1000);
  }
}


const noButtonStages = [
  "Ты уверена?",
  "Мне кажется ты промазала",
  "Точно не \"Да\"?",
  "Я все равно жду \"Да\"",
  "Ладно, последняя попытка",
];
let noButtonStageIndex = 0;
let noButtonScale = 1;
let yesButtonScale = 1;

function updateSecondButtonScales() {
  const shiftX = Math.min(120, (noButtonScale - 1) * 120);
  secondNoBtn.style.transform = `scale(${noButtonScale})`;
  secondYesBtn.style.transform = `translateX(${-shiftX}px) scale(${yesButtonScale})`;
}

function handleSecondNoClick() {
  if (secondNoBtn.disabled) {
    return;
  }

  secondNoBtn.textContent = noButtonStages[Math.min(noButtonStageIndex, noButtonStages.length - 1)];
  noButtonStageIndex += 1;

  noButtonScale += 0.12;
  yesButtonScale = Math.max(0.82, yesButtonScale - 0.05);
  updateSecondButtonScales();

  if (noButtonStageIndex >= noButtonStages.length) {
    secondNoBtn.disabled = true;
    secondNoBtn.style.cursor = "not-allowed";
  }
}

function handleSecondYesClick() {
  startMassFireworks();
  secondYesBtn.disabled = true;
  secondNoBtn.disabled = true;
  secondNoBtn.classList.add("hidden");
  secondYesBtn.classList.add("hidden");
  hugBtn.classList.remove("hidden");
}

yesBtn.addEventListener("click", () => {
  celebration.classList.remove("hidden");
  celebration.setAttribute("aria-hidden", "false");
  yesBtn.disabled = true;
});

secondNoBtn.addEventListener("click", handleSecondNoClick);
secondYesBtn.addEventListener("click", handleSecondYesClick);

hugBtn.addEventListener("click", showCountdown);

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawConfetti();
