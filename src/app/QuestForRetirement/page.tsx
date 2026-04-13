"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────

const GW = 384;
const GH = 216;
const GROUND_Y = 190;
const GRAVITY = 0.35;
const JUMP_VEL = -6.5;
const MAX_FALL = 7;
const LEVEL_LEN = 6000;
const BOSS_X = 5100;
const BARN_X = LEVEL_LEN - 80;
const METEOR_TRIGGER_DIST = 100;

type CharId = "tony" | "ovi" | "bill";
type Phase = "select" | "playing" | "gameover";

// ─── PALETTE ──────────────────────────────────────────────────

const P = [
  "",         // 0  transparent
  "#1a1a2e", // 1  dark navy
  "#e94560", // 2  red
  "#f5c518", // 3  yellow
  "#ffffff", // 4  white
  "#3b2314", // 5  dark brown (hair)
  "#ffdbb4", // 6  light skin
  "#2d6a4f", // 7  dark green
  "#ff6b35", // 8  orange
  "#3a86ff", // 9  blue
  "#000000", // 10 black
  "#cc2222", // 11 hat red
  "#c4956a", // 12 tan/medium skin shadow
  "#4a4a6a", // 13 dark gray-blue (pants)
  "#6a6a8a", // 14 medium gray (shirt)
  "#f0d080", // 15 blonde
  "#2244aa", // 16 dark blue (suit)
  "#e0e0e0", // 17 light gray
  "#884422", // 18 brown
  "#66bb66", // 19 green
  "#ffaa00", // 20 gold
  "#ff4444", // 21 bright red
  "#88ccff", // 22 sky blue
  "#556633", // 23 olive
  "#dddddd", // 24 off-white
  "#ffc0c0", // 25 pink skin highlight
  "#eebb88", // 26 skin mid
];

function drawSprite(
  ctx: CanvasRenderingContext2D,
  s: number[][],
  x: number,
  y: number,
  sc: number = 1,
  flipX: boolean = false,
) {
  for (let r = 0; r < s.length; r++) {
    for (let c = 0; c < s[r].length; c++) {
      const ci = s[r][c];
      if (ci === 0) continue;
      ctx.fillStyle = P[ci];
      const dx = flipX ? x + (s[r].length - 1 - c) * sc : x + c * sc;
      ctx.fillRect(dx, y + r * sc, sc, sc);
    }
  }
}

// ─── PIXEL FONT (3x5) ────────────────────────────────────────

const FONT: Record<string, number[][]> = {
  A: [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  B: [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
  C: [[0,1,1],[1,0,0],[1,0,0],[1,0,0],[0,1,1]],
  D: [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
  E: [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],
  F: [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,0,0]],
  G: [[0,1,1],[1,0,0],[1,0,1],[1,0,1],[0,1,1]],
  H: [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  I: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
  J: [[0,0,1],[0,0,1],[0,0,1],[1,0,1],[0,1,0]],
  K: [[1,0,1],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  L: [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
  M: [[1,0,1],[1,1,1],[1,1,1],[1,0,1],[1,0,1]],
  N: [[1,0,1],[1,1,1],[1,1,1],[1,1,1],[1,0,1]],
  O: [[0,1,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  P: [[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
  Q: [[0,1,0],[1,0,1],[1,0,1],[1,1,1],[0,1,1]],
  R: [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  S: [[0,1,1],[1,0,0],[0,1,0],[0,0,1],[1,1,0]],
  T: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
  U: [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  V: [[1,0,1],[1,0,1],[1,0,1],[0,1,0],[0,1,0]],
  W: [[1,0,1],[1,0,1],[1,1,1],[1,1,1],[1,0,1]],
  X: [[1,0,1],[1,0,1],[0,1,0],[1,0,1],[1,0,1]],
  Y: [[1,0,1],[1,0,1],[0,1,0],[0,1,0],[0,1,0]],
  Z: [[1,1,1],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
  "0": [[0,1,0],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
  "1": [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
  "2": [[1,1,0],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
  "3": [[1,1,0],[0,0,1],[0,1,0],[0,0,1],[1,1,0]],
  "4": [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
  "5": [[1,1,1],[1,0,0],[1,1,0],[0,0,1],[1,1,0]],
  "6": [[0,1,1],[1,0,0],[1,1,0],[1,0,1],[0,1,0]],
  "7": [[1,1,1],[0,0,1],[0,1,0],[0,1,0],[0,1,0]],
  "8": [[0,1,0],[1,0,1],[0,1,0],[1,0,1],[0,1,0]],
  "9": [[0,1,0],[1,0,1],[0,1,1],[0,0,1],[1,1,0]],
  "!": [[0,1,0],[0,1,0],[0,1,0],[0,0,0],[0,1,0]],
  "?": [[1,1,0],[0,0,1],[0,1,0],[0,0,0],[0,1,0]],
  ":": [[0,0,0],[0,1,0],[0,0,0],[0,1,0],[0,0,0]],
  "-": [[0,0,0],[0,0,0],[1,1,1],[0,0,0],[0,0,0]],
  ".": [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,1,0]],
  ",": [[0,0,0],[0,0,0],[0,0,0],[0,1,0],[1,0,0]],
  "'": [[0,1,0],[0,1,0],[0,0,0],[0,0,0],[0,0,0]],
  "/": [[0,0,1],[0,0,1],[0,1,0],[1,0,0],[1,0,0]],
  "%": [[1,0,1],[0,0,1],[0,1,0],[1,0,0],[1,0,1]],
};

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string = "#ffffff",
  sc: number = 1,
) {
  let cx = x;
  for (const ch of text.toUpperCase()) {
    const g = FONT[ch];
    if (g) {
      ctx.fillStyle = color;
      for (let r = 0; r < g.length; r++)
        for (let c = 0; c < g[r].length; c++)
          if (g[r][c]) ctx.fillRect(cx + c * sc, y + r * sc, sc, sc);
      cx += (g[0].length + 1) * sc;
    } else {
      cx += 4 * sc;
    }
  }
  return cx - x;
}

function textWidth(text: string, sc: number = 1): number {
  let w = 0;
  for (const ch of text.toUpperCase()) {
    const g = FONT[ch];
    w += g ? (g[0].length + 1) * sc : 4 * sc;
  }
  return w;
}

// ─── SPRITES ──────────────────────────────────────────────────

// Tony: 12x18, dark flowing hair, tallest
const TONY_IDLE: number[][] = [
  [0,0,0,5,5,5,5,5,0,0,0,0],
  [0,0,5,5,5,5,5,5,5,0,0,0],
  [0,0,5,5,5,5,5,5,5,5,0,0],
  [0,0,0,6,6,6,6,6,0,5,0,0],
  [0,0,0,6,10,6,10,6,0,0,0,0],
  [0,0,0,6,6,6,6,6,0,0,0,0],
  [0,0,0,6,6,2,6,6,0,0,0,0],
  [0,0,0,0,6,6,6,0,0,0,0,0],
  [0,0,0,14,14,14,14,0,0,0,0,0],
  [0,0,14,14,14,14,14,14,0,0,0,0],
  [0,0,14,14,14,14,14,14,0,0,0,0],
  [0,0,6,14,14,14,14,6,0,0,0,0],
  [0,0,0,14,14,14,14,0,0,0,0,0],
  [0,0,0,13,13,13,13,0,0,0,0,0],
  [0,0,0,13,13,13,13,0,0,0,0,0],
  [0,0,0,13,0,0,13,0,0,0,0,0],
  [0,0,0,13,0,0,13,0,0,0,0,0],
  [0,0,0,5,0,0,5,0,0,0,0,0],
];

const TONY_RUN: number[][] = [
  [0,0,0,5,5,5,5,5,0,0,0,0],
  [0,0,5,5,5,5,5,5,5,0,0,0],
  [0,0,5,5,5,5,5,5,5,5,0,0],
  [0,0,0,6,6,6,6,6,0,5,0,0],
  [0,0,0,6,10,6,10,6,0,0,0,0],
  [0,0,0,6,6,6,6,6,0,0,0,0],
  [0,0,0,6,6,2,6,6,0,0,0,0],
  [0,0,0,0,6,6,6,0,0,0,0,0],
  [0,0,0,14,14,14,14,0,0,0,0,0],
  [0,0,14,14,14,14,14,14,0,0,0,0],
  [0,0,14,14,14,14,14,14,0,0,0,0],
  [0,6,0,14,14,14,14,0,6,0,0,0],
  [0,0,0,14,14,14,14,0,0,0,0,0],
  [0,0,0,13,13,13,13,0,0,0,0,0],
  [0,0,0,0,13,13,0,0,0,0,0,0],
  [0,0,0,13,0,0,13,0,0,0,0,0],
  [0,0,13,0,0,0,0,13,0,0,0,0],
  [0,0,5,0,0,0,0,5,0,0,0,0],
];

// Ovi: 12x16, balding, medium
const OVI_IDLE: number[][] = [
  [0,0,0,0,6,6,6,0,0,0,0,0],
  [0,0,0,6,6,6,6,6,0,0,0,0],
  [0,0,5,6,6,6,6,6,5,0,0,0],
  [0,0,0,6,10,6,10,6,0,0,0,0],
  [0,0,0,6,6,6,6,6,0,0,0,0],
  [0,0,0,6,6,2,6,6,0,0,0,0],
  [0,0,0,0,6,6,6,0,0,0,0,0],
  [0,0,0,14,14,14,14,0,0,0,0,0],
  [0,0,14,14,14,14,14,14,0,0,0,0],
  [0,0,14,14,14,14,14,14,0,0,0,0],
  [0,0,6,14,14,14,14,6,0,0,0,0],
  [0,0,0,14,14,14,14,0,0,0,0,0],
  [0,0,0,13,13,13,13,0,0,0,0,0],
  [0,0,0,13,0,0,13,0,0,0,0,0],
  [0,0,0,13,0,0,13,0,0,0,0,0],
  [0,0,0,5,0,0,5,0,0,0,0,0],
];

const OVI_RUN: number[][] = [
  [0,0,0,0,6,6,6,0,0,0,0,0],
  [0,0,0,6,6,6,6,6,0,0,0,0],
  [0,0,5,6,6,6,6,6,5,0,0,0],
  [0,0,0,6,10,6,10,6,0,0,0,0],
  [0,0,0,6,6,6,6,6,0,0,0,0],
  [0,0,0,6,6,2,6,6,0,0,0,0],
  [0,0,0,0,6,6,6,0,0,0,0,0],
  [0,0,0,14,14,14,14,0,0,0,0,0],
  [0,0,14,14,14,14,14,14,0,0,0,0],
  [0,0,14,14,14,14,14,14,0,0,0,0],
  [0,6,0,14,14,14,14,0,6,0,0,0],
  [0,0,0,14,14,14,14,0,0,0,0,0],
  [0,0,0,13,13,13,13,0,0,0,0,0],
  [0,0,0,0,13,0,13,0,0,0,0,0],
  [0,0,0,13,0,0,0,13,0,0,0,0],
  [0,0,0,5,0,0,0,5,0,0,0,0],
];

// Bill: 12x14, red hat, shortest
const BILL_IDLE: number[][] = [
  [0,0,11,11,11,11,11,11,0,0,0,0],
  [0,0,11,11,11,11,11,0,0,0,0,0],
  [0,0,0,6,6,6,6,6,0,0,0,0],
  [0,0,0,6,10,6,10,6,0,0,0,0],
  [0,0,0,6,6,6,6,6,0,0,0,0],
  [0,0,0,6,6,2,6,6,0,0,0,0],
  [0,0,0,0,6,6,6,0,0,0,0,0],
  [0,0,0,14,14,14,14,0,0,0,0,0],
  [0,0,14,14,14,14,14,14,0,0,0,0],
  [0,0,6,14,14,14,14,6,0,0,0,0],
  [0,0,0,14,14,14,14,0,0,0,0,0],
  [0,0,0,13,0,0,13,0,0,0,0,0],
  [0,0,0,13,0,0,13,0,0,0,0,0],
  [0,0,0,5,0,0,5,0,0,0,0,0],
];

const BILL_RUN: number[][] = [
  [0,0,11,11,11,11,11,11,0,0,0,0],
  [0,0,11,11,11,11,11,0,0,0,0,0],
  [0,0,0,6,6,6,6,6,0,0,0,0],
  [0,0,0,6,10,6,10,6,0,0,0,0],
  [0,0,0,6,6,6,6,6,0,0,0,0],
  [0,0,0,6,6,2,6,6,0,0,0,0],
  [0,0,0,0,6,6,6,0,0,0,0,0],
  [0,0,0,14,14,14,14,0,0,0,0,0],
  [0,0,14,14,14,14,14,14,0,0,0,0],
  [0,6,0,14,14,14,14,0,6,0,0,0],
  [0,0,0,14,14,14,14,0,0,0,0,0],
  [0,0,0,0,13,0,13,0,0,0,0,0],
  [0,0,0,13,0,0,0,13,0,0,0,0],
  [0,0,0,5,0,0,0,5,0,0,0,0],
];

const CHARS: Record<CharId, { idle: number[][]; run: number[][]; w: number; h: number }> = {
  tony: { idle: TONY_IDLE, run: TONY_RUN, w: 12, h: 18 },
  ovi:  { idle: OVI_IDLE,  run: OVI_RUN,  w: 12, h: 16 },
  bill: { idle: BILL_IDLE, run: BILL_RUN, w: 12, h: 14 },
};

// PowerPoint enemy (12x14)
const PP_SPRITE: number[][] = [
  [0,8,8,8,8,8,8,8,8,8,0,0],
  [8,8,24,24,24,24,24,24,8,8,0,0],
  [8,24,24,24,24,24,24,24,24,8,0,0],
  [8,24,24,8,8,8,24,24,24,8,0,0],
  [8,24,24,8,24,24,24,24,24,8,0,0],
  [8,24,24,8,8,8,24,24,24,8,0,0],
  [8,24,24,8,24,24,24,24,24,8,0,0],
  [8,24,24,8,24,24,24,24,24,8,0,0],
  [8,24,24,24,24,24,24,24,24,8,0,0],
  [8,8,8,8,8,8,8,8,8,8,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,10,0,0,0,0,10,0,0,0],
  [0,0,0,10,0,0,0,0,10,0,0,0],
  [0,0,10,10,0,0,0,0,10,10,0,0],
];

// Poop bullet (5x5)
const POOP_SMALL: number[][] = [
  [0,0,18,0,0],
  [0,18,18,18,0],
  [18,18,5,18,18],
  [18,18,18,18,18],
  [0,18,18,18,0],
];

// Large poop powerup (8x8)
const POOP_BIG: number[][] = [
  [0,0,0,18,18,0,0,0],
  [0,0,18,18,18,18,0,0],
  [0,18,18,5,5,18,18,0],
  [18,18,5,18,18,5,18,18],
  [18,18,18,18,18,18,18,18],
  [18,18,18,18,18,18,18,18],
  [0,18,18,18,18,18,18,0],
  [0,0,18,18,18,18,0,0],
];

// Meeting powerup (calendar 8x10)
const MEETING_SPRITE: number[][] = [
  [0,21,0,0,0,0,21,0],
  [9,9,9,9,9,9,9,9],
  [9,9,9,9,9,9,9,9],
  [9,4,4,4,4,4,4,9],
  [9,4,10,4,10,4,4,9],
  [9,4,4,4,4,4,4,9],
  [9,4,4,10,4,10,4,9],
  [9,4,4,4,4,4,4,9],
  [9,4,4,4,4,4,4,9],
  [9,9,9,9,9,9,9,9],
];

// Barn (32x28)
const BARN_SPRITE: number[][] = (() => {
  const b: number[][] = [];
  // Roof (triangle-ish)
  for (let r = 0; r < 8; r++) {
    const row = new Array(32).fill(0);
    const indent = 8 - r;
    for (let c = indent; c < 32 - indent; c++) row[c] = 11;
    if (r === 0) { row[15] = 3; row[16] = 3; } // weathervane
    b.push(row);
  }
  // Walls
  for (let r = 0; r < 16; r++) {
    const row = new Array(32).fill(0);
    for (let c = 2; c < 30; c++) row[c] = 21;
    // Door
    if (r >= 6) { row[14] = 5; row[15] = 5; row[16] = 5; row[17] = 5; }
    // Windows
    if (r >= 3 && r <= 6) {
      row[6] = 22; row[7] = 22; row[8] = 22;
      row[23] = 22; row[24] = 22; row[25] = 22;
    }
    // Trim
    row[2] = 4; row[29] = 4;
    b.push(row);
  }
  // Foundation
  const fnd = new Array(32).fill(0);
  for (let c = 1; c < 31; c++) fnd[c] = 13;
  b.push(fnd);
  b.push(fnd.slice());
  b.push(fnd.slice());
  b.push(fnd.slice());
  return b;
})();

// ─── GAME TYPES ───────────────────────────────────────────────

interface Body {
  x: number; y: number; vx: number; vy: number;
  w: number; h: number; grounded: boolean;
}

interface Player {
  body: Body;
  charId: CharId;
  anger: number; maxAnger: number;
  ammo: number; maxAmmo: number;
  speed: number;
  facing: 1 | -1;
  animTimer: number;
  animFrame: number;
  invTimer: number;
  shootCd: number;
  pierce: boolean;
}

interface Enemy {
  body: Body;
  hp: number;
  alive: boolean;
  flashTimer: number;
}

interface Bullet {
  body: Body;
  alive: boolean;
  dmg: number;
  pierce: boolean;
}

interface Powerup {
  body: Body;
  type: "meeting" | "bullshit";
  alive: boolean;
  bob: number;
}

interface Boss {
  body: Body;
  hp: number; maxHp: number;
  alive: boolean;
  entered: boolean;
  speechTimer: number;
  speechIdx: number;
  attackTimer: number;
  flashTimer: number;
}

interface MeteorState {
  active: boolean;
  frame: number;
  x: number; y: number;
  impactX: number;
}

interface GState {
  player: Player;
  enemies: Enemy[];
  bullets: Bullet[];
  powerups: Powerup[];
  boss: Boss | null;
  bossDefeated: boolean;
  camera: number;
  meteor: MeteorState;
  shake: number;
  flash: number;
  inputLocked: boolean;
  spawnIdx: number;
  puIdx: number;
  gameOver: boolean;
  gameOverReason: string;
  frameCount: number;
  killCount: number;
}

interface Input {
  left: boolean; right: boolean; jump: boolean;
  shoot: boolean; shootPressed: boolean;
}

// ─── SPAWN DATA ───────────────────────────────────────────────

const ENEMY_SPAWNS = [
  { x: 400, n: 1 }, { x: 700, n: 1 }, { x: 1000, n: 2 }, { x: 1400, n: 1 },
  { x: 1700, n: 2 }, { x: 2000, n: 2 }, { x: 2300, n: 3 }, { x: 2600, n: 2 },
  { x: 2900, n: 3 }, { x: 3200, n: 2 }, { x: 3500, n: 3 }, { x: 3800, n: 4 },
  { x: 4100, n: 3 }, { x: 4400, n: 4 }, { x: 4700, n: 5 },
];

const PU_SPAWNS = [
  { x: 500, t: "bullshit" as const }, { x: 900, t: "meeting" as const },
  { x: 1300, t: "bullshit" as const }, { x: 1800, t: "meeting" as const },
  { x: 2200, t: "bullshit" as const }, { x: 2700, t: "meeting" as const },
  { x: 3100, t: "bullshit" as const }, { x: 3600, t: "meeting" as const },
  { x: 4000, t: "bullshit" as const }, { x: 4500, t: "meeting" as const },
  { x: 4900, t: "bullshit" as const },
];

const BOSS_SPEECHES = [
  "MORE PICTURES!",
  "ADD MORE SLIDES!",
  "MAKE IT POP!",
  "NEEDS CLIPART!",
  "MORE GRAPHICS!",
];

// ─── CHARACTER CONFIGS ────────────────────────────────────────

const CHAR_CFG: Record<CharId, { anger: number; ammo: number; speed: number; pierce: boolean }> = {
  tony: { anger: 133, ammo: 67,  speed: 2.0, pierce: false },
  ovi:  { anger: 100, ammo: 10,  speed: 2.66, pierce: false },
  bill: { anger: 100, ammo: 100, speed: 2.0, pierce: true },
};

// ─── PHYSICS ──────────────────────────────────────────────────

function updateBody(b: Body) {
  if (!b.grounded) b.vy = Math.min(b.vy + GRAVITY, MAX_FALL);
  b.x += b.vx;
  b.y += b.vy;
  if (b.y + b.h >= GROUND_Y) {
    b.y = GROUND_Y - b.h;
    b.vy = 0;
    b.grounded = true;
  } else {
    b.grounded = false;
  }
}

function collides(a: Body, b: Body): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// ─── GAME INIT ────────────────────────────────────────────────

function initGame(charId: CharId): GState {
  const cfg = CHAR_CFG[charId];
  const ch = CHARS[charId];
  return {
    player: {
      body: { x: 50, y: GROUND_Y - ch.h, vx: 0, vy: 0, w: ch.w, h: ch.h, grounded: true },
      charId, anger: cfg.anger, maxAnger: cfg.anger,
      ammo: cfg.ammo, maxAmmo: cfg.ammo,
      speed: cfg.speed, facing: 1, animTimer: 0, animFrame: 0,
      invTimer: 0, shootCd: 0, pierce: cfg.pierce,
    },
    enemies: [], bullets: [], powerups: [],
    boss: null, bossDefeated: false,
    camera: 0, meteor: { active: false, frame: 0, x: 0, y: 0, impactX: 0 },
    shake: 0, flash: 0, inputLocked: false,
    spawnIdx: 0, puIdx: 0,
    gameOver: false, gameOverReason: "",
    frameCount: 0, killCount: 0,
  };
}

// ─── UPDATE ───────────────────────────────────────────────────

function update(gs: GState, inp: Input): string | null {
  gs.frameCount++;

  // Meteor sequence
  if (gs.meteor.active) {
    gs.inputLocked = true;
    gs.meteor.frame++;
    const f = gs.meteor.frame;
    // Meteor flies in
    if (f < 60) {
      gs.meteor.x = GW + 50 - f * 3;
      gs.meteor.y = -20 + f * 2.5;
    }
    // Impact
    if (f === 60) {
      gs.shake = 30;
      gs.flash = 1.0;
    }
    if (f > 60 && f < 120) {
      gs.flash = Math.max(0, gs.flash - 0.02);
      gs.shake = Math.max(0, gs.shake - 0.5);
    }
    if (f >= 150) {
      gs.gameOver = true;
      gs.gameOverReason = "RETIREMENT DENIED";
      return gs.gameOverReason;
    }
    return null;
  }

  if (gs.inputLocked) return null;

  const p = gs.player;

  // Player input
  p.body.vx = 0;
  if (inp.left) { p.body.vx = -p.speed; p.facing = -1; }
  if (inp.right) { p.body.vx = p.speed; p.facing = 1; }
  if (inp.jump && p.body.grounded) { p.body.vy = JUMP_VEL; p.body.grounded = false; }

  // Shoot
  if (p.shootCd > 0) p.shootCd--;
  if (inp.shootPressed && p.ammo > 0 && p.shootCd <= 0) {
    p.ammo--;
    p.shootCd = 12;
    gs.bullets.push({
      body: {
        x: p.body.x + (p.facing === 1 ? p.body.w : -5),
        y: p.body.y + p.body.h / 2 - 2,
        vx: p.facing * 4, vy: 0, w: 5, h: 5, grounded: false,
      },
      alive: true, dmg: 1, pierce: p.pierce,
    });
  }

  // Player physics
  updateBody(p.body);
  p.body.x = Math.max(gs.camera, p.body.x);
  if (p.invTimer > 0) p.invTimer--;

  // Animation
  if (p.body.vx !== 0) {
    p.animTimer++;
    if (p.animTimer > 8) { p.animTimer = 0; p.animFrame = 1 - p.animFrame; }
  } else {
    p.animFrame = 0;
    p.animTimer = 0;
  }

  // Camera
  const targetCam = p.body.x - GW * 0.3;
  gs.camera += (targetCam - gs.camera) * 0.08;
  gs.camera = Math.max(0, gs.camera);

  // Spawn enemies
  while (gs.spawnIdx < ENEMY_SPAWNS.length && gs.camera + GW > ENEMY_SPAWNS[gs.spawnIdx].x - 100) {
    const sp = ENEMY_SPAWNS[gs.spawnIdx];
    for (let i = 0; i < sp.n; i++) {
      gs.enemies.push({
        body: {
          x: sp.x + i * 20 + GW, y: GROUND_Y - 14,
          vx: 0, vy: 0, w: 10, h: 10, grounded: true,
        },
        hp: 2, alive: true, flashTimer: 0,
      });
    }
    gs.spawnIdx++;
  }

  // Spawn powerups
  while (gs.puIdx < PU_SPAWNS.length && gs.camera + GW > PU_SPAWNS[gs.puIdx].x - 50) {
    const pu = PU_SPAWNS[gs.puIdx];
    gs.powerups.push({
      body: { x: pu.x, y: GROUND_Y - 30, vx: 0, vy: 0, w: 8, h: 10, grounded: false },
      type: pu.t, alive: true, bob: Math.random() * Math.PI * 2,
    });
    gs.puIdx++;
  }

  // Spawn boss
  if (!gs.boss && !gs.bossDefeated && p.body.x > BOSS_X - GW * 0.5) {
    gs.boss = {
      body: {
        x: BOSS_X + GW * 0.3, y: GROUND_Y - 96,
        vx: 0, vy: 0, w: 24, h: 96, grounded: true,
      },
      hp: 25, maxHp: 25, alive: true, entered: false,
      speechTimer: 120, speechIdx: 0,
      attackTimer: 90, flashTimer: 0,
    };
  }

  // Update enemies
  for (const e of gs.enemies) {
    if (!e.alive) continue;
    const dx = p.body.x - e.body.x;
    const dist = Math.abs(dx);
    if (dist < 200) {
      e.body.vx = Math.sign(dx) * 0.8;
      if (p.body.y < e.body.y - 10 && e.body.grounded && Math.random() < 0.015) {
        e.body.vy = JUMP_VEL * 0.7;
        e.body.grounded = false;
      }
    } else {
      e.body.vx = 0;
    }
    updateBody(e.body);
    if (e.flashTimer > 0) e.flashTimer--;

    // Enemy hits player
    if (p.invTimer <= 0 && collides(p.body, e.body)) {
      p.anger -= 15;
      p.invTimer = 60;
      gs.shake = 5;
      if (p.anger <= 0) {
        gs.gameOver = true;
        gs.gameOverReason = "OUT OF ANGER!";
        return gs.gameOverReason;
      }
    }
  }

  // Update bullets
  for (const b of gs.bullets) {
    if (!b.alive) continue;
    b.body.x += b.body.vx;
    // Off screen
    if (b.body.x < gs.camera - 20 || b.body.x > gs.camera + GW + 20) b.alive = false;
    // Hit enemies
    for (const e of gs.enemies) {
      if (!e.alive) continue;
      if (collides(b.body, e.body)) {
        e.hp -= b.dmg;
        e.flashTimer = 6;
        if (e.hp <= 0) { e.alive = false; gs.killCount++; }
        if (!b.pierce) b.alive = false;
        break;
      }
    }
    // Hit boss
    if (gs.boss && gs.boss.alive && collides(b.body, gs.boss.body)) {
      gs.boss.hp -= b.dmg;
      gs.boss.flashTimer = 6;
      if (gs.boss.hp <= 0) {
        gs.boss.alive = false;
        gs.bossDefeated = true;
        gs.shake = 15;
      }
      if (!b.pierce) b.alive = false;
    }
  }

  // Update boss
  if (gs.boss && gs.boss.alive) {
    const boss = gs.boss;
    // Move toward player slowly
    if (boss.body.x > p.body.x + 50) boss.body.vx = -0.3;
    else if (boss.body.x < p.body.x - 10) boss.body.vx = 0.3;
    else boss.body.vx = 0;
    boss.body.x += boss.body.vx;

    // Speech
    boss.speechTimer--;
    if (boss.speechTimer <= 0) {
      boss.speechIdx = (boss.speechIdx + 1) % BOSS_SPEECHES.length;
      boss.speechTimer = 180;
    }
    if (boss.flashTimer > 0) boss.flashTimer--;

    // Attack: throw PP projectiles
    boss.attackTimer--;
    if (boss.attackTimer <= 0) {
      boss.attackTimer = 70 + Math.floor(Math.random() * 40);
      gs.enemies.push({
        body: {
          x: boss.body.x - 10, y: boss.body.y + 40,
          vx: 0, vy: 0, w: 10, h: 10, grounded: false,
        },
        hp: 1, alive: true, flashTimer: 0,
      });
    }

    // Boss hits player
    if (p.invTimer <= 0 && collides(p.body, boss.body)) {
      p.anger -= 25;
      p.invTimer = 60;
      gs.shake = 8;
      if (p.anger <= 0) {
        gs.gameOver = true;
        gs.gameOverReason = "OUT OF ANGER!";
        return gs.gameOverReason;
      }
    }
  }

  // Update powerups
  for (const pu of gs.powerups) {
    if (!pu.alive) continue;
    pu.bob += 0.05;
    if (collides(p.body, { ...pu.body, y: pu.body.y + Math.sin(pu.bob) * 3 })) {
      pu.alive = false;
      if (pu.type === "meeting") {
        p.anger = Math.min(p.maxAnger, p.anger + 30);
      } else {
        p.ammo = Math.min(p.maxAmmo, p.ammo + 25);
      }
    }
  }

  // Check meteor trigger
  if (gs.bossDefeated && p.body.x > BARN_X - METEOR_TRIGGER_DIST) {
    gs.meteor.active = true;
    gs.meteor.impactX = BARN_X;
    gs.inputLocked = true;
    p.body.vx = 0;
  }

  // Cleanup dead
  gs.enemies = gs.enemies.filter(e => e.alive || e.flashTimer > 0);
  gs.bullets = gs.bullets.filter(b => b.alive);
  gs.powerups = gs.powerups.filter(pu => pu.alive);

  // Prevent going past barn without boss defeated
  if (!gs.bossDefeated && p.body.x > BOSS_X + 100) {
    p.body.x = BOSS_X + 100;
  }

  if (gs.shake > 0) gs.shake -= 0.5;
  return null;
}

// ─── RENDER ───────────────────────────────────────────────────

function render(ctx: CanvasRenderingContext2D, gs: GState) {
  const cam = gs.camera;

  // Screen shake offset
  const sx = gs.shake > 0 ? (Math.random() - 0.5) * gs.shake * 2 : 0;
  const sy = gs.shake > 0 ? (Math.random() - 0.5) * gs.shake * 2 : 0;
  ctx.save();
  ctx.translate(sx, sy);

  // Sky gradient
  const progress = cam / LEVEL_LEN;
  const skyR = Math.floor(30 + progress * 100);
  const skyG = Math.floor(30 + progress * 130);
  const skyB = Math.floor(80 + progress * 140);
  ctx.fillStyle = `rgb(${skyR},${skyG},${skyB})`;
  ctx.fillRect(0, 0, GW, GH);

  // Clouds
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  for (let i = 0; i < 6; i++) {
    const cx = ((i * 120 + 50) - cam * 0.05) % (GW + 80) - 40;
    const cy = 15 + (i % 3) * 12;
    ctx.fillRect(cx, cy, 30 + (i % 2) * 15, 6);
    ctx.fillRect(cx + 5, cy - 3, 20, 4);
  }

  // Far background (buildings/trees based on progress)
  if (progress < 0.5) {
    // Office buildings
    ctx.fillStyle = "#3a3a5e";
    for (let i = 0; i < 8; i++) {
      const bx = ((i * 80) - cam * 0.15) % (GW + 100) - 50;
      const bh = 30 + (i % 3) * 20;
      ctx.fillRect(bx, GROUND_Y - bh - 30, 35, bh);
      // Windows
      ctx.fillStyle = "#ffcc44";
      for (let wy = 0; wy < bh - 10; wy += 8) {
        for (let wx = 4; wx < 30; wx += 8) {
          if (Math.random() > 0.3) ctx.fillRect(bx + wx, GROUND_Y - bh - 28 + wy, 4, 4);
        }
      }
      ctx.fillStyle = "#3a3a5e";
    }
  } else {
    // Trees
    ctx.fillStyle = "#2d5a27";
    for (let i = 0; i < 10; i++) {
      const tx = ((i * 70 + 20) - cam * 0.2) % (GW + 80) - 40;
      // Trunk
      ctx.fillStyle = "#5a3a1a";
      ctx.fillRect(tx + 6, GROUND_Y - 40, 4, 15);
      // Canopy
      ctx.fillStyle = "#2d5a27";
      ctx.fillRect(tx, GROUND_Y - 50, 16, 12);
      ctx.fillRect(tx + 2, GROUND_Y - 55, 12, 8);
    }
  }

  // Ground
  ctx.fillStyle = progress < 0.4 ? "#4a4a4a" : progress < 0.7 ? "#5a6a3a" : "#4a7a2a";
  ctx.fillRect(0, GROUND_Y, GW, GH - GROUND_Y);
  // Ground detail line
  ctx.fillStyle = progress < 0.4 ? "#5a5a5a" : "#6a8a3a";
  ctx.fillRect(0, GROUND_Y, GW, 2);

  // Barn (when close)
  if (cam + GW > BARN_X - 50 && !gs.meteor.active || (gs.meteor.active && gs.meteor.frame < 60)) {
    const barnScreenX = BARN_X - cam;
    drawSprite(ctx, BARN_SPRITE, barnScreenX, GROUND_Y - 28, 1);
    // "RETIREMENT" sign
    const tw = textWidth("RETIREMENT", 1);
    drawText(ctx, "RETIREMENT", barnScreenX + 16 - tw / 2, GROUND_Y - 34, "#ffffff", 1);
  }

  // Powerups
  for (const pu of gs.powerups) {
    if (!pu.alive) continue;
    const px = pu.body.x - cam;
    const py = pu.body.y + Math.sin(pu.bob) * 3;
    if (px < -20 || px > GW + 20) continue;
    if (pu.type === "meeting") {
      drawSprite(ctx, MEETING_SPRITE, px, py, 1);
    } else {
      drawSprite(ctx, POOP_BIG, px, py, 1);
    }
  }

  // Enemies
  for (const e of gs.enemies) {
    if (!e.alive && e.flashTimer <= 0) continue;
    const ex = e.body.x - cam;
    if (ex < -20 || ex > GW + 20) continue;
    if (e.flashTimer > 0 && e.flashTimer % 2 === 0) continue; // flash
    drawSprite(ctx, PP_SPRITE, ex, e.body.y, 1);
  }

  // Player
  const p = gs.player;
  if (p.invTimer <= 0 || p.invTimer % 4 < 2) { // blink when invincible
    const ch = CHARS[p.charId];
    const sprite = p.body.vx !== 0 ? (p.animFrame === 0 ? ch.idle : ch.run) : ch.idle;
    drawSprite(ctx, sprite, p.body.x - cam, p.body.y, 1, p.facing === -1);
  }

  // Bullets
  for (const b of gs.bullets) {
    if (!b.alive) continue;
    drawSprite(ctx, POOP_SMALL, b.body.x - cam, b.body.y, 1);
  }

  // Boss
  if (gs.boss && gs.boss.alive) {
    const boss = gs.boss;
    const bx = boss.body.x - cam;
    if (boss.flashTimer > 0 && boss.flashTimer % 2 === 0) {
      // Flash red
    } else {
      drawBoss(ctx, bx, boss.body.y);
    }
    // Speech bubble
    if (boss.speechTimer > 30) {
      const speech = BOSS_SPEECHES[boss.speechIdx];
      const tw2 = textWidth(speech, 1);
      const bubW = tw2 + 6;
      const bubX = bx + 12 - bubW / 2;
      const bubY = boss.body.y - 14;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(bubX, bubY, bubW, 10);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(bx + 10, bubY + 10, 3, 3);
      drawText(ctx, speech, bubX + 3, bubY + 2, "#000000", 1);
    }
  }

  // Meteor
  if (gs.meteor.active) {
    const mf = gs.meteor.frame;
    if (mf < 60) {
      // Meteor approaching
      const mx = gs.meteor.x - cam;
      const my = gs.meteor.y;
      // Meteor body
      ctx.fillStyle = "#ff4400";
      ctx.fillRect(mx, my, 8, 8);
      ctx.fillStyle = "#ffaa00";
      ctx.fillRect(mx + 1, my + 1, 6, 6);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(mx + 2, my + 2, 3, 3);
      // Trail
      ctx.fillStyle = "rgba(255,100,0,0.5)";
      for (let t = 1; t < 8; t++) {
        ctx.fillRect(mx + t * 4, my - t * 3, 4 + t, 3 + t);
      }
    }
    if (mf >= 60 && mf < 120) {
      // Explosion at barn
      const expX = BARN_X + 16 - cam;
      const expY = GROUND_Y - 14;
      const radius = (mf - 60) * 1.5;
      ctx.fillStyle = `rgba(255,${150 - (mf - 60) * 2},0,${1 - (mf - 60) / 80})`;
      ctx.beginPath();
      ctx.arc(expX, expY, radius, 0, Math.PI * 2);
      ctx.fill();
      // White core
      ctx.fillStyle = `rgba(255,255,255,${0.8 - (mf - 60) / 80})`;
      ctx.beginPath();
      ctx.arc(expX, expY, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    if (mf >= 100) {
      // Crater
      const craterX = BARN_X - cam;
      ctx.fillStyle = "#2a1a0a";
      ctx.fillRect(craterX - 10, GROUND_Y - 5, 60, 20);
      ctx.fillStyle = "#1a0a00";
      ctx.fillRect(craterX, GROUND_Y - 2, 40, 12);
    }
  }

  // Flash overlay
  if (gs.flash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${gs.flash})`;
    ctx.fillRect(0, 0, GW, GH);
  }

  ctx.restore();

  // HUD (not affected by shake)
  // Anger bar
  drawText(ctx, "ANGER", 4, 4, "#ffffff", 1);
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(4, 12, 60, 6);
  const angerPct = gs.player.anger / gs.player.maxAnger;
  ctx.fillStyle = angerPct > 0.5 ? "#33ff33" : angerPct > 0.25 ? "#ffcc00" : "#ff3333";
  ctx.fillRect(4, 12, 60 * angerPct, 6);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 0.5;
  ctx.strokeRect(4, 12, 60, 6);

  // Ammo
  drawText(ctx, "AMMO", GW - 50, 4, "#ffffff", 1);
  drawText(ctx, `${gs.player.ammo}`, GW - 50, 12, "#ffaa00", 1);
  drawSprite(ctx, POOP_SMALL, GW - 18, 10, 1);

  // Kill count
  drawText(ctx, `KO:${gs.killCount}`, 4, 22, "#aaaaaa", 1);

  // Meteor text
  if (gs.meteor.active && gs.meteor.frame >= 120) {
    const txt = "RETIREMENT DENIED";
    const tw3 = textWidth(txt, 2);
    drawText(ctx, txt, GW / 2 - tw3 / 2, GH / 2 - 20, "#ff4444", 2);

    if (gs.meteor.frame >= 140) {
      const txt2 = "THE UNIVERSE HAS SPOKEN";
      const tw4 = textWidth(txt2, 1);
      drawText(ctx, txt2, GW / 2 - tw4 / 2, GH / 2 + 5, "#ffffff", 1);
    }
  }

  // Game over from death
  if (gs.gameOver && !gs.meteor.active) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, GW, GH);
    const tw5 = textWidth("GAME OVER", 2);
    drawText(ctx, "GAME OVER", GW / 2 - tw5 / 2, GH / 2 - 20, "#ff4444", 2);
    const tw6 = textWidth(gs.gameOverReason, 1);
    drawText(ctx, gs.gameOverReason, GW / 2 - tw6 / 2, GH / 2 + 5, "#ffffff", 1);
  }
}

// ─── BOSS RENDERING ───────────────────────────────────────────

function drawBoss(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Lori: 24x96 px, caucasian, medium-length blonde hair, business attire

  // Hair (blonde, medium-length)
  ctx.fillStyle = P[15]; // blonde
  ctx.fillRect(x + 4, y, 16, 8);
  ctx.fillRect(x + 3, y + 2, 18, 6);
  ctx.fillRect(x + 2, y + 6, 20, 10); // hair flowing down

  // Face
  ctx.fillStyle = P[6]; // light skin
  ctx.fillRect(x + 6, y + 8, 12, 12);
  // Eyes
  ctx.fillStyle = P[10]; // black
  ctx.fillRect(x + 8, y + 12, 2, 2);
  ctx.fillRect(x + 14, y + 12, 2, 2);
  // Mouth (angry)
  ctx.fillStyle = P[2]; // red
  ctx.fillRect(x + 9, y + 17, 6, 1);

  // Neck
  ctx.fillStyle = P[6];
  ctx.fillRect(x + 9, y + 20, 6, 3);

  // Blazer (dark blue)
  ctx.fillStyle = P[16]; // dark blue
  ctx.fillRect(x + 4, y + 23, 16, 30);
  // Blazer lapels
  ctx.fillStyle = P[1]; // darker navy
  ctx.fillRect(x + 6, y + 23, 3, 15);
  ctx.fillRect(x + 15, y + 23, 3, 15);
  // Blouse underneath
  ctx.fillStyle = P[4]; // white
  ctx.fillRect(x + 9, y + 23, 6, 15);
  // Button
  ctx.fillStyle = P[10];
  ctx.fillRect(x + 11, y + 30, 2, 2);
  ctx.fillRect(x + 11, y + 35, 2, 2);

  // Arms
  ctx.fillStyle = P[16];
  ctx.fillRect(x + 1, y + 25, 4, 20);
  ctx.fillRect(x + 19, y + 25, 4, 20);
  // Hands
  ctx.fillStyle = P[6];
  ctx.fillRect(x + 1, y + 45, 4, 4);
  ctx.fillRect(x + 19, y + 45, 4, 4);

  // Skirt
  ctx.fillStyle = P[13]; // dark gray
  ctx.fillRect(x + 4, y + 53, 16, 20);
  ctx.fillRect(x + 3, y + 60, 18, 13);

  // Legs
  ctx.fillStyle = P[6]; // skin
  ctx.fillRect(x + 6, y + 73, 4, 16);
  ctx.fillRect(x + 14, y + 73, 4, 16);

  // Shoes (heels)
  ctx.fillStyle = P[10]; // black
  ctx.fillRect(x + 5, y + 89, 6, 3);
  ctx.fillRect(x + 13, y + 89, 6, 3);
  // Heel
  ctx.fillRect(x + 5, y + 92, 2, 4);
  ctx.fillRect(x + 17, y + 92, 2, 4);
}

// ─── REACT COMPONENT ─────────────────────────────────────────

export default function QuestForRetirementPage() {
  const [phase, setPhase] = useState<Phase>("select");
  const [selectedChar, setSelectedChar] = useState<CharId | null>(null);
  const [overReason, setOverReason] = useState("");
  const [lastKills, setLastKills] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferRef = useRef<HTMLCanvasElement | null>(null);
  const gsRef = useRef<GState | null>(null);
  const inputRef = useRef<Input>({ left: false, right: false, jump: false, shoot: false, shootPressed: false });
  const cleanupRef = useRef<(() => void) | null>(null);

  const startGame = useCallback((charId: CharId) => {
    setSelectedChar(charId);
    setPhase("playing");
  }, []);

  // Game loop effect
  useEffect(() => {
    if (phase !== "playing" || !selectedChar) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create offscreen buffer
    const buffer = document.createElement("canvas");
    buffer.width = GW;
    buffer.height = GH;
    const bufCtx = buffer.getContext("2d")!;
    bufCtx.imageSmoothingEnabled = false;
    bufferRef.current = buffer;

    // Size display canvas
    const resizeCanvas = () => {
      const maxW = Math.min(window.innerWidth - 16, 960);
      const maxH = window.innerHeight - 16;
      const aspect = GW / GH;
      let w = maxW;
      let h = w / aspect;
      if (h > maxH) { h = maxH; w = h * aspect; }
      canvas.width = Math.floor(w);
      canvas.height = Math.floor(h);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const displayCtx = canvas.getContext("2d")!;
    displayCtx.imageSmoothingEnabled = false;

    // Init game state
    const gs = initGame(selectedChar);
    gsRef.current = gs;

    // Input
    const keys = new Set<string>();
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(e.key)) e.preventDefault();
      const wasShoot = keys.has(" ");
      keys.add(e.key);
      inputRef.current.left = keys.has("ArrowLeft") || keys.has("a");
      inputRef.current.right = keys.has("ArrowRight") || keys.has("d");
      inputRef.current.jump = keys.has("ArrowUp") || keys.has("w");
      inputRef.current.shoot = keys.has(" ");
      if (keys.has(" ") && !wasShoot) inputRef.current.shootPressed = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.key);
      inputRef.current.left = keys.has("ArrowLeft") || keys.has("a");
      inputRef.current.right = keys.has("ArrowRight") || keys.has("d");
      inputRef.current.jump = keys.has("ArrowUp") || keys.has("w");
      inputRef.current.shoot = keys.has(" ");
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Touch
    const touches = new Map<number, { x: number; startY: number }>();
    const processTouch = () => {
      const w = canvas.clientWidth;
      let left = false, right = false, shoot = false;
      touches.forEach(t => {
        const rel = t.x / w;
        if (rel < 0.35) left = true;
        else if (rel > 0.65) { right = true; shoot = true; }
      });
      inputRef.current.left = left;
      inputRef.current.right = right;
      if (shoot && !inputRef.current.shoot) inputRef.current.shootPressed = true;
      inputRef.current.shoot = shoot;
    };
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      for (const t of Array.from(e.changedTouches)) {
        const rect = canvas.getBoundingClientRect();
        touches.set(t.identifier, { x: t.clientX - rect.left, startY: t.clientY });
      }
      processTouch();
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      for (const t of Array.from(e.changedTouches)) {
        const rect = canvas.getBoundingClientRect();
        const existing = touches.get(t.identifier);
        touches.set(t.identifier, { x: t.clientX - rect.left, startY: existing?.startY ?? t.clientY });
        if (existing && existing.startY - t.clientY > 30) {
          inputRef.current.jump = true;
          setTimeout(() => { inputRef.current.jump = false; }, 150);
        }
      }
      processTouch();
    };
    const onTouchEnd = (e: TouchEvent) => {
      for (const t of Array.from(e.changedTouches)) touches.delete(t.identifier);
      processTouch();
    };
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    // Game loop
    let rafId: number;
    let gameOverSent = false;

    const loop = () => {
      // Clear shootPressed after each frame
      const inp = { ...inputRef.current };
      inputRef.current.shootPressed = false;

      const result = update(gs, inp);
      render(bufCtx, gs);

      // Scale to display
      displayCtx.imageSmoothingEnabled = false;
      displayCtx.clearRect(0, 0, canvas.width, canvas.height);
      displayCtx.drawImage(buffer, 0, 0, canvas.width, canvas.height);

      if (result && !gameOverSent) {
        gameOverSent = true;
        setTimeout(() => {
          setOverReason(result);
          setLastKills(gs.killCount);
          setPhase("gameover");
        }, 2000);
      }

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    cleanupRef.current = () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };

    return () => cleanupRef.current?.();
  }, [phase, selectedChar]);

  // ─── SELECT SCREEN ────────────────────────────────────────

  if (phase === "select") {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-4 font-mono text-white">
        {/* Landscape prompt for mobile */}
        <div className="sm:hidden mb-4 text-center">
          <p className="text-yellow-400 text-xs animate-pulse">
            ROTATE YOUR PHONE TO LANDSCAPE TO PLAY
          </p>
          <p className="text-white/40 text-[10px] mt-1">&#x21BB; Turn sideways for the best experience</p>
        </div>

        <h1
          className="text-2xl sm:text-4xl font-bold tracking-widest mb-2 text-center"
          style={{ color: "#ff6b35", textShadow: "0 0 20px rgba(255,107,53,0.5)" }}
        >
          RETIREMENT QUEST
        </h1>
        <p className="text-white/50 text-xs sm:text-sm mb-6">Choose your warrior</p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8">
          {(["tony", "ovi", "bill"] as CharId[]).map((id) => {
            const cfg = CHAR_CFG[id];
            const labels: Record<CharId, { name: string; title: string; desc: string }> = {
              tony: { name: "TONY", title: "MAX ANGER", desc: "+33% HP, -33% Ammo" },
              ovi:  { name: "OVI",  title: "MAX SPEED", desc: "+33% Speed, -90% Ammo" },
              bill: { name: "BILL", title: "MAX BULLSHIT", desc: "Piercing shots" },
            };
            const l = labels[id];
            return (
              <button
                key={id}
                onClick={() => startGame(id)}
                className="border-2 border-white/20 rounded-sm p-4 w-48 hover:border-[#ff6b35]
                           hover:bg-white/5 transition-colors cursor-pointer flex flex-col items-center"
              >
                <CharPreview charId={id} />
                <p className="text-lg font-bold mt-2" style={{ color: "#ff6b35" }}>{l.name}</p>
                <p className="text-xs text-yellow-400 mb-2">{l.title}</p>
                <p className="text-[10px] text-white/60 mb-3">{l.desc}</p>
                {/* Stat bars */}
                <div className="w-full space-y-1 text-[10px]">
                  <StatBar label="ANGER" value={cfg.anger} max={133} color="#ff4444" />
                  <StatBar label="AMMO" value={cfg.ammo} max={100} color="#ffaa00" />
                  <StatBar label="SPEED" value={Math.round(cfg.speed * 50)} max={133} color="#33ff33" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="border border-white/20 rounded-sm p-4 max-w-md w-full">
          <p className="text-center text-xs text-white/60 mb-2 uppercase tracking-wider">Controls</p>
          <div className="grid grid-cols-2 gap-4 text-[10px] text-white/80">
            <div>
              <p className="text-white/40 mb-1">DESKTOP</p>
              <p>Arrow Keys / WASD - Move</p>
              <p>Up / W - Jump</p>
              <p>Space - Shoot</p>
            </div>
            <div>
              <p className="text-white/40 mb-1">MOBILE</p>
              <p>Left side - Move left</p>
              <p>Right side - Move right + Shoot</p>
              <p>Swipe up - Jump</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── PLAYING ──────────────────────────────────────────────

  if (phase === "playing") {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-1 sm:p-2">
        <canvas
          ref={canvasRef}
          className="block max-w-4xl w-full border border-white/10"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
    );
  }

  // ─── GAME OVER ────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-4 font-mono text-white">
      <h1
        className="text-3xl sm:text-5xl font-bold tracking-widest mb-4 text-center"
        style={{ color: "#ff4444", textShadow: "0 0 20px rgba(255,68,68,0.5)" }}
      >
        GAME OVER
      </h1>
      <p
        className="text-xl sm:text-2xl font-bold mb-6 text-center"
        style={{ color: "#ff6b35" }}
      >
        {overReason}
      </p>

      {overReason === "RETIREMENT DENIED" && (
        <p className="text-white/50 text-sm mb-4 text-center max-w-sm">
          A meteor has destroyed your dream of retirement.
          The universe does not want you to stop working.
        </p>
      )}
      {overReason === "OUT OF ANGER!" && (
        <p className="text-white/50 text-sm mb-4 text-center max-w-sm">
          You ran out of anger. Without rage, there is no fuel.
          Back to the cubicle.
        </p>
      )}

      <div className="border border-white/20 rounded-sm p-4 mb-6 text-center">
        <p className="text-white/60 text-xs">POWERPOINTS DESTROYED</p>
        <p className="text-2xl font-bold" style={{ color: "#ff6b35" }}>{lastKills}</p>
      </div>

      <button
        onClick={() => { setPhase("select"); setSelectedChar(null); }}
        className="border-2 border-[#ff6b35] rounded-sm px-8 py-3 text-[#ff6b35] font-bold
                   hover:bg-[#ff6b35]/10 transition-colors cursor-pointer animate-pulse"
      >
        TRY AGAIN
      </button>
      <p className="text-white/30 text-xs mt-2">(You still won&apos;t retire.)</p>
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────

function CharPreview({ charId }: { charId: CharId }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const ch = CHARS[charId];
    const scale = 3;
    const ox = (canvas.width - ch.w * scale) / 2;
    const oy = canvas.height - ch.h * scale - 2;
    drawSprite(ctx, ch.idle, ox, oy, scale);
  }, [charId]);

  return (
    <canvas
      ref={canvasRef}
      width={60}
      height={70}
      className="block"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-1">
      <span className="w-12 text-right text-white/50">{label}</span>
      <div className="flex-1 h-2 bg-white/10 rounded-sm overflow-hidden">
        <div className="h-full rounded-sm" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
