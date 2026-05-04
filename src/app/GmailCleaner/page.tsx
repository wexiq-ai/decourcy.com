import { FadeIn } from "@/components/FadeIn";

export default function GmailCleanerPage() {
  return (
    <main className="min-h-screen bg-[#071a0e] text-white">
      <TopBar />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#5b9bd5]">
            DeCourcy.com / Phase 1
          </p>
          <h1
            className="mb-3 text-5xl font-bold uppercase tracking-tight md:text-6xl"
            style={{ fontFamily: "var(--font-baskerville), Georgia, serif" }}
          >
            Gmail Cleaner
          </h1>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">
            Foundation Connected — OAuth & Sweep Pending
          </p>
        </FadeIn>

        <FadeIn className="mt-16">
          <SystemDiagram />
        </FadeIn>

        <FadeIn className="mt-16">
          <PhaseStatus />
        </FadeIn>
      </div>
    </main>
  );
}

function TopBar() {
  return (
    <div className="border-b border-[#1a4a2e] bg-[#0d2b18]/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em]">
        <span className="text-white/40">DeCourcy.com / GmailCleaner</span>
        <div className="flex gap-6 text-[#5b9bd5]">
          <span>
            Session <span className="text-white/80">$0.00</span>
          </span>
          <span>
            Lifetime <span className="text-white/80">$0.00</span>
          </span>
          <span>
            Inbox <span className="text-white/80">—</span>
          </span>
        </div>
      </div>
    </div>
  );
}

const STEPS: Array<{ n: number; label: string; sub: string; status: "ready" | "pending" }> = [
  { n: 1, label: "Page Gate", sub: "Password middleware", status: "ready" },
  { n: 2, label: "Database", sub: "Neon Postgres / Drizzle", status: "ready" },
  { n: 3, label: "Background Jobs", sub: "Inngest", status: "ready" },
  { n: 4, label: "Gmail OAuth", sub: "Phase 2", status: "pending" },
  { n: 5, label: "Sweep & Classify", sub: "Phase 3 — Haiku + Sonnet", status: "pending" },
  { n: 6, label: "Bulk Actions", sub: "Phase 4 — archive, unsubscribe", status: "pending" },
  { n: 7, label: "Ongoing Maintenance", sub: "Phase 5 — since-last-visit", status: "pending" },
];

function SystemDiagram() {
  return (
    <div>
      <h2 className="mb-8 text-xs font-bold uppercase tracking-[0.3em] text-white/50">
        Build Pipeline
      </h2>
      <div className="flex flex-col items-stretch gap-3">
        {STEPS.map((step, i) => (
          <div key={step.n}>
            <StepRow step={step} />
            {i < STEPS.length - 1 && <Connector />}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepRow({ step }: { step: (typeof STEPS)[number] }) {
  const isReady = step.status === "ready";
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
          isReady
            ? "border-[#5b9bd5] bg-[#071a0e] text-[#5b9bd5]"
            : "border-white/20 bg-[#071a0e] text-white/30"
        }`}
      >
        {step.n}
      </div>
      <div
        className={`flex-1 rounded border px-5 py-4 ${
          isReady
            ? "border-[#1a4a2e] bg-[#143d24]"
            : "border-white/10 bg-[#0d2b18]/40"
        }`}
      >
        <div className="flex items-baseline justify-between gap-4">
          <p
            className={`text-sm font-bold uppercase tracking-[0.15em] ${
              isReady ? "text-white" : "text-white/40"
            }`}
          >
            {step.label}
          </p>
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
              isReady ? "text-[#5b9bd5]" : "text-white/30"
            }`}
          >
            {isReady ? "Ready" : "Pending"}
          </p>
        </div>
        <p
          className={`mt-1 text-xs ${
            isReady ? "text-white/60" : "text-white/30"
          }`}
        >
          {step.sub}
        </p>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="ml-5 flex h-6 w-px flex-col items-center bg-[#5b9bd5]/40" aria-hidden />
  );
}

function PhaseStatus() {
  return (
    <div className="rounded border border-[#1a4a2e] bg-[#0d2b18] p-8">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#5b9bd5]">
        What This Means
      </p>
      <p className="text-sm leading-relaxed text-white/80">
        Phase 1 lays the foundation: password gate is wired into the existing
        middleware, the Neon database schema is defined for messages, senders,
        VIPs, actions, usage events, and rules, and Inngest is connected for
        background processing. No Gmail data is touched yet.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-white/80">
        Phase 2 adds Google OAuth so this account can connect to Gmail. Phase 3
        runs the initial sweep (~33,000 unread messages) through Haiku and
        Sonnet for categorization, with live cost tracking displayed above.
      </p>
    </div>
  );
}
