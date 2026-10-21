/* =====================================================================
   CV Maxime Montcel — interactions Star Wars
   1. Audio partagé          2. Fond étoilé + hyperespace
   3. Bataille d'Endor        4. Progression, retour en haut, menu actif
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

  /* arrivée sur le site : on démarre en hyperespace puis on en sort
     (synchronisé avec --arrive dans le CSS) */
  if (!reduceMotion) {
    speed = target = 46;
    setTimeout(() => {
      target = CRUISE;
    }, 1000);
  }
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

/* 3. BATAILLE D'ENDOR (fond du hero) ---------------------------------- */
/* Tirs rebelles (X-wing, Faucon, croiseurs) en rouge, tirs impériaux
   (chasseurs TIE, destroyers, Étoile de la Mort) en vert. */

const hero = document.querySelector(".hero");
let heroVisible = true;

const battle = (() => {
  const canvas = document.getElementById("battle");
  const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
  if (!ctx || !hero) return { resize() {} };

  const TAU = Math.PI * 2;
  const SIZE = 2.1;
  const LASER = {
    rebel: { glow: "rgba(255, 40, 30, 0.7)", core: "#ffe2dd" },
    empire: { glow: "rgba(60, 255, 80, 0.7)", core: "#eaffe8" },
  };
  const falconImg = new Image();
  falconImg.src = "img/falcon.webp";

  let W = 0;
  let H = 0;
  let k = 1;
  let dpr = 1;
  let backdrop = null;
  let ships = [];
  let bolts = [];
  let particles = [];
  let flashes = [];
  let capitals = [];
  let dsLights = [];
  let ds = { x: 0, y: 0, r: 0 };
  let falcon = null;
  let beam = null;
  let time = 0;
  let nextFalcon = 6;
  let nextBeam = 14;
  let nextTurbo = 0;
  let last = 0;
  let raf = 0;

  const angleTo = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));

  /* aléatoire reproductible pour le décor (même rendu à chaque visite) */
  function seeded(seed) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* --- décor : Endor et l'Étoile de la Mort II (dessinés une fois) --- */

  function drawEndor(g, cx, cy, r) {
    const rnd = seeded(42);
    const halo = g.createRadialGradient(cx, cy, r * 0.96, cx, cy, r * 1.1);
    halo.addColorStop(0, "rgba(150, 235, 180, 0.4)");
    halo.addColorStop(1, "rgba(150, 235, 180, 0)");
    g.fillStyle = halo;
    g.beginPath();
    g.arc(cx, cy, r * 1.1, 0, TAU);
    g.fill();

    const body = g.createRadialGradient(cx - r * 0.3, cy - r * 0.55, r * 0.05, cx, cy, r);
    body.addColorStop(0, "#6fb878");
    body.addColorStop(0.55, "#2e6a3b");
    body.addColorStop(1, "#0d2615");
    g.fillStyle = body;
    g.beginPath();
    g.arc(cx, cy, r, 0, TAU);
    g.fill();

    g.save();
    g.beginPath();
    g.arc(cx, cy, r, 0, TAU);
    g.clip();
    for (let i = 0; i < 90; i++) {
      const a = rnd() * TAU;
      const d = Math.sqrt(rnd()) * r;
      g.fillStyle = rnd() < 0.7 ? "rgba(18, 60, 30, 0.45)" : "rgba(120, 170, 90, 0.25)";
      g.beginPath();
      g.ellipse(cx + Math.cos(a) * d, cy + Math.sin(a) * d, r * (0.02 + rnd() * 0.06), r * (0.01 + rnd() * 0.03), rnd() * 0.6, 0, TAU);
      g.fill();
    }
    for (let i = 0; i < 45; i++) {
      const a = rnd() * TAU;
      const d = Math.sqrt(rnd()) * r;
      g.fillStyle = `rgba(255, 255, 255, ${0.08 + rnd() * 0.18})`;
      g.beginPath();
      g.ellipse(cx + Math.cos(a) * d, cy + Math.sin(a) * d, r * (0.04 + rnd() * 0.1), r * (0.008 + rnd() * 0.015), -0.15 + rnd() * 0.3, 0, TAU);
      g.fill();
    }
    const shade = g.createLinearGradient(cx - r * 0.6, cy - r, cx + r * 0.8, cy + r * 0.4);
    shade.addColorStop(0, "rgba(0, 0, 0, 0)");
    shade.addColorStop(0.55, "rgba(0, 0, 0, 0.05)");
    shade.addColorStop(1, "rgba(0, 0, 0, 0.6)");
    g.fillStyle = shade;
    g.fillRect(cx - r, cy - r, r * 2, r * 2);
    g.restore();
  }

  function drawDeathStar(g, cx, cy, r) {
    const rnd = seeded(7);
    const size = Math.ceil(r * 2 + 8);
    const off = document.createElement("canvas");
    off.width = off.height = size;
    const o = off.getContext("2d");
    const c = size / 2;

    const body = o.createRadialGradient(c - r * 0.4, c - r * 0.45, r * 0.08, c, c, r);
    body.addColorStop(0, "#d3d7de");
    body.addColorStop(0.6, "#7e848e");
    body.addColorStop(1, "#262930");
    o.fillStyle = body;
    o.beginPath();
    o.arc(c, c, r, 0, TAU);
    o.fill();

    o.save();
    o.beginPath();
    o.arc(c, c, r, 0, TAU);
    o.clip();
    for (let i = 0; i < 140; i++) {
      o.fillStyle = rnd() < 0.5 ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.14)";
      o.fillRect(c - r + rnd() * r * 2, c - r + rnd() * r * 2, r * (0.03 + rnd() * 0.12), r * (0.015 + rnd() * 0.04));
    }
    o.strokeStyle = "rgba(20, 22, 28, 0.7)";
    o.lineWidth = Math.max(1, r * 0.025);
    o.beginPath();
    o.ellipse(c, c + r * 0.05, r, r * 0.12, 0, 0, Math.PI);
    o.stroke();
    /* parabole du superlaser */
    const dx = c - r * 0.36;
    const dy = c - r * 0.34;
    const dr = r * 0.25;
    const dish = o.createRadialGradient(dx + dr * 0.25, dy + dr * 0.25, dr * 0.1, dx, dy, dr);
    dish.addColorStop(0, "#4a4f58");
    dish.addColorStop(1, "#9aa0aa");
    o.fillStyle = dish;
    o.beginPath();
    o.arc(dx, dy, dr, 0, TAU);
    o.fill();
    o.strokeStyle = "rgba(30, 32, 38, 0.8)";
    o.lineWidth = Math.max(1, r * 0.02);
    o.stroke();
    o.fillStyle = "#3a3f47";
    o.beginPath();
    o.arc(dx, dy, dr * 0.18, 0, TAU);
    o.fill();
    o.restore();

    /* partie inachevée : on découpe le quart inférieur droit */
    const cut = new Path2D();
    const qx = c + r * 0.88;
    const qy = c + r * 0.82;
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * TAU;
      const rr = r * 0.92 * (1 + (rnd() - 0.5) * 0.12);
      if (i === 0) cut.moveTo(qx + Math.cos(a) * rr, qy + Math.sin(a) * rr);
      else cut.lineTo(qx + Math.cos(a) * rr, qy + Math.sin(a) * rr);
    }
    cut.closePath();
    o.globalCompositeOperation = "destination-out";
    o.fill(cut);
    o.globalCompositeOperation = "source-over";

    /* squelette visible dans la partie inachevée */
    o.save();
    o.beginPath();
    o.arc(c, c, r, 0, TAU);
    o.clip();
    o.clip(cut);
    o.fillStyle = "rgba(14, 16, 22, 0.45)";
    o.fillRect(0, 0, size, size);
    o.strokeStyle = "rgba(170, 180, 196, 0.5)";
    o.lineWidth = 0.8;
    for (let lat = -0.8; lat <= 0.81; lat += 0.2) {
      o.beginPath();
      o.ellipse(c, c + lat * r, r * Math.sqrt(1 - lat * lat), r * 0.1, 0, 0, TAU);
      o.stroke();
    }
    for (let m = 0.15; m <= 1; m += 0.2) {
      o.beginPath();
      o.ellipse(c, c, r * m, r, 0, 0, TAU);
      o.stroke();
    }
    o.restore();

    /* lumière de bord */
    o.strokeStyle = "rgba(255, 255, 255, 0.12)";
    o.lineWidth = 1.2;
    o.beginPath();
    o.arc(c, c, r - 0.6, Math.PI * 0.9, Math.PI * 1.7);
    o.stroke();

    g.drawImage(off, cx - c, cy - c);

    dsLights = Array.from({ length: 16 }, () => {
      const a = Math.PI * (0.8 + rnd() * 1.1);
      const d = r * (0.2 + rnd() * 0.75);
      return { x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, p: rnd() * TAU, f: 1 + rnd() * 2 };
    });
  }

  function buildBackdrop() {
    backdrop = document.createElement("canvas");
    backdrop.width = Math.round(W * dpr);
    backdrop.height = Math.round(H * dpr);
    const g = backdrop.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const portrait = H > W;
    if (portrait) {
      drawEndor(g, W * 0.5, H * 1.08, W * 0.72);
      ds = { x: W * 0.84, y: Math.min(H * 0.07, 58), r: W * 0.11 };
    } else {
      drawEndor(g, W * 0.17, H * 1.02, Math.min(H * 0.62, W * 0.4));
      ds = { x: W * 0.8, y: H * 0.27, r: Math.min(W, H) * 0.14 };
    }
    drawDeathStar(g, ds.x, ds.y, ds.r);
  }

  /* --- vaisseaux --- */

  function drawXwing(g, t) {
    g.fillStyle = `rgba(255, 130, 100, ${0.6 + 0.3 * Math.sin(t * 40)})`;
    g.beginPath();
    g.arc(-12.5, -3.2, 2, 0, TAU);
    g.arc(-12.5, 3.2, 2, 0, TAU);
    g.fill();
    g.fillStyle = "#c3c8d0";
    for (const d of [-1, 1]) {
      g.beginPath();
      g.moveTo(-9, -2 * d);
      g.lineTo(-3.5, -2 * d);
      g.lineTo(-5.5, -11 * d);
      g.lineTo(-10, -11 * d);
      g.closePath();
      g.fill();
    }
    g.fillStyle = "#d24538";
    g.fillRect(-9.6, -9.4, 3.2, 1.3);
    g.fillRect(-9.6, 8.1, 3.2, 1.3);
    g.strokeStyle = "#9aa1ab";
    g.lineWidth = 0.9;
    g.beginPath();
    g.moveTo(-10, -11);
    g.lineTo(7, -11);
    g.moveTo(-10, 11);
    g.lineTo(7, 11);
    g.stroke();
    g.fillStyle = "#a9afb8";
    g.fillRect(-12.5, -4.8, 8, 3);
    g.fillRect(-12.5, 1.8, 8, 3);
    g.fillStyle = "#e6e9ee";
    g.beginPath();
    g.moveTo(-11, -1.9);
    g.lineTo(9, -1.2);
    g.lineTo(15, 0);
    g.lineTo(9, 1.2);
    g.lineTo(-11, 1.9);
    g.closePath();
    g.fill();
    g.fillStyle = "#28303e";
    g.beginPath();
    g.ellipse(3, 0, 2.6, 1.1, 0, 0, TAU);
    g.fill();
    g.fillStyle = "#d24538";
    g.fillRect(6, -0.5, 4, 1);
  }

  function hexagon(g, r) {
    g.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    g.closePath();
  }

  function drawTie(g) {
    g.fillStyle = "#6c737d";
    g.fillRect(-1.2, -8.6, 2.4, 17.2);
    for (const d of [-1, 1]) {
      g.save();
      g.translate(0, d * 8.6);
      g.scale(1, 0.42);
      hexagon(g, 9);
      g.fillStyle = "#262a31";
      g.fill();
      g.strokeStyle = "#8d949e";
      g.lineWidth = 1.4;
      g.stroke();
      g.strokeStyle = "#4b525c";
      g.lineWidth = 0.8;
      g.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = (i / 6) * TAU;
        g.moveTo(Math.cos(a) * 9, Math.sin(a) * 9);
        g.lineTo(-Math.cos(a) * 9, -Math.sin(a) * 9);
      }
      g.stroke();
      g.restore();
    }
    g.fillStyle = "#8f96a0";
    g.beginPath();
    g.arc(0, 0, 3.8, 0, TAU);
    g.fill();
    g.fillStyle = "#16191e";
    g.beginPath();
    g.arc(1.3, 0, 1.9, 0, TAU);
    g.fill();
  }

  function drawStarDestroyer(g) {
    g.fillStyle = "#8a9099";
    g.beginPath();
    g.moveTo(-30, 0);
    g.lineTo(22, -11);
    g.lineTo(22, 11);
    g.closePath();
    g.fill();
    g.fillStyle = "#5f656e";
    g.beginPath();
    g.moveTo(-30, 0);
    g.lineTo(22, 0);
    g.lineTo(22, 11);
    g.closePath();
    g.fill();
    g.fillStyle = "#a3a9b2";
    g.fillRect(9, -4, 9, 3);
    g.fillRect(13, -7.5, 3.5, 4);
    g.fillStyle = "rgba(170, 210, 255, 0.9)";
    for (const y of [-6, 0, 6]) {
      g.beginPath();
      g.arc(22.5, y, 1.6, 0, TAU);
      g.fill();
    }
  }

  function drawCruiser(g) {
    g.fillStyle = "rgba(120, 180, 255, 0.85)";
    for (const y of [-4, 0, 4]) {
      g.beginPath();
      g.arc(-31, y, 1.8, 0, TAU);
      g.fill();
    }
    g.fillStyle = "#97a5b8";
    g.beginPath();
    g.ellipse(0, 0, 30, 8, 0, 0, TAU);
    g.fill();
    g.fillStyle = "#7b889b";
    g.beginPath();
    g.ellipse(-6, 2.5, 18, 5, 0, 0, TAU);
    g.fill();
    g.fillStyle = "#b9c4d3";
    g.beginPath();
    g.ellipse(12, -3, 10, 3, 0, 0, TAU);
    g.fill();
  }

  /* --- logique de combat --- */

  function spawnShip(team, anywhere) {
    const rebel = team === "rebel";
    const s = rand(0.55, 1);
    let x;
    let y;
    let a;
    if (anywhere) {
      x = rand(0.05, 0.95) * W;
      y = rand(0.08, 0.75) * H;
      a = rand(0, TAU);
    } else {
      x = rebel ? -40 : W + 40;
      y = rand(0.1, 0.7) * H;
      a = rebel ? rand(-0.4, 0.4) : Math.PI + rand(-0.4, 0.4);
    }
    return {
      team, x, y, a, s, alive: true, respawn: 0,
      hp: rebel ? 2 : 1,
      speed: (rebel ? 160 : 190) * rand(0.9, 1.1),
      turn: rebel ? 1.8 : 2.3,
      cd: rand(0.5, 2),
      target: null,
      retarget: 0,
      phase: rand(0, TAU),
    };
  }

  function buildFleet() {
    const perSide = W < 700 ? 3 : 5;
    ships = [];
    for (let i = 0; i < perSide; i++) {
      ships.push(spawnShip("rebel", true), spawnShip("empire", true));
    }
    bolts = [];
    particles = [];
    flashes = [];
  }

  function buildCapitals() {
    const portrait = H > W;
    capitals = portrait
      ? [
        { type: "sd", x: W * 0.56, y: H * 0.07, s: 0.4 },
        { type: "sd", x: W * 0.95, y: H * 0.3, s: 0.5 },
        { type: "mc", x: W * 0.1, y: H * 0.3, s: 0.45 },
        { type: "mc", x: W * 0.3, y: H * 0.05, s: 0.35 },
      ]
      : [
        { type: "sd", x: W * 0.62, y: H * 0.16, s: 0.55 },
        { type: "sd", x: W * 0.93, y: H * 0.58, s: 0.7 },
        { type: "mc", x: W * 0.09, y: H * 0.22, s: 0.65 },
        { type: "mc", x: W * 0.28, y: H * 0.1, s: 0.45 },
      ];
    capitals.forEach((c) => {
      c.phase = rand(0, TAU);
      c.dead = false;
      c.respawn = 0;
      c.fade = 1;
    });
  }

  function nearestEnemy(sh) {
    let best = null;
    let bestD = Infinity;
    for (const o of ships) {
      if (!o.alive || o.team === sh.team) continue;
      const d = Math.hypot(o.x - sh.x, o.y - sh.y) + Math.abs(o.s - sh.s) * 400;
      if (d < bestD) {
        bestD = d;
        best = o;
      }
    }
    return best;
  }

  function fire(x, y, a, team, s, offsets) {
    const c = Math.cos(a);
    const sn = Math.sin(a);
    const sc = s * k * SIZE;
    for (const [ox, oy] of offsets) {
      bolts.push({
        x: x + (ox * c - oy * sn) * sc,
        y: y + (ox * sn + oy * c) * sc,
        vx: c * 720 * s * k,
        vy: sn * 720 * s * k,
        life: 0.9,
        team,
        s,
        len: 30 * s * k,
      });
    }
  }

  function burst(x, y, s, big) {
    const n = big ? 70 : 30;
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU);
      const sp = rand(20, big ? 280 : 170) * k * s;
      const life = rand(0.45, big ? 1.6 : 1.1);
      particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life, max: life, size: rand(1.2, 3.2) * k * s * (big ? 1.8 : 1) });
    }
    for (let i = 0; i < (big ? 12 : 6); i++) {
      const a = rand(0, TAU);
      const sp = rand(30, 120) * k * s;
      const life = rand(0.8, 1.6);
      particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life, max: life, size: rand(1.5, 3) * k * s, debris: true, rot: rand(0, TAU), spin: rand(-8, 8) });
    }
    flashes.push({ x, y, r: (big ? 70 : 24) * k * s, life: big ? 0.7 : 0.4, max: big ? 0.7 : 0.4 });
  }

  function spark(x, y, s) {
    for (let i = 0; i < 6; i++) {
      const a = rand(0, TAU);
      const sp = rand(40, 120) * k * s;
      particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.3, max: 0.3, size: 1.4 * k * s });
    }
  }

  function updateShip(sh, dt) {
    if (!sh.alive) {
      sh.respawn -= dt;
      if (sh.respawn <= 0) Object.assign(sh, spawnShip(sh.team, false));
      return;
    }
    sh.retarget -= dt;
    if (sh.retarget <= 0 || !sh.target || !sh.target.alive) {
      sh.target = nearestEnemy(sh);
      sh.retarget = rand(1.5, 3);
    }
    let tx = W / 2;
    let ty = H * 0.4;
    if (sh.target) {
      tx = sh.target.x + Math.cos(time * 0.9 + sh.phase) * 70 * k;
      ty = sh.target.y + Math.sin(time * 1.1 + sh.phase) * 45 * k;
    }
    if (sh.x < -60) tx = W * 0.35;
    if (sh.x > W + 60) tx = W * 0.65;
    if (sh.y < -50) ty = H * 0.45;
    if (sh.y > H * 0.9) ty = H * 0.4;

    const diff = angleTo(sh.a, Math.atan2(ty - sh.y, tx - sh.x));
    sh.a += Math.max(-sh.turn * dt, Math.min(sh.turn * dt, diff));
    const v = sh.speed * k * (0.55 + 0.45 * sh.s);
    sh.x += Math.cos(sh.a) * v * dt;
    sh.y += Math.sin(sh.a) * v * dt;

    sh.cd -= dt;
    const t = sh.target;
    if (t && sh.cd <= 0) {
      const d = Math.hypot(t.x - sh.x, t.y - sh.y);
      const off = Math.abs(angleTo(sh.a, Math.atan2(t.y - sh.y, t.x - sh.x)));
      if (d < 520 * k && off < 0.35 && Math.abs(t.s - sh.s) < 0.3) {
        const rebel = sh.team === "rebel";
        fire(sh.x, sh.y, sh.a, sh.team, sh.s, rebel ? [[7, -11], [7, 11]] : [[5, -3], [5, 3]]);
        sh.cd = rebel ? rand(0.45, 0.8) : rand(0.35, 0.6);
      }
    }
  }

  function updateFalcon(dt) {
    if (!falcon) {
      if (time > nextFalcon) falcon = { x: W + 90 * k, y: rand(0.15, 0.55) * H, cd: 0, t: 0 };
      return;
    }
    falcon.t += dt;
    falcon.x -= 330 * k * dt;
    falcon.y += Math.sin(falcon.t * 1.6) * 30 * k * dt;
    falcon.cd -= dt;
    if (falcon.cd <= 0) {
      const prey = ships.find((o) => o.alive && o.team === "empire" && o.s > 0.7 && o.x < falcon.x && falcon.x - o.x < 520 * k && Math.abs(o.y - falcon.y) < 70 * k);
      if (prey) {
        fire(falcon.x - 30 * k, falcon.y, Math.atan2(prey.y - falcon.y, prey.x - falcon.x), "rebel", 1, [[0, -2], [0, 2]]);
        falcon.cd = 0.35;
      }
    }
    if (falcon.x < -120 * k) {
      falcon = null;
      nextFalcon = time + rand(18, 32);
    }
  }

  function updateCapitals(dt) {
    for (const c of capitals) {
      if (c.dead) {
        c.respawn -= dt;
        if (c.respawn <= 0) {
          c.dead = false;
          c.fade = 0;
        }
      } else if (c.fade < 1) {
        c.fade = Math.min(1, c.fade + dt / 3);
      }
    }
    /* échanges de turbolasers entre gros vaisseaux */
    nextTurbo -= dt;
    if (nextTurbo <= 0) {
      nextTurbo = rand(0.25, 0.7);
      const alive = capitals.filter((c) => !c.dead && c.fade > 0.8);
      const from = alive[Math.floor(rand(0, alive.length))];
      const foes = alive.filter((c) => from && c.type !== from.type);
      const to = foes[Math.floor(rand(0, foes.length))];
      if (from && to) {
        const a = Math.atan2(to.y - from.y, to.x - from.x) + rand(-0.05, 0.05);
        const d = Math.hypot(to.x - from.x, to.y - from.y);
        const sp = 420 * k;
        bolts.push({ x: from.x, y: from.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: d / sp, team: from.type === "sd" ? "empire" : "rebel", s: 0.35, len: 9 * k, turbo: true });
      }
    }
    /* superlaser de l'Étoile de la Mort (vert) */
    if (!beam && time > nextBeam) {
      const target = capitals.find((c) => c.type === "mc" && !c.dead && c.fade >= 1);
      if (target) beam = { target, life: 1.6, hit: false };
      nextBeam = time + rand(22, 34);
    }
    if (beam) {
      beam.life -= dt;
      if (!beam.hit && beam.life < 0.9) {
        beam.hit = true;
        burst(beam.target.x, beam.target.y, beam.target.s * 1.6, true);
        beam.target.dead = true;
        beam.target.respawn = rand(12, 18);
      }
      if (beam.life <= 0) beam = null;
    }
  }

  function update(dt) {
    time += dt;
    ships.forEach((sh) => updateShip(sh, dt));
    updateFalcon(dt);
    updateCapitals(dt);

    for (const b of bolts) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      if (b.turbo || b.life <= 0) {
        if (b.turbo && b.life <= 0) spark(b.x, b.y, 0.4);
        continue;
      }
      for (const o of ships) {
        if (!o.alive || o.team === b.team || Math.abs(o.s - b.s) > 0.3) continue;
        if (Math.hypot(o.x - b.x, o.y - b.y) < 9 * SIZE * o.s * k) {
          b.life = 0;
          o.hp -= 1;
          spark(b.x, b.y, o.s);
          if (o.hp <= 0) {
            o.alive = false;
            o.respawn = rand(1.5, 3.5);
            burst(o.x, o.y, o.s, false);
          }
          break;
        }
      }
    }
    bolts = bolts.filter((b) => b.life > 0 && b.x > -50 && b.x < W + 50 && b.y > -50 && b.y < H + 50);

    for (const p of particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 1 - 1.6 * dt;
      p.vy *= 1 - 1.6 * dt;
      p.life -= dt;
      if (p.debris) p.rot += p.spin * dt;
    }
    particles = particles.filter((p) => p.life > 0);
    flashes.forEach((f) => (f.life -= dt));
    flashes = flashes.filter((f) => f.life > 0);
  }

  /* --- rendu --- */

  function drawBolt(b) {
    const col = LASER[b.team];
    const n = Math.hypot(b.vx, b.vy) || 1;
    const tx = b.x - (b.vx / n) * b.len;
    const ty = b.y - (b.vy / n) * b.len;
    ctx.strokeStyle = col.glow;
    ctx.lineWidth = (b.turbo ? 4 : 6) * k * b.s + 1.5;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.strokeStyle = col.core;
    ctx.lineWidth = Math.max(1.2, 2 * k * b.s);
    ctx.stroke();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    if (backdrop) ctx.drawImage(backdrop, 0, 0, W, H);

    for (const l of dsLights) {
      ctx.fillStyle = `rgba(255, 220, 160, ${0.35 + 0.6 * Math.abs(Math.sin(time * l.f + l.p))})`;
      ctx.fillRect(l.x, l.y, 1.4, 1.4);
    }

    for (const c of capitals) {
      if (c.dead) continue;
      ctx.save();
      ctx.globalAlpha = 0.75 * c.fade;
      ctx.translate(c.x + Math.sin(time * 0.2 + c.phase) * 6 * k, c.y + Math.cos(time * 0.17 + c.phase) * 3 * k);
      ctx.scale(c.s * k * 1.6, c.s * k * 1.6);
      if (c.type === "sd") drawStarDestroyer(ctx);
      else drawCruiser(ctx);
      ctx.restore();
    }

    if (beam) {
      const dx = ds.x - ds.r * 0.36;
      const dy = ds.y - ds.r * 0.34;
      const a = Math.min(1, beam.life * 2);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = `rgba(80, 255, 90, ${0.35 * a})`;
      ctx.lineWidth = 9 * k;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * TAU;
        ctx.moveTo(dx + Math.cos(ang) * ds.r * 0.22, dy + Math.sin(ang) * ds.r * 0.22);
        ctx.lineTo(dx - ds.r * 0.25, dy);
      }
      ctx.stroke();
      if (beam.life < 1.3) {
        ctx.beginPath();
        ctx.moveTo(dx - ds.r * 0.25, dy);
        ctx.lineTo(beam.target.x, beam.target.y);
        ctx.lineWidth = 10 * k;
        ctx.stroke();
        ctx.strokeStyle = `rgba(230, 255, 230, ${0.9 * a})`;
        ctx.lineWidth = 3 * k;
        ctx.stroke();
      }
      ctx.restore();
    }

    const order = ships.filter((s) => s.alive).sort((a, b) => a.s - b.s);
    for (const sh of order) {
      ctx.save();
      ctx.globalAlpha = 0.55 + sh.s * 0.45;
      ctx.translate(sh.x, sh.y);
      ctx.rotate(sh.a);
      ctx.scale(sh.s * k * SIZE, sh.s * k * SIZE);
      if (sh.team === "rebel") drawXwing(ctx, time);
      else drawTie(ctx);
      ctx.restore();
    }

    if (falcon && falconImg.complete) {
      const w = 78 * k;
      ctx.drawImage(falconImg, falcon.x - w / 2, falcon.y - w * 0.29, w, w * 0.58);
      ctx.fillStyle = `rgba(150, 210, 255, ${0.55 + 0.3 * Math.sin(time * 30)})`;
      ctx.fillRect(falcon.x + w * 0.38, falcon.y - w * 0.04, 3 * k, w * 0.12);
    }

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    bolts.forEach(drawBolt);
    for (const f of flashes) {
      const t = f.life / f.max;
      const r = f.r * (1.6 - t * 0.6);
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
      g.addColorStop(0, `rgba(255, 255, 240, ${t})`);
      g.addColorStop(0.35, `rgba(255, 190, 90, ${t * 0.8})`);
      g.addColorStop(1, "rgba(255, 80, 20, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(f.x, f.y, r, 0, TAU);
      ctx.fill();
    }
    for (const p of particles) {
      if (p.debris) continue;
      const t = p.life / p.max;
      ctx.fillStyle = `hsla(${20 + t * 35}, 100%, ${50 + t * 40}%, ${t})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.4 + t * 0.6), 0, TAU);
      ctx.fill();
    }
    ctx.restore();

    for (const p of particles) {
      if (!p.debris) continue;
      ctx.save();
      ctx.globalAlpha = Math.min(1, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = "#8d939c";
      ctx.fillRect(-p.size, -p.size * 0.35, p.size * 2, p.size * 0.7);
      ctx.restore();
    }
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (t - (last || t)) / 1000);
    last = t;
    if (!heroVisible || document.body.classList.contains("intro-open")) return;
    update(dt);
    render();
  }

  function start() {
    cancelAnimationFrame(raf);
    last = 0;
    if (reduceMotion) {
      /* image fixe : on simule quelques secondes de combat puis on fige */
      for (let i = 0; i < 150; i++) update(1 / 30);
      render();
    } else {
      raf = requestAnimationFrame(frame);
    }
  }

  function resize(force) {
    const r = hero.getBoundingClientRect();
    const w = Math.round(r.width);
    const h = Math.round(r.height);
    if (!force && w === W && h === H) return;
    const rebuildFleet = !ships.length || (w < 700) !== (W < 700);
    W = w;
    H = h;
    dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.25 : 1.5);
    k = Math.max(0.6, Math.min(1.15, W / 1300));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildBackdrop();
    if (rebuildFleet) buildFleet();
    buildCapitals();
    if (reduceMotion) render();
  }

  resize(true);
  start();
  motionQuery.addEventListener("change", start);

  return { resize };
})();

let resizeTimer = 0;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    battle.resize();
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
const MARQUEE_SPEED = 40; /* pixels par seconde */
let marqueesPaused = false;

/* fait défiler d'environ trois cartes, en bouclant sans à-coup */
function stepMarquee(m, dir) {
  const el = m.el;
  const w = m.group.offsetWidth;
  const amount = Math.min(el.clientWidth * 0.8, 760) * dir;
  if (m.loop) {
    if (dir > 0 && el.scrollLeft + amount > w * 1.5) el.scrollLeft -= w;
    if (dir < 0 && el.scrollLeft + amount < w * 0.2) el.scrollLeft += w;
  }
  m.hold = performance.now() + 3500;
  el.scrollBy({ left: amount, behavior: reduceMotion ? "auto" : "smooth" });
}

const marquees = Array.from(document.querySelectorAll(".marquee")).map((el) => {
  const group = el.querySelector(".marquee-group");
  const m = { el, group, reverse: el.classList.contains("marquee--reverse"), loop: !reduceMotion, pos: 0, hold: 0, hover: false };

  if (m.loop) {
    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    el.querySelector(".marquee-track").appendChild(clone);
    el.classList.add("is-looping");
  }

  const wrap = document.createElement("div");
  wrap.className = "marquee-wrap";
  el.parentNode.insertBefore(wrap, el);
  wrap.appendChild(el);
  const what = el.dataset.name || "la liste";
  [-1, 1].forEach((dir) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `marquee-arrow marquee-arrow--${dir < 0 ? "prev" : "next"}`;
    btn.setAttribute("aria-label", `${dir < 0 ? "Précédent" : "Suivant"} : ${what}`);
    btn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-arrow"/></svg>';
    btn.addEventListener("click", () => {
      sfx("blaster");
      stepMarquee(m, dir);
    });
    wrap.appendChild(btn);
  });

  el.addEventListener("pointerenter", () => (m.hover = true));
  el.addEventListener("pointerleave", () => (m.hover = false));
  el.addEventListener("focusin", () => (m.hover = true));
  el.addEventListener("focusout", () => (m.hover = false));
  /* défilement manuel (doigt, molette, clavier) : on suit la position puis on reprend */
  el.addEventListener("scroll", () => {
    if (Math.abs(el.scrollLeft - m.pos) > 2) {
      m.pos = el.scrollLeft;
      m.hold = performance.now() + 2500;
    }
  }, { passive: true });

  if (m.loop && m.reverse) {
    m.pos = group.offsetWidth;
    el.scrollLeft = m.pos;
  }
  return m;
});

let lastMarqueeTick = 0;
function tickMarquees(t) {
  requestAnimationFrame(tickMarquees);
  const dt = Math.min(0.05, (t - (lastMarqueeTick || t)) / 1000);
  lastMarqueeTick = t;
  if (marqueesPaused || (galaxy && galaxy.classList.contains("is-offscreen")) || document.body.classList.contains("intro-open")) return;
  for (const m of marquees) {
    if (!m.loop || m.hover || t < m.hold) continue;
    const w = m.group.offsetWidth;
    m.pos += (m.reverse ? -1 : 1) * MARQUEE_SPEED * dt;
    if (m.pos >= w) m.pos -= w;
    if (m.pos < 0) m.pos += w;
    m.el.scrollLeft = m.pos;
  }
}

if (!reduceMotion) requestAnimationFrame(tickMarquees);
else if (marqueeToggle) marqueeToggle.hidden = true;

if (marqueeToggle) {
  marqueeToggle.addEventListener("click", () => {
    marqueesPaused = !marqueesPaused;
    marqueeToggle.setAttribute("aria-pressed", String(marqueesPaused));
    marqueeToggle.querySelector("span").textContent = marqueesPaused ? "Reprendre le défilement" : "Mettre en pause";
    marqueeToggle.querySelector("use").setAttribute("href", marqueesPaused ? "#i-play" : "#i-pause");
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
let introOpenedAt = 0;

/* Musique officielle : « Main Title » (John Williams, London Symphony Orchestra),
   mise à disposition sur YouTube par Universal Music Group. Le lecteur n'est chargé
   qu'au clic sur « Lancer le générique » ; si YouTube ne répond pas, on joue la
   version synthétisée ci-dessous. */
const YT_VIDEO = "HJSHkFf6ZRc";
const LOGO_TIME = 5; /* le logo apparaît 5 s après l'ouverture (.intro-logo dans le CSS) */
const introPlayer = document.getElementById("intro-player");
const introMusicNote = document.getElementById("intro-music-note");
let ytApi = null;
let ytPlayer = null;
let ytLive = false;
let ytFallback = 0;

function sizeCrawl() {
  const inner = crawl.querySelector(".crawl-inner");
  const dist = Math.max(1700, Math.round(inner.offsetHeight + window.innerHeight * 1.3));
  const dur = Math.min(36, Math.max(20, Math.round(dist / 90)));
  crawl.style.setProperty("--crawl-dist", `-${dist}px`);
  crawl.style.setProperty("--crawl-dur", `${dur}s`);
  return dur;
}

function playSynthMusic() {
  const ctx = getAudio();
  if (!ctx) return;
  musicBus = ctx.createGain();
  musicBus.gain.value = musicMuted ? 0 : 0.3;
  musicBus.connect(ctx.destination);
  /* calé sur l'ouverture du générique, même si on bascule en cours de route */
  const t0 = ctx.currentTime + 0.3 - (performance.now() - introOpenedAt) / 1000;

  const voice = (freq, start, dur, peak, type, cutoff) => {
    if (start < ctx.currentTime) return;
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

function loadYouTubeApi() {
  if (!ytApi) {
    ytApi = new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) {
        resolve(window.YT);
        return;
      }
      window.onYouTubeIframeAPIReady = () => resolve(window.YT);
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.onerror = () => {
        ytApi = null;
        reject(new Error("YouTube indisponible"));
      };
      document.head.appendChild(script);
    });
  }
  return ytApi;
}

function resetPlayerSlot() {
  const slot = introPlayer.querySelector(".intro-player-slot");
  slot.innerHTML = '<div id="intro-player-frame"></div>';
}

function playMusic() {
  let ready = false;
  let synth = false;
  /* repli sur la musique synthétisée (YouTube lent, bloqué ou en erreur) */
  const fallback = () => {
    if (synth || !introOpen) return;
    synth = true;
    clearTimeout(ytFallback);
    if (ytPlayer) {
      try {
        ytPlayer.destroy();
      } catch (err) {
        /* lecteur déjà fermé */
      }
      ytPlayer = null;
      resetPlayerSlot();
    }
    ytLive = false;
    introPlayer.hidden = true;
    playSynthMusic();
  };

  /* YouTube refuse la lecture quand la page est ouverte en fichier local
     (erreur 153 « Erreur de configuration ») : la vraie musique n'est
     disponible que sur le site en ligne. */
  if (location.protocol === "file:") {
    introMusicNote.hidden = false;
    fallback();
    return;
  }

  ytFallback = setTimeout(() => {
    if (!ready) fallback();
  }, 9000);
  introPlayer.hidden = false;

  loadYouTubeApi()
    .then((YT) => {
      if (synth || !introOpen) return;
      ytPlayer = new YT.Player("intro-player-frame", {
        host: "https://www.youtube-nocookie.com",
        videoId: YT_VIDEO,
        width: 200,
        height: 200,
        playerVars: { controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, playsinline: 1, rel: 0 },
        events: {
          onReady: (e) => {
            if (synth || !introOpen) return;
            ready = true;
            clearTimeout(ytFallback);
            /* préchargement silencieux, puis la musique démarre avec le logo */
            e.target.mute();
            e.target.playVideo();
            const wait = Math.max(0, LOGO_TIME * 1000 - (performance.now() - introOpenedAt));
            introTimers.push(setTimeout(() => {
              if (!ytPlayer) return;
              ytLive = true;
              ytPlayer.seekTo(0, true);
              ytPlayer.setVolume(85);
              if (!musicMuted) ytPlayer.unMute();
              ytPlayer.playVideo();
              /* si la lecture n'a toujours pas démarré 4 s plus tard, version synthétisée */
              introTimers.push(setTimeout(() => {
                const state = ytPlayer && ytPlayer.getPlayerState ? ytPlayer.getPlayerState() : -1;
                if (ytPlayer && state !== 1 && state !== 3) fallback();
              }, 4000));
            }, wait));
          },
          onError: fallback,
        },
      });
    })
    .catch(fallback);
}

function stopMusic() {
  clearTimeout(ytFallback);
  ytLive = false;
  if (ytPlayer) {
    const player = ytPlayer;
    ytPlayer = null;
    let volume = 85;
    const fade = setInterval(() => {
      volume -= 14;
      try {
        player.setVolume(Math.max(0, volume));
      } catch (err) {
        /* lecteur déjà fermé */
      }
      if (volume <= 0) {
        clearInterval(fade);
        try {
          player.destroy();
        } catch (err) {
          /* rien à détruire */
        }
        if (!ytPlayer) resetPlayerSlot();
      }
    }, 60);
  }
  if (introPlayer) introPlayer.hidden = true;
  if (introMusicNote) introMusicNote.hidden = true;
  stopSynthMusic();
}

function stopSynthMusic() {
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
  introOpenedAt = performance.now();
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
  /* préchargement du lecteur YouTube dès que l'on s'apprête à cliquer */
  const prefetchYouTube = () => {
    if (location.protocol !== "file:" && !reduceMotion) loadYouTubeApi().catch(() => {});
  };
  btnIntro.addEventListener("pointerenter", prefetchYouTube, { once: true });
  btnIntro.addEventListener("focus", prefetchYouTube, { once: true });
  btnIntro.addEventListener("touchstart", prefetchYouTube, { once: true, passive: true });
  introClose.addEventListener("click", closeIntro);

  introMute.addEventListener("click", () => {
    musicMuted = !musicMuted;
    introMute.setAttribute("aria-pressed", String(musicMuted));
    introMute.textContent = musicMuted ? "Activer la musique" : "Couper la musique";
    if (musicBus && audioCtx) musicBus.gain.setTargetAtTime(musicMuted ? 0 : 0.3, audioCtx.currentTime, 0.05);
    if (ytPlayer && ytLive) {
      if (musicMuted) ytPlayer.mute();
      else ytPlayer.unMute();
    }
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

onScroll();
