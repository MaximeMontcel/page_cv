const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const coruscant = document.getElementById("coruscant");

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function buildTraffic() {
  if (!coruscant) return;
  coruscant.querySelectorAll(".ship").forEach((el) => el.remove());
  const count = window.innerWidth < 768 ? 10 : 16;
  const lanes = Math.max(4, Math.floor(count * 0.6));
  for (let i = 0; i < count; i++) {
    const ship = document.createElement("div");
    ship.className = "ship";
    const isTie = i % 3 === 0;
    if (isTie) ship.classList.add("ship--tie");
    const img = document.createElement("img");
    img.src = isTie ? "img/tie-fighter.png" : "img/x-wing.png";
    img.alt = "";
    ship.appendChild(img);

    ship.style.top = rand(2, 96) + "%";
    const y = parseFloat(ship.style.top);
    const rev = y % 2 < 1;
    if (rev) ship.classList.add("ship--rev");

    ship.style.animationDuration = rand(7, 16).toFixed(1) + "s";
    ship.style.animationDelay = -rand(0, 18).toFixed(1) + "s";
    if (i < lanes) ship.style.opacity = "0.65";
    coruscant.appendChild(ship);
  }
}

function buildCoruscant() {
  buildTraffic();
  scheduleFalcon();
}

let falconTimer = null;

function scheduleFalcon() {
  clearTimeout(falconTimer);
  if (prefersReducedMotion) return;
  falconTimer = setTimeout(spawnFalcon, rand(22, 40) * 1000);
}

function spawnFalcon() {
  if (!coruscant) return;
  if (document.hidden) {
    scheduleFalcon();
    return;
  }
  const ship = document.createElement("div");
  ship.className = "ship ship--falcon";
  const img = document.createElement("img");
  img.src = "img/falcon.png";
  img.alt = "";
  ship.appendChild(img);
  ship.style.top = rand(8, 50).toFixed(1) + "%";
  ship.style.animationDuration = rand(18, 26).toFixed(1) + "s";
  ship.addEventListener("animationend", () => {
    ship.remove();
    scheduleFalcon();
  });
  coruscant.appendChild(ship);
}

let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildCoruscant, 250);
});

/* ─────────────────────── PROGRESS + BACK TO TOP ─────────────────────── */

const progressBar = document.querySelector(".scroll-progress");
const backToTop = document.getElementById("back-to-top");

let ticking = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const scrollY = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar) {
      progressBar.style.width = max > 0 ? (scrollY / max) * 100 + "%" : "0%";
    }

    if (backToTop) {
      backToTop.classList.toggle("visible", scrollY > 400);
    }

    ticking = false;
  });
}

window.addEventListener("scroll", onScroll, { passive: true });

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
}

/* ─────────────────────────── SCROLL SPY ─────────────────────────── */

const navLinks = Array.from(document.querySelectorAll(".nav a"));

function setActiveLink(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + id);
  });
}

setActiveLink("profil");

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );
  document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
}

/* ─────────────────────────── REVEAL ─────────────────────────── */

const sections = document.querySelectorAll("main section");

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          reveal.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06 }
  );
  sections.forEach((section) => {
    section.style.animationPlayState = "paused";
    reveal.observe(section);
  });
} else {
  sections.forEach((section) => {
    section.style.animation = "none";
    section.style.opacity = "1";
  });
}

/* ────────────────────────────── YODA ────────────────────────────── */

const yodaEl = document.querySelector(".yoda");

if (yodaEl) {
  const img = document.createElement("img");
  img.src = "img/yoda.png";
  img.alt = "";
  img.className = "yoda-img";
  yodaEl.appendChild(img);
}

const yodaBubble = document.querySelector(".yoda-bubble");
const yodaText = document.querySelector("#yoda-text");
const yodaNext = document.querySelector("#yoda-next");
const yodaClose = document.querySelector("#yoda-close");

const yodaLines = [
  "En paix, jeune Padawan... Ton parcours, je vois.",
  "Bachelier STI2D option SIN obtenu en juin 2026, tu es. BTS SIO SISR, depuis, tu suis.",
  "Vers les systèmes et réseaux, ton chemin s'oriente. Java, Python, HTML et CSS, maîtriser tu veux.",
  "Sérieux, rigoureux et curieux, les qualités d'un bon technicien, tu possèdes.",
  "Une alternance, tu recherches. L'Entreprise, avec toi, grandira. Certainement.",
  "Que la Force du code soit avec toi, Padawan !",
];

let yodaIndex = 0;
let isBubbleOpen = false;
let typeTimer = null;

function typeText(el, text, done) {
  clearTimeout(typeTimer);
  el.textContent = "";
  el.classList.add("typing");
  let i = 0;
  function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i) + (i < text.length ? "▌" : "");
      i++;
      if (i <= text.length) {
        typeTimer = setTimeout(step, 16);
      } else {
        el.classList.remove("typing");
        if (done) done();
      }
    }
  }
  step();
}

function showYodaLine(index) {
  if (!yodaText) return;
  yodaIndex = index % yodaLines.length;
  typeText(yodaText, yodaLines[yodaIndex]);
}

function openBubble() {
  if (!yodaBubble) return;
  isBubbleOpen = true;
  yodaBubble.setAttribute("aria-hidden", "false");
  showYodaLine(0);
  yodaBubble.classList.add("active");
}

function closeBubble() {
  if (!yodaBubble) return;
  isBubbleOpen = false;
  yodaBubble.setAttribute("aria-hidden", "true");
  clearTimeout(typeTimer);
  yodaBubble.classList.remove("active");
}

function toggleBubble(e) {
  if (e) e.preventDefault();
  if (isBubbleOpen) {
    closeBubble();
  } else {
    openBubble();
  }
}

if (yodaEl) {
  yodaEl.addEventListener("click", toggleBubble);
  yodaEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleBubble();
    }
  });
}

if (yodaNext) {
  yodaNext.addEventListener("click", (e) => {
    e.stopPropagation();
    showYodaLine(yodaIndex + 1);
  });
}

if (yodaClose) {
  yodaClose.addEventListener("click", (e) => {
    e.stopPropagation();
    closeBubble();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isBubbleOpen) closeBubble();
});

/* ─────────────────────────── INIT ─────────────────────────── */

buildCoruscant();
onScroll();