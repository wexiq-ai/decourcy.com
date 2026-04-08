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
        <FlowBox step={1} label="Client Request" sublabel="Intake form submitted" />
        <Arrow />

        {/* Step 2 */}
        <FlowBox step={2} label="Initial Review" sublabel="Scope & feasibility check" />
        <Arrow />

        {/* Step 3 — decision split */}
        <FlowBox
          step={3}
          label="Approved?"
          sublabel="Decision gate"
          variant="accent"
        />
        <BranchArrows leftLabel="No" rightLabel="Yes" />

        {/* Step 4 — simultaneous branches */}
        <GroupBox step={4}>
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
        </GroupBox>

        {/* Step 5 */}
        <FlowBox step={5} label="Development" sublabel="Iterative build & review" />
        <TwoWayArrow />

        {/* Step 6 */}
        <FlowBox step={6} label="Client Feedback" sublabel="Review & approval cycle" />
        <Arrow />

        {/* Step 7 */}
        <FlowBox step={7} label="Deliver & Deploy" sublabel="Launch to production" variant="accent" />
      </div>

    </div>
  );
}

/* ── Flow components ── */

function StepIcon({ step }: { step: number }) {
  return (
    <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-[#5b9bd5]/40 bg-[#071a0e] flex items-center justify-center">
      <span className="text-[11px] font-bold text-[#5b9bd5]/70">{step}</span>
    </div>
  );
}

function FlowBox({
  label,
  sublabel,
  variant = "default",
  size = "md",
  step,
}: {
  label: string;
  sublabel?: string;
  variant?: "default" | "accent";
  size?: "sm" | "md";
  step?: number;
}) {
  const base =
    variant === "accent"
      ? "border-[#5b9bd5]/50 bg-[#0d2b18]"
      : "border-[#1a4a2e] bg-[#0d2b18]";
  const padding = size === "sm" ? "px-5 py-3" : "px-8 py-4";

  return (
    <div
      className={`relative ${base} ${padding} w-full border rounded text-center`}
    >
      {step && <StepIcon step={step} />}
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

function GroupBox({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="relative w-full border border-[#5b9bd5]/20 border-dashed rounded-md bg-[#0a2314] p-4">
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-[#5b9bd5]/40 bg-[#071a0e] flex items-center justify-center">
        <span className="text-[11px] font-bold text-[#5b9bd5]/70">{step}</span>
      </div>
      {children}
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
