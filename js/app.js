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
  scheduleShootingStar();
}

let shootTimer = null;

function scheduleShootingStar() {
  clearTimeout(shootTimer);
  if (prefersReducedMotion) return;
  shootTimer = setTimeout(spawnShootingStar, rand(3.5, 8) * 1000);
}

function spawnShootingStar() {
  if (!coruscant || prefersReducedMotion) return;
  if (document.hidden) {
    scheduleShootingStar();
    return;
  }
  const star = document.createElement("div");
  star.className = "shooting-star";
  star.style.top = rand(4, 55).toFixed(1) + "%";
  star.style.left = rand(15, 75).toFixed(1) + "%";
  star.style.animationDuration = rand(0.9, 1.5).toFixed(2) + "s";
  star.addEventListener("animationend", () => star.remove());
  coruscant.appendChild(star);
  scheduleShootingStar();
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

    if (coruscant && !prefersReducedMotion) {
      coruscant.style.transform = "translateY(" + Math.min(36, scrollY * 0.04) + "px)";
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
        if (entry.isIntersecting) {
          const id = entry.target.id === "personnages" ? "planetes" : entry.target.id;
          setActiveLink(id);
        }
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

/* ─────────────────────────── EFFETS SONORES ─────────────────────────── */

function sfxNoise(ctx, dur) {
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

const SFX = {
  ignite(ctx, t, out) {
    const src = ctx.createBufferSource();
    src.buffer = sfxNoise(ctx, 0.6);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.6;
    bp.frequency.setValueAtTime(500, t);
    bp.frequency.exponentialRampToValueAtTime(2600, t + 0.32);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.4, t + 0.07);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    src.connect(bp);
    bp.connect(g);
    g.connect(out);
    src.start(t);
    src.stop(t + 0.6);
    const hum = ctx.createOscillator();
    hum.type = "sawtooth";
    hum.frequency.value = 112;
    const hg = ctx.createGain();
    hg.gain.setValueAtTime(0.0001, t);
    hg.gain.exponentialRampToValueAtTime(0.1, t + 0.12);
    hg.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    hum.connect(hg);
    hg.connect(out);
    hum.start(t);
    hum.stop(t + 0.65);
  },

  blaster(ctx, t, out) {
    const o = ctx.createOscillator();
    o.type = "square";
    o.frequency.setValueAtTime(1750, t);
    o.frequency.exponentialRampToValueAtTime(240, t + 0.16);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.3, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(g);
    g.connect(out);
    o.start(t);
    o.stop(t + 0.22);
    const src = ctx.createBufferSource();
    src.buffer = sfxNoise(ctx, 0.12);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1200;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.22, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    src.connect(hp);
    hp.connect(ng);
    ng.connect(out);
    src.start(t);
    src.stop(t + 0.12);
  },

  chirp(ctx, t, out) {
    [[1240, 0], [1760, 0.08], [1080, 0.16]].forEach(([f, d]) => {
      const o = ctx.createOscillator();
      o.type = "square";
      o.frequency.setValueAtTime(f, t + d);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t + d);
      g.gain.exponentialRampToValueAtTime(0.16, t + d + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, t + d + 0.07);
      o.connect(g);
      g.connect(out);
      o.start(t + d);
      o.stop(t + d + 0.09);
    });
  },

  force(ctx, t, out) {
    const src = ctx.createBufferSource();
    src.buffer = sfxNoise(ctx, 1.1);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(300, t);
    bp.frequency.exponentialRampToValueAtTime(1800, t + 0.35);
    bp.frequency.exponentialRampToValueAtTime(260, t + 1.0);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.3, t + 0.3);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.05);
    src.connect(bp);
    bp.connect(g);
    g.connect(out);
    src.start(t);
    src.stop(t + 1.1);
    const pad = ctx.createOscillator();
    pad.type = "sine";
    pad.frequency.setValueAtTime(96, t);
    pad.frequency.linearRampToValueAtTime(128, t + 1.0);
    const pg = ctx.createGain();
    pg.gain.setValueAtTime(0.0001, t);
    pg.gain.exponentialRampToValueAtTime(0.14, t + 0.25);
    pg.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
    pad.connect(pg);
    pg.connect(out);
    pad.start(t);
    pad.stop(t + 1.15);
  },

  hyper(ctx, t, out) {
    const src = ctx.createBufferSource();
    src.buffer = sfxNoise(ctx, 1.4);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(180, t);
    bp.frequency.exponentialRampToValueAtTime(7000, t + 1.0);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.42, t + 0.75);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.35);
    src.connect(bp);
    bp.connect(g);
    g.connect(out);
    src.start(t);
    src.stop(t + 1.4);
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.setValueAtTime(70, t);
    sub.frequency.exponentialRampToValueAtTime(42, t + 1.2);
    const sg = ctx.createGain();
    sg.gain.setValueAtTime(0.0001, t);
    sg.gain.exponentialRampToValueAtTime(0.3, t + 0.5);
    sg.gain.exponentialRampToValueAtTime(0.001, t + 1.3);
    sub.connect(sg);
    sg.connect(out);
    sub.start(t);
    sub.stop(t + 1.35);
  },

  beep(ctx, t, out) {
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.setValueAtTime(880, t);
    o.frequency.setValueAtTime(1320, t + 0.07);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.2, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    o.connect(g);
    g.connect(out);
    o.start(t);
    o.stop(t + 0.18);
  },
};

let sfxMuted = false;
try {
  sfxMuted = localStorage.getItem("sw-sfx-muted") === "1";
} catch (err) {
  /* stockage indisponible */
}
let sfxCtx = null;
let sfxBus = null;
let lastSfxAt = 0;

function sfxReady() {
  if (!sfxCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      sfxCtx = new AC();
      sfxBus = sfxCtx.createGain();
      sfxBus.gain.value = 0.55;
      sfxBus.connect(sfxCtx.destination);
    } catch (err) {
      return false;
    }
  }
  if (sfxCtx.state === "suspended") sfxCtx.resume();
  return true;
}

function sfx(name, gap = 220) {
  if (sfxMuted || !SFX[name] || !sfxReady()) return;
  const now = performance.now();
  if (now - lastSfxAt < gap) return;
  lastSfxAt = now;
  try {
    SFX[name](sfxCtx, sfxCtx.currentTime + 0.02, sfxBus);
  } catch (err) {
    /* ignore */
  }
}

document.addEventListener("pointerdown", () => sfxReady(), { once: true });

const soundToggleEl = document.getElementById("sound-toggle");

function syncSoundToggle() {
  if (!soundToggleEl) return;
  soundToggleEl.setAttribute("aria-pressed", String(sfxMuted));
  soundToggleEl.setAttribute(
    "aria-label",
    sfxMuted ? "Activer les effets sonores" : "Couper les effets sonores"
  );
  const icon = soundToggleEl.querySelector("span");
  if (icon) icon.textContent = sfxMuted ? "🔇" : "🔊";
}

if (soundToggleEl) {
  syncSoundToggle();
  soundToggleEl.addEventListener("click", () => {
    sfxMuted = !sfxMuted;
    try {
      localStorage.setItem("sw-sfx-muted", sfxMuted ? "1" : "0");
    } catch (err) {
      /* ignore */
    }
    syncSoundToggle();
    if (!sfxMuted) sfx("beep", 0);
  });
}

document
  .querySelectorAll(
    ".nav a, .hero-contact a, footer a, .back-to-top, .btn-intro, .intro-close, .intro-mute"
  )
  .forEach((el) => el.addEventListener("click", () => sfx("blaster")));

document
  .querySelectorAll(".saber-title")
  .forEach((el) => el.addEventListener("mouseenter", () => sfx("ignite", 450)));

if (yodaEl) yodaEl.addEventListener("click", () => sfx("force", 400));
if (yodaNext) yodaNext.addEventListener("click", () => sfx("chirp", 200));
if (backToTop) backToTop.addEventListener("click", () => sfx("hyper", 600));

const droidSfx = { r2: "chirp", c3po: "beep", bb8: "chirp" };

document.querySelectorAll(".droid-card").forEach((card) => {
  const sound = droidSfx[card.dataset.droid] || "beep";
  card.addEventListener("mouseenter", () => sfx(sound, 350));
  card.addEventListener("click", () => sfx(sound, 350));
});

/* ─────────────────────────── INIT ─────────────────────────── */

buildCoruscant();
onScroll();