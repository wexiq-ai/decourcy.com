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

    // Sparser grid for less density
    const COLS = 80;
    const ROWS = 40;

    function terrainDisplacement(gx: number, gy: number, t: number) {
      const scrollY = gy - t * 0.03;
      const scrollX = gx - t * 0.006;
      // Bigger amplitudes for more undulation
      const h1 = fbm(scrollX * 0.08, scrollY * 0.08) * 2.0;
      const h2 =
        (1.0 - Math.abs(noise(scrollX * 0.05, scrollY * 0.07) * 2.0 - 1.0)) *
        1.4;
      const h3 =
        Math.sin(scrollX * 0.12 + t * 0.003) *
        Math.cos(scrollY * 0.09) *
        1.0;
      return h1 + h2 + h3;
    }

    // Green color palette
    function colorFromDisplacement(d: number) {
      const e = Math.min(1, Math.max(0, (d + 0.5) / 4.5));

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

      const opacity = 0.15 + e * 0.55;
      return { r, g, b, opacity, e };
    }

    function animate() {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);

      // Trapezoid: narrow at top, wide at bottom
      const topWidth = w * 0.15;
      const bottomWidth = w * 0.75;

      // Continuous downward flow: rows scroll down over time
      // The spacing between rows in pixels
      const totalHeight = h + 200; // extend beyond viewport top and bottom
      const rowSpacing = totalHeight / (ROWS - 1);

      // flowOffset increases over time, pushing everything down
      // When a row goes past the bottom, it wraps to the top
      const flowSpeed = 0.8; // pixels per frame
      const flowOffset = (time * flowSpeed) % rowSpacing;

      // Build the grid with flowing Y positions
      const grid: { sx: number; sy: number; d: number; rowRatio: number }[][] =
        [];
      for (let row = 0; row < ROWS; row++) {
        // Base Y position with flow offset — wraps seamlessly
        let baseY = -100 + row * rowSpacing + flowOffset;
        // Wrap: if a row flows past the bottom edge, it reappears at the top
        if (baseY > h + 100) {
          baseY -= totalHeight;
        }

        // rowRatio for the trapezoid width is based on screen position, not grid index
        const screenRatio = Math.min(1, Math.max(0, (baseY + 100) / (h + 200)));

        const ease = screenRatio * screenRatio;
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

          // Use the row's logical position (accounting for time) for noise continuity
          const gx = colRatio * 20;
          const gy = ((row * rowSpacing + time * flowSpeed) / totalHeight) * 40;
          const d = terrainDisplacement(gx, gy, time);

          const displaceFactor = 15 + screenRatio * 30;
          const dx = d * displaceFactor * 0.7;
          const dy = d * displaceFactor * 0.35;

          gridRow.push({
            sx: baseX + dx,
            sy: baseY + dy,
            d,
            rowRatio: screenRatio,
          });
        }
        grid.push(gridRow);
      }

      // Sort rows by their Y position so we draw top-to-bottom
      const sortedIndices = Array.from({ length: ROWS }, (_, i) => i);
      sortedIndices.sort((a, b) => {
        const ay = grid[a][Math.floor(COLS / 2)]?.sy ?? 0;
        const by = grid[b][Math.floor(COLS / 2)]?.sy ?? 0;
        return ay - by;
      });

      // Draw horizontal lines
      for (const row of sortedIndices) {
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
          const c = colorFromDisplacement(midP.d);
          ctx!.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.opacity})`;
          ctx!.lineWidth = Math.max(0.3, 0.5 + c.e * 1.2);
          if (c.e > 0.55) {
            ctx!.shadowColor = `rgba(34, 197, 94, ${(c.e - 0.55) * 0.5})`;
            ctx!.shadowBlur = 4 + c.e * 6;
          }
          ctx!.stroke();
          ctx!.shadowBlur = 0;
        }
      }

      // Draw vertical connectors between adjacent sorted rows
      for (let i = 1; i < sortedIndices.length; i++) {
        const curIdx = sortedIndices[i];
        const prevIdx = sortedIndices[i - 1];
        // Only connect if rows are close together (not wrapping gap)
        const curY = grid[curIdx][Math.floor(COLS / 2)]?.sy ?? 0;
        const prevY = grid[prevIdx][Math.floor(COLS / 2)]?.sy ?? 0;
        if (Math.abs(curY - prevY) > rowSpacing * 2) continue;

        for (let col = 0; col < COLS; col += 4) {
          const cur = grid[curIdx][col];
          const prev = grid[prevIdx][col];

          const c = colorFromDisplacement(cur.d);
          ctx!.beginPath();
          ctx!.moveTo(prev.sx, prev.sy);
          ctx!.lineTo(cur.sx, cur.sy);
          ctx!.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${c.opacity * 0.25})`;
          ctx!.lineWidth = Math.max(0.2, 0.25 + c.e * 0.3);
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
