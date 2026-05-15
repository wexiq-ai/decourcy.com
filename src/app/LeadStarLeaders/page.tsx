"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiKeyGate } from "./components/ApiKeyGate";
import { Leaderboard, type ReportData } from "./components/Leaderboard";
import { LeadStarLogo } from "./components/LeadStarLogo";
import { TechLines } from "./components/Background";

const STORAGE_KEY = "leadstar_leaders_api_key";
const REFRESH_MS = 60_000;

const RANGES = [
  { id: "today", label: "Today" },
  { id: "wtd", label: "Week-to-Date" },
  { id: "mtd", label: "Month-to-Date" },
  { id: "lastMonth", label: "Last Month" },
  { id: "qtd", label: "Quarter-to-Date" },
  { id: "lastQuarter", label: "Last Quarter" },
  { id: "ytd", label: "Year-to-Date" },
] as const;

type RangeId = (typeof RANGES)[number]["id"];

type RangeState = {
  data: ReportData | null;
  loading: boolean;
  error: string | null;
};

const emptyState: RangeState = { data: null, loading: false, error: null };

const initialStates = (): Record<RangeId, RangeState> =>
  RANGES.reduce(
    (acc, r) => {
      acc[r.id] = { ...emptyState };
      return acc;
    },
    {} as Record<RangeId, RangeState>
  );

export default function LeadStarLeadersPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [active, setActive] = useState<RangeId>("today");
  const [states, setStates] = useState<Record<RangeId, RangeState>>(initialStates);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  useEffect(() => {
    setHydrated(true);
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored) setApiKey(stored);
  }, []);

  // Override the site-wide green body background while this page is mounted.
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#231f20";
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  const fetchRange = useCallback(
    async (range: RangeId, key: string) => {
      setStates((s) => ({ ...s, [range]: { ...s[range], loading: true, error: null } }));
      try {
        const res = await fetch("/api/leadstar-leaders/report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-LeadStar-API-Key": key,
          },
          body: JSON.stringify({ range, topN: 50 }),
        });

        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          const message =
            res.status === 401 || res.status === 403
              ? "Invalid API key — clear and re-enter."
              : typeof body?.error === "string"
                ? `${body.error}${body?.body?.message ? ` — ${body.body.message}` : ""}`
                : `Request failed (${res.status})`;
          setStates((s) => ({ ...s, [range]: { data: null, loading: false, error: message } }));
          return;
        }

        setStates((s) => ({ ...s, [range]: { data: body as ReportData, loading: false, error: null } }));
      } catch (err) {
        setStates((s) => ({
          ...s,
          [range]: {
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Network error",
          },
        }));
      }
    },
    []
  );

  const refreshAll = useCallback(
    (key: string) => {
      RANGES.forEach((r) => {
        void fetchRange(r.id, key);
      });
      setLastRefreshed(new Date());
    },
    [fetchRange]
  );

  // Initial load + auto-refresh
  useEffect(() => {
    if (!apiKey) return;
    refreshAll(apiKey);
    const id = window.setInterval(() => refreshAll(apiKey), REFRESH_MS);
    return () => window.clearInterval(id);
  }, [apiKey, refreshAll]);

  const handleSubmitKey = (key: string) => {
    window.localStorage.setItem(STORAGE_KEY, key);
    setApiKey(key);
  };

  const handleClearKey = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setApiKey(null);
    setStates(initialStates());
    setLastRefreshed(null);
  };

  if (!hydrated) {
    return <div className="min-h-screen bg-[#231f20]" />;
  }

  if (!apiKey) {
    return <ApiKeyGate onSubmit={handleSubmitKey} />;
  }

  const activeState = states[active];

  return (
    <div
      className="relative min-h-screen text-white"
      style={{
        backgroundColor: "#231f20",
        fontFamily: "var(--font-poppins), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <TechLines />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-10 pb-16">
        {/* Header */}
        <header className="flex flex-col gap-6 mb-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <LeadStarLogo size="md" showPowered />
            <div className="flex items-center gap-3">
              <RefreshButton
                onClick={() => refreshAll(apiKey)}
                loading={RANGES.some((r) => states[r.id].loading)}
              />
              <button
                onClick={handleClearKey}
                className="text-[0.625rem] tracking-[0.22em] uppercase text-white/45 hover:text-[#eeb54e] border border-white/15 hover:border-[#eeb54e]/50 px-4 py-2 rounded transition-colors"
              >
                Clear Key
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-[0.04em] text-white">
              LeadStar <span className="text-[#eeb54e]">Leaders</span>
            </h1>
            <div
              className="h-px w-32 bg-[#eeb54e] mt-3"
              aria-hidden
              style={{
                background:
                  "linear-gradient(90deg, #eeb54e 0%, #eeb54e 70%, rgba(238,181,78,0) 100%)",
              }}
            />
            <p className="text-[0.6875rem] tracking-[0.22em] uppercase text-white/55 mt-3 font-medium">
              Top 50 Agents by Sales · Eastern Time
            </p>
          </div>
        </header>

        {/* Tabs */}
        <RangeTabs active={active} onChange={setActive} states={states} />

        {/* Content */}
        <main className="mt-8">
          <RangeContent state={activeState} active={active} />
        </main>

        {/* Footer */}
        <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 text-[0.6875rem] tracking-[0.04em] text-white/40">
          <span>
            {lastRefreshed ? `Last refreshed ${lastRefreshed.toLocaleTimeString("en-US")}` : "Loading…"}
            {" · Auto-refresh every 60s"}
          </span>
          <span className="tracking-[0.22em] uppercase">Better Leads · Better Prices · Better Results</span>
        </footer>
      </div>
    </div>
  );
}

function RangeTabs({
  active,
  onChange,
  states,
}: {
  active: RangeId;
  onChange: (id: RangeId) => void;
  states: Record<RangeId, RangeState>;
}) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-white/[0.08]">
      {RANGES.map((r) => {
        const isActive = r.id === active;
        const sales = states[r.id].data?.data.groups?.summary?.metrics?.totalSales;
        const loading = states[r.id].loading;
        return (
          <button
            key={r.id}
            onClick={() => onChange(r.id)}
            className={`px-5 py-3 -mb-px border-b-2 transition-colors flex items-center gap-3 ${
              isActive
                ? "border-[#eeb54e] text-[#eeb54e]"
                : "border-transparent text-white/55 hover:text-white"
            }`}
          >
            <span className="text-[0.6875rem] tracking-[0.22em] uppercase font-medium">{r.label}</span>
            <span
              className={`text-xs tabular-nums font-semibold ${
                isActive ? "text-[#eeb54e]" : "text-white/40"
              }`}
            >
              {loading && !sales ? "…" : typeof sales === "number" ? formatCompact(sales) : "—"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function RangeContent({ state, active }: { state: RangeState; active: RangeId }) {
  if (state.error) {
    return (
      <div className="rounded border border-red-500/30 bg-red-500/[0.04] px-6 py-5 text-sm text-red-200">
        {state.error}
      </div>
    );
  }

  if (!state.data && state.loading) {
    return (
      <div className="rounded border border-[#eeb54e]/15 bg-[#1a1718] py-16 text-center text-white/45 tracking-[0.06em] text-sm">
        Loading {labelFor(active)}…
      </div>
    );
  }

  return <Leaderboard data={state.data} />;
}

function RefreshButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 text-[0.625rem] tracking-[0.22em] uppercase text-[#eeb54e] hover:text-[#f2c574] disabled:opacity-50 border border-[#eeb54e]/40 hover:border-[#eeb54e] disabled:hover:border-[#eeb54e]/40 px-4 py-2 rounded transition-colors"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={loading ? "animate-spin" : ""}>
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 3v6h-6" />
      </svg>
      {loading ? "Refreshing" : "Refresh"}
    </button>
  );
}

function labelFor(id: RangeId): string {
  return RANGES.find((r) => r.id === id)?.label ?? id;
}

function formatCompact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
