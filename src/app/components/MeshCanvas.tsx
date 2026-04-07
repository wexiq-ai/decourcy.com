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

    // Grid dimensions — rows flow top-to-bottom, cols span left-to-right
    const COLS = 160;
    const ROWS = 80;

    function terrainDisplacement(gx: number, gy: number, t: number) {
      // Scroll downward over time
      const scrollY = gy - t * 0.025;
      const scrollX = gx - t * 0.008;
      const h1 = fbm(scrollX * 0.12, scrollY * 0.12) * 1.0;
      const h2 =
        (1.0 - Math.abs(noise(scrollX * 0.08, scrollY * 0.1) * 2.0 - 1.0)) *
        0.6;
      const h3 =
        Math.sin(scrollX * 0.18 + t * 0.004) *
        Math.cos(scrollY * 0.12) *
        0.4;
      return h1 + h2 + h3;
    }

    // Green color palette based on displacement intensity
    function colorFromDisplacement(d: number, rowRatio: number) {
      const e = Math.min(1, Math.max(0, (d + 0.2) / 2.2));

      // Fade at top and bottom edges
      const edgeFade =
        Math.min(1, rowRatio * 4) * Math.min(1, (1 - rowRatio) * 4);

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

      r = Math.floor(r * edgeFade);
      g = Math.floor(g * edgeFade);
      b = Math.floor(b * edgeFade);

      const opacity = (0.15 + e * 0.55) * edgeFade;
      return { r, g, b, opacity, e };
    }

    function animate() {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);

      const marginY = 60;

      // Trapezoid: narrow at top, wide at bottom — perspective funnel
      const topWidth = w * 0.15;
      const bottomWidth = w * 0.75;

      // Build the grid
      const grid: { sx: number; sy: number; d: number; rowRatio: number }[][] =
        [];
      for (let row = 0; row < ROWS; row++) {
        const rowRatio = row / (ROWS - 1);
        const baseY = -marginY + rowRatio * (h + 2 * marginY);

        // Width eased for smoother perspective feel
        const ease = rowRatio * rowRatio;
        const rowWidth = topWidth + (bottomWidth - topWidth) * ease;
        const rowLeft = (w - rowWidth) / 2;

        const gridRow: {
          sx: number;
          sy: number;
          d: number;
          rowRatio: number;
        }[] = [];
        for (let col = 0; col < COLS; col++) {
          const colRatio = col / (COLS - 1);
          const baseX = rowLeft + colRatio * rowWidth;

          const gx = colRatio * 20;
          const gy = rowRatio * 20;
          const d = terrainDisplacement(gx, gy, time);

          const displaceFactor = 10 + rowRatio * 20;
          const dx = d * displaceFactor * 0.6;
          const dy = d * displaceFactor * 0.3;

          gridRow.push({
            sx: baseX + dx,
            sy: baseY + dy,
            d,
            rowRatio,
          });
        }
        grid.push(gridRow);
      }

      // Draw horizontal lines (flowing bands)
      for (let row = 0; row < ROWS; row++) {
        ctx!.beginPath();
        let started = false;
        for (let col = 0; col < COLS; col++) {
          const p = grid[row][col];
          if (!started) {
            ctx!.moveTo(p.sx, p.sy);
            started = true;
          } else {
            ctx!.lineTo(p.sx, p.sy);
          }
        }
        if (started) {
          const midP = grid[row][Math.floor(COLS / 2)];
          const c = colorFromDisplacement(midP.d, midP.rowRatio);
          ctx!.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.opacity})`;
          ctx!.lineWidth = Math.max(0.3, 0.4 + c.e * 1.0);
          if (c.e > 0.55) {
            ctx!.shadowColor = `rgba(34, 197, 94, ${(c.e - 0.55) * 0.5})`;
            ctx!.shadowBlur = 4 + c.e * 6;
          }
          ctx!.stroke();
          ctx!.shadowBlur = 0;
        }
      }

      // Draw vertical connectors (every 3rd column)
      for (let row = 1; row < ROWS; row++) {
        for (let col = 0; col < COLS; col += 3) {
          const cur = grid[row][col];
          const prev = grid[row - 1][col];

          const c = colorFromDisplacement(cur.d, cur.rowRatio);
          ctx!.beginPath();
          ctx!.moveTo(prev.sx, prev.sy);
          ctx!.lineTo(cur.sx, cur.sy);
          ctx!.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.opacity * 0.3})`;
          ctx!.lineWidth = Math.max(0.2, 0.25 + c.e * 0.35);
          ctx!.stroke();
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
