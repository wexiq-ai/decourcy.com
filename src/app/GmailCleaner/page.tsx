import { FadeIn } from "@/components/FadeIn";
import { getGmailClient } from "@/lib/gmail/client";
import {
  getProfile,
  getInboxUnreadCount,
  listSampleMessages,
  type SampleMessage,
} from "@/lib/gmail/messages";
import {
  getLatestSweepRun,
  getBucketSummaries,
  getCurrentSweepCost,
  getLifetimeCost,
  isSweepActive,
  isSweepDone,
  type SweepRun,
  type BucketSummary,
} from "@/lib/dashboard/queries";
import { RunSweepButton } from "./components/RunSweepButton";
import { SweepProgress } from "./components/SweepProgress";
import { BucketDashboard } from "./components/BucketDashboard";

export const dynamic = "force-dynamic";

type SearchParams = {
  connected?: string;
  disconnected?: string;
  oauth_error?: string;
  swept?: string;
};

export default async function GmailCleanerPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const view = await loadView();

  return (
    <main className="min-h-screen bg-[#071a0e] text-white">
      <TopBar
        email={view.kind === "connected" ? view.profile.emailAddress : undefined}
        inboxUnread={view.kind === "connected" ? view.inboxUnread : undefined}
        sweepCost={view.kind === "connected" ? view.sweepCost : 0}
        lifetimeCost={view.kind === "connected" ? view.lifetimeCost : 0}
      />
      <div className="mx-auto max-w-5xl px-6 py-16">
        {params.connected && <Banner kind="ok" text="Gmail connected." />}
        {params.disconnected && <Banner kind="muted" text="Gmail disconnected." />}
        {params.oauth_error && (
          <Banner kind="err" text={`OAuth error: ${params.oauth_error}`} />
        )}

        <FadeIn>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#5b9bd5]">
            DeCourcy.com / Phase 3
          </p>
          <h1
            className="mb-3 text-5xl font-bold uppercase tracking-tight md:text-6xl"
            style={{ fontFamily: "var(--font-baskerville), Georgia, serif" }}
          >
            Gmail Cleaner
          </h1>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">
            {view.kind === "disconnected" && "Connect Gmail to Begin"}
            {view.kind === "connected" && view.bodyState === "no-sweep" && "Connected — Ready to Sweep"}
            {view.kind === "connected" && view.bodyState === "running" && "Sweep in Progress"}
            {view.kind === "connected" && view.bodyState === "done" && "Sweep Complete — Action Phase Pending"}
          </p>
        </FadeIn>

        <FadeIn className="mt-16">
          {view.kind === "disconnected" && <ConnectGmailView />}
          {view.kind === "connected" && (
            <ConnectedShell
              email={view.profile.emailAddress}
              messagesTotal={view.profile.messagesTotal}
              inboxUnread={view.inboxUnread}
            >
              {view.bodyState === "no-sweep" && (
                <>
                  <RunSweepButton inboxUnread={view.inboxUnread} />
                  <SampleMessages samples={view.samples} />
                </>
              )}
              {view.bodyState === "running" && view.sweep && (
                <SweepProgress sweep={view.sweep} costSoFar={view.sweepCost} />
              )}
              {view.bodyState === "done" && view.summaries && (
                <BucketDashboard
                  summaries={view.summaries}
                  totalSweepCost={view.sweepCost}
                />
              )}
            </ConnectedShell>
          )}
        </FadeIn>
      </div>
    </main>
  );
}

type View =
  | { kind: "disconnected" }
  | {
      kind: "connected";
      profile: { emailAddress: string; messagesTotal: number };
      inboxUnread: number;
      samples: SampleMessage[];
      sweep: SweepRun | null;
      summaries: BucketSummary[] | null;
      sweepCost: number;
      lifetimeCost: number;
      bodyState: "no-sweep" | "running" | "done";
    };

async function loadView(): Promise<View> {
  const client = await getGmailClient();
  if (!client) return { kind: "disconnected" };

  const sweep = await getLatestSweepRun();
  const active = isSweepActive(sweep);
  const done = isSweepDone(sweep);

  const [profile, inboxUnread, samples, summaries, sweepCost, lifetimeCost] =
    await Promise.all([
      getProfile(client.gmail),
      getInboxUnreadCount(client.gmail),
      done || active ? Promise.resolve([]) : listSampleMessages(client.gmail, 10),
      done ? getBucketSummaries() : Promise.resolve(null),
      getCurrentSweepCost(),
      getLifetimeCost(),
    ]);

  return {
    kind: "connected",
    profile,
    inboxUnread,
    samples,
    sweep,
    summaries,
    sweepCost,
    lifetimeCost,
    bodyState: active ? "running" : done ? "done" : "no-sweep",
  };
}

function TopBar({
  email,
  inboxUnread,
  sweepCost,
  lifetimeCost,
}: {
  email?: string;
  inboxUnread?: number;
  sweepCost: number;
  lifetimeCost: number;
}) {
  return (
    <div className="border-b border-[#1a4a2e] bg-[#0d2b18]/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em]">
        <span className="text-white/40 truncate">
          {email ? `Connected · ${email}` : "DeCourcy.com / GmailCleaner"}
        </span>
        <div className="flex gap-6 text-[#5b9bd5]">
          <span>
            Sweep <span className="text-white/80">${sweepCost.toFixed(4)}</span>
          </span>
          <span>
            Lifetime <span className="text-white/80">${lifetimeCost.toFixed(2)}</span>
          </span>
          <span>
            Inbox{" "}
            <span className="text-white/80">
              {inboxUnread === undefined ? "—" : inboxUnread.toLocaleString()}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function Banner({ kind, text }: { kind: "ok" | "err" | "muted"; text: string }) {
  const cls = {
    ok: "border-[#5b9bd5] bg-[#143d24] text-[#5b9bd5]",
    err: "border-red-400/40 bg-red-900/30 text-red-200",
    muted: "border-white/20 bg-[#0d2b18] text-white/60",
  }[kind];
  return (
    <div
      className={`mb-8 rounded border px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] ${cls}`}
    >
      {text}
    </div>
  );
}

function ConnectGmailView() {
  return (
    <div className="rounded border border-[#1a4a2e] bg-[#0d2b18] p-8">
      <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-[#5b9bd5]">
        Step 1 — Connect Your Mailbox
      </p>
      <p className="mb-8 text-sm leading-relaxed text-white/80">
        Sign in with Google to grant read and modify access to this Gmail
        account. The refresh token is encrypted at rest.
      </p>
      <a
        href="/api/oauth/google/start"
        className="inline-block rounded border border-[#5b9bd5] px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-[#5b9bd5] transition-colors hover:bg-[#5b9bd5]/10"
      >
        Connect Gmail
      </a>
    </div>
  );
}

function ConnectedShell({
  email,
  messagesTotal,
  inboxUnread,
  children,
}: {
  email: string;
  messagesTotal: number;
  inboxUnread: number;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <div className="rounded border border-[#1a4a2e] bg-[#0d2b18] p-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#5b9bd5]">
          Mailbox
        </p>
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Stat label="Account" value={email} />
          <Stat label="Total Messages" value={messagesTotal.toLocaleString()} />
          <Stat label="Inbox Unread" value={inboxUnread.toLocaleString()} />
        </dl>
      </div>

      {children}

      <form action="/api/oauth/google/disconnect" method="POST">
        <button
          type="submit"
          className="rounded border border-white/20 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 transition-colors hover:border-white/40 hover:text-white/80"
        >
          Disconnect Gmail
        </button>
      </form>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-bold text-white truncate">{value}</dd>
    </div>
  );
}

function SampleMessages({ samples }: { samples: SampleMessage[] }) {
  return (
    <div className="rounded border border-[#1a4a2e] bg-[#0d2b18] p-8">
      <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-[#5b9bd5]">
        Latest Unread (Sample of 10)
      </p>
      {samples.length === 0 ? (
        <p className="text-sm text-white/50">Inbox unread is empty.</p>
      ) : (
        <ul className="divide-y divide-[#1a4a2e]">
          {samples.map((m) => (
            <li key={m.id} className="py-3">
              <p className="text-sm font-bold text-white truncate">
                {m.subject || "(no subject)"}
              </p>
              <p className="mt-1 text-xs text-white/50 truncate">{m.from}</p>
              <p className="mt-1 text-xs text-white/40 line-clamp-1">
                {m.snippet}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
