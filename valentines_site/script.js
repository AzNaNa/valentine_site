const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const celebration = document.getElementById("celebration");
const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function positionNoButtonRandomly() {
  const maxX = window.innerWidth - noBtn.offsetWidth - 8;
  const maxY = window.innerHeight - noBtn.offsetHeight - 8;

  const nextX = Math.random() * maxX;
  const nextY = Math.random() * maxY;

  noBtn.style.left = `${clamp(nextX, 8, maxX)}px`;
  noBtn.style.top = `${clamp(nextY, 8, maxY)}px`;
}

function moveNoButtonAway() {
  positionNoButtonRandomly();
}

noBtn.addEventListener("mouseenter", moveNoButtonAway);
noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButtonAway();
});

window.addEventListener("resize", positionNoButtonRandomly);
positionNoButtonRandomly();

const confettiParticles = [];
const confettiColors = ["#ff406d", "#ffd166", "#06d6a0", "#118ab2", "#f4a261", "#ffffff"];

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function createConfetti(count = 180) {
  for (let i = 0; i < count; i += 1) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedY: 2 + Math.random() * 4,
      speedX: -1 + Math.random() * 2,
      rotation: Math.random() * Math.PI,
      rotationSpeed: -0.1 + Math.random() * 0.2,
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

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

  requestAnimationFrame(drawConfetti);
}

yesBtn.addEventListener("click", () => {
  celebration.classList.remove("hidden");
  celebration.setAttribute("aria-hidden", "false");

  noBtn.style.display = "none";
  yesBtn.disabled = true;

  confettiParticles.length = 0;
  createConfetti();
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawConfetti();
