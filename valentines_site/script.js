+const card = document.getElementById("card");
+const noBtn = document.getElementById("noBtn");
+const yesBtn = document.getElementById("yesBtn");
+const noHint = document.getElementById("noHint");
+const celebration = document.getElementById("celebration");
+const confettiCanvas = document.getElementById("confettiCanvas");
+const ctx = confettiCanvas.getContext("2d");
+
+let noButtonRunning = false;
+
+function clamp(value, min, max) {
+  return Math.max(min, Math.min(max, value));
+}
+
+function startNoButtonRunMode() {
+  if (noButtonRunning) {
+    return;
+  }
+
+  const cardRect = card.getBoundingClientRect();
+  const noRect = noBtn.getBoundingClientRect();
+
+  noBtn.classList.add("is-running");
+  noBtn.style.left = `${noRect.left - cardRect.left}px`;
+  noBtn.style.top = `${noRect.top - cardRect.top}px`;
+
+  noHint.classList.remove("hidden");
+  noButtonRunning = true;
+}
+
+function moveNoButtonAway() {
+  startNoButtonRunMode();
+
+  const cardRect = card.getBoundingClientRect();
+  const padding = 12;
+  const maxX = cardRect.width - noBtn.offsetWidth - padding;
+  const maxY = cardRect.height - noBtn.offsetHeight - padding;
+
+  const nextX = padding + Math.random() * (maxX - padding);
+  const nextY = padding + Math.random() * (maxY - padding);
+
+  noBtn.style.left = `${clamp(nextX, padding, maxX)}px`;
+  noBtn.style.top = `${clamp(nextY, padding, maxY)}px`;
+}
+
+noBtn.addEventListener("mouseenter", moveNoButtonAway);
+noBtn.addEventListener("touchstart", (event) => {
+  event.preventDefault();
+  moveNoButtonAway();
+});
+noBtn.addEventListener("pointerdown", (event) => {
+  event.preventDefault();
+  moveNoButtonAway();
+});
+
+const confettiParticles = [];
+const confettiColors = ["#ff406d", "#ffd166", "#06d6a0", "#118ab2", "#f4a261", "#ffffff"];
+
+function resizeCanvas() {
+  confettiCanvas.width = window.innerWidth;
+  confettiCanvas.height = window.innerHeight;
+}
+
+function createConfetti(count = 180) {
+  for (let i = 0; i < count; i += 1) {
+    confettiParticles.push({
+      x: Math.random() * confettiCanvas.width,
+      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
+      w: 6 + Math.random() * 6,
+      h: 8 + Math.random() * 10,
+      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
+      speedY: 2 + Math.random() * 4,
+      speedX: -1 + Math.random() * 2,
+      rotation: Math.random() * Math.PI,
+      rotationSpeed: -0.1 + Math.random() * 0.2,
+    });
+  }
+}
+
+function drawConfetti() {
+  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
+
+  confettiParticles.forEach((p) => {
+    p.x += p.speedX;
+    p.y += p.speedY;
+    p.rotation += p.rotationSpeed;
+
+    ctx.save();
+    ctx.translate(p.x, p.y);
+    ctx.rotate(p.rotation);
+    ctx.fillStyle = p.color;
+    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
+    ctx.restore();
+
+    if (p.y > confettiCanvas.height + 20) {
+      p.y = -10;
+      p.x = Math.random() * confettiCanvas.width;
+    }
+  });
+
+  requestAnimationFrame(drawConfetti);
+}
+
+yesBtn.addEventListener("click", () => {
+  celebration.classList.remove("hidden");
+  celebration.setAttribute("aria-hidden", "false");
+
+  yesBtn.disabled = true;
+
+  confettiParticles.length = 0;
+  createConfetti();
+});
+
+window.addEventListener("resize", resizeCanvas);
+resizeCanvas();
+drawConfetti();
