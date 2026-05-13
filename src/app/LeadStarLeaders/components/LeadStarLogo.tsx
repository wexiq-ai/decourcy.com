type LogoSize = "sm" | "md" | "lg";

const dims: Record<LogoSize, { compass: number; wordmark: string; divider: string; gap: string }> = {
  sm: { compass: 36, wordmark: "text-xl", divider: "h-9", gap: "gap-3" },
  md: { compass: 56, wordmark: "text-3xl", divider: "h-14", gap: "gap-4" },
  lg: { compass: 88, wordmark: "text-5xl", divider: "h-[88px]", gap: "gap-6" },
};

export function CompassStar({ size = 56, color = "#eeb54e", innerColor = "#231f20" }: { size?: number; color?: string; innerColor?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="3" strokeDasharray="36 8 4 8 36 8 4 8" />
      {/* Cardinal points (large) */}
      <polygon points="50,8 56,46 50,50 44,46" fill={color} />
      <polygon points="50,92 56,54 50,50 44,54" fill={color} />
      <polygon points="8,50 46,44 50,50 46,56" fill={color} />
      <polygon points="92,50 54,44 50,50 54,56" fill={color} />
      {/* Inter-cardinal accents (inner color) */}
      <polygon points="50,28 54,46 50,50 46,46" fill={innerColor} />
      <polygon points="50,72 54,54 50,50 46,54" fill={innerColor} />
      <polygon points="28,50 46,46 50,50 46,54" fill={innerColor} />
      <polygon points="72,50 54,46 50,50 54,54" fill={innerColor} />
      <circle cx="50" cy="50" r="2.5" fill="#f9f9f9" />
    </svg>
  );
}

export function LeadStarLogo({ size = "md", showPowered = true }: { size?: LogoSize; showPowered?: boolean }) {
  const d = dims[size];
  return (
    <div className="flex flex-col items-start">
      <div className={`flex items-center ${d.gap}`}>
        <div className={`${d.wordmark} font-light tracking-[0.18em] leading-none text-[#f9f9f9]`}>
          LEAD
          <br />
          STAR
        </div>
        <div className={`w-px ${d.divider} bg-[#f9f9f9]/85`} />
        <CompassStar size={d.compass} />
      </div>
      {showPowered && (
        <div className="text-[0.625rem] tracking-[0.18em] uppercase text-[#f9f9f9]/70 mt-2 self-center">
          Powered By <span className="text-[#eeb54e] font-semibold">EnrollHere</span>
        </div>
      )}
    </div>
  );
}
