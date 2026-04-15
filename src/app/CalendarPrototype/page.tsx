"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { FadeIn } from "./components/FadeIn";
import type {
  CalendarEvent,
  EventScope,
  EventStatus,
  FilterState,
  SourceType,
  ViewMode,
} from "./types";
import { DEFAULT_SOURCE_COLOR, SOURCE_COLORS } from "./types";
import { EVENTS, LAST_UPDATED, SOURCES } from "./data";
import {
  addDays,
  addMonths,
  buildMonthGrid,
  compareISO,
  dayNumber,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  isSameMonth,
  isToday,
  longDayLabel,
  monthLabel,
  quarterLabel,
  shortDayLabel,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  todayISO,
} from "./lib/dates";
import {
  applyFilters,
  emptyFilterState,
  eventScope,
  eventsOnDay,
  hasActiveFilters,
  isThemeScope,
  SCOPE_LABELS,
  SCOPE_ORDER,
  themesInRange,
  toggleSet,
  uniqueSorted,
} from "./lib/filter";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CalendarPrototypePage() {
  const [view, setView] = useState<ViewMode>("month");
  const [cursor, setCursor] = useState<string>(todayISO());
  const [filters, setFilters] = useState<FilterState>(emptyFilterState());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const filtered = useMemo(() => applyFilters(EVENTS, filters), [filters]);

  // Keyboard shortcut: "/" focuses search, Escape collapses expanded card
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && expandedId) setExpandedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedId]);

  return (
    <div className="min-h-screen bg-[#1a3047] text-white pb-24">
      {/* Brand gradient band — AmeriLife signature teal→navy */}
      <div
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, #71C495 0%, #40A590 45%, #244260 100%)",
        }}
      />

      {/* Top header band */}
      <div className="px-4 md:px-8 pt-12 pb-6 flex flex-col items-center">
        <FadeIn className="w-full flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-bold tracking-[0.18em] uppercase text-white leading-none">
              AmeriLife
            </span>
            <span className="text-[10px] md:text-xs text-white/70 font-semibold">®</span>
          </div>
          <div className="h-px w-24 bg-[#40A590] mt-4 mb-3" aria-hidden />
          <h1 className="text-sm md:text-base font-semibold tracking-[0.25em] uppercase text-[#71C495] text-center">
            Consolidated Calendar Prototype
          </h1>
          <p className="text-[11px] font-medium text-white/50 mt-2 uppercase tracking-wider text-center">
            {SOURCES.length} Sources · One View
          </p>
          <LastUpdated />
        </FadeIn>
      </div>

      {/* Sticky toolbar */}
      <StickyToolbar
        view={view}
        setView={setView}
        cursor={cursor}
        setCursor={setCursor}
        filters={filters}
        setFilters={setFilters}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        totalResults={filtered.length}
        searchRef={searchRef}
      />

      {/* Filter panel (collapsible) */}
      {filtersOpen && (
        <div className="px-4 md:px-8 pt-4">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            setView={setView}
          />
        </div>
      )}

      {/* Active filter chips */}
      {hasActiveFilters(filters) && (
        <div className="px-4 md:px-8 pt-3">
          <ActiveFilterChips filters={filters} setFilters={setFilters} />
        </div>
      )}

      {/* Main view */}
      <div className="px-4 md:px-8 pt-6 max-w-7xl mx-auto w-full">
        <FadeIn className="w-full">
          {view === "month" && (
            <MonthView
              cursor={cursor}
              events={filtered}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              goToDay={(iso) => {
                setCursor(iso);
                setView("day");
              }}
            />
          )}
          {view === "week" && (
            <WeekView
              cursor={cursor}
              events={filtered}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              goToDay={(iso) => {
                setCursor(iso);
                setView("day");
              }}
            />
          )}
          {view === "day" && (
            <DayView
              cursor={cursor}
              events={filtered}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
            />
          )}
          {view === "agenda" && (
            <AgendaView
              events={filtered}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
            />
          )}
          {view === "source" && (
            <SourceView
              events={filtered}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
            />
          )}
        </FadeIn>

        {/* Undated bucket */}
        <UndatedBucket
          events={filtered}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Last Updated
// ---------------------------------------------------------------------------

function LastUpdated() {
  // Format the ISO data-refresh timestamp deterministically (timezone is
  // pinned to America/New_York so SSR and CSR produce identical output).
  const ts = useMemo(() => {
    try {
      const d = new Date(LAST_UPDATED);
      return (
        d.toLocaleString("en-US", {
          timeZone: "America/New_York",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }) + " ET"
      );
    } catch {
      return "";
    }
  }, []);

  if (!ts) return <div className="mb-4" />;

  return (
    <p className="text-[10px] italic text-white/25 mt-3 mb-0 text-center">
      Last updated {ts}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Sticky Toolbar
// ---------------------------------------------------------------------------

function StickyToolbar({
  view,
  setView,
  cursor,
  setCursor,
  filters,
  setFilters,
  filtersOpen,
  setFiltersOpen,
  totalResults,
  searchRef,
}: {
  view: ViewMode;
  setView: (v: ViewMode) => void;
  cursor: string;
  setCursor: (iso: string) => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  filtersOpen: boolean;
  setFiltersOpen: (b: boolean) => void;
  totalResults: number;
  searchRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const navLabel = (() => {
    if (view === "month") return monthLabel(cursor);
    if (view === "week") {
      const s = startOfWeek(cursor);
      const e = endOfWeek(cursor);
      return `${shortDayLabel(s)} – ${shortDayLabel(e)}`;
    }
    if (view === "day") return longDayLabel(cursor);
    return "All events";
  })();

  function navPrev() {
    if (view === "month") setCursor(addMonths(cursor, -1));
    else if (view === "week") setCursor(addDays(cursor, -7));
    else if (view === "day") setCursor(addDays(cursor, -1));
  }
  function navNext() {
    if (view === "month") setCursor(addMonths(cursor, 1));
    else if (view === "week") setCursor(addDays(cursor, 7));
    else if (view === "day") setCursor(addDays(cursor, 1));
  }

  return (
    <div className="sticky top-0 z-30 bg-[#1a3047]/95 backdrop-blur border-b border-[#3a5a7a]/60">
      <div className="px-4 md:px-8 py-3 flex flex-col gap-3 max-w-7xl mx-auto w-full">
        {/* Row 1: Search + filter toggle + result count */}
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="flex-1 relative">
            <input
              ref={searchRef}
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search titles, descriptions, owners, tags, locations…  (press / to focus)"
              className="w-full bg-[#244260] border border-[#3a5a7a] focus:border-[#40A590]/60 outline-none rounded-sm px-3 py-2 text-sm text-white placeholder:text-white/25"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: "" })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#40A590] text-sm"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`px-3 py-2 rounded-sm text-[11px] font-bold uppercase tracking-wider border transition-colors ${
                filtersOpen
                  ? "border-[#40A590]/60 text-[#40A590]"
                  : "border-[#3a5a7a] text-white/60 hover:border-[#40A590]/40 hover:text-[#40A590]/80"
              }`}
            >
              Filters
            </button>
            {hasActiveFilters(filters) && (
              <button
                onClick={() => setFilters(emptyFilterState())}
                className="px-3 py-2 rounded-sm text-[11px] font-bold uppercase tracking-wider border border-[#3a5a7a] text-white/40 hover:border-rose-400/40 hover:text-rose-300/80"
              >
                Clear
              </button>
            )}
            <span className="text-[11px] uppercase tracking-wider text-white/35 ml-1">
              {totalResults} {totalResults === 1 ? "event" : "events"}
            </span>
          </div>
        </div>

        {/* Row 2: View switcher + navigation */}
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <ViewSwitcher view={view} setView={setView} />
          <div className="flex items-center gap-2">
            {view !== "agenda" && view !== "source" && (
              <>
                <IconBtn label="◀" onClick={navPrev} />
                <button
                  onClick={() => setDatePickerOpen(!datePickerOpen)}
                  className="px-3 py-1.5 rounded-sm border border-[#3a5a7a] hover:border-[#40A590]/40 text-white/80 text-xs font-bold uppercase tracking-wider min-w-[220px] text-center"
                >
                  {navLabel}
                </button>
                <IconBtn label="▶" onClick={navNext} />
                <button
                  onClick={() => setCursor(todayISO())}
                  className="px-3 py-1.5 rounded-sm border border-[#3a5a7a] hover:border-[#40A590]/40 text-[#40A590]/80 text-[11px] font-bold uppercase tracking-wider"
                >
                  Today
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mini date picker */}
        {datePickerOpen && (
          <div className="pt-2">
            <MiniDatePicker
              cursor={cursor}
              setCursor={(iso) => {
                setCursor(iso);
                setDatePickerOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function IconBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-sm border border-[#3a5a7a] hover:border-[#40A590]/40 text-white/70 hover:text-[#40A590] text-xs"
      aria-label={label}
    >
      {label}
    </button>
  );
}

function ViewSwitcher({ view, setView }: { view: ViewMode; setView: (v: ViewMode) => void }) {
  const opts: { v: ViewMode; label: string }[] = [
    { v: "month", label: "Month" },
    { v: "week", label: "Week" },
    { v: "day", label: "Day" },
    { v: "agenda", label: "Agenda" },
    { v: "source", label: "By Source" },
  ];
  return (
    <div className="flex flex-wrap gap-1 border border-[#3a5a7a] rounded-sm p-1 bg-[#244260]">
      {opts.map((o) => {
        const active = view === o.v;
        return (
          <button
            key={o.v}
            onClick={() => setView(o.v)}
            className={`px-3 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-colors ${
              active
                ? "bg-[#40A590]/15 text-[#40A590]"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini Date Picker (quick jump to any day)
// ---------------------------------------------------------------------------

function MiniDatePicker({
  cursor,
  setCursor,
}: {
  cursor: string;
  setCursor: (iso: string) => void;
}) {
  const [value, setValue] = useState(cursor);
  return (
    <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
      <label className="text-[11px] uppercase tracking-wider text-white/40 font-bold">
        Jump to day
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-[#244260] border border-[#3a5a7a] focus:border-[#40A590]/60 outline-none rounded-sm px-2 py-1.5 text-xs text-white"
      />
      <button
        onClick={() => setCursor(value)}
        className="px-3 py-1.5 rounded-sm border border-[#40A590]/40 text-[#40A590] text-[11px] font-bold uppercase tracking-wider hover:bg-[#40A590]/10"
      >
        Go
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter Panel
// ---------------------------------------------------------------------------

function FilterPanel({
  filters,
  setFilters,
  setView,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  setView: (v: ViewMode) => void;
}) {
  const allSources = uniqueSorted(EVENTS.map((e) => e.sourceTracker));
  const allOwners = uniqueSorted(EVENTS.map((e) => e.owner));
  const allTypes = uniqueSorted(EVENTS.map((e) => e.sourceType));
  const allStatuses = uniqueSorted(
    EVENTS.map((e) => e.status).filter((s): s is EventStatus => !!s)
  );

  // Clicking any chip toggles the filter AND jumps to the month view so
  // the user always ends up seeing their selection in the at-a-glance grid.
  // Deselect still works — the × on ActiveFilterChips also removes a filter.
  function applyAndJump(next: FilterState) {
    setFilters(next);
    setView("month");
  }

  return (
    <div className="bg-[#244260] border border-[#3a5a7a] rounded-sm p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <FilterGroup label="Source">
        {allSources.map((s) => (
          <FilterChip
            key={s}
            label={s}
            color={SOURCE_COLORS[s] || DEFAULT_SOURCE_COLOR}
            active={filters.sources.has(s)}
            onToggle={() =>
              applyAndJump({ ...filters, sources: toggleSet(filters.sources, s) })
            }
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Owner">
        {allOwners.map((o) => (
          <FilterChip
            key={o}
            label={o}
            active={filters.owners.has(o)}
            onToggle={() =>
              applyAndJump({ ...filters, owners: toggleSet(filters.owners, o) })
            }
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Type">
        {allTypes.map((t) => (
          <FilterChip
            key={t}
            label={t}
            active={filters.sourceTypes.has(t as SourceType)}
            onToggle={() =>
              applyAndJump({
                ...filters,
                sourceTypes: toggleSet(filters.sourceTypes, t as SourceType),
              })
            }
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Status">
        {allStatuses.map((s) => (
          <FilterChip
            key={s}
            label={s}
            active={filters.statuses.has(s)}
            onToggle={() =>
              applyAndJump({ ...filters, statuses: toggleSet(filters.statuses, s) })
            }
          />
        ))}
      </FilterGroup>
      <FilterGroup label="Scope">
        {SCOPE_ORDER.map((s) => (
          <FilterChip
            key={s}
            label={SCOPE_LABELS[s]}
            active={filters.scopes.has(s)}
            onToggle={() =>
              applyAndJump({ ...filters, scopes: toggleSet(filters.scopes, s) })
            }
          />
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  label,
  color,
  active,
  onToggle,
}: {
  label: string;
  color?: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border transition-colors flex items-center gap-1.5 ${
        active
          ? "border-[#40A590]/60 bg-[#40A590]/10 text-[#40A590]"
          : "border-[#3a5a7a] text-white/55 hover:text-white/80 hover:border-[#40A590]/30"
      }`}
    >
      {color && (
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: color }}
        />
      )}
      <span>{label}</span>
    </button>
  );
}

function ActiveFilterChips({
  filters,
  setFilters,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
}) {
  const chips: { label: string; onRemove: () => void }[] = [];
  if (filters.search.trim()) {
    chips.push({
      label: `"${filters.search.trim()}"`,
      onRemove: () => setFilters({ ...filters, search: "" }),
    });
  }
  filters.sources.forEach((s) =>
    chips.push({
      label: `Source: ${s}`,
      onRemove: () => setFilters({ ...filters, sources: toggleSet(filters.sources, s) }),
    })
  );
  filters.owners.forEach((o) =>
    chips.push({
      label: `Owner: ${o}`,
      onRemove: () => setFilters({ ...filters, owners: toggleSet(filters.owners, o) }),
    })
  );
  filters.sourceTypes.forEach((t) =>
    chips.push({
      label: `Type: ${t}`,
      onRemove: () =>
        setFilters({ ...filters, sourceTypes: toggleSet(filters.sourceTypes, t) }),
    })
  );
  filters.statuses.forEach((s) =>
    chips.push({
      label: `Status: ${s}`,
      onRemove: () =>
        setFilters({ ...filters, statuses: toggleSet(filters.statuses, s) }),
    })
  );
  filters.scopes.forEach((s) =>
    chips.push({
      label: `Scope: ${SCOPE_LABELS[s]}`,
      onRemove: () =>
        setFilters({ ...filters, scopes: toggleSet(filters.scopes, s) }),
    })
  );
  if (filters.range) {
    chips.push({
      label: `Range: ${filters.range.start} → ${filters.range.end}`,
      onRemove: () => setFilters({ ...filters, range: null }),
    });
  }
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c, i) => (
        <span
          key={i}
          className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-[#40A590]/40 bg-[#40A590]/10 text-[#40A590] rounded-sm flex items-center gap-2"
        >
          {c.label}
          <button onClick={c.onRemove} aria-label="Remove" className="hover:text-rose-300">
            ×
          </button>
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Themes & Campaigns banner — month-scope items aligned alongside daily tasks.
//
// Monthly and quarterly content (ideaXchange issues, Notion monthly themes,
// Insider quarterly issues, campaign strips, Professor Leads weeks that span
// the view range, etc.) would clutter the month grid if we dropped them into
// every single day cell. Instead they float in this banner above the grid so
// they're always in view but never swallow the daily activity.
// ---------------------------------------------------------------------------

function ThemesBanner({
  events,
  rangeStart,
  rangeEnd,
  rangeLabel,
  expandedId,
  setExpandedId,
}: {
  events: CalendarEvent[];
  rangeStart: string;
  rangeEnd: string;
  rangeLabel: string;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}) {
  const [open, setOpen] = useState(true);
  const themes = useMemo(
    () =>
      themesInRange(events, rangeStart, rangeEnd).sort((a, b) => {
        // Smallest cadence first so readers see what's on this week before
        // the always-on background: Weekly → Monthly → Quarterly → Annually.
        const order: EventScope[] = ["week", "month", "quarter", "year"];
        const sa = order.indexOf(eventScope(a));
        const sb = order.indexOf(eventScope(b));
        if (sa !== sb) return sa - sb;
        return a.title.localeCompare(b.title);
      }),
    [events, rangeStart, rangeEnd]
  );
  if (themes.length === 0) return null;

  // Group by scope for clearer visual separation
  const byScope = new Map<EventScope, CalendarEvent[]>();
  themes.forEach((ev) => {
    const s = eventScope(ev);
    if (!byScope.has(s)) byScope.set(s, []);
    byScope.get(s)!.push(ev);
  });

  return (
    <div
      className="mb-5 rounded-sm border border-dashed border-[#40A590]/40 bg-[#244260] relative overflow-hidden"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(64,165,144,0.04) 0, rgba(64,165,144,0.04) 1px, transparent 1px, transparent 8px)",
      }}
    >
      {/* Left accent rail — visual reminder "this spans time, it is not a point" */}
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#40A590]/60"
      />
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2.5 flex items-start justify-between gap-3 border-b border-dashed border-[#40A590]/25 hover:bg-[#2c5073] transition-colors text-left"
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-block w-2 h-2 rounded-full bg-[#40A590] flex-shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#40A590]">
              {`${rangeLabel} Themes & Campaigns`}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-white/35">
              {themes.length} active
            </span>
          </div>
          <span className="text-[10px] text-white/45 pl-5 italic leading-snug">
            Long-running themes that are <em className="not-italic font-semibold text-white/65">active during this period</em> — not actions happening on this specific day.
          </span>
        </div>
        <span className="text-[#40A590] text-xs flex-shrink-0 mt-0.5">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="p-3 flex flex-col gap-4">
          {(["week", "month", "quarter", "year"] as EventScope[]).map((scope) => {
            const group = byScope.get(scope);
            if (!group || group.length === 0) return null;
            return (
              <div key={scope}>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#40A590]/80 mb-2 flex items-center gap-2">
                  <span className="inline-block w-6 h-px bg-[#40A590]/40" />
                  <span>{SCOPE_LABELS[scope]} theme{group.length === 1 ? "" : "s"}</span>
                  <span className="text-white/30 normal-case tracking-normal text-[9px] italic">
                    {scope === "quarter"
                      ? "multi-month"
                      : scope === "month"
                      ? "full-month arc"
                      : scope === "week"
                      ? "week-long arc"
                      : "always on"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.map((ev) => (
                    <ThemeChip
                      key={ev.id}
                      event={ev}
                      onClick={() =>
                        setExpandedId(expandedId === ev.id ? null : ev.id)
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ThemeChip({
  event,
  onClick,
}: {
  event: CalendarEvent;
  onClick: () => void;
}) {
  const color = SOURCE_COLORS[event.sourceTracker] || DEFAULT_SOURCE_COLOR;
  const status = event.status;
  const scope = eventScope(event);
  const scopeLabel = SCOPE_LABELS[scope];
  const dateRange =
    event.startDate && event.endDate && event.startDate !== event.endDate
      ? `${shortDayLabel(event.startDate).split(",")[0]} → ${shortDayLabel(event.endDate).split(",")[0]}`
      : event.startDate
      ? shortDayLabel(event.startDate).split(",")[0]
      : "Ongoing";
  return (
    <button
      onClick={onClick}
      // Dashed border + diagonal stripe pattern are the at-a-glance "this is a
      // range, not a same-day event" signal. Day chips elsewhere use solid
      // borders and flat fills — the visual language is deliberately different.
      className="text-left rounded-sm border border-dashed px-2.5 py-1.5 hover:brightness-125 transition-all flex items-start gap-2 max-w-full"
      style={{
        backgroundColor: `${color}1a`,
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 6px)",
        borderColor: `${color}88`,
      }}
      title={`${scopeLabel} theme — ${event.sourceTracker} — ${event.owner}${status ? ` — ${status}` : ""} — runs ${dateRange}`}
    >
      {/* Span-range glyph: a double-ended arrow icon makes "this covers a range" obvious at a glance */}
      <svg
        aria-hidden
        viewBox="0 0 20 10"
        className="w-4 h-2.5 flex-shrink-0 mt-1"
        style={{ color }}
      >
        <path
          d="M2 5 L18 5 M2 5 L5 2 M2 5 L5 8 M18 5 L15 2 M18 5 L15 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[11px] font-bold text-white/90 truncate max-w-[16rem] md:max-w-[22rem]">
          {event.title}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="text-[8px] font-bold uppercase tracking-[0.15em] rounded-sm px-1 py-0.5 border"
            style={{
              color,
              borderColor: `${color}88`,
              backgroundColor: `${color}22`,
            }}
          >
            {scopeLabel}
          </span>
          <span className="text-[9px] text-white/60 tabular-nums">{dateRange}</span>
          <span className="text-[9px] uppercase tracking-wider text-white/35">{event.owner}</span>
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Month View
// ---------------------------------------------------------------------------

function MonthView({
  cursor,
  events,
  expandedId,
  setExpandedId,
  goToDay,
}: {
  cursor: string;
  events: CalendarEvent[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  goToDay: (iso: string) => void;
}) {
  const days = buildMonthGrid(cursor);
  const monthRef = startOfMonth(cursor);
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div>
      <ThemesBanner
        events={events}
        rangeStart={startOfMonth(cursor)}
        rangeEnd={endOfMonth(cursor)}
        rangeLabel={monthLabel(cursor)}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
      />

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((d) => (
          <div
            key={d}
            className="text-[10px] font-bold uppercase tracking-wider text-white/35 text-center py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((iso) => {
          const dayEvents = eventsOnDay(events, iso);
          const inMonth = isSameMonth(iso, monthRef);
          const today = isToday(iso);
          return (
            <div
              key={iso}
              role="button"
              tabIndex={0}
              aria-label={`Open ${longDayLabel(iso)}`}
              onClick={() => goToDay(iso)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goToDay(iso);
                }
              }}
              className={`group min-h-[110px] md:min-h-[130px] rounded-sm border p-1.5 flex flex-col gap-1 cursor-pointer transition-colors hover:border-[#40A590]/60 hover:bg-[#2c5073] focus:outline-none focus:border-[#40A590] ${
                inMonth
                  ? "bg-[#244260] border-[#3a5a7a]"
                  : "bg-[#1a3047] border-[#2c5073] opacity-50"
              } ${today ? "border-[#40A590]/60" : ""}`}
            >
              <span
                className={`text-[11px] font-bold transition-colors ${
                  today
                    ? "text-[#40A590]"
                    : inMonth
                    ? "text-white/70 group-hover:text-[#40A590]"
                    : "text-white/30 group-hover:text-[#40A590]"
                }`}
              >
                {dayNumber(iso)}
              </span>
              <div className="flex flex-col gap-0.5">
                {dayEvents.slice(0, 3).map((ev) => (
                  <MonthChip
                    key={ev.id}
                    event={ev}
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(expandedId === ev.id ? null : ev.id);
                    }}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToDay(iso);
                    }}
                    className="text-[9px] text-white/35 hover:text-[#40A590] text-left pl-1"
                  >
                    +{dayEvents.length - 3} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded card below grid for clarity */}
      {expandedId && (
        <div className="mt-6">
          <ExpandedCard
            event={events.find((e) => e.id === expandedId)!}
            allEvents={events}
            onClose={() => setExpandedId(null)}
            setExpandedId={setExpandedId}
          />
        </div>
      )}
    </div>
  );
}

function MonthChip({
  event,
  onClick,
}: {
  event: CalendarEvent;
  onClick: (e: MouseEvent) => void;
}) {
  const color = SOURCE_COLORS[event.sourceTracker] || DEFAULT_SOURCE_COLOR;
  return (
    <button
      onClick={onClick}
      className="text-left text-[10px] px-1 py-0.5 rounded-sm truncate hover:opacity-100 opacity-85 transition-opacity border w-full"
      style={{
        background: `${color}22`,
        borderColor: `${color}55`,
        color: "#fff",
      }}
      title={event.title}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle"
        style={{ background: color }}
      />
      {event.title}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Week View
// ---------------------------------------------------------------------------

function WeekView({
  cursor,
  events,
  expandedId,
  setExpandedId,
  goToDay,
}: {
  cursor: string;
  events: CalendarEvent[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  goToDay: (iso: string) => void;
}) {
  const weekStart = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div>
      <ThemesBanner
        events={events}
        rangeStart={weekStart}
        rangeEnd={endOfWeek(cursor)}
        rangeLabel={`${shortDayLabel(weekStart).split(",")[0]} – ${shortDayLabel(endOfWeek(cursor)).split(",")[0]}`}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
      />
      <div className="grid grid-cols-7 gap-2">
        {days.map((iso) => {
          const dayEvents = eventsOnDay(events, iso);
          const today = isToday(iso);
          return (
            <div
              key={iso}
              role="button"
              tabIndex={0}
              aria-label={`Open ${longDayLabel(iso)}`}
              onClick={() => goToDay(iso)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goToDay(iso);
                }
              }}
              className={`group min-h-[320px] rounded-sm border p-2 flex flex-col gap-1.5 bg-[#244260] cursor-pointer transition-colors hover:border-[#40A590]/60 hover:bg-[#2c5073] focus:outline-none focus:border-[#40A590] ${
                today ? "border-[#40A590]/60" : "border-[#3a5a7a]"
              }`}
            >
              <div className="flex items-baseline justify-between w-full text-left px-1 py-0.5 rounded-sm">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    today ? "text-[#40A590]" : "text-white/40 group-hover:text-[#40A590]"
                  }`}
                >
                  {shortDayLabel(iso).split(",")[0]}
                </span>
                <span
                  className={`text-sm font-bold transition-colors ${
                    today ? "text-[#40A590]" : "text-white/70 group-hover:text-[#40A590]"
                  }`}
                >
                  {dayNumber(iso)}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {dayEvents.map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    dense
                    inlineExpanded={false}
                    expanded={expandedId === ev.id}
                    onToggle={() =>
                      setExpandedId(expandedId === ev.id ? null : ev.id)
                    }
                    allEvents={events}
                    setExpandedId={setExpandedId}
                  />
                ))}
                {dayEvents.length === 0 && (
                  <span className="text-[10px] text-white/25 italic">
                    Click to open day →
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded card below grid so it never overflows a narrow day column */}
      {expandedId && events.find((e) => e.id === expandedId) && (
        <div className="mt-6">
          <ExpandedCard
            event={events.find((e) => e.id === expandedId)!}
            allEvents={events}
            onClose={() => setExpandedId(null)}
            setExpandedId={setExpandedId}
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Day View — flat chronological list (day is the deepest level of hierarchy;
// no hour-by-hour breakdown)
// ---------------------------------------------------------------------------

function DayView({
  cursor,
  events,
  expandedId,
  setExpandedId,
}: {
  cursor: string;
  events: CalendarEvent[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}) {
  const dayEvents = eventsOnDay(events, cursor);

  // Sort: all-day first, then any timed events by start time, then the rest.
  const sorted = [...dayEvents].sort((a, b) => {
    const aAllDay = a.allDay || !a.startTime;
    const bAllDay = b.allDay || !b.startTime;
    if (aAllDay && !bAllDay) return -1;
    if (!aAllDay && bAllDay) return 1;
    if (a.startTime && b.startTime) return a.startTime < b.startTime ? -1 : 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-6">
      <ThemesBanner
        events={events}
        rangeStart={cursor}
        rangeEnd={cursor}
        rangeLabel={longDayLabel(cursor)}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
      />

      {sorted.length > 0 && (
        <div>
          <SectionHeader>
            {sorted.length} item{sorted.length === 1 ? "" : "s"} on {longDayLabel(cursor)}
          </SectionHeader>
          <div className="flex flex-col gap-2">
            {sorted.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                expanded={expandedId === ev.id}
                onToggle={() => setExpandedId(expandedId === ev.id ? null : ev.id)}
                allEvents={events}
                setExpandedId={setExpandedId}
              />
            ))}
          </div>
        </div>
      )}

      {dayEvents.length === 0 && (
        <div className="text-center py-12 text-white/30 italic text-sm">
          Nothing scheduled for {longDayLabel(cursor)}.
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Agenda View (chronological list grouped by day)
// ---------------------------------------------------------------------------

function AgendaView({
  events,
  expandedId,
  setExpandedId,
}: {
  events: CalendarEvent[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}) {
  // Split into daily-scoped events (show in chronological day groups) and
  // theme-scoped events (show in a "Themes & Campaigns" block above).
  const daily = events
    .filter((e) => e.startDate && !isThemeScope(e))
    .slice()
    .sort((a, b) => {
      const d = compareISO(a.startDate!, b.startDate!);
      if (d !== 0) return d;
      return (a.startTime || "").localeCompare(b.startTime || "");
    });
  const themes = events
    .filter((e) => isThemeScope(e))
    .slice()
    .sort((a, b) => {
      // Earlier theme-windows first
      const sa = a.startDate || "9999";
      const sb = b.startDate || "9999";
      if (sa !== sb) return sa < sb ? -1 : 1;
      return a.title.localeCompare(b.title);
    });

  const groups = new Map<string, CalendarEvent[]>();
  daily.forEach((ev) => {
    const key = ev.startDate!;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(ev);
  });

  if (groups.size === 0 && themes.length === 0) {
    return (
      <div className="text-center py-16 text-white/30 italic text-sm">
        No events match the current filters.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {themes.length > 0 && (
        <div>
          <SectionHeader>Themes &amp; Campaigns ({themes.length})</SectionHeader>
          <div className="flex flex-col gap-2">
            {themes.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                expanded={expandedId === ev.id}
                onToggle={() => setExpandedId(expandedId === ev.id ? null : ev.id)}
                allEvents={events}
                setExpandedId={setExpandedId}
              />
            ))}
          </div>
        </div>
      )}

      {Array.from(groups.entries()).map(([iso, group]) => (
        <div key={iso}>
          <SectionHeader highlight={isToday(iso)}>
            {longDayLabel(iso)}
            {isToday(iso) && <span className="ml-2 text-[#40A590]">— Today</span>}
          </SectionHeader>
          <div className="flex flex-col gap-2">
            {group.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                expanded={expandedId === ev.id}
                onToggle={() => setExpandedId(expandedId === ev.id ? null : ev.id)}
                allEvents={events}
                setExpandedId={setExpandedId}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// By-Source View
// ---------------------------------------------------------------------------

function SourceView({
  events,
  expandedId,
  setExpandedId,
}: {
  events: CalendarEvent[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const groups = new Map<string, CalendarEvent[]>();
  events.forEach((ev) => {
    if (!groups.has(ev.sourceTracker)) groups.set(ev.sourceTracker, []);
    groups.get(ev.sourceTracker)!.push(ev);
  });

  const sorted = Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="flex flex-col gap-4">
      {sorted.map(([source, group]) => {
        const color = SOURCE_COLORS[source] || DEFAULT_SOURCE_COLOR;
        const isCollapsed = collapsed.has(source);
        return (
          <div
            key={source}
            className="bg-[#244260] border border-[#3a5a7a] rounded-sm"
          >
            <button
              onClick={() =>
                setCollapsed((prev) => {
                  const next = new Set(prev);
                  if (next.has(source)) next.delete(source);
                  else next.add(source);
                  return next;
                })
              }
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#2c5073] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: color }}
                />
                <span className="text-sm font-bold uppercase tracking-wider text-white/85">
                  {source}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-white/35">
                  {group.length} {group.length === 1 ? "event" : "events"}
                </span>
              </div>
              <span className="text-[#40A590] text-xs">{isCollapsed ? "+" : "−"}</span>
            </button>
            {!isCollapsed && (
              <div className="p-3 border-t border-[#3a5a7a] flex flex-col gap-2">
                {group.map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    expanded={expandedId === ev.id}
                    onToggle={() =>
                      setExpandedId(expandedId === ev.id ? null : ev.id)
                    }
                    allEvents={events}
                    setExpandedId={setExpandedId}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Undated bucket
// ---------------------------------------------------------------------------

function UndatedBucket({
  events,
  expandedId,
  setExpandedId,
}: {
  events: CalendarEvent[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}) {
  const undated = events.filter((e) => !e.startDate);
  if (undated.length === 0) return null;
  return (
    <div className="mt-10">
      <SectionHeader>Ongoing / Undated ({undated.length})</SectionHeader>
      <div className="flex flex-col gap-2">
        {undated.map((ev) => (
          <EventCard
            key={ev.id}
            event={ev}
            expanded={expandedId === ev.id}
            onToggle={() => setExpandedId(expandedId === ev.id ? null : ev.id)}
            allEvents={events}
            setExpandedId={setExpandedId}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Event Card (collapsed <-> expanded)
// ---------------------------------------------------------------------------

function EventCard({
  event,
  expanded,
  onToggle,
  allEvents,
  setExpandedId,
  dense = false,
  inlineExpanded = true,
}: {
  event: CalendarEvent;
  expanded: boolean;
  onToggle: () => void;
  allEvents: CalendarEvent[];
  setExpandedId: (id: string | null) => void;
  dense?: boolean;
  // When true (default), an expanded card swaps in ExpandedCard in place.
  // When false, expanded state just highlights the collapsed row — the
  // parent is expected to render ExpandedCard somewhere with more room
  // (used by WeekView so the detail panel never overflows a day column).
  inlineExpanded?: boolean;
}) {
  const color = SOURCE_COLORS[event.sourceTracker] || DEFAULT_SOURCE_COLOR;
  const dateRange =
    event.startDate && event.endDate && event.startDate !== event.endDate
      ? `${shortDayLabel(event.startDate)} → ${shortDayLabel(event.endDate)}`
      : event.startDate
      ? shortDayLabel(event.startDate)
      : "Undated";

  if (expanded && inlineExpanded) {
    return (
      <ExpandedCard
        event={event}
        allEvents={allEvents}
        onClose={onToggle}
        setExpandedId={setExpandedId}
      />
    );
  }

  const isHighlighted = expanded && !inlineExpanded;

  return (
    <button
      // stopPropagation so a chip click expands the card instead of bubbling
      // up to a surrounding clickable cell (e.g. the WeekView day column).
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`text-left rounded-sm border px-2.5 py-1.5 flex items-start gap-2 hover:bg-[#2c5073] transition-colors w-full ${
        dense ? "" : "py-2"
      } ${isHighlighted ? "ring-2 ring-[#40A590]/70" : ""}`}
      style={{
        background: isHighlighted ? `${color}33` : `${color}1a`,
        borderColor: `${color}55`,
      }}
    >
      <span
        className="inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
        style={{ background: color }}
      />
      <div className="flex-1 min-w-0">
        <div className={`font-bold text-white/90 truncate ${dense ? "text-[11px]" : "text-sm"}`}>
          {event.title}
        </div>
        {!dense && (
          <div className="text-[10px] uppercase tracking-wider text-white/45 truncate mt-0.5 flex gap-2">
            <span>{dateRange}</span>
            <span className="text-white/20">·</span>
            <span>{event.owner}</span>
          </div>
        )}
      </div>
    </button>
  );
}

function ExpandedCard({
  event,
  allEvents,
  onClose,
  setExpandedId,
}: {
  event: CalendarEvent;
  allEvents: CalendarEvent[];
  onClose: () => void;
  setExpandedId: (id: string | null) => void;
}) {
  const color = SOURCE_COLORS[event.sourceTracker] || DEFAULT_SOURCE_COLOR;
  const dateRange =
    event.startDate && event.endDate && event.startDate !== event.endDate
      ? `${longDayLabel(event.startDate)} → ${longDayLabel(event.endDate)}`
      : event.startDate
      ? longDayLabel(event.startDate)
      : "Undated / Ongoing";

  // Find children (e.g. Medicarians sessions)
  const children = allEvents.filter((e) => e.parentId === event.id);

  return (
    <div
      className="rounded-sm border bg-[#244260] p-5 flex flex-col gap-4 relative min-w-0 overflow-hidden"
      style={{ borderColor: `${color}66` }}
    >
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white/40 hover:text-white/80 text-lg leading-none"
        aria-label="Close"
      >
        ×
      </button>

      {/* Source badge */}
      <div className="flex items-center gap-2 flex-wrap pr-6">
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border text-[10px] font-bold uppercase tracking-wider max-w-full break-words"
          style={{
            background: `${color}22`,
            borderColor: `${color}66`,
            color: color,
          }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: color }}
          />
          <span className="break-words">{event.sourceTracker}</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 border border-[#3a5a7a] px-2 py-0.5 rounded-sm break-words max-w-full">
          {event.sourceType}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#40A590]/80 border border-[#40A590]/30 bg-[#40A590]/5 px-2 py-0.5 rounded-sm break-words max-w-full">
          {SCOPE_LABELS[eventScope(event)]} scope
        </span>
        {event.status && <StatusPill status={event.status} />}
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white/95 uppercase tracking-wide break-words">
        {event.title}
      </h3>

      {/* Metadata — auto-fit responsive grid so columns collapse cleanly in any container width */}
      <div className="grid gap-x-4 gap-y-3 text-xs" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <MetaItem label="When">
          <div className="break-words">{dateRange}</div>
        </MetaItem>
        <MetaItem label="Owner">
          <span className="break-words">{event.owner}</span>
        </MetaItem>
        {event.location && (
          <MetaItem label="Location">
            <span className="break-words">{event.location}</span>
          </MetaItem>
        )}
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-sm leading-relaxed text-white/70 border-t border-[#3a5a7a] pt-4 break-words">
          {event.description}
        </p>
      )}

      {/* Tags */}
      {event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {event.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] font-bold uppercase tracking-wider text-white/45 border border-[#3a5a7a] px-1.5 py-0.5 rounded-sm break-all max-w-full"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Link */}
      {event.link && (
        <a
          href={event.link}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[#40A590] hover:text-[#40A590]/80 uppercase tracking-wider font-bold"
        >
          Open source →
        </a>
      )}

      {/* Child sessions */}
      {children.length > 0 && (
        <div className="border-t border-[#3a5a7a] pt-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-white/45 mb-2">
            Sessions ({children.length})
          </div>
          <div className="flex flex-col gap-1.5">
            {children
              .slice()
              .sort((a, b) => {
                const d = compareISO(a.startDate || "", b.startDate || "");
                if (d !== 0) return d;
                return (a.startTime || "").localeCompare(b.startTime || "");
              })
              .map((c) => (
                <button
                  key={c.id}
                  onClick={() => setExpandedId(c.id)}
                  className="text-left text-xs px-2 py-1.5 rounded-sm border border-[#3a5a7a] hover:border-[#40A590]/40 hover:bg-[#2c5073] flex items-center gap-2 w-full"
                >
                  <span className="text-white/45 text-[10px] uppercase tracking-wider w-28 flex-shrink-0">
                    {c.startDate ? shortDayLabel(c.startDate).split(",")[0] : ""}
                  </span>
                  <span className="text-white/80">{c.title}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetaItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
        {label}
      </div>
      <div className="text-white/80 break-words min-w-0">{children}</div>
    </div>
  );
}

function StatusPill({ status }: { status: EventStatus }) {
  const colors: Record<EventStatus, string> = {
    planned: "#40A590",
    "in-production": "#EFB54E",
    completed: "#71C495",
    "no-content": "#C6C8CA",
  };
  const c = colors[status];
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border"
      style={{
        color: c,
        borderColor: `${c}66`,
        background: `${c}15`,
      }}
    >
      {status}
    </span>
  );
}

function SectionHeader({
  children,
  highlight = false,
}: {
  children: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b ${
        highlight ? "text-[#40A590] border-[#40A590]/40" : "text-white/50 border-[#3a5a7a]"
      }`}
    >
      {children}
    </div>
  );
}
