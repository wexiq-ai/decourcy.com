"use client";

/**
 * LeadStar Pattern Style 3 — gold tech-line accents on the dark background.
 * Pure SVG so it's crisp at any resolution.
 */
export function TechLines() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden opacity-50">
      <svg viewBox="0 0 1200 200" preserveAspectRatio="xMaxYMin slice" className="w-full h-full">
        <defs>
          <linearGradient id="fadeRight" x1="0" x2="1">
            <stop offset="0" stopColor="#eeb54e" stopOpacity="0" />
            <stop offset="0.4" stopColor="#eeb54e" stopOpacity="0.45" />
            <stop offset="1" stopColor="#eeb54e" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="fadeRightFaint" x1="0" x2="1">
            <stop offset="0" stopColor="#eeb54e" stopOpacity="0" />
            <stop offset="0.5" stopColor="#eeb54e" stopOpacity="0.2" />
            <stop offset="1" stopColor="#eeb54e" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <g fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M600 40 L850 40 L880 60 L1100 60" stroke="url(#fadeRight)" />
          <circle cx="1100" cy="60" r="3" fill="#eeb54e" />
          <path d="M650 90 L900 90 L930 110 L1170 110" stroke="url(#fadeRight)" />
          <circle cx="1170" cy="110" r="3" fill="#eeb54e" />
          <path d="M700 140 L820 140 L850 160 L1080 160" stroke="url(#fadeRightFaint)" />
          <circle cx="1080" cy="160" r="2.5" fill="#eeb54e" opacity="0.7" />
          <path d="M580 70 L720 70" stroke="url(#fadeRightFaint)" />
        </g>
      </svg>
    </div>
  );
}
