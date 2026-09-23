const starsCanvas = document.getElementById("stars-canvas");
const ctx = starsCanvas ? starsCanvas.getContext("2d") : null;

function resizeCanvas() {
  if (!starsCanvas) return;
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
}

const stars = [];

function createStars() {
  stars.length = 0;
  const count = window.innerWidth < 768 ? 60 : window.innerWidth < 1200 ? 90 : 140;
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * (starsCanvas?.width || window.innerWidth),
      y: Math.random() * (starsCanvas?.height || window.innerHeight),
      radius: Math.random() * 1.2 + 0.2,
      velocity: Math.random() * 0.05 + 0.01,
      alpha: Math.random() * 0.5 + 0.3,
    });
  }
}

function drawStars() {
  if (!ctx || !starsCanvas) return;
  ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.fill();
    star.y += star.velocity;
    if (star.y > starsCanvas.height) {
      star.y = 0;
      star.x = Math.random() * starsCanvas.width;
    }
  }
  requestAnimationFrame(drawStars);
}

if (starsCanvas && ctx) {
  resizeCanvas();
  createStars();
  drawStars();
  window.addEventListener("resize", () => {
    resizeCanvas();
    createStars();
  });
}

const yodaInner = document.querySelector(".yoda");
if (yodaInner) {
  yodaInner.innerHTML = `<svg viewBox="0 0 64 72" role="presentation">
    <g transform="translate(32 62)">
      <ellipse cx="0" cy="0" rx="15" ry="9" fill="#3c5a3c" opacity="0.6"/>
      <ellipse cx="-4" cy="-3" rx="6" ry="4" fill="#5f805f" transform="rotate(-20 -4 -3)"/>
      <ellipse cx="7" cy="-4" rx="4" ry="3" fill="#5f805f"/>
    </g>
    <g class="yoda-ears" transform="translate(10.5 15)">
      <ellipse cx="-8" cy="0" rx="4.5" ry="13" fill="#6f966f" transform="rotate(-25 -8 0)"/>
      <ellipse cx="8" cy="0" rx="4" ry="12" fill="#6f966f" transform="rotate(25 8 0)"/>
      <ellipse cx="-8" cy="0" rx="2.2" ry="8" fill="#547454" transform="rotate(-25 -8 0) opacity 0.6"/>
      <ellipse cx="8" cy="0" rx="2" ry="7.5" fill="#547454" transform="rotate(25 8 0) opacity 0.6"/>
    </g>
    <g transform="translate(6 4)">
      <ellipse cx="26" cy="38" rx="24" ry="26" fill="#b9d8b9" stroke="#8ab08a" stroke-width="2"/>
    </g>
    <g transform="translate(6 4)">
      <g transform="translate(26 30)">
        <ellipse cx="-7" cy="0" rx="5" ry="6" fill="#fff"/>
        <ellipse cx="7" cy="0" rx="5" ry="6" fill="#fff"/>
        <ellipse cx="-7" cy="0" rx="2.4" ry="3" fill="#2b3a2b"/>
        <ellipse cx="7" cy="0" rx="2.4" ry="3" fill="#2b3a2b"/>
        <circle cx="-7" cy="0" r="1.4" fill="#e8ffe8"/>
        <circle cx="7" cy="0" r="1.4" fill="#e8ffe8"/>
      </g>
      <g transform="translate(10 40)">
        <rect x="0" y="0" width="18" height="2.5" rx="1.25" fill="#5f805f" transform="rotate(-12 9 1.25)"/>
      </g>
      <ellipse cx="26" cy="50" rx="7" ry="5" fill="#8eaf8e"/>
    </g>
  </svg>`;
}

const yodaEl = document.querySelector(".yoda");
const yodaBubble = document.querySelector(".yoda-bubble");
const yodaText = document.querySelector("#yoda-text");
const yodaNext = document.querySelector("#yoda-next");
const yodaClose = document.querySelector("#yoda-close");

const yodaLines = [
  "En paix, jeune Padawan... Ton parcours, je vois.",
  "Bachelier STI2D option SIN, obtenu en juin 2026, tu es. Actuellement en BTS SIO SISR, 2026–2028.",
  "Vers les systèmes et réseaux, ton chemin s'oriente. Java, Python, HTML et CSS, maîtriser tu veux.",
  "Sérieux, rigoureux et curieux, qualités d'un bon technicien tu possèdes.",
  "Une alternance, tu recherches. L'Entreprise, avec toi, grandir pourra.",
  "Que la Force du code soit avec toi, Padawan !",
];

let yodaIndex = 0;
let isBubbleOpen = false;

function showYodaLine(index) {
  if (!yodaText) return;
  yodaIndex = index % yodaLines.length;
  yodaText.textContent = yodaLines[yodaIndex];
}

function openBubble() {
  if (!yodaBubble) return;
  isBubbleOpen = true;
  showYodaLine(0);
  yodaBubble.classList.add("active");
}

function closeBubble() {
  if (!yodaBubble) return;
  isBubbleOpen = false;
  yodaBubble.classList.remove("active");
}

function nextLine() {
  if (!isBubbleOpen) return;
  showYodaLine(yodaIndex + 1);
}

if (yodaEl) {
  yodaEl.addEventListener("click", () => {
    if (isBubbleOpen) {
      closeBubble();
    } else {
      openBubble();
    }
  });

  yodaEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isBubbleOpen) {
        closeBubble();
      } else {
        openBubble();
      }
    }
  });
}

if (yodaNext) {
  yodaNext.addEventListener("click", (e) => {
    e.stopPropagation();
    nextLine();
  });
}

if (yodaClose) {
  yodaClose.addEventListener("click", (e) => {
    e.stopPropagation();
    closeBubble();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isBubbleOpen) {
    closeBubble();
  }
});

const sections = document.querySelectorAll("section");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
    }
  );

  sections.forEach((section) => {
    section.style.animationPlayState = "paused";
    observer.observe(section);
  });
}
