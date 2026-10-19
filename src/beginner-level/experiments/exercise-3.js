/**
 * ┌──────────────────────────────────────────────────────────┐
 * │              CUENTA REGRESIVA DE LANZAMIENTO             │
 * └──────────────────────────────────────────────────────────┘
 *
 * Descripción:
 *   Realiza una cuenta regresiva en consola para simular
 *   el lanzamiento de un proyecto.
 *
 * Instrucciones:
 *   1. Solicitar al usuario un número entero N.
 *
 *   2. Validar el número ingresado:
 *      • Si N es menor o igual a 0, mostrar:
 *        "Número no válido".
 *
 *   3. Si el número es válido:
 *      • Mostrar los números desde N hasta 1.
 *      • Imprimir cada número en una línea diferente.
 *
 *   4. Al finalizar la cuenta regresiva, mostrar:
 *      "¡Despegue!".
 *
 */

/* ════════════════════════════════════════════════════════════════
   EXPERIMENTO · CONTROL DE LANZAMIENTO
   Versión interactiva (TUI) de la cuenta regresiva del ejercicio 3:
   un centro de control con cohete ASCII animado, partículas
   y fases (espera → cuenta regresiva → despegue → órbita).

   Teclas:  R = reiniciar   Q / Esc / Ctrl+C = salir
   ════════════════════════════════════════════════════════════════ */

// @ts-nocheck  ·  Archivo de experimento en JS puro: omitimos el chequeo
// estricto de tipos, pero conservamos el autocompletado de neo-blessed.

import blessed from "neo-blessed";

// ═══════════════════════════ 1 · Constantes ═══════════════════════════

// Paleta de colores de la interfaz
const PALETTE = {
  panel: "#0b1226",
  border: "#2b3a63",
  accent: "#4cc9f0",
  text: "#e6edf7",
  dim: "#7d8ab3",
  ok: "#5ee6a8",
  warn: "#ffd166",
  danger: "#ff5d73",
};

// Fuente ASCII grande (5 filas por carácter)
const BIG_FONT = {
  0: ["█████", "█   █", "█   █", "█   █", "█████"],
  1: [" ██  ", "  █  ", "  █  ", "  █  ", "█████"],
  2: ["█████", "    █", "█████", "█    ", "█████"],
  3: ["█████", "    █", "█████", "    █", "█████"],
  4: ["█   █", "█   █", "█████", "    █", "    █"],
  5: ["█████", "█    ", "█████", "    █", "█████"],
  6: ["█████", "█    ", "█████", "█   █", "█████"],
  7: ["█████", "    █", "   █ ", "  █  ", "  █  "],
  8: ["█████", "█   █", "█████", "█   █", "█████"],
  9: ["█████", "█   █", "█████", "    █", "█████"],
  "-": ["     ", "     ", "█████", "     ", "     "],
  " ": ["   ", "   ", "   ", "   ", "   "],
  D: ["████ ", "█   █", "█   █", "█   █", "████ "],
  E: ["█████", "█    ", "████ ", "█    ", "█████"],
  S: ["█████", "█    ", "█████", "    █", "█████"],
  P: ["█████", "█   █", "█████", "█    ", "█    "],
  G: ["█████", "█    ", "█  ██", "█   █", "█████"],
  U: ["█   █", "█   █", "█   █", "█   █", "█████"],
};

// Sprite del cohete: cada fila tiene [forma, colores]
// R=rojo W=blanco G=gris sombra D=oscuro C=cian ventana
const ROCKET_SPRITE = [
  ["     ▄     ", "     R     "],
  ["    ▟█▙    ", "    RRR    "],
  ["   █████   ", "   RRRRR   "],
  ["   █████   ", "   WWWGG   "],
  ["   ██●██   ", "   WWCGG   "],
  ["   █████   ", "   WWWGG   "],
  ["   █████   ", "   RRRRR   "],
  ["   █████   ", "   WWWGG   "],
  ["   █████   ", "   WWWGG   "],
  ["  ▐█████▌  ", "  RWWWGGR  "],
  [" ▟▌█████▐▙ ", " RRWWWGGRR "],
  ["▟█▘█████▝█▙", "RRRWWWGGRRR"],
  ["▀▘ ▀▀▀▀▀ ▝▀", "RR DDDDD RR"],
  ["    ▀▀▀    ", "    DDD    "],
];
const SPRITE_COLORS = { R: "#e5383b", W: "#f1f5f9", G: "#8d99ae", D: "#4a5568", C: "#4cc9f0" };

// Medidas y límites del escenario
const ROCKET_HEIGHT = ROCKET_SPRITE.length; // alto del cohete
const GROUND_HEIGHT = 2; // filas de suelo
const MAX_PARTICLES = 450; // partículas a la vez en pantalla

// Ajustes de animación y física
const PARALLAX_SPEEDS = [0.04, 0.09, 0.17]; // velocidad por capa de estrellas
const BOOST_DURATION = 11; // duración del empuje (segundos)

// ═══════════════════════════ 2 · Estado ═══════════════════════════

// Rejilla de caracteres y colores del escenario
let stageWidth = 0;
let stageHeight = 0;
let characterGrid = [];
let colorGrid = [];

// Estado general de la misión
const state = {
  phase: "idle", // idle | countdown | flight
  initialCount: 10,
  startedAt: 0,
  lastFrameAt: Date.now(),
  particles: [],
  stars: [],
  starsWidth: 0,
  starsHeight: 0,
  groundY: 0,
};

// ═══════════════════════ 3 · Funciones auxiliares ═══════════════════════

// Mantiene un valor dentro de un rango
function clamp(value, minimum = 0, maximum = 1) {
  return Math.max(minimum, Math.min(maximum, value));
}

// Número aleatorio entre dos valores
function randomBetween(minimum, maximum) {
  return minimum + Math.random() * (maximum - minimum);
}

// Convierte "#rrggbb" a [r, g, b]
function hexToRgb(hex) {
  return [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
}

// Convierte [r, g, b] a "#rrggbb"
function rgbToHex(rgb) {
  return "#" + rgb.map((channel) => Math.round(clamp(channel, 0, 255)).toString(16).padStart(2, "0")).join("");
}

// Mezcla dos colores (amount 0 = colorA, 1 = colorB)
function mixColors(colorA, colorB, amount) {
  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);
  return rgbToHex(rgbA.map((channel, index) => channel + (rgbB[index] - channel) * amount));
}

// Toma un color de una lista según un punto entre 0 y 1
function colorFromGradient(colors, amount) {
  const position = clamp(amount) * (colors.length - 1);
  const index = Math.min(colors.length - 2, Math.floor(position));
  return mixColors(colors[index], colors[index + 1], position - index);
}

// Envuelve texto con etiquetas de color de blessed
function paint(color, text) {
  return `{${color}-fg}${text}{/}`;
}

// Convierte segundos a formato mm:ss
function formatClock(seconds) {
  const total = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

// Devuelve 5 filas de texto grande; las filas aún no reveladas se ven como "ruido"
function buildBigText(text, revealedRows = 5) {
  const glyphs = [...String(text)].map((character) => BIG_FONT[character] || BIG_FONT[" "]);
  return Array.from({ length: 5 }, (_, rowIndex) => {
    const row = glyphs.map((glyph) => glyph[rowIndex]).join(" ");
    if (rowIndex < revealedRows) return row;
    return [...row].map((character) => (character === "█" ? (Math.random() < 0.5 ? "░" : " ") : character)).join("");
  });
}

// Altura del cohete según el tiempo de vuelo
function altitudeAt(time) {
  return time <= 0 ? 0 : time <= BOOST_DURATION ? 0.6 * time ** 2.2 : 0.6 * BOOST_DURATION ** 2.2 + 0.6 * 2.2 * BOOST_DURATION ** 1.2 * (time - BOOST_DURATION);
}

// Velocidad del cohete según el tiempo de vuelo
function speedAt(time) {
  return time <= 0 ? 0 : 0.6 * 2.2 * Math.min(time, BOOST_DURATION) ** 1.2;
}

// ═══════════════════════════ 4 · Funciones de lógica ═══════════════════════════

// Crea las estrellas del fondo
function createStars() {
  state.starsWidth = stageWidth;
  state.starsHeight = stageHeight;
  state.stars = [];
  const starCount = Math.floor((stageWidth * stageHeight) / 16);

  for (let index = 0; index < starCount; index++) {
    const roll = Math.random();
    state.stars.push({
      x: Math.floor(Math.random() * stageWidth),
      y: Math.random() * stageHeight,
      depth: roll < 0.55 ? 0 : roll < 0.85 ? 1 : 2,
      twinkleOffset: Math.random() * 6.28,
    });
  }
}

// Agrega una partícula, respetando el límite
function spawnParticle(particle) {
  if (state.particles.length < MAX_PARTICLES) state.particles.push({ ...particle, maxLife: particle.life });
}

// Mueve las partículas y elimina las que ya expiraron
function updateParticles(deltaTime) {
  for (const particle of state.particles) {
    particle.life -= deltaTime;
    particle.x += particle.velocityX * deltaTime;
    particle.worldY += particle.velocityY * deltaTime;
    particle.velocityX *= 1 - 1.1 * deltaTime;
    if (particle.type === "steam") particle.velocityY *= 1 - 0.5 * deltaTime;
  }

  state.particles = state.particles.filter(
    (particle) => particle.life > 0 && state.groundY - particle.worldY < state.starsHeight + 4,
  );
}

// Abre el modal para pedir el número inicial
function openSetupDialog() {
  dialogError.setContent("");
  countdownInput.clearValue();
  setupDialog.show();
  countdownInput.focus();
  screen.render();
}

// Inicia la cuenta regresiva con el número elegido
function startCountdown(initialCount) {
  state.initialCount = initialCount;
  state.phase = "countdown";
  state.startedAt = Date.now();
  state.particles = [];
  setupDialog.hide();
  screen.render();
}

// Vuelve a la pantalla de espera
function returnToSetup() {
  state.phase = "idle";
  state.particles = [];
  openSetupDialog();
}

// ═══════════════ 5 · Funciones de lógica de renderizado ═══════════════

// Vacía la rejilla del escenario
function resetGrids() {
  characterGrid = Array.from({ length: stageHeight }, () => Array(stageWidth).fill(" "));
  colorGrid = Array.from({ length: stageHeight }, () => Array(stageWidth).fill(null));
}

// Escribe un carácter en la rejilla (ignora lo que se salga)
function setCell(x, y, character, color) {
  const column = Math.round(x);
  const row = Math.round(y);
  if (column < 0 || column >= stageWidth || row < 0 || row >= stageHeight || character === " ") return;

  characterGrid[row][column] = character;
  colorGrid[row][column] = color;
}

// Escribe un texto completo en la rejilla
function drawText(x, y, text, color) {
  const characters = [...String(text)];

  for (let offset = 0; offset < characters.length; offset++) {
    setCell(x + offset, y, characters[offset], color);
  }
}

// Convierte la rejilla en texto con colores para blessed
function renderGrid(backgroundColors) {
  const lines = [];

  for (let row = 0; row < stageHeight; row++) {
    let line = `{${backgroundColors[row]}-bg}`;
    let currentColor = null;

    for (let column = 0; column < stageWidth; column++) {
      const character = characterGrid[row][column];

      if (character !== " " && colorGrid[row][column] !== currentColor) {
        currentColor = colorGrid[row][column];
        line += `{${currentColor}-fg}`;
      }

      line += character;
    }

    lines.push(line + "{/}");
  }

  return lines.join("\n");
}

// Dibuja las partículas
function drawParticles(groundY) {
  for (const particle of state.particles) {
    const age = 1 - particle.life / particle.maxLife;
    const row = groundY - particle.worldY;

    if (particle.type === "spark") {
      setCell(particle.x, row, Math.random() < 0.5 ? "·" : "*", colorFromGradient(["#fff1a8", "#ff8a00", "#7a1f10"], age));
      continue;
    }

    const character = age < 0.35 ? "▓" : age < 0.7 ? "▒" : "░";
    const color =
      particle.type === "exhaust"
        ? colorFromGradient(["#ffe2a0", "#d9d9d9", "#7f8798", "#3a4152"], age)
        : colorFromGradient(["#eef3fb", "#aab3c5", "#4a5266"], age);

    setCell(particle.x, row, character, color);
  }
}

// Dibuja la llama del motor
function drawExhaustFlame(centerX, nozzleRow, throttle, groundY, inVacuum) {
  if (throttle <= 0.02) return;

  const flameLength = Math.round((2 + throttle * 8 + (inVacuum ? 4 : 0)) * randomBetween(0.85, 1.15));

  for (let step = 0; step < flameLength; step++) {
    const row = Math.round(nozzleRow + step);
    if (row >= groundY) break; // la llama no atraviesa el suelo
    const progress = step / flameLength;
    const width = (0.9 + 1.6 * throttle * Math.sin(Math.PI * Math.min(1, progress * 1.2 + 0.15))) * (1 - progress) ** 1.15;
    const halfWidth = Math.round(width * randomBetween(0.85, 1.1));
    const color = colorFromGradient(["#ffffff", "#fff1a8", "#ffc233", "#ff8a00", "#e8431a", "#7a1f10"], progress + randomBetween(-0.05, 0.05));
    const jitter = Math.round(randomBetween(-0.6, 0.6) * progress);

    for (let offsetX = -halfWidth; offsetX <= halfWidth; offsetX++) {
      const isEdge = Math.abs(offsetX) === halfWidth && halfWidth > 0;
      const character =
        progress < 0.25 ? "█" : progress < 0.5 ? (isEdge ? "▓" : "█") : progress < 0.75 ? (isEdge ? "▒" : "▓") : isEdge ? "░" : "▒";

      setCell(centerX + offsetX + jitter, row, character, color);
    }
  }
}

// Dibuja un frame completo: escenario, contador, header y footer
function renderFrame() {
  const now = Date.now();
  const deltaTime = Math.min(0.1, (now - state.lastFrameAt) / 1000);
  state.lastFrameAt = now;

  stageWidth = sceneView.width - 2;
  stageHeight = sceneView.height - 2;

  if (stageWidth < 40 || stageHeight < 16) {
    sceneView.setContent("\n  Agranda la terminal (mínimo 80x24)");
    screen.render();
    return;
  }

  if (state.starsWidth !== stageWidth || state.starsHeight !== stageHeight) createStars();
  resetGrids();

  // ── Fase y tiempos ──
  let elapsed = 0;
  let remaining = 0;
  let flightTime = 0;
  let throttle = 0;
  let altitude = 0;
  let speed = 0;

  if (state.phase !== "idle") {
    elapsed = (now - state.startedAt) / 1000;
    if (state.phase === "countdown" && elapsed >= state.initialCount) state.phase = "flight";
  }

  if (state.phase === "countdown") {
    remaining = state.initialCount - elapsed;
    throttle = clamp((4 - remaining) / 4) * 0.55;
  } else if (state.phase === "flight") {
    flightTime = elapsed - state.initialCount;
    throttle = Math.min(1, 0.55 + flightTime * 1.5);
    altitude = altitudeAt(flightTime);
    speed = speedAt(flightTime);
  }

  // ── Geometría ──
  const baseGroundY = stageHeight - GROUND_HEIGHT;
  const topMargin = Math.max(3, Math.floor(stageHeight * 0.26));
  const maxRise = Math.max(0, baseGroundY - ROCKET_HEIGHT - topMargin);
  const cameraOffset = Math.max(0, altitude - maxRise);
  const groundY = baseGroundY + cameraOffset; // fila de la superficie del suelo en pantalla
  state.groundY = groundY;
  const centerX = Math.floor(stageWidth / 2);
  const nozzleRow = groundY - altitude; // fila justo bajo la tobera

  // ── Cielo (gradiente por fila) ──
  const spaceProgress = clamp(altitude / 75);
  const engineGlow = clamp(throttle) * clamp(1 - altitude / 12);
  const skyColors = [];

  for (let row = 0; row < stageHeight; row++) {
    if (row >= groundY) {
      skyColors.push("#0d121f");
      continue;
    }

    const rowRatio = clamp(row / Math.max(1, groundY));
    let color = mixColors("#050a1a", "#27497c", rowRatio ** 1.8);
    color = mixColors(color, "#02030a", spaceProgress);
    if (engineGlow > 0) color = mixColors(color, "#c2531b", engineGlow * clamp(1 - (groundY - row) / 9) * 0.45);
    skyColors.push(color);
  }

  // ── Estrellas con parallax ──
  for (const star of state.stars) {
    const screenY = (((star.y + altitude * PARALLAX_SPEEDS[star.depth]) % stageHeight) + stageHeight) % stageHeight;
    const twinkle = 0.6 + 0.4 * Math.sin(now / 400 * (1 + star.depth * 0.5) + star.twinkleOffset);
    const streaking = speed * PARALLAX_SPEEDS[star.depth] > 1.6;

    if (star.depth === 0) setCell(star.x, screenY, streaking ? "│" : ".", mixColors("#05070f", "#6a7599", twinkle * 0.7));
    else if (star.depth === 1) setCell(star.x, screenY, streaking ? "│" : "·", mixColors("#05070f", "#9aa6cf", twinkle));
    else setCell(star.x, screenY, streaking ? "┃" : twinkle > 0.8 ? "+" : "*", mixColors("#05070f", "#eef2ff", twinkle));
  }

  // ── Colinas, suelo y plataforma ──
  for (let column = 0; column < stageWidth; column++) {
    const hillHeight = Math.round(1.6 + Math.sin(column * 0.11 + 1) * 1.1 + Math.sin(column * 0.27) * 0.7);

    for (let step = 1; step <= hillHeight; step++) setCell(column, groundY - step, "█", "#0c1428");
  }

  const padLeft = centerX - 10;
  const padRight = centerX + 10;

  for (let column = 0; column < stageWidth; column++) {
    const onPad = column >= padLeft && column <= padRight;
    setCell(column, groundY, onPad ? "█" : "▀", onPad ? "#59647a" : "#2a3347");
    setCell(column, groundY + 1, "▒", "#222a3b");
  }

  // ── Torre de lanzamiento ──
  const towerColumn = centerX - 12;
  const towerHeight = ROCKET_HEIGHT - 1;

  for (let step = 0; step < towerHeight; step++) {
    setCell(towerColumn, groundY - 1 - step, step % 2 ? "║" : "╠", "#5f6b82");
    setCell(towerColumn + 1, groundY - 1 - step, step % 2 ? " " : "═", "#5f6b82");
    setCell(towerColumn + 2, groundY - 1 - step, step % 2 ? "║" : "╣", "#5f6b82");
  }

  setCell(towerColumn + 1, groundY - 1 - towerHeight, Math.floor(now / 500) % 2 ? "●" : "○", PALETTE.danger);

  if (state.phase !== "flight" || flightTime < 0.3) {
    const armLength = state.phase === "idle" ? 4 : clamp(Math.round(((remaining - 3) / 0.5) * 4), 0, 4);

    for (let step = 0; step < armLength; step++) {
      setCell(towerColumn + 3 + step, nozzleRow - 10, "═", "#8a96aa");
      setCell(towerColumn + 3 + step, nozzleRow - 5, "═", "#8a96aa");
    }
  }

  // ── Partículas: vapor, humo, chispas ──
  if (state.phase !== "flight" && Math.random() < 0.15) {
    const side = Math.random() < 0.5 ? -1 : 1; // venteo de oxígeno líquido
    spawnParticle({ type: "steam", x: centerX + side * 5, worldY: randomBetween(3, 10), velocityX: side * randomBetween(1, 3), velocityY: randomBetween(0.3, 1), life: randomBetween(1.2, 2) });
  }

  const blast = clamp(1 - altitude / 10);

  if (throttle > 0.1 && altitude < 10 && Math.random() < 0.3 + throttle * 0.7) {
    for (const side of [-1, 1]) {
      spawnParticle({
        type: "steam", x: centerX + side * randomBetween(2, 5), worldY: randomBetween(0.5, 1.8),
        velocityX: side * randomBetween(3, 11) * (0.5 + throttle) * (0.6 + blast), velocityY: randomBetween(0.2, 1.4),
        life: randomBetween(1.6, 3.4),
      });
    }
  }

  if (state.phase === "flight" && altitude > 1 && throttle > 0.3) {
    for (let index = 0; index < 3; index++) {
      spawnParticle({ type: "exhaust", x: centerX + randomBetween(-2, 2), worldY: altitude - randomBetween(5, 13), velocityX: randomBetween(-3, 3), velocityY: -randomBetween(0.5, 2.5), life: randomBetween(1.2, 2.8) });
    }

    if (Math.random() < 0.5) {
      spawnParticle({ type: "spark", x: centerX + randomBetween(-2, 2), worldY: altitude - randomBetween(2, 6), velocityX: randomBetween(-4, 4), velocityY: -randomBetween(2, 6), life: randomBetween(0.5, 1) });
    }
  }

  updateParticles(deltaTime);
  drawParticles(groundY);

  // ── Cohete (con vibración del motor) ──
  const shake = throttle * (altitude < 3 ? 1 : 0.4);
  const jitterX = Math.random() < shake * 0.55 ? (Math.random() < 0.5 ? -1 : 1) : 0;
  const rocketX = centerX - 5 + jitterX;
  const rocketTop = Math.round(nozzleRow) - ROCKET_HEIGHT;

  ROCKET_SPRITE.forEach(([shape, colors], rowIndex) => {
    [...shape].forEach((character, columnIndex) => {
      if (character !== " " && colors[columnIndex] !== " ") setCell(rocketX + columnIndex, rocketTop + rowIndex, character, SPRITE_COLORS[colors[columnIndex]]);
    });
  });

  // ── Llama y reflejo en la plataforma ──
  drawExhaustFlame(centerX + jitterX, Math.round(nozzleRow), throttle, groundY, altitude > 60);

  if (altitude < 5 && throttle > 0.2) {
    const reflectionWidth = Math.round(throttle * (9 - altitude) * randomBetween(0.8, 1.1));

    for (let offsetX = -reflectionWidth; offsetX <= reflectionWidth; offsetX++) {
      const distance = Math.abs(offsetX) / Math.max(1, reflectionWidth);
      const color = colorFromGradient(["#fff1a8", "#ff8a00", "#e8431a", "#7a1f10"], distance);
      setCell(centerX + offsetX, groundY, distance < 0.5 ? "▀" : "▄", color);

      if (Math.abs(offsetX) < reflectionWidth * 0.6) setCell(centerX + offsetX, groundY - 1, "▄", color);
    }
  }

  // ── Mensaje de DESPEGUE ──
  const centerOffset = (text) => Math.floor((stageWidth - [...String(text)].length) / 2);

  if (state.phase === "flight" && flightTime < 3.6) {
    const bannerRows = buildBigText("DESPEGUE", 5);
    const bannerWidth = bannerRows[0].length;

    if (bannerWidth <= stageWidth - 2) {
      const bannerX = Math.floor((stageWidth - bannerWidth) / 2);
      const reveal = clamp(flightTime / 0.5);
      const fade = clamp((flightTime - 2.4) / 1.2);

      bannerRows.forEach((bannerRow, rowIndex) => {
        const color = colorFromGradient(["#e8ffd1", "#b6ff6b", "#5ee6a8", "#22c55e", "#166534"], rowIndex / 4 + 0.15 * Math.sin(now / 90 + rowIndex));

        [...bannerRow].forEach((character, columnIndex) => {
          if (character === " " || columnIndex / bannerWidth > reveal || Math.random() < fade) return;
          setCell(bannerX + columnIndex, 2 + rowIndex, character, color);
        });
      });
    } else {
      const message = "¡ D E S P E G U E !";
      drawText(centerOffset(message), 2, message, PALETTE.ok);
    }
  }

  // ───────── Contador grande (esquina superior derecha) ─────────
  const counterWidth = 26;
  const counterX = stageWidth - counterWidth;
  const centerInCounter = (text) => Math.max(0, Math.floor((counterWidth - text.length) / 2));
  let counterValue = "--";
  let counterColor = "#7dd3fc";
  let counterSubtitle = "ESPERANDO ORDEN";
  let secondFraction = 1;

  if (state.phase === "countdown") {
    const wholeSeconds = Math.floor(elapsed);
    secondFraction = elapsed - wholeSeconds;
    const value = state.initialCount - wholeSeconds;
    counterValue = String(value);
    counterColor = value <= 3 ? "#ff5d8f" : value <= 10 ? "#ffd166" : "#7dd3fc";

    const filledSlots = Math.floor((1 - secondFraction) * 16);
    counterSubtitle = "▰".repeat(filledSlots) + "▱".repeat(16 - filledSlots);

    if (value <= 3) counterColor = mixColors(counterColor, "#000000", clamp((secondFraction - 0.55) / 0.45) * 0.55); // latido
  } else if (state.phase === "flight") {
    const wholeSeconds = Math.floor(flightTime);
    secondFraction = flightTime - wholeSeconds;
    counterValue = String(wholeSeconds);
    counterColor = "#7dffb0";
    counterSubtitle = "MOTORES NOMINALES";
  }

  const revealedRows = state.phase === "idle" ? 5 : clamp(Math.floor(secondFraction / 0.07) + 1, 1, 5);
  const isFlashing = state.phase !== "idle" && secondFraction < 0.1;
  const digitRows = buildBigText(counterValue, revealedRows);

  digitRows.forEach((digitRow, rowIndex) => {
    const color = isFlashing ? "#ffffff" : mixColors(counterColor, "#ffffff", 0.55 - rowIndex * 0.1);
    drawText(counterX + centerInCounter(digitRow), 1 + rowIndex, digitRow, color);
  });

  drawText(counterX + centerInCounter(counterSubtitle), 7, counterSubtitle, counterColor);

  // ───────── Guía inferior (esquina inferior derecha, sin fondo) ─────────
  const hints = "[R] Reiniciar  [Q] Salir";
  const progressRatio = state.phase === "countdown" ? clamp(elapsed / state.initialCount) : state.phase === "flight" ? 1 : 0;
  const clockText = state.phase === "idle" ? "--:--" : state.phase === "countdown" ? formatClock(remaining) : formatClock(flightTime);
  const progressBarWidth = 16;
  const filledSlots = Math.round(progressRatio * progressBarWidth);
  const progressColor = state.phase === "flight" ? PALETTE.ok : remaining <= 4 && state.phase === "countdown" ? PALETTE.danger : PALETTE.accent;
  const guideParts = [
    { text: `${clockText}  `, color: PALETTE.text },
    { text: "█".repeat(filledSlots), color: progressColor },
    { text: "░".repeat(progressBarWidth - filledSlots), color: PALETTE.border },
    { text: ` ${String(Math.round(progressRatio * 100)).padStart(3)}%`, color: PALETTE.dim },
  ];

  if (stageWidth > 70) guideParts.push({ text: `   ${hints}`, color: PALETTE.dim });

  const guideY = stageHeight - 1;
  let guideX = stageWidth - guideParts.reduce((total, part) => total + part.text.length, 0);

  for (const part of guideParts) {
    drawText(guideX, guideY, part.text, part.color);
    guideX += part.text.length;
  }

  sceneView.setContent(renderGrid(skyColors));

  screen.render();
}

// ══════════════════ 6 · Renderizado e inicio ══════════════════

const screen = blessed.screen({ smartCSR: true, title: "Control de Lanzamiento" });

// Cierra la aplicación
function exitApp() {
  screen.destroy();
  process.exit(0);
}

screen.key(["escape", "q", "C-c"], exitApp);

// Crea una caja con el estilo base del panel
function createPanel(options) {
  return blessed.box({
    parent: screen,
    tags: true,
    wrap: false,
    border: { type: "line" },
    style: { bg: PALETTE.panel, fg: PALETTE.text, border: { fg: PALETTE.border } },
    ...options,
  });
}

// Distribución de la pantalla
const sceneView = createPanel({
  top: 0, left: 0, width: "100%", height: "100%",
  style: { bg: "#02030a", border: { fg: PALETTE.border } },
});

// Modal de entrada del número inicial
const setupDialog = blessed.box({
  parent: screen, top: "center", left: "center", width: 56, height: 13,
  tags: true, label: " NUEVA MISIÓN ",
  border: { type: "line" },
  style: { bg: PALETTE.panel, fg: PALETTE.text, border: { fg: PALETTE.accent } },
});

blessed.box({
  parent: setupDialog, top: 1, left: 1, right: 1, height: 1, tags: true, align: "center",
  content: `{bold}Ingresa el número inicial de la cuenta regresiva{/bold}`,
  style: { bg: PALETTE.panel, fg: PALETTE.text },
});

blessed.box({
  parent: setupDialog, top: 2, left: 1, right: 1, height: 1, tags: true, align: "center",
  content: paint(PALETTE.dim, "entero mayor que 0  ·  Enter vacío = 10"),
  style: { bg: PALETTE.panel },
});

const countdownInput = blessed.textbox({
  parent: setupDialog, top: 4, left: 6, right: 6, height: 3,
  inputOnFocus: true, keys: true,
  border: { type: "line" },
  style: {
    bg: "#121c3a", fg: "#ffffff",
    border: { fg: PALETTE.border },
    focus: { border: { fg: PALETTE.accent } },
  },
});

const dialogError = blessed.box({
  parent: setupDialog, top: 8, left: 1, right: 1, height: 1, tags: true, align: "center",
  style: { bg: PALETTE.panel },
});

blessed.box({
  parent: setupDialog, top: 10, left: 1, right: 1, height: 1, tags: true, align: "center",
  content: paint(PALETTE.dim, "[Enter] Confirmar    [Esc] Salir"),
  style: { bg: PALETTE.panel },
});

// Validación y arranque al confirmar el número
countdownInput.on("submit", (value) => {
  const raw = String(value ?? "").trim();
  const initialCount = raw === "" ? 10 : Number(raw);

  if (!Number.isSafeInteger(initialCount) || initialCount < 1) {
    dialogError.setContent(paint(PALETTE.danger, "Número no válido, ingresa un entero mayor que 0"));
    countdownInput.clearValue();
    screen.render();
    setImmediate(() => countdownInput.readInput());
    return;
  }

  startCountdown(initialCount);
});

// Reiniciar con R (solo durante la misión)
screen.key(["r"], () => {
  if (state.phase !== "idle") returnToSetup();
});

// Bucle de animación ~20 fps
setInterval(renderFrame, 50);
openSetupDialog();
