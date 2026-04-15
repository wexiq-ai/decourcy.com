// Lightweight ISO-date helpers. All dates are "YYYY-MM-DD" strings
// treated as calendar dates (no timezone), which is what every source
// tracker stores. We never parse into Date() for math, only for display.

export const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function todayISO(): string {
  const d = new Date();
  return toISO(d);
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, n: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function addMonths(iso: string, n: number): string {
  const d = parseISO(iso);
  d.setMonth(d.getMonth() + n);
  return toISO(d);
}

export function startOfMonth(iso: string): string {
  const d = parseISO(iso);
  d.setDate(1);
  return toISO(d);
}

export function endOfMonth(iso: string): string {
  const d = parseISO(iso);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  return toISO(d);
}

export function startOfWeek(iso: string): string {
  // Monday-start week
  const d = parseISO(iso);
  const day = d.getDay(); // 0=Sun, 1=Mon
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  return toISO(d);
}

export function endOfWeek(iso: string): string {
  return addDays(startOfWeek(iso), 6);
}

export function isBetween(iso: string, start: string, end: string): boolean {
  return iso >= start && iso <= end;
}

export function compareISO(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function monthLabel(iso: string): string {
  const d = parseISO(iso);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function shortDayLabel(iso: string): string {
  const d = parseISO(iso);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function longDayLabel(iso: string): string {
  const d = parseISO(iso);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export function dayNumber(iso: string): number {
  return parseISO(iso).getDate();
}

export function weekdayIndex(iso: string): number {
  // Monday = 0, Sunday = 6
  const d = parseISO(iso).getDay();
  return d === 0 ? 6 : d - 1;
}

export function isSameMonth(a: string, b: string): boolean {
  return a.slice(0, 7) === b.slice(0, 7);
}

export function isToday(iso: string): boolean {
  return iso === todayISO();
}

export function buildMonthGrid(monthISO: string): string[] {
  // 6-row grid of YYYY-MM-DD starting on the Monday <= 1st of month
  const first = startOfMonth(monthISO);
  const gridStart = startOfWeek(first);
  const result: string[] = [];
  for (let i = 0; i < 42; i++) {
    result.push(addDays(gridStart, i));
  }
  return result;
}

export function formatTimeRange(start?: string, end?: string): string | null {
  if (!start) return null;
  if (!end) return formatTime(start);
  return `${formatTime(start)} – ${formatTime(end)}`.replace("–", "-");
}

export function formatTime(t: string): string {
  // "14:30" -> "2:30pm"
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hh = ((h % 12) || 12);
  return m === 0 ? `${hh}${suffix}` : `${hh}:${String(m).padStart(2, "0")}${suffix}`;
}

export function daysBetween(startIso: string, endIso: string): number {
  const s = parseISO(startIso);
  const e = parseISO(endIso);
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

export function quarterLabel(iso: string): string {
  const d = parseISO(iso);
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `Q${q} ${d.getFullYear()}`;
}

export function startOfQuarter(iso: string): string {
  const d = parseISO(iso);
  const startMonth = Math.floor(d.getMonth() / 3) * 3;
  return `${d.getFullYear()}-${String(startMonth + 1).padStart(2, "0")}-01`;
}

export function endOfQuarter(iso: string): string {
  const d = parseISO(iso);
  const endMonth = Math.floor(d.getMonth() / 3) * 3 + 2;
  const last = new Date(d.getFullYear(), endMonth + 1, 0).getDate();
  return `${d.getFullYear()}-${String(endMonth + 1).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
}
