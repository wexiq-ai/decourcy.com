export type SourceType =
  | "Event"
  | "Session"
  | "Content"
  | "Campaign"
  | "Channel Activity"
  | "Social Post"
  | "Weekly Theme"
  | "Monthly Theme";

export type EventStatus =
  | "planned"
  | "in-production"
  | "completed"
  | "no-content";

// Derived at render time from startDate/endDate span (see lib/filter.ts).
// - "day"     single-day or <5 day event (fits in a day cell)
// - "week"    5-13 day weekly theme (fits in day cells)
// - "month"   14-62 day theme (floats in "This Month" banner)
// - "quarter" 63-120 day quarterly theme (floats in "This Quarter" banner)
// - "year"    long-running / undated (floats in "Ongoing" bucket)
export type EventScope = "day" | "week" | "month" | "quarter" | "year";

export type CalendarEvent = {
  id: string;
  title: string;
  sourceTracker: string;
  sourceType: SourceType;
  owner: string;
  tags: string[];
  startDate?: string; // ISO YYYY-MM-DD
  endDate?: string;
  startTime?: string; // HH:mm local
  endTime?: string;
  allDay: boolean;
  location?: string;
  status?: EventStatus;
  description?: string;
  link?: string;
  parentId?: string;
};

export type ViewMode = "year" | "month" | "week" | "day" | "agenda" | "source";

export type DateRange = {
  start: string; // ISO YYYY-MM-DD
  end: string; // ISO YYYY-MM-DD (inclusive)
};

export type FilterState = {
  search: string;
  sources: Set<string>;
  owners: Set<string>;
  sourceTypes: Set<SourceType>;
  statuses: Set<EventStatus>;
  scopes: Set<EventScope>;
  range: DateRange | null;
};

// AmeriLife brand-aligned palette: teal + seafoam ramp with Gold for the
// highest-profile live event. Each tracker gets a distinct shade but the
// overall vibe stays on-brand (Teal #40A590, Seafoam #71C495).
export const SOURCE_COLORS: Record<string, string> = {
  "AmeriLife Affiliates & Carriers Events": "#40A590", // AmeriLife Teal
  "Social Media (Notion)": "#71C495",                  // AmeriLife Seafoam
  "2026 Marketing Channel Activity": "#2d8a78",        // deep teal
  "Integrated Marketing Calendar": "#5fb5a2",          // light teal
  "Editorial Tracker": "#88d0a8",                      // light seafoam
  "Employee Comms Channel Tracker": "#3d8e7c",         // mid-deep teal
  "2025 Key Event Calendar": "#a5dcbc",                // pale seafoam
  "Marketing Mentors Deliverables": "#267a68",         // deepest teal
  "Professor Leads": "#bce3ce",                        // very pale seafoam
  "Medicarians LIVE 2026": "#EFB54E",                  // AmeriLife Gold (flagship event)
};

export const DEFAULT_SOURCE_COLOR = "#40A590";
