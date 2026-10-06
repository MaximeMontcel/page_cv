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

/* ─────────────────────────── STAR WARS INTRO ─────────────────────────── */

const introOverlay = document.getElementById("intro-overlay");
const btnIntro = document.getElementById("btn-intro");
const introClose = document.getElementById("intro-close");
const introMute = document.getElementById("intro-mute");
const crawlEl = document.getElementById("crawl");
const introStars = introOverlay ? introOverlay.querySelector(".intro-stars") : null;
const reduceMotionIntro = window.matchMedia("(prefers-reduced-motion: reduce)");

const CRAWL_DELAY = 11.3;
let introTimers = [];
let introIsOpen = false;
let introMuted = false;
let audioCtx = null;
let masterGain = null;

function buildIntroStars() {
  if (!introStars) return;
  const shadows = [];
  for (let i = 0; i < 160; i++) {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    const size = (Math.random() * 1.3 + 0.4).toFixed(1);
    const alpha = (Math.random() * 0.7 + 0.3).toFixed(2);
    shadows.push(`${x}vw ${y}vh 0 ${size}px rgba(255, 255, 255, ${alpha})`);
  }
  introStars.style.boxShadow = shadows.join(", ");
}

function sizeCrawl() {
  if (!crawlEl) return 26;
  const inner = crawlEl.querySelector(".crawl-inner");
  const height = inner ? inner.offsetHeight : 1400;
  const dist = Math.max(1700, Math.round(height + window.innerHeight * 1.2));
  const dur = Math.min(34, Math.max(18, Math.round(dist / 95)));
  crawlEl.style.setProperty("--crawl-dist", `-${dist}px`);
  crawlEl.style.setProperty("--crawl-dur", `${dur}s`);
  return dur;
}

function playIntroMusic() {
  if (introMuted) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!audioCtx) {
      audioCtx = new AC();
      masterGain = audioCtx.createGain();
      masterGain.connect(audioCtx.destination);
    }
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.value = 0.32;
    if (audioCtx.state === "suspended") audioCtx.resume();
    scheduleFanfare(audioCtx.currentTime + 0.15);
  } catch (err) {
    /* audio indisponible */
  }
}

function scheduleFanfare(t0) {
  const voice = (freq, start, dur, peak, type, cutoff) => {
    const osc = audioCtx.createOscillator();
    const lp = audioCtx.createBiquadFilter();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    lp.type = "lowpass";
    lp.frequency.value = cutoff;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(peak, start + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(lp);
    lp.connect(g);
    g.connect(masterGain);
    osc.start(start);
    osc.stop(start + dur + 0.1);
  };

  voice(55, t0, 1.6, 0.5, "sine", 220);
  voice(58.27, t0, 1.6, 0.3, "triangle", 240);

  const chords = [
    [146.83, 174.61, 220.0],
    [116.54, 146.83, 174.61],
    [174.61, 220.0, 261.63],
    [130.81, 164.81, 196.0],
  ];
  chords.forEach((chord, i) => {
    const start = t0 + 0.3 + i * 3;
    chord.forEach((f) => voice(f, start, 3.1, 0.16, "sawtooth", 900));
    voice(chord[0] / 2, start, 3.1, 0.2, "triangle", 400);
  });

  voice(55, t0 + 4.7, 2.2, 0.45, "sine", 200);
  voice(87.31, t0 + 4.7, 2.0, 0.25, "sawtooth", 700);

  const motif = [220, 261.63, 293.66, 349.23];
  motif.forEach((f, i) => {
    const start = t0 + CRAWL_DELAY + i * 0.55;
    voice(f, start, 1.1, 0.2, "sawtooth", 1500);
    voice(f * 2, start, 1.1, 0.1, "sawtooth", 2200);
  });
}

function openIntro() {
  if (!introOverlay || introIsOpen) return;
  introIsOpen = true;
  buildIntroStars();
  introOverlay.classList.remove("is-static");
  introOverlay.classList.add("is-open");
  introOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  introMute.hidden = false;

  if (reduceMotionIntro.matches) {
    introOverlay.classList.add("is-static");
    introMute.hidden = true;
  } else {
    const dur = sizeCrawl();
    playIntroMusic();
    introTimers.push(setTimeout(closeIntro, (CRAWL_DELAY + dur + 2.5) * 1000));
  }
  introClose.focus();
}

function closeIntro() {
  if (!introIsOpen) return;
  introIsOpen = false;
  introTimers.forEach(clearTimeout);
  introTimers = [];
  introOverlay.classList.remove("is-open", "is-static");
  introOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (audioCtx && masterGain) {
    try {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.12);
    } catch (err) {
      /* ignore */
    }
  }
  if (btnIntro) btnIntro.focus();
}

if (btnIntro) btnIntro.addEventListener("click", openIntro);
if (introClose) introClose.addEventListener("click", closeIntro);

if (introMute) {
  introMute.addEventListener("click", () => {
    introMuted = !introMuted;
    introMute.setAttribute("aria-pressed", String(introMuted));
    introMute.textContent = introMuted ? "🔇 Musique" : "🔊 Musique";
    if (audioCtx && masterGain) {
      try {
        masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
        masterGain.gain.value = introMuted ? 0 : 0.32;
      } catch (err) {
        /* ignore */
      }
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && introIsOpen) closeIntro();
});

/* ─────────────────────────── INIT ─────────────────────────── */

buildCoruscant();
onScroll();