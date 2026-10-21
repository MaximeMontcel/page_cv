/* =====================================================================
   CV Maxime Montcel — interactions Star Wars
   1. Audio partagé          2. Fond étoilé + hyperespace
   3. Trafic de vaisseaux     4. Progression, retour en haut, menu actif
   5. Apparitions au défilement   6. Effets de survol des cartes
   7. Bandes défilantes       8. Yoda
   9. Générique d'ouverture   10. Effets sonores
   ===================================================================== */

"use strict";

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let reduceMotion = motionQuery.matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const rand = (min, max) => min + Math.random() * (max - min);

/* 1. AUDIO PARTAGÉ ---------------------------------------------------- */

let audioCtx = null;

function getAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      audioCtx = new AC();
    } catch (err) {
      return null;
    }
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

/* 2. FOND ÉTOILÉ + HYPERESPACE --------------------------------------- */

const starfield = (() => {
  const canvas = document.getElementById("starfield");
  const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
  if (!ctx) return { warp: () => Promise.resolve() };

  const DEPTH = 1000;
  const CRUISE = 0.5;
  let w = 0;
  let h = 0;
  let stars = [];
  let speed = CRUISE;
  let target = CRUISE;
  let last = 0;
  let raf = 0;
  let mouseX = 0;
  let mouseY = 0;
  let offX = 0;
  let offY = 0;
  let shooting = null;
  let nextShoot = 0;

  function newStar(anyDepth) {
    return {
      x: rand(-1, 1) * w,
      y: rand(-1, 1) * h,
      z: anyDepth ? rand(1, DEPTH) : DEPTH,
      tw: rand(0, Math.PI * 2),
    };
  }

  function project(s, z) {
    const k = (DEPTH * 0.5) / z;
    return [w / 2 + offX + s.x * k, h / 2 + offY + s.y * k];
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(260, Math.max(90, (w * h) / 5200)));
    stars = Array.from({ length: count }, () => newStar(true));
    if (reduceMotion) draw(0);
  }

  function drawShootingStar(dt) {
    const now = performance.now();
    if (!shooting && now > nextShoot && speed < 2) {
      const angle = rand(0.15, 0.45);
      shooting = { x: rand(w * 0.3, w), y: rand(0, h * 0.45), vx: -Math.cos(angle), vy: Math.sin(angle), life: 1 };
    }
    if (!shooting) return;
    const step = dt * 0.9;
    shooting.x += shooting.vx * step;
    shooting.y += shooting.vy * step;
    shooting.life -= dt / 1100;
    const tailX = shooting.x - shooting.vx * 140;
    const tailY = shooting.y - shooting.vy * 140;
    const grad = ctx.createLinearGradient(shooting.x, shooting.y, tailX, tailY);
    grad.addColorStop(0, `rgba(255,255,255,${Math.max(0, shooting.life)})`);
    grad.addColorStop(1, "rgba(140,210,255,0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(shooting.x, shooting.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();
    if (shooting.life <= 0) {
      shooting = null;
      nextShoot = now + rand(4000, 9000);
    }
  }

  function draw(dt) {
    const warping = speed > 3;
    ctx.fillStyle = warping ? "rgba(5,7,13,0.35)" : "#05070d";
    ctx.fillRect(0, 0, w, h);

    offX += (mouseX - offX) * 0.04;
    offY += (mouseY - offY) * 0.04;

    for (const s of stars) {
      const pz = s.z;
      s.z -= speed * dt * 0.06;
      if (s.z < 1) Object.assign(s, newStar(false));
      const [x, y] = project(s, s.z);
      if (x < -20 || x > w + 20 || y < -20 || y > h + 20) {
        Object.assign(s, newStar(false));
        continue;
      }
      const near = 1 - s.z / DEPTH;
      const size = near * 2.2 + 0.35;
      s.tw += dt * 0.002;
      const alpha = Math.min(1, near * 1.2 + 0.25) * (reduceMotion ? 1 : 0.8 + Math.sin(s.tw) * 0.2);

      if (warping) {
        const [px, py] = project(s, Math.min(DEPTH, pz + speed * 2.2));
        ctx.strokeStyle = `rgba(200,230,255,${alpha})`;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(x, y, size, size);
      }
    }
    if (!reduceMotion) drawShootingStar(dt);
  }

  function frame(t) {
    const dt = Math.min(50, t - (last || t));
    last = t;
    speed += (target - speed) * (1 - Math.pow(0.92, dt / 16));
    draw(dt);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    cancelAnimationFrame(raf);
    last = 0;
    if (reduceMotion) draw(0);
    else raf = requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  if (finePointer) {
    window.addEventListener("pointermove", (e) => {
      mouseX = (e.clientX - w / 2) * -0.03;
      mouseY = (e.clientY - h / 2) * -0.03;
    }, { passive: true });
  }
  motionQuery.addEventListener("change", (e) => {
    reduceMotion = e.matches;
    start();
  });

  resize();
  nextShoot = performance.now() + rand(2500, 6000);
  start();

  return {
    /* saut en hyperespace : accélère puis revient à la vitesse de croisière */
    warp(duration = 900) {
      if (reduceMotion) return Promise.resolve();
      target = 46;
      return new Promise((resolve) => {
        setTimeout(() => {
          target = CRUISE;
          resolve();
        }, duration);
      });
    },
  };
})();

/* 3. TRAFIC DE VAISSEAUX (hero) -------------------------------------- */

const hero = document.querySelector(".hero");
const traffic = document.querySelector(".hero-traffic");
const SHIPS = {
  xwing: { src: "img/x-wing.webp", w: 180, h: 115 },
  tie: { src: "img/tie-fighter.webp", w: 150, h: 96 },
  falcon: { src: "img/falcon.webp", w: 300, h: 174 },
};
let trafficWide = null;
let falconTimer = 0;
let heroVisible = true;

function makeShip(model) {
  const ship = document.createElement("div");
  ship.className = "ship";
  const img = new Image(model.w, model.h);
  img.src = model.src;
  img.alt = "";
  img.decoding = "async";
  ship.appendChild(img);
  return ship;
}

function buildTraffic() {
  if (!traffic || reduceMotion) return;
  const wide = window.innerWidth >= 768;
  if (wide === trafficWide) return;
  trafficWide = wide;
  traffic.querySelectorAll(".ship:not(.ship--falcon)").forEach((s) => s.remove());

  const count = wide ? 6 : 3;
  for (let i = 0; i < count; i++) {
    const isTie = i % 3 === 1;
    const ship = makeShip(isTie ? SHIPS.tie : SHIPS.xwing);
    const depth = rand(0.45, 1);
    ship.style.setProperty("--y", rand(4, 80).toFixed(1) + "%");
    ship.style.setProperty("--w", (isTie ? 54 : 66) + "px");
    ship.style.setProperty("--s", depth.toFixed(2));
    ship.style.setProperty("--dur", (rand(16, 26) / depth).toFixed(1) + "s");
    ship.style.setProperty("--delay", (-rand(0, 30)).toFixed(1) + "s");
    ship.style.opacity = (0.3 + depth * 0.6).toFixed(2);
    if (Math.random() < 0.5) ship.classList.add("ship--rev");
    traffic.appendChild(ship);
  }
}

function scheduleFalcon() {
  clearTimeout(falconTimer);
  if (!traffic || reduceMotion) return;
  falconTimer = setTimeout(spawnFalcon, rand(14, 30) * 1000);
}

function spawnFalcon() {
  if (document.hidden || !heroVisible) {
    scheduleFalcon();
    return;
  }
  const ship = makeShip(SHIPS.falcon);
  ship.classList.add("ship--falcon");
  ship.style.setProperty("--y", rand(10, 45).toFixed(1) + "%");
  ship.style.setProperty("--w", "130px");
  ship.style.setProperty("--s", "1");
  ship.style.setProperty("--dur", rand(11, 15).toFixed(1) + "s");
  ship.style.setProperty("--delay", "0s");
  ship.addEventListener("animationend", () => {
    ship.remove();
    scheduleFalcon();
  });
  traffic.appendChild(ship);
}

let resizeTimer = 0;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    buildTraffic();
    moveIndicator();
  }, 200);
});

/* met en pause les animations hors écran (économie de batterie) */
if ("IntersectionObserver" in window) {
  const pauseObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-offscreen", !entry.isIntersecting);
      if (entry.target === hero) heroVisible = entry.isIntersecting;
    });
  });
  [hero, document.getElementById("galaxie")].forEach((el) => el && pauseObserver.observe(el));
}

/* 4. PROGRESSION, RETOUR EN HAUT, MENU ACTIF ------------------------- */

const progressBar = document.querySelector(".scroll-progress");
const backToTop = document.getElementById("back-to-top");
const navList = document.querySelector(".nav-list");
const navIndicator = document.querySelector(".nav-indicator");
const navLinks = Array.from(document.querySelectorAll(".nav a"));
let activeLink = null;
let ticking = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (backToTop) backToTop.classList.toggle("is-visible", y > 600);
    ticking = false;
  });
}

function moveIndicator() {
  if (!navIndicator) return;
  if (!activeLink) {
    navIndicator.style.opacity = "0";
    return;
  }
  const x = activeLink.offsetLeft - navList.scrollLeft + 14;
  const width = Math.max(1, activeLink.offsetWidth - 28);
  navIndicator.style.opacity = "1";
  navIndicator.style.transform = `translateX(${x}px) scaleX(${width})`;
}

function setActive(id) {
  const link = navLinks.find((a) => a.getAttribute("href") === "#" + id) || null;
  if (link === activeLink) return;
  navLinks.forEach((a) => {
    a.classList.toggle("active", a === link);
    if (a === link) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
  activeLink = link;
  if (link && navList.scrollWidth > navList.clientWidth) {
    navList.scrollTo({
      left: link.offsetLeft - (navList.clientWidth - link.offsetWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }
  moveIndicator();
}

window.addEventListener("scroll", onScroll, { passive: true });
if (navList) navList.addEventListener("scroll", moveIndicator, { passive: true });

if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));
  if (hero) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.35) setActive(null);
    }, { threshold: [0, 0.35, 1] }).observe(hero);
  }
}

if (backToTop) {
  backToTop.addEventListener("click", () => {
    sfx("hyper", 0);
    starfield.warp(700);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    document.getElementById("haut").focus({ preventScroll: true });
  });
  document.getElementById("haut").setAttribute("tabindex", "-1");
}

/* 5. APPARITIONS AU DÉFILEMENT --------------------------------------- */

function animateCount(el) {
  const end = Number(el.dataset.count);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const start = performance.now();
  const duration = 1400;
  function step(now) {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(end * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const revealEls = document.querySelectorAll(".reveal, main .section");

/* décalage en cascade entre éléments voisins */
document.querySelectorAll(".reveal").forEach((el) => {
  const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
  el.style.setProperty("--delay", Math.min(siblings.indexOf(el), 5) * 90 + "ms");
});

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll(".stat-num[data-count]").forEach(animateCount);
        revealer.unobserve(entry.target);
      });
    },
    { threshold: 0, rootMargin: "0px 0px -12% 0px" }
  );
  revealEls.forEach((el) => revealer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* 6. EFFETS DE SURVOL DES CARTES (halo + inclinaison des droids) ------ */

if (finePointer) {
  document.querySelectorAll(".card").forEach((card) => {
    const tilt = card.classList.contains("droid");
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty("--mx", x + "px");
      card.style.setProperty("--my", y + "px");
      if (tilt && !reduceMotion) {
        card.style.setProperty("--ry", ((x / r.width - 0.5) * 12).toFixed(2) + "deg");
        card.style.setProperty("--rx", ((0.5 - y / r.height) * 12).toFixed(2) + "deg");
      }
    });
    if (tilt) {
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    }
  });
}

/* 7. BANDES DÉFILANTES (planètes et personnages) --------------------- */

const galaxy = document.getElementById("galaxie");
const marqueeToggle = document.getElementById("marquee-toggle");

if (!reduceMotion) {
  document.querySelectorAll(".marquee").forEach((marquee) => {
    const group = marquee.querySelector(".marquee-group");
    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    marquee.querySelector(".marquee-track").appendChild(clone);
    marquee.classList.add("is-ready");
  });
} else if (marqueeToggle) {
  marqueeToggle.hidden = true;
}

if (marqueeToggle && galaxy) {
  marqueeToggle.addEventListener("click", () => {
    const paused = galaxy.classList.toggle("marquees-paused");
    marqueeToggle.setAttribute("aria-pressed", String(paused));
    marqueeToggle.querySelector("span").textContent = paused ? "Reprendre le défilement" : "Mettre en pause";
    marqueeToggle.querySelector("use").setAttribute("href", paused ? "#i-play" : "#i-pause");
  });
}

/* 8. YODA ------------------------------------------------------------- */

const yodaBtn = document.getElementById("yoda-btn");
const yodaBubble = document.getElementById("yoda-bubble");
const yodaText = yodaBubble ? yodaBubble.querySelector(".yoda-text") : null;
const yodaLive = document.getElementById("yoda-live");
const yodaNext = document.getElementById("yoda-next");
const yodaClose = document.getElementById("yoda-close");

const yodaLines = [
  "Bienvenue, jeune visiteur. Le dossier de Maxime, consulter tu veux ?",
  "Bachelier STI2D option SIN en juin 2026, il est. En BTS SIO SISR, désormais il se forme.",
  "Son alternance, il a trouvée : au Département de la Loire. Support aux utilisateurs et gestion du parc, il assure.",
  "Java, Python, PHP, HTML et CSS, déjà il pratique. Les systèmes et réseaux, bientôt il maîtrisera.",
  "Rigoureux et ponctuel, il est. Un bon Padawan pour son équipe, il fait.",
  "Son CV en PDF, télécharger tu peux. Sur LinkedIn, le suivre tu dois !",
  "Que la Force soit avec toi.",
];

let yodaIndex = 0;
let typeTimer = 0;

function typeText(text) {
  clearTimeout(typeTimer);
  if (yodaLive) yodaLive.textContent = text;
  if (reduceMotion) {
    yodaText.textContent = text;
    return;
  }
  let i = 0;
  yodaText.classList.add("typing");
  (function step() {
    yodaText.textContent = text.slice(0, i);
    if (i++ < text.length) typeTimer = setTimeout(step, 18);
    else yodaText.classList.remove("typing");
  })();
}

function showYodaLine(index) {
  yodaIndex = (index + yodaLines.length) % yodaLines.length;
  typeText(yodaLines[yodaIndex]);
}

function openYoda(fromKeyboard) {
  yodaBubble.hidden = false;
  yodaBtn.setAttribute("aria-expanded", "true");
  showYodaLine(0);
  if (fromKeyboard) yodaNext.focus();
}

function closeYoda() {
  const hadFocus = yodaBubble.contains(document.activeElement);
  clearTimeout(typeTimer);
  yodaBubble.hidden = true;
  yodaBtn.setAttribute("aria-expanded", "false");
  if (hadFocus) yodaBtn.focus();
}

if (yodaBtn && yodaBubble) {
  yodaBtn.addEventListener("click", (e) => {
    sfx("force", 400);
    if (yodaBubble.hidden) openYoda(e.detail === 0);
    else closeYoda();
  });
  yodaNext.addEventListener("click", () => {
    sfx("chirp", 0);
    showYodaLine(yodaIndex + 1);
  });
  yodaClose.addEventListener("click", closeYoda);
}

/* 9. GÉNÉRIQUE D'OUVERTURE ------------------------------------------- */

const page = document.getElementById("page");
const intro = document.getElementById("intro");
const btnIntro = document.getElementById("btn-intro");
const introClose = document.getElementById("intro-close");
const introMute = document.getElementById("intro-mute");
const crawl = document.getElementById("crawl");

const CRAWL_START = 11; /* doit correspondre au délai de .crawl dans le CSS */
let introTimers = [];
let introOpen = false;
let musicMuted = false;
let musicBus = null;

function sizeCrawl() {
  const inner = crawl.querySelector(".crawl-inner");
  const dist = Math.max(1700, Math.round(inner.offsetHeight + window.innerHeight * 1.3));
  const dur = Math.min(36, Math.max(20, Math.round(dist / 90)));
  crawl.style.setProperty("--crawl-dist", `-${dist}px`);
  crawl.style.setProperty("--crawl-dur", `${dur}s`);
  return dur;
}

function playMusic() {
  const ctx = getAudio();
  if (!ctx) return;
  musicBus = ctx.createGain();
  musicBus.gain.value = musicMuted ? 0 : 0.3;
  musicBus.connect(ctx.destination);
  const t0 = ctx.currentTime + 0.3;

  const voice = (freq, start, dur, peak, type, cutoff) => {
    const osc = ctx.createOscillator();
    const lp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    lp.type = "lowpass";
    lp.frequency.value = cutoff;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(peak, start + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(lp);
    lp.connect(g);
    g.connect(musicBus);
    osc.start(start);
    osc.stop(start + dur + 0.1);
  };

  /* nappe d'attente pendant « Il y a bien longtemps… » */
  [[146.83, 174.61, 220], [116.54, 146.83, 174.61]].forEach((chord, i) => {
    chord.forEach((f) => voice(f, t0 + i * 2.3, 2.5, 0.07, "sine", 700));
  });

  /* impact au moment où le logo apparaît */
  const hit = t0 + 4.7;
  voice(55, hit, 2.4, 0.5, "sine", 220);
  voice(87.31, hit, 2.2, 0.25, "sawtooth", 700);
  [[146.83, 220, 293.66], [174.61, 220, 261.63], [130.81, 196, 261.63]].forEach((chord, i) => {
    chord.forEach((f) => voice(f, hit + i * 2.1, 2.3, 0.13, "sawtooth", 1100));
    voice(chord[0] / 2, hit + i * 2.1, 2.3, 0.18, "triangle", 400);
  });

  /* fanfare au démarrage du texte déroulant */
  [220, 261.63, 293.66, 349.23, 293.66].forEach((f, i) => {
    const start = t0 + CRAWL_START - 0.3 + i * 0.5;
    voice(f, start, 1.1, 0.18, "sawtooth", 1600);
    voice(f * 2, start, 1.1, 0.08, "sawtooth", 2400);
  });
}

function stopMusic() {
  if (!musicBus || !audioCtx) return;
  try {
    musicBus.gain.cancelScheduledValues(audioCtx.currentTime);
    musicBus.gain.setTargetAtTime(0, audioCtx.currentTime, 0.12);
  } catch (err) {
    /* rien à arrêter */
  }
  musicBus = null;
}

async function openIntro() {
  if (introOpen) return;
  introOpen = true;
  sfx("hyper", 0);
  await starfield.warp(850);

  intro.hidden = false;
  document.body.classList.add("intro-open");
  page.inert = true;
  introMute.hidden = reduceMotion;

  if (reduceMotion) {
    intro.classList.add("is-static");
  } else {
    intro.classList.remove("is-static");
    const dur = sizeCrawl();
    playMusic();
    introTimers.push(setTimeout(closeIntro, (CRAWL_START + dur + 1.5) * 1000));
  }
  introClose.focus();
}

function closeIntro() {
  if (!introOpen) return;
  introOpen = false;
  introTimers.forEach(clearTimeout);
  introTimers = [];
  stopMusic();
  intro.hidden = true;
  document.body.classList.remove("intro-open");
  page.inert = false;
  starfield.warp(450);
  btnIntro.focus();
}

if (intro && btnIntro) {
  btnIntro.addEventListener("click", openIntro);
  introClose.addEventListener("click", closeIntro);

  introMute.addEventListener("click", () => {
    musicMuted = !musicMuted;
    introMute.setAttribute("aria-pressed", String(musicMuted));
    introMute.textContent = musicMuted ? "Activer la musique" : "Couper la musique";
    if (musicBus && audioCtx) musicBus.gain.setTargetAtTime(musicMuted ? 0 : 0.3, audioCtx.currentTime, 0.05);
  });

  /* garde le focus clavier à l'intérieur du générique */
  intro.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const items = [introClose, introMute].filter((el) => !el.hidden);
    const i = items.indexOf(document.activeElement);
    e.preventDefault();
    items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (introOpen) closeIntro();
  else if (yodaBubble && !yodaBubble.hidden) closeYoda();
});

/* 10. EFFETS SONORES (désactivés par défaut) ------------------------- */

function noiseBuffer(ctx, dur) {
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function envelope(ctx, node, t, peak, attack, release) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.001, t + release);
  node.connect(g);
  return g;
}

function noise(ctx, t, dur, type, freqs, q) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, dur);
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(freqs[0], t);
  freqs.slice(1).forEach(([f, at]) => filter.frequency.exponentialRampToValueAtTime(f, t + at));
  src.connect(filter);
  src.start(t);
  src.stop(t + dur);
  return filter;
}

function tone(ctx, t, dur, type, freqs) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freqs[0], t);
  freqs.slice(1).forEach(([f, at]) => o.frequency.exponentialRampToValueAtTime(f, t + at));
  o.start(t);
  o.stop(t + dur);
  return o;
}

const SFX = {
  ignite(ctx, t, out) {
    envelope(ctx, noise(ctx, t, 0.6, "bandpass", [500, [2600, 0.32]], 1.6), t, 0.35, 0.07, 0.55).connect(out);
    envelope(ctx, tone(ctx, t, 0.65, "sawtooth", [112]), t, 0.08, 0.12, 0.6).connect(out);
  },
  blaster(ctx, t, out) {
    envelope(ctx, tone(ctx, t, 0.22, "square", [1750, [240, 0.16]]), t, 0.22, 0.012, 0.2).connect(out);
    envelope(ctx, noise(ctx, t, 0.12, "highpass", [1200], 0.7), t, 0.16, 0.005, 0.1).connect(out);
  },
  chirp(ctx, t, out) {
    [[1240, 0], [1760, 0.08], [1080, 0.16]].forEach(([f, d]) => {
      envelope(ctx, tone(ctx, t + d, 0.09, "square", [f]), t + d, 0.12, 0.012, 0.07).connect(out);
    });
  },
  beep(ctx, t, out) {
    envelope(ctx, tone(ctx, t, 0.18, "triangle", [880, [1320, 0.07]]), t, 0.2, 0.015, 0.16).connect(out);
  },
  force(ctx, t, out) {
    envelope(ctx, noise(ctx, t, 1.1, "bandpass", [300, [1800, 0.35], [260, 1]], 0.8), t, 0.28, 0.3, 1.05).connect(out);
    envelope(ctx, tone(ctx, t, 1.15, "sine", [96, [128, 1]]), t, 0.14, 0.25, 1.1).connect(out);
  },
  hyper(ctx, t, out) {
    envelope(ctx, noise(ctx, t, 1.4, "bandpass", [180, [7000, 1]], 1.1), t, 0.38, 0.75, 1.35).connect(out);
    envelope(ctx, tone(ctx, t, 1.35, "sine", [70, [42, 1.2]]), t, 0.28, 0.5, 1.3).connect(out);
  },
};

const soundToggle = document.getElementById("sound-toggle");
let sfxOn = false;
let sfxBus = null;
let lastSfx = 0;

try {
  sfxOn = localStorage.getItem("sw-sfx") === "on";
} catch (err) {
  /* stockage indisponible : sons coupés */
}

function sfx(name, gap = 220) {
  if (!sfxOn || !SFX[name]) return;
  const now = performance.now();
  if (now - lastSfx < gap) return;
  lastSfx = now;
  const ctx = getAudio();
  if (!ctx) return;
  if (!sfxBus) {
    sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.5;
    sfxBus.connect(ctx.destination);
  }
  try {
    SFX[name](ctx, ctx.currentTime + 0.02, sfxBus);
  } catch (err) {
    /* son ignoré */
  }
}

function syncSoundToggle() {
  soundToggle.setAttribute("aria-pressed", String(sfxOn));
  soundToggle.title = sfxOn ? "Couper les effets sonores" : "Activer les effets sonores";
}

if (soundToggle) {
  syncSoundToggle();
  soundToggle.addEventListener("click", () => {
    sfxOn = !sfxOn;
    try {
      localStorage.setItem("sw-sfx", sfxOn ? "on" : "off");
    } catch (err) {
      /* préférence non mémorisée */
    }
    syncSoundToggle();
    sfx("beep", 0);
  });
}

document.querySelectorAll(".nav a, .hero a, .contact-actions a, .link-arrow, .section-cta a, .footer a").forEach((el) => {
  el.addEventListener("click", () => sfx("blaster"));
});

document.querySelectorAll(".saber-title").forEach((el) => {
  el.addEventListener("mouseenter", () => sfx("ignite", 450));
});

const droidSounds = { r2: "chirp", c3po: "beep", bb8: "chirp" };
document.querySelectorAll(".droid").forEach((card) => {
  card.addEventListener("mouseenter", () => sfx(droidSounds[card.dataset.droid] || "beep", 350));
});

/* INITIALISATION ------------------------------------------------------ */

buildTraffic();
scheduleFalcon();
onScroll();
