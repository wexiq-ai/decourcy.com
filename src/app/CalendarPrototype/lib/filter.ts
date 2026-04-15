import type { CalendarEvent, EventScope, FilterState } from "../types";
import { daysBetween, isBetween } from "./dates";

export function emptyFilterState(): FilterState {
  return {
    search: "",
    sources: new Set(),
    owners: new Set(),
    sourceTypes: new Set(),
    statuses: new Set(),
    scopes: new Set(),
    range: null,
  };
}

export function hasActiveFilters(f: FilterState): boolean {
  return (
    f.search.trim() !== "" ||
    f.sources.size > 0 ||
    f.owners.size > 0 ||
    f.sourceTypes.size > 0 ||
    f.statuses.size > 0 ||
    f.scopes.size > 0 ||
    f.range !== null
  );
}

// ---------------------------------------------------------------------------
// Scope classification
//
// "Scope" describes how wide a net an event casts on the calendar:
//   - "day"     single-day or short multi-day event (< 5 days)
//   - "week"    week-long theme (5-13 days) — fits inside a month cell
//   - "month"   full-month theme (14-62 days)
//   - "quarter" quarter or multi-month scope (63-120 days)
//   - "year"    full-year / ongoing / undated (>120 days or no dates)
//
// We use scope to decide WHERE to render an event: day/week items go into
// day cells, month+ items float in a "Themes" banner above the day grid.
// ---------------------------------------------------------------------------

export function eventScope(ev: CalendarEvent): EventScope {
  if (!ev.startDate) return "year";
  const end = ev.endDate || ev.startDate;
  const span = daysBetween(ev.startDate, end) + 1;
  if (span <= 4) return "day";
  if (span <= 13) return "week";
  if (span <= 62) return "month";
  if (span <= 120) return "quarter";
  return "year";
}

// An event is "theme-typed" if its sourceType explicitly calls it out as a
// theme (Weekly Theme, Monthly Theme). Such events always belong in the
// themes banner regardless of span — a weekly theme is NOT a same-day
// action, even though its span would otherwise scope-classify as "week".
//
// Items with a multi-day span but a non-theme sourceType ("Event",
// "Content", etc.) stay in day cells — a 6-day incentive trip or a
// weekly-publishing-window article is something happening on each of
// those days, not a descriptive theme the calendar is operating under.
export function isThemeType(ev: CalendarEvent): boolean {
  return ev.sourceType === "Weekly Theme" || ev.sourceType === "Monthly Theme";
}

export function isDailyScope(ev: CalendarEvent): boolean {
  if (isThemeType(ev)) return false;
  const s = eventScope(ev);
  return s === "day" || s === "week";
}

export function isThemeScope(ev: CalendarEvent): boolean {
  if (isThemeType(ev)) return true;
  const s = eventScope(ev);
  return s === "month" || s === "quarter" || s === "year";
}

// Multi-term substring search: every whitespace-separated term must appear.
export function matchesSearch(ev: CalendarEvent, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    ev.title,
    ev.description || "",
    ev.owner,
    ev.sourceTracker,
    ev.sourceType,
    ev.location || "",
    ev.status || "",
    ev.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((term) => hay.includes(term));
}

export function eventMatches(ev: CalendarEvent, f: FilterState): boolean {
  if (!matchesSearch(ev, f.search)) return false;

  if (f.sources.size > 0 && !f.sources.has(ev.sourceTracker)) return false;
  if (f.owners.size > 0 && !f.owners.has(ev.owner)) return false;
  if (f.sourceTypes.size > 0 && !f.sourceTypes.has(ev.sourceType)) return false;
  if (f.statuses.size > 0 && (!ev.status || !f.statuses.has(ev.status))) return false;
  if (f.scopes.size > 0 && !f.scopes.has(eventScope(ev))) return false;

  if (f.range) {
    if (!ev.startDate) return false;
    const evStart = ev.startDate;
    const evEnd = ev.endDate || ev.startDate;
    if (evEnd < f.range.start || evStart > f.range.end) return false;
  }

  return true;
}

export function applyFilters(events: CalendarEvent[], f: FilterState): CalendarEvent[] {
  return events.filter((ev) => eventMatches(ev, f));
}

// Return only "daily" (day + week scope) events overlapping the given day.
// This is what goes inside the individual day cells of the month/week grid.
export function eventsOnDay(events: CalendarEvent[], iso: string): CalendarEvent[] {
  return events.filter((ev) => {
    if (!ev.startDate) return false;
    if (!isDailyScope(ev)) return false;
    const end = ev.endDate || ev.startDate;
    return isBetween(iso, ev.startDate, end);
  });
}

// Return "theme" (month/quarter/year scope) events active on the given day.
// This is what fills the "Themes & Campaigns" banner at the top of each view.
export function themesActiveOn(events: CalendarEvent[], iso: string): CalendarEvent[] {
  return events.filter((ev) => {
    if (!isThemeScope(ev)) return false;
    if (!ev.startDate) return true; // undated themes are always active
    const end = ev.endDate || ev.startDate;
    return isBetween(iso, ev.startDate, end);
  });
}

// Return theme events overlapping a date range (for month/week/day views).
export function themesInRange(
  events: CalendarEvent[],
  start: string,
  end: string
): CalendarEvent[] {
  return events.filter((ev) => {
    if (!isThemeScope(ev)) return false;
    if (!ev.startDate) return true;
    const evEnd = ev.endDate || ev.startDate;
    return !(evEnd < start || ev.startDate > end);
  });
}

export function toggleSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function uniqueSorted<T>(values: T[]): T[] {
  return Array.from(new Set(values)).sort();
}

export const SCOPE_ORDER: EventScope[] = ["day", "week", "month", "quarter", "year"];

export const SCOPE_LABELS: Record<EventScope, string> = {
  day: "Daily",
  week: "Weekly",
  month: "Monthly",
  quarter: "Quarterly",
  year: "Ongoing",
};
