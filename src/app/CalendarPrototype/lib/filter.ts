import type { CalendarEvent, FilterState } from "../types";
import { isBetween } from "./dates";

export function emptyFilterState(): FilterState {
  return {
    search: "",
    sources: new Set(),
    owners: new Set(),
    sourceTypes: new Set(),
    statuses: new Set(),
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
    f.range !== null
  );
}

export function eventMatches(ev: CalendarEvent, f: FilterState): boolean {
  if (f.search.trim()) {
    const q = f.search.trim().toLowerCase();
    const hay = [
      ev.title,
      ev.description || "",
      ev.owner,
      ev.sourceTracker,
      ev.location || "",
      ev.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    if (!hay.includes(q)) return false;
  }

  if (f.sources.size > 0 && !f.sources.has(ev.sourceTracker)) return false;
  if (f.owners.size > 0 && !f.owners.has(ev.owner)) return false;
  if (f.sourceTypes.size > 0 && !f.sourceTypes.has(ev.sourceType)) return false;
  if (f.statuses.size > 0 && (!ev.status || !f.statuses.has(ev.status))) return false;

  if (f.range) {
    if (!ev.startDate) return false;
    const evStart = ev.startDate;
    const evEnd = ev.endDate || ev.startDate;
    // overlap check
    if (evEnd < f.range.start || evStart > f.range.end) return false;
  }

  return true;
}

export function applyFilters(events: CalendarEvent[], f: FilterState): CalendarEvent[] {
  return events.filter((ev) => eventMatches(ev, f));
}

export function eventsOnDay(events: CalendarEvent[], iso: string): CalendarEvent[] {
  return events.filter((ev) => {
    if (!ev.startDate) return false;
    const end = ev.endDate || ev.startDate;
    return isBetween(iso, ev.startDate, end);
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
