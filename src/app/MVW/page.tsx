"use client";

import { useEffect, useRef, type ReactNode, type SVGProps } from "react";

/* DeCourcy.com palette
   BG          #071a0e   dark forest
   Surface 1   #0d2b18
   Surface 2   #0f3320
   Surface 3   #143d24
   Surface 4   #1a4a2e
   Accent      #5b9bd5   light blue
   Text        #ffffff
*/

const ACCENT = "#5b9bd5";
const SURFACE_1 = "#0d2b18";
const SURFACE_2 = "#0f3320";
const SURFACE_3 = "#143d24";
const SURFACE_4 = "#1a4a2e";

export default function MVWWireframePage() {
  return (
    <div
      className="min-h-screen w-full text-white"
      style={{
        backgroundColor: "#071a0e",
        fontFamily: "var(--font-poppins), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <WireframeChrome />

      <div className="mx-auto max-w-6xl px-6 md:px-10 pb-32">
        <NavStrip />
        <Hero />
        <Numbers />
        <BrandPortfolio />
        <ExchangeNetwork />
        <Values />
        <InvestorRelations />
        <Careers />
        <Newsroom />
        <SiteFooter />
      </div>

      <WireframeFooter />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   WIREFRAME CHROME — top + bottom annotation bars
   ───────────────────────────────────────────────────────────── */

function WireframeChrome() {
  return (
    <div
      className="w-full border-b flex items-center justify-between px-6 py-2 text-[10px] tracking-[0.2em] uppercase"
      style={{
        borderColor: "rgba(91,155,213,0.25)",
        color: "rgba(255,255,255,0.55)",
        backgroundColor: "#050f08",
      }}
    >
      <div className="flex items-center gap-3">
        <span style={{ color: ACCENT }}>◆</span>
        <span>MVW.com / Wireframe v0.1</span>
      </div>
      <div className="hidden md:flex items-center gap-6">
        <span>Viewport · 1440</span>
        <span>Grid · 12-col</span>
        <span>Theme · Forest / Tide</span>
      </div>
      <div>DeCourcy.com</div>
    </div>
  );
}

function WireframeFooter() {
  return (
    <div
      className="w-full border-t flex items-center justify-between px-6 py-2 text-[10px] tracking-[0.2em] uppercase"
      style={{
        borderColor: "rgba(91,155,213,0.25)",
        color: "rgba(255,255,255,0.45)",
        backgroundColor: "#050f08",
      }}
    >
      <div>End of frame</div>
      <div className="hidden md:block">Render · static · concept</div>
      <div style={{ color: ACCENT }}>◆ ◆ ◆</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NAV
   ───────────────────────────────────────────────────────────── */

function NavStrip() {
  const links = [
    "Our Company",
    "Our Brands",
    "Our Values",
    "Investors",
    "Careers",
    "Newsroom",
  ];
  return (
    <nav className="flex items-center justify-between py-6 mt-2">
      <div className="flex items-baseline gap-2">
        <span
          className="text-base font-bold tracking-[0.32em] uppercase"
          style={{ color: "#ffffff" }}
        >
          MVW
        </span>
        <span
          className="text-[9px] tracking-[0.3em] uppercase"
          style={{ color: ACCENT }}
        >
          Marriott Vacations Worldwide
        </span>
      </div>
      <div className="hidden md:flex items-center gap-7">
        {links.map((l) => (
          <span
            key={l}
            className="text-[10px] tracking-[0.22em] uppercase font-semibold text-white/80"
          >
            {l}
          </span>
        ))}
      </div>
      <div
        className="text-[10px] tracking-[0.22em] uppercase font-bold border px-3 py-2 rounded-sm"
        style={{ borderColor: ACCENT, color: ACCENT }}
      >
        Contact ↗
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────
   01 — HERO
   ───────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <Module number="01" label="Hero" caption="Brand promise · above-the-fold">
      <div className="relative pt-6 pb-16">
        {/* Hairline grid markers */}
        <div className="absolute inset-x-0 top-0 flex justify-between text-[9px] uppercase tracking-[0.2em] text-white/30">
          <span>Col 01</span>
          <span>Col 06</span>
          <span>Col 12</span>
        </div>
        <div className="absolute inset-x-0 top-3 h-px" style={{ backgroundColor: "rgba(91,155,213,0.18)" }} />

        <FadeIn>
          <p
            className="text-[10px] tracking-[0.3em] uppercase font-semibold mb-6"
            style={{ color: ACCENT }}
          >
            ◆ The World&apos;s Largest Vacation Ownership Company
          </p>
        </FadeIn>

        <FadeIn>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-[0.92] tracking-tight">
            Inspiring
            <br />
            Experiences
            <br />
            <span style={{ color: ACCENT }}>for Life.</span>
          </h1>
        </FadeIn>

        <FadeIn>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-7">
              <p className="text-base md:text-lg text-white/75 font-light leading-relaxed max-w-xl">
                Vacations are our dedicated time to relax. To revitalize. To dream. We build the most
                expansive, immersive world of leisure experiences in the industry — and the long-lasting
                relationships that come with them.
              </p>
            </div>
            <div className="md:col-span-5">
              <HorizonGlyph />
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Cta primary>Explore Our Brands ↘</Cta>
            <Cta>Investor Relations ↗</Cta>
            <span className="text-[10px] tracking-[0.22em] uppercase text-white/40 ml-auto">
              Scroll · 08 modules below
            </span>
          </div>
        </FadeIn>
      </div>
    </Module>
  );
}

function HorizonGlyph() {
  return (
    <svg
      viewBox="0 0 320 140"
      className="w-full h-auto"
      style={{ color: ACCENT }}
      aria-hidden
    >
      {/* sun */}
      <circle cx="160" cy="78" r="34" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="160" cy="78" r="22" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.6" />
      {/* horizon */}
      <line x1="0" y1="110" x2="320" y2="110" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="116" x2="320" y2="116" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      {/* tick marks like a survey scale */}
      {Array.from({ length: 21 }).map((_, i) => (
        <line
          key={i}
          x1={i * 16}
          y1="110"
          x2={i * 16}
          y2={i % 5 === 0 ? 122 : 116}
          stroke="currentColor"
          strokeWidth="0.5"
          opacity={i % 5 === 0 ? 0.7 : 0.3}
        />
      ))}
      {/* palm-as-line glyphs */}
      <g stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.7">
        <line x1="50" y1="110" x2="50" y2="78" />
        <path d="M50 78 q-12 -8 -22 -4 M50 78 q12 -8 22 -4 M50 78 q-6 -12 -14 -16 M50 78 q6 -12 14 -16" />
      </g>
      <g stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.7">
        <line x1="270" y1="110" x2="270" y2="84" />
        <path d="M270 84 q-10 -6 -18 -3 M270 84 q10 -6 18 -3 M270 84 q-5 -10 -12 -13 M270 84 q5 -10 12 -13" />
      </g>
      {/* annotations */}
      <text x="2" y="135" fill="currentColor" fontSize="7" letterSpacing="2" opacity="0.6">
        FIG. 01 — HORIZON
      </text>
      <text x="260" y="135" fill="currentColor" fontSize="7" letterSpacing="2" opacity="0.6">
        E · 92°
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   02 — BY THE NUMBERS
   ───────────────────────────────────────────────────────────── */

function Numbers() {
  const stats = [
    { figure: "700K+", label: "Owner Families" },
    { figure: "90%+", label: "Guest Satisfaction" },
    { figure: "120", label: "Vacation Properties" },
    { figure: "1.6M", label: "Exchange Members" },
    { figure: "22K+", label: "Associates Worldwide" },
  ];
  return (
    <Module number="02" label="By the numbers" caption="Scale of the platform">
      <FadeIn>
        <div
          className="grid grid-cols-2 md:grid-cols-5 border-l border-t"
          style={{ borderColor: "rgba(91,155,213,0.25)" }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="border-r border-b px-5 py-7 flex flex-col gap-2"
              style={{
                borderColor: "rgba(91,155,213,0.25)",
                backgroundColor: i % 2 === 0 ? SURFACE_1 : SURFACE_2,
              }}
            >
              <span className="text-[9px] tracking-[0.25em] uppercase text-white/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: ACCENT }}>
                {s.figure}
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/80 font-semibold">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </FadeIn>
    </Module>
  );
}

/* ─────────────────────────────────────────────────────────────
   03 — BRAND PORTFOLIO
   ───────────────────────────────────────────────────────────── */

function BrandPortfolio() {
  const luxury = [
    { name: "The Ritz-Carlton Club", glyph: <CrownGlyph /> },
    { name: "St. Regis Residence Club", glyph: <DiamondGlyph /> },
  ];
  const premium = [
    { name: "Marriott Vacation Club", glyph: <MGlyph /> },
    { name: "Westin Vacation Club", glyph: <LeafGlyph /> },
    { name: "Sheraton Vacation Club", glyph: <WaveGlyph /> },
    { name: "Grand Residences by Marriott", glyph: <FacadeGlyph /> },
    { name: "Hyatt Vacation Club", glyph: <HGlyph /> },
  ];

  return (
    <Module number="03" label="Brand portfolio" caption="Seven vacation ownership brands · two service tiers">
      <FadeIn>
        <Tier label="Luxury Tier" letter="L" count={luxury.length}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {luxury.map((b) => (
              <BrandCard key={b.name} name={b.name} glyph={b.glyph} tier="L" />
            ))}
          </div>
        </Tier>
      </FadeIn>

      <FadeIn>
        <div className="mt-8" />
        <Tier label="Premium Tier" letter="P" count={premium.length}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {premium.map((b) => (
              <BrandCard key={b.name} name={b.name} glyph={b.glyph} tier="P" compact />
            ))}
          </div>
        </Tier>
      </FadeIn>
    </Module>
  );
}

function Tier({
  label,
  letter,
  count,
  children,
}: {
  label: string;
  letter: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span
          className="w-7 h-7 inline-flex items-center justify-center rounded-full border text-[10px] font-bold"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          {letter}
        </span>
        <span className="text-xs tracking-[0.25em] uppercase font-bold text-white">
          {label}
        </span>
        <span className="text-[10px] tracking-[0.22em] uppercase text-white/40">
          / {count.toString().padStart(2, "0")} brands
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: "rgba(91,155,213,0.2)" }} />
      </div>
      {children}
    </div>
  );
}

function BrandCard({
  name,
  glyph,
  tier,
  compact = false,
}: {
  name: string;
  glyph: ReactNode;
  tier: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative border rounded-sm flex flex-col ${
        compact ? "p-4 gap-3" : "p-6 gap-4"
      }`}
      style={{
        borderColor: "rgba(91,155,213,0.3)",
        backgroundColor: SURFACE_2,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[9px] tracking-[0.28em] uppercase font-bold"
          style={{ color: ACCENT }}
        >
          Tier {tier}
        </span>
        <span className="text-[9px] tracking-[0.28em] uppercase text-white/30">
          ↗
        </span>
      </div>
      <div
        className={`${compact ? "h-16" : "h-24"} flex items-center justify-center`}
        style={{ color: ACCENT }}
      >
        {glyph}
      </div>
      <div
        className={`${compact ? "text-[10px]" : "text-xs"} font-bold tracking-[0.18em] uppercase text-white leading-snug`}
      >
        {name}
      </div>
      <div
        className="absolute left-2 right-2 bottom-1 h-px"
        style={{ backgroundColor: "rgba(91,155,213,0.15)" }}
      />
    </div>
  );
}

/* Brand glyphs — abstract wireframe marks (no real logos) */

function MGlyph(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 60" className="w-12 h-12" {...p}>
      <path d="M8 50 V14 L30 38 L52 14 V50" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="4" y1="54" x2="56" y2="54" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

function LeafGlyph() {
  return (
    <svg viewBox="0 0 60 60" className="w-12 h-12">
      <path
        d="M30 8 C46 14, 50 30, 30 52 C10 30, 14 14, 30 8 Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <line x1="30" y1="8" x2="30" y2="52" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}

function WaveGlyph() {
  return (
    <svg viewBox="0 0 60 60" className="w-12 h-12">
      <circle cx="30" cy="30" r="22" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
      <path d="M8 30 q11 -10 22 0 t22 0" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M8 38 q11 -10 22 0 t22 0" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.7" />
    </svg>
  );
}

function FacadeGlyph() {
  return (
    <svg viewBox="0 0 60 60" className="w-12 h-12">
      <path d="M10 50 V22 L30 10 L50 22 V50 Z" stroke="currentColor" strokeWidth="1" fill="none" />
      <line x1="22" y1="50" x2="22" y2="32" stroke="currentColor" strokeWidth="0.75" />
      <line x1="38" y1="50" x2="38" y2="32" stroke="currentColor" strokeWidth="0.75" />
      <line x1="22" y1="32" x2="38" y2="32" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}

function CrownGlyph() {
  return (
    <svg viewBox="0 0 60 60" className="w-14 h-14">
      <path d="M10 44 L14 22 L24 32 L30 16 L36 32 L46 22 L50 44 Z" stroke="currentColor" strokeWidth="1" fill="none" />
      <line x1="8" y1="50" x2="52" y2="50" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="14" cy="22" r="1.5" fill="currentColor" />
      <circle cx="46" cy="22" r="1.5" fill="currentColor" />
      <circle cx="30" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function DiamondGlyph() {
  return (
    <svg viewBox="0 0 60 60" className="w-14 h-14">
      <path d="M30 8 L52 26 L30 52 L8 26 Z" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M8 26 L52 26" stroke="currentColor" strokeWidth="0.75" />
      <path d="M30 8 L18 26 L30 52 L42 26 Z" stroke="currentColor" strokeWidth="0.5" opacity="0.6" fill="none" />
    </svg>
  );
}

function HGlyph() {
  return (
    <svg viewBox="0 0 60 60" className="w-12 h-12">
      <line x1="14" y1="12" x2="14" y2="48" stroke="currentColor" strokeWidth="1.5" />
      <line x1="46" y1="12" x2="46" y2="48" stroke="currentColor" strokeWidth="1.5" />
      <line x1="14" y1="30" x2="46" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <line x1="4" y1="54" x2="56" y2="54" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   04 — EXCHANGE NETWORK
   ───────────────────────────────────────────────────────────── */

function ExchangeNetwork() {
  return (
    <Module
      number="04"
      label="Exchange & 3rd-party network"
      caption="Interval International · Aqua-Aston Hospitality"
    >
      <FadeIn>
        <div
          className="border rounded-sm relative overflow-hidden"
          style={{ borderColor: "rgba(91,155,213,0.3)", backgroundColor: SURFACE_1 }}
        >
          {/* Globe + arcs visualization */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            <div
              className="md:col-span-5 p-8 border-b md:border-b-0 md:border-r"
              style={{ borderColor: "rgba(91,155,213,0.25)" }}
            >
              <GlobeGlyph />
            </div>
            <div className="md:col-span-7 p-8 flex flex-col gap-6">
              <p
                className="text-[10px] tracking-[0.3em] uppercase font-bold"
                style={{ color: ACCENT }}
              >
                ◆ Reach
              </p>
              <h3 className="text-2xl md:text-3xl font-bold uppercase leading-tight">
                A Global Lattice of
                <br />
                Vacation Possibilities
              </h3>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <NetworkStat figure="90+" label="Countries" />
                <NetworkStat figure="3.2K+" label="Properties" />
                <NetworkStat figure="1.6M" label="Members" />
              </div>
              <p className="text-sm text-white/70 font-light leading-relaxed">
                Two networks — <span className="text-white">Interval International</span> and{" "}
                <span className="text-white">Aqua-Aston Hospitality</span> — connect owners and members
                to a vacation universe that extends well beyond the seven branded clubs.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </Module>
  );
}

function NetworkStat({ figure, label }: { figure: string; label: string }) {
  return (
    <div
      className="border-l pl-3 py-1"
      style={{ borderColor: ACCENT }}
    >
      <div className="text-2xl font-bold" style={{ color: ACCENT }}>{figure}</div>
      <div className="text-[10px] tracking-[0.2em] uppercase text-white/70 font-semibold">{label}</div>
    </div>
  );
}

function GlobeGlyph() {
  return (
    <svg viewBox="0 0 280 240" className="w-full h-auto" style={{ color: ACCENT }}>
      {/* concentric rings */}
      <circle cx="140" cy="120" r="100" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.4" />
      <circle cx="140" cy="120" r="72" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.55" />
      <circle cx="140" cy="120" r="44" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.7" />
      {/* meridians */}
      <ellipse cx="140" cy="120" rx="100" ry="40" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
      <ellipse cx="140" cy="120" rx="40" ry="100" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
      {/* network nodes */}
      {[
        [60, 80],
        [110, 60],
        [180, 70],
        [220, 110],
        [200, 170],
        [120, 190],
        [70, 160],
        [140, 120],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3" fill="currentColor" />
          <circle cx={x} cy={y} r="6" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
        </g>
      ))}
      {/* arcs between */}
      <path d="M60 80 Q120 50 180 70" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M180 70 Q230 130 200 170" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M70 160 Q110 200 200 170" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M60 80 Q40 130 70 160" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
      {/* annotations */}
      <text x="6" y="232" fill="currentColor" fontSize="7" letterSpacing="2" opacity="0.55">
        FIG. 04 — NETWORK TOPOLOGY
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   05 — VALUES
   ───────────────────────────────────────────────────────────── */

function Values() {
  const pillars = [
    {
      title: "Put People First",
      copy: "Associates, owners, guests — relationships are the platform.",
      icon: <PeopleIcon />,
    },
    {
      title: "Pursue Excellence",
      copy: "Industry-leading guest satisfaction held to a 90%+ standard.",
      icon: <StarIcon />,
    },
    {
      title: "Embrace Change",
      copy: "Acquisitions, integrations, and new brands are how we grow.",
      icon: <CycleIcon />,
    },
    {
      title: "Act with Integrity",
      copy: "Governance, human rights, and corporate responsibility, by default.",
      icon: <ShieldIcon />,
    },
  ];
  return (
    <Module number="05" label="Our values" caption="Four operating principles">
      <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {pillars.map((p, i) => (
            <div
              key={p.title}
              className="border rounded-sm p-6 flex flex-col gap-4 min-h-[200px]"
              style={{
                borderColor: "rgba(91,155,213,0.3)",
                backgroundColor: i % 2 === 0 ? SURFACE_2 : SURFACE_3,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] tracking-[0.28em] uppercase font-bold" style={{ color: ACCENT }}>
                  V·{String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ color: ACCENT }}>{p.icon}</div>
              </div>
              <div className="text-sm font-bold uppercase tracking-[0.15em] leading-snug">
                {p.title}
              </div>
              <div className="text-xs text-white/65 font-light leading-relaxed">
                {p.copy}
              </div>
              <div className="mt-auto h-px w-full" style={{ backgroundColor: "rgba(91,155,213,0.25)" }} />
            </div>
          ))}
        </div>
      </FadeIn>
    </Module>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 28 28" className="w-7 h-7">
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="20" cy="12" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M2 24 Q10 16 18 24" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M14 24 Q20 18 26 24" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg viewBox="0 0 28 28" className="w-7 h-7">
      <path d="M14 3 L17 11 L25 12 L19 18 L21 26 L14 22 L7 26 L9 18 L3 12 L11 11 Z" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}
function CycleIcon() {
  return (
    <svg viewBox="0 0 28 28" className="w-7 h-7">
      <path d="M5 14 a9 9 0 0 1 17 -3" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M23 14 a9 9 0 0 1 -17 3" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M19 8 L23 8 L23 12" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M9 20 L5 20 L5 16" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 28 28" className="w-7 h-7">
      <path d="M14 3 L24 7 V14 Q24 21 14 25 Q4 21 4 14 V7 Z" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M10 14 L13 17 L18 11" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   06 — INVESTOR RELATIONS
   ───────────────────────────────────────────────────────────── */

function InvestorRelations() {
  return (
    <Module number="06" label="Investor relations" caption="VAC · NYSE">
      <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Stock card */}
          <div
            className="md:col-span-5 border rounded-sm p-6 flex flex-col gap-4"
            style={{ borderColor: "rgba(91,155,213,0.3)", backgroundColor: SURFACE_2 }}
          >
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: ACCENT }}>
                NYSE · VAC
              </span>
              <span className="text-[9px] tracking-[0.22em] uppercase text-white/40">
                Live · delayed 15m
              </span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-bold leading-none">$▮▮.▮▮</span>
              <span className="text-sm font-bold pb-1" style={{ color: ACCENT }}>▲ +0.00%</span>
            </div>
            {/* sparkline */}
            <SparkLine />
            <div className="grid grid-cols-3 gap-3 mt-2">
              <KV k="Mkt Cap" v="$ ▮.▮ B" />
              <KV k="P/E" v="▮▮ ×" />
              <KV k="Yield" v="▮.▮ %" />
            </div>
          </div>

          {/* Filings + earnings */}
          <div className="md:col-span-7 grid grid-cols-1 gap-4">
            <div
              className="border rounded-sm p-6"
              style={{ borderColor: "rgba(91,155,213,0.3)", backgroundColor: SURFACE_3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold tracking-[0.22em] uppercase">Latest Filings</span>
                <div className="flex-1 h-px" style={{ backgroundColor: "rgba(91,155,213,0.2)" }} />
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/40">SEC EDGAR ↗</span>
              </div>
              <ul className="divide-y" style={{ borderColor: "rgba(91,155,213,0.15)" }}>
                {[
                  { tag: "10-Q", title: "Quarterly Report — Q1 2026", date: "Apr 24" },
                  { tag: "8-K", title: "Material Event Disclosure", date: "Apr 18" },
                  { tag: "DEF 14A", title: "Proxy Statement — Annual Meeting", date: "Mar 29" },
                  { tag: "10-K", title: "Annual Report — FY 2025", date: "Feb 26" },
                ].map((f) => (
                  <li
                    key={f.title}
                    className="flex items-center gap-4 py-3 text-xs"
                    style={{ borderColor: "rgba(91,155,213,0.15)" }}
                  >
                    <span
                      className="text-[10px] tracking-[0.22em] uppercase font-bold w-16"
                      style={{ color: ACCENT }}
                    >
                      {f.tag}
                    </span>
                    <span className="flex-1 text-white/85">{f.title}</span>
                    <span className="text-white/40 tracking-[0.2em] uppercase text-[10px]">{f.date}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="border rounded-sm p-6 flex items-center justify-between gap-4"
              style={{ borderColor: "rgba(91,155,213,0.3)", backgroundColor: SURFACE_4 }}
            >
              <div>
                <div className="text-[10px] tracking-[0.28em] uppercase font-bold" style={{ color: ACCENT }}>
                  Next Earnings Call
                </div>
                <div className="text-lg font-bold uppercase tracking-[0.12em] mt-1">
                  Q2 2026 · Live Webcast
                </div>
                <div className="text-xs text-white/60 mt-1">
                  Thursday · 10:00 a.m. ET · 60-min Q&amp;A
                </div>
              </div>
              <Cta primary>Add to Calendar ↘</Cta>
            </div>
          </div>
        </div>
      </FadeIn>
    </Module>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[9px] tracking-[0.25em] uppercase text-white/40 font-semibold">{k}</div>
      <div className="text-sm font-bold mt-1">{v}</div>
    </div>
  );
}

function SparkLine() {
  // Generated wireframe path; visual placeholder only.
  return (
    <svg viewBox="0 0 320 60" className="w-full h-14" style={{ color: ACCENT }} aria-hidden>
      <path
        d="M0 40 L20 36 L40 38 L60 30 L80 32 L100 24 L120 28 L140 18 L160 22 L180 14 L200 18 L220 12 L240 22 L260 16 L280 24 L300 14 L320 18"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
      />
      <path
        d="M0 40 L20 36 L40 38 L60 30 L80 32 L100 24 L120 28 L140 18 L160 22 L180 14 L200 18 L220 12 L240 22 L260 16 L280 24 L300 14 L320 18 L320 60 L0 60 Z"
        fill="currentColor"
        opacity="0.08"
      />
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={i}
          x1={i * 64}
          y1="0"
          x2={i * 64}
          y2="60"
          stroke="currentColor"
          strokeWidth="0.4"
          opacity="0.15"
        />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   07 — CAREERS
   ───────────────────────────────────────────────────────────── */

function Careers() {
  return (
    <Module number="07" label="Careers" caption="Join 22,000+ associates worldwide">
      <FadeIn>
        <div
          className="relative border rounded-sm overflow-hidden"
          style={{ borderColor: "rgba(91,155,213,0.3)", backgroundColor: SURFACE_1 }}
        >
          {/* Pattern strip */}
          <div className="flex h-2">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 border-r"
                style={{
                  borderColor: "rgba(91,155,213,0.25)",
                  backgroundColor: i % 7 === 0 ? ACCENT : "transparent",
                  opacity: i % 7 === 0 ? 0.7 : 1,
                }}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-8">
            <div className="md:col-span-7 flex flex-col gap-4">
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: ACCENT }}>
                ◆ Now Hiring
              </p>
              <h3 className="text-2xl md:text-4xl font-bold uppercase leading-tight">
                Build a Career Where
                <br />
                People Build Memories.
              </h3>
              <p className="text-sm text-white/70 font-light max-w-xl leading-relaxed">
                Open roles across resorts, sales, technology, and corporate. Every associate is part of
                delivering inspiring experiences for life — for owners, guests, and each other.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <Cta primary>Search Open Roles ↘</Cta>
                <Cta>Life at MVW ↗</Cta>
              </div>
            </div>
            <div className="md:col-span-5 grid grid-cols-2 gap-3">
              {[
                ["140+", "Job Categories"],
                ["48", "Countries"],
                ["22K+", "Associates"],
                ["94%", "Would Recommend"],
              ].map(([n, l]) => (
                <div
                  key={l}
                  className="border rounded-sm p-4 flex flex-col gap-1"
                  style={{ borderColor: "rgba(91,155,213,0.3)", backgroundColor: SURFACE_3 }}
                >
                  <div className="text-2xl font-bold" style={{ color: ACCENT }}>
                    {n}
                  </div>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-white/70 font-semibold">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </Module>
  );
}

/* ─────────────────────────────────────────────────────────────
   08 — NEWSROOM
   ───────────────────────────────────────────────────────────── */

function Newsroom() {
  const stories = [
    {
      tag: "Earnings",
      title: "MVW Reports Strong Q1 Vacation Ownership Performance",
      kicker: "Press Release",
      date: "Apr 24, 2026",
    },
    {
      tag: "Brand",
      title: "Hyatt Vacation Club Adds Two New Resort Destinations",
      kicker: "Brand News",
      date: "Apr 12, 2026",
    },
    {
      tag: "ESG",
      title: "2025 Corporate Responsibility Report Now Available",
      kicker: "Sustainability",
      date: "Apr 02, 2026",
    },
  ];
  return (
    <Module number="08" label="Newsroom" caption="Latest from MVW">
      <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stories.map((s, i) => (
            <article
              key={s.title}
              className="border rounded-sm p-6 flex flex-col gap-4 group"
              style={{
                borderColor: "rgba(91,155,213,0.3)",
                backgroundColor: i === 0 ? SURFACE_3 : SURFACE_2,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[9px] tracking-[0.28em] uppercase font-bold border px-2 py-1 rounded-sm"
                  style={{ color: ACCENT, borderColor: ACCENT }}
                >
                  {s.tag}
                </span>
                <span className="text-[10px] tracking-[0.22em] uppercase text-white/40">{s.date}</span>
              </div>
              {/* Title illustration: stacked bars */}
              <div className="h-20 flex items-end gap-1" style={{ color: ACCENT }}>
                {Array.from({ length: 24 }).map((_, j) => (
                  <div
                    key={j}
                    className="flex-1"
                    style={{
                      backgroundColor: "currentColor",
                      opacity: 0.15 + ((j * 7 + i * 3) % 10) / 14,
                      height: `${20 + ((j * 11 + i * 17) % 70)}%`,
                    }}
                  />
                ))}
              </div>
              <div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-white/50 mb-2">
                  {s.kicker}
                </div>
                <h4 className="text-base font-bold uppercase leading-snug tracking-[0.05em]">
                  {s.title}
                </h4>
              </div>
              <div
                className="mt-auto text-[10px] tracking-[0.25em] uppercase font-bold flex items-center gap-2"
                style={{ color: ACCENT }}
              >
                Read story <span>↗</span>
              </div>
            </article>
          ))}
        </div>
        <div className="flex items-center justify-end mt-4">
          <span className="text-[10px] tracking-[0.25em] uppercase text-white/50">
            View all news ↗
          </span>
        </div>
      </FadeIn>
    </Module>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────────────────────────── */

function SiteFooter() {
  return (
    <Module number="09" label="Footer" caption="Brand · Legal · Social">
      <FadeIn>
        <div
          className="border rounded-sm p-8"
          style={{ borderColor: "rgba(91,155,213,0.3)", backgroundColor: SURFACE_1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8">
            <div className="col-span-2 md:col-span-4">
              <div className="text-2xl font-bold tracking-[0.32em] uppercase">MVW</div>
              <div className="text-[10px] tracking-[0.28em] uppercase mt-2" style={{ color: ACCENT }}>
                Marriott Vacations Worldwide
              </div>
              <p className="text-xs text-white/55 mt-4 leading-relaxed">
                The world&apos;s largest company dedicated exclusively to vacation ownership and exchange.
                Headquartered in Orlando, FL.
              </p>
            </div>
            <FooterCol title="Company" items={["About Us", "Executive Leadership", "Awards", "Newsroom"]} />
            <FooterCol title="Investors" items={["Stock Data", "Filings", "Press Releases", "Governance"]} />
            <FooterCol title="Engage" items={["Careers", "Contact Us", "Owner Login", "Corporate Responsibility"]} />
            <FooterCol title="Legal" items={["Privacy Policy", "Terms of Use", "Accessibility", "Human Rights"]} />
          </div>
          <div
            className="mt-8 pt-6 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[10px] tracking-[0.22em] uppercase text-white/45"
            style={{ borderColor: "rgba(91,155,213,0.2)" }}
          >
            <div>© 2026 Marriott Vacations Worldwide Corporation</div>
            <div className="flex items-center gap-5">
              <span>LinkedIn ↗</span>
              <span>Facebook ↗</span>
              <span>Instagram ↗</span>
            </div>
          </div>
        </div>
      </FadeIn>
    </Module>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="md:col-span-2">
      <div className="text-[10px] tracking-[0.28em] uppercase font-bold" style={{ color: ACCENT }}>
        {title}
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i} className="text-xs text-white/75 font-light">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SHARED — Module wrapper, Cta, FadeIn
   ───────────────────────────────────────────────────────────── */

function Module({
  number,
  label,
  caption,
  children,
}: {
  number: string;
  label: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-16 md:mt-24 first:mt-8">
      <div className="flex items-center gap-3 mb-6">
        <span
          className="text-[10px] tracking-[0.3em] uppercase font-bold border px-2 py-1 rounded-sm"
          style={{ color: ACCENT, borderColor: ACCENT }}
        >
          MODULE · {number}
        </span>
        <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-white">
          {label}
        </span>
        <span className="text-[10px] tracking-[0.22em] uppercase text-white/40">
          / {caption}
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: "rgba(91,155,213,0.2)" }} />
      </div>
      {children}
    </section>
  );
}

function Cta({
  children,
  primary = false,
}: {
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-3 rounded-sm text-[10px] tracking-[0.28em] uppercase font-bold border"
      style={{
        backgroundColor: primary ? ACCENT : "transparent",
        color: primary ? "#071a0e" : ACCENT,
        borderColor: ACCENT,
      }}
    >
      {children}
    </span>
  );
}

function FadeIn({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add("fade-in-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("fade-in-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="fade-in-hidden w-full">
      {children}
    </div>
  );
}
