import { FadeIn } from "@/components/FadeIn";
import { getGmailClient } from "@/lib/gmail/client";
import {
  getProfile,
  getInboxUnreadCount,
  listSampleMessages,
  type SampleMessage,
} from "@/lib/gmail/messages";

export const dynamic = "force-dynamic";

type SearchParams = {
  connected?: string;
  disconnected?: string;
  oauth_error?: string;
};

export default async function GmailCleanerPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const connection = await loadConnection();

  return (
    <main className="min-h-screen bg-[#071a0e] text-white">
      <TopBar
        email={connection?.profile.emailAddress}
        inboxUnread={connection?.inboxUnread}
      />
      <div className="mx-auto max-w-5xl px-6 py-16">
        {params.connected && (
          <Banner kind="ok" text="Gmail connected." />
        )}
        {params.disconnected && (
          <Banner kind="muted" text="Gmail disconnected." />
        )}
        {params.oauth_error && (
          <Banner kind="err" text={`OAuth error: ${params.oauth_error}`} />
        )}

        <FadeIn>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#5b9bd5]">
            DeCourcy.com / Phase 2
          </p>
          <h1
            className="mb-3 text-5xl font-bold uppercase tracking-tight md:text-6xl"
            style={{ fontFamily: "var(--font-baskerville), Georgia, serif" }}
          >
            Gmail Cleaner
          </h1>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">
            {connection ? "Connected — Sweep Pending" : "Connect Gmail to Begin"}
          </p>
        </FadeIn>

        <FadeIn className="mt-16">
          {connection ? (
            <ConnectedView
              email={connection.profile.emailAddress}
              messagesTotal={connection.profile.messagesTotal}
              inboxUnread={connection.inboxUnread}
              samples={connection.samples}
            />
          ) : (
            <ConnectGmailView />
          )}
        </FadeIn>
      </div>
    </main>
  );
}

type Connection = {
  profile: { emailAddress: string; messagesTotal: number };
  inboxUnread: number;
  samples: SampleMessage[];
};

async function loadConnection(): Promise<Connection | null> {
  const client = await getGmailClient();
  if (!client) return null;
  try {
    const [profile, inboxUnread, samples] = await Promise.all([
      getProfile(client.gmail),
      getInboxUnreadCount(client.gmail),
      listSampleMessages(client.gmail, 10),
    ]);
    return { profile, inboxUnread, samples };
  } catch {
    return null;
  }
}

function TopBar({
  email,
  inboxUnread,
}: {
  email?: string;
  inboxUnread?: number;
}) {
  return (
    <div className="border-b border-[#1a4a2e] bg-[#0d2b18]/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em]">
        <span className="text-white/40 truncate">
          {email ? `Connected · ${email}` : "DeCourcy.com / GmailCleaner"}
        </span>
        <div className="flex gap-6 text-[#5b9bd5]">
          <span>
            Session <span className="text-white/80">$0.00</span>
          </span>
          <span>
            Lifetime <span className="text-white/80">$0.00</span>
          </span>
          <span>
            Inbox{" "}
            <span className="text-white/80">
              {inboxUnread === undefined
                ? "—"
                : inboxUnread.toLocaleString()}
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
        account. The refresh token is encrypted at rest. You can disconnect at
        any time.
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

function ConnectedView({
  email,
  messagesTotal,
  inboxUnread,
  samples,
}: {
  email: string;
  messagesTotal: number;
  inboxUnread: number;
  samples: SampleMessage[];
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
                <p className="mt-1 text-xs text-white/50 truncate">
                  {m.from}
                </p>
                <p className="mt-1 text-xs text-white/40 line-clamp-1">
                  {m.snippet}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

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
