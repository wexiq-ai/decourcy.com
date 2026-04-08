export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-[#071a0e] text-white px-6 py-16 flex flex-col items-center">
      {/* Page title */}
      <h1 className="text-2xl font-bold tracking-wide mb-2 text-white/90 uppercase">
        Sample Workflow
      </h1>
      <p className="text-xs font-bold text-white/40 mb-16 uppercase tracking-wider">
        A conceptual process flow — top to bottom
      </p>

      {/* Flow container */}
      <div className="flex flex-col items-center gap-0 w-full max-w-md">
        {/* Step 1 */}
        <FlowBox label="Client Request" sublabel="Intake form submitted" />
        <Arrow />

        {/* Step 2 */}
        <FlowBox label="Initial Review" sublabel="Scope & feasibility check" />
        <Arrow />

        {/* Step 3 — decision split */}
        <FlowBox
          label="Approved?"
          sublabel="Decision gate"
          variant="accent"
        />
        <BranchArrows leftLabel="No" rightLabel="Yes" />

        {/* Branches */}
        <div className="grid grid-cols-2 gap-8 w-full">
          <div className="flex flex-col items-center gap-0">
            <FlowBox label="Request Revisions" sublabel="Return to client" size="sm" />
            <ArrowUp />
          </div>
          <div className="flex flex-col items-center gap-0">
            <FlowBox label="Begin Build" sublabel="Assign resources" size="sm" />
            <Arrow />
          </div>
        </div>

        {/* Continue right branch */}
        <FlowBox label="Development" sublabel="Iterative build & review" />
        <TwoWayArrow />
        <FlowBox label="Client Feedback" sublabel="Review & approval cycle" />
        <Arrow />

        {/* Final */}
        <FlowBox label="Deliver & Deploy" sublabel="Launch to production" variant="accent" />
      </div>

    </div>
  );
}

/* ── Flow components ── */

function FlowBox({
  label,
  sublabel,
  variant = "default",
  size = "md",
}: {
  label: string;
  sublabel?: string;
  variant?: "default" | "accent";
  size?: "sm" | "md";
}) {
  const base =
    variant === "accent"
      ? "border-[#5b9bd5]/50 bg-[#0d2b18]"
      : "border-[#1a4a2e] bg-[#0d2b18]";
  const padding = size === "sm" ? "px-5 py-3" : "px-8 py-4";
  const width = size === "sm" ? "w-full" : "w-full";

  return (
    <div
      className={`${base} ${padding} ${width} border rounded text-center`}
    >
      <div className={`font-bold uppercase tracking-wide ${size === "sm" ? "text-sm" : "text-base"} text-white/90`}>
        {label}
      </div>
      {sublabel && (
        <div className={`uppercase font-bold tracking-wider ${size === "sm" ? "text-xs" : "text-sm"} text-white/40 mt-1`}>
          {sublabel}
        </div>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-8 bg-[#5b9bd5]/60" />
      <svg width="12" height="8" viewBox="0 0 12 8" className="text-[#5b9bd5]/60">
        <path d="M6 8L0 0h12z" fill="currentColor" />
      </svg>
    </div>
  );
}

function ArrowUp() {
  return (
    <div className="flex flex-col items-center py-1">
      <svg width="12" height="8" viewBox="0 0 12 8" className="text-[#5b9bd5]/60 rotate-180">
        <path d="M6 8L0 0h12z" fill="currentColor" />
      </svg>
      <div className="w-px h-8 bg-[#5b9bd5]/60" />
    </div>
  );
}

function TwoWayArrow() {
  return (
    <div className="flex flex-col items-center py-1">
      <svg width="12" height="8" viewBox="0 0 12 8" className="text-[#5b9bd5]/60 rotate-180">
        <path d="M6 8L0 0h12z" fill="currentColor" />
      </svg>
      <div className="w-px h-6 bg-[#5b9bd5]/60" />
      <svg width="12" height="8" viewBox="0 0 12 8" className="text-[#5b9bd5]/60">
        <path d="M6 8L0 0h12z" fill="currentColor" />
      </svg>
    </div>
  );
}

function BranchArrows({
  leftLabel,
  rightLabel,
}: {
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div className="relative w-full py-1">
      {/* Vertical stem from parent */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-4 bg-[#5b9bd5]/60" />
      {/* Horizontal bar */}
      <div className="absolute top-4 left-1/4 right-1/4 h-px bg-[#5b9bd5]/60" />
      {/* Left branch down */}
      <div className="absolute top-4 left-1/4 -translate-x-1/2 flex flex-col items-center">
        <div className="w-px h-4 bg-[#5b9bd5]/60" />
        <svg width="12" height="8" viewBox="0 0 12 8" className="text-[#5b9bd5]/60">
          <path d="M6 8L0 0h12z" fill="currentColor" />
        </svg>
        <span className="text-[10px] text-white/30 mt-0.5 uppercase font-bold tracking-wider">{leftLabel}</span>
      </div>
      {/* Right branch down */}
      <div className="absolute top-4 right-1/4 translate-x-1/2 flex flex-col items-center">
        <div className="w-px h-4 bg-[#5b9bd5]/60" />
        <svg width="12" height="8" viewBox="0 0 12 8" className="text-[#5b9bd5]/60">
          <path d="M6 8L0 0h12z" fill="currentColor" />
        </svg>
        <span className="text-[10px] text-white/30 mt-0.5 uppercase font-bold tracking-wider">{rightLabel}</span>
      </div>
      {/* Spacer */}
      <div className="h-16" />
    </div>
  );
}
