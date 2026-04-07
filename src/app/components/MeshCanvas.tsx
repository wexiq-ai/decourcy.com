"use client";

import { useEffect, useRef } from "react";

export default function MeshCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;
    const particles: {
      row: number;
      col: number;
      age: number;
      lifespan: number;
      size: number;
    }[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    // Value noise
    function hash(n: number) {
      const s = Math.sin(n) * 43758.5453;
      return s - Math.floor(s);
    }
    function noise(x: number, y: number) {
      const ix = Math.floor(x),
        iy = Math.floor(y);
      const fx = x - ix,
        fy = y - iy;
      const ux = fx * fx * (3 - 2 * fx),
        uy = fy * fy * (3 - 2 * fy);
      const a = hash(ix + iy * 157.0);
      const b = hash(ix + 1 + iy * 157.0);
      const c = hash(ix + (iy + 1) * 157.0);
      const d = hash(ix + 1 + (iy + 1) * 157.0);
      return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
    }
    function fbm(x: number, y: number) {
      let v = 0,
        a = 1,
        f = 1,
        total = 0;
      for (let i = 0; i < 5; i++) {
        v += noise(x * f, y * f) * a;
        total += a;
        a *= 0.5;
        f *= 2.0;
      }
      return v / total;
    }

    // 3D terrain mesh — rotated so depth flows top-to-bottom
    const COLS = 200;
    const ROWS = 60;
    const GRID_X = 50; // horizontal spread
    const GRID_Z = 14; // depth range

    // Camera / perspective
    const camY = -3.5;
    const camZ = -8;
    const fov = 500;

    function terrainHeight(gx: number, gz: number, t: number) {
      // Scroll terrain "downward" — increase gz over time so mesh flows toward viewer
      const scrollZ = gz - t * 0.02;
      const scrollX = gx - t * 0.01;
      const h1 = fbm(scrollX * 0.15, scrollZ * 0.15) * 4.0;
      const h2 =
        (1.0 - Math.abs(noise(scrollX * 0.08, scrollZ * 0.12) * 2.0 - 1.0)) *
        2.5;
      const h3 =
        Math.sin(scrollX * 0.2 + t * 0.005) *
        Math.cos(scrollZ * 0.15) *
        1.5;
      return h1 + h2 + h3;
    }

    function project(
      x3d: number,
      y3d: number,
      z3d: number,
      w: number,
      h: number
    ) {
      const dz = z3d - camZ;
      if (dz <= 0.1) return null;
      const scale = fov / dz;
      return {
        sx: w * 0.5 + x3d * scale,
        sy: h * 0.5 + (y3d - camY) * scale,
        scale: scale,
        depth: dz,
      };
    }

    // Green color palette based on terrain height
    function colorFromHeight(h: number, depth: number, maxDepth: number) {
      const e = Math.min(1, Math.max(0, (h + 1.0) / 6.5));
      const depthFade = 1.0 - (depth / maxDepth) * 0.6;

      let r: number, g: number, b: number;
      if (e < 0.15) {
        const t = e / 0.15;
        r = 2 + t * 4;
        g = 12 + t * 25;
        b = 8 + t * 18;
      } else if (e < 0.3) {
        const t = (e - 0.15) / 0.15;
        r = 6 + t * 6;
        g = 37 + t * 50;
        b = 26 + t * 30;
      } else if (e < 0.5) {
        const t = (e - 0.3) / 0.2;
        r = 12 + t * 8;
        g = 87 + t * 60;
        b = 56 + t * 30;
      } else if (e < 0.7) {
        const t = (e - 0.5) / 0.2;
        r = 20 + t * 20;
        g = 147 + t * 55;
        b = 86 + t * 30;
      } else if (e < 0.88) {
        const t = (e - 0.7) / 0.18;
        r = 40 + t * 50;
        g = 202 + t * 30;
        b = 116 + t * 30;
      } else {
        const t = (e - 0.88) / 0.12;
        r = 90 + t * 120;
        g = 232 + t * 23;
        b = 146 + t * 60;
      }

      r = Math.floor(r * depthFade);
      g = Math.floor(g * depthFade);
      b = Math.floor(b * depthFade);

      const opacity = (0.15 + e * 0.55) * depthFade;
      return { r, g, b, opacity, e };
    }

    function animate() {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);

      const halfX = GRID_X / 2;
      const maxDepth = GRID_Z + 2;

      // Build projected grid
      const grid: (ReturnType<typeof project> & { height: number })[][] = [];
      for (let row = 0; row < ROWS; row++) {
        const gz = (row / ROWS) * GRID_Z + 1.0;
        const gridRow: (ReturnType<typeof project> & { height: number })[] = [];
        for (let col = 0; col < COLS; col++) {
          const gx = (col / (COLS - 1)) * GRID_X - halfX;
          const gy = -terrainHeight(gx, gz, time);
          const p = project(gx, gy, gz, w, h);
          if (p) {
            gridRow.push({ ...p, height: -gy });
          } else {
            gridRow.push(null as unknown as typeof gridRow[0]);
          }
        }
        grid.push(gridRow);
      }

      // Draw back-to-front
      for (let row = 0; row < ROWS; row++) {
        // Horizontal lines
        ctx!.beginPath();
        let started = false;
        for (let col = 0; col < COLS; col++) {
          const p = grid[row][col];
          if (!p) continue;
          if (!started) {
            ctx!.moveTo(p.sx, p.sy);
            started = true;
          } else ctx!.lineTo(p.sx, p.sy);
        }
        if (started) {
          const midCol = Math.floor(COLS / 2);
          const midP = grid[row][midCol];
          if (midP) {
            const c = colorFromHeight(midP.height, midP.depth, maxDepth);
            ctx!.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.opacity})`;
            ctx!.lineWidth = Math.max(0.3, 0.4 + c.e * 1.2);
            if (c.e > 0.55) {
              ctx!.shadowColor = `rgba(34, 197, 94, ${(c.e - 0.55) * 0.6})`;
              ctx!.shadowBlur = 4 + c.e * 8;
            }
            ctx!.stroke();
            ctx!.shadowBlur = 0;
          }
        }

        // Vertical mesh connectors
        if (row > 0) {
          for (let col = 0; col < COLS; col += 2) {
            const cur = grid[row][col];
            const prev = grid[row - 1][col];
            if (!cur || !prev) continue;

            const c = colorFromHeight(cur.height, cur.depth, maxDepth);
            ctx!.beginPath();
            ctx!.moveTo(prev.sx, prev.sy);
            ctx!.lineTo(cur.sx, cur.sy);
            ctx!.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.opacity * 0.35})`;
            ctx!.lineWidth = Math.max(0.2, 0.3 + c.e * 0.4);
            ctx!.stroke();
          }
        }
      }

      // Neuron dots
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age++;
        if (p.age > p.lifespan) {
          particles.splice(i, 1);
          continue;
        }

        const row = p.row;
        const col = p.col;
        if (row >= grid.length || col >= (grid[0]?.length ?? 0)) continue;
        const gp = grid[row][col];
        if (!gp) continue;

        const maxD = GRID_Z + 2;
        const depthRatio = Math.max(0, 1.0 - gp.depth / maxD);
        const depthIntensity = 0.08 + depthRatio * 0.92;

        const life = p.age / p.lifespan;
        let alpha: number;
        if (life < 0.1) alpha = life / 0.1;
        else if (life > 0.6) alpha = (1 - life) / 0.4;
        else alpha = 1;
        alpha *= depthIntensity;

        const radius = (1.5 + p.size * 1.5) * (0.5 + depthRatio * 0.5);
        const glowSize = (8 + p.size * 6) * depthIntensity;

        ctx!.beginPath();
        ctx!.arc(gp.sx, gp.sy, radius, 0, Math.PI * 2);
        ctx!.shadowColor = `rgba(187, 247, 208, ${0.9 * depthIntensity})`;
        ctx!.shadowBlur = glowSize;
        ctx!.fillStyle = `rgba(220, 252, 231, ${alpha * 0.95})`;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      // Spawn particles
      for (let s = 0; s < 4; s++) {
        if (Math.random() < 0.4) {
          const row = Math.floor(Math.random() * ROWS);
          const col = Math.floor(Math.random() * Math.floor(COLS / 2)) * 2;
          particles.push({
            row,
            col,
            age: 0,
            lifespan: 30 + Math.random() * 40,
            size: Math.random() * 0.8,
          });
        }
      }

      time += 1;
      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0, animation: "fadeIn 2s ease-out 0.5s forwards" }}
    />
  );
}
