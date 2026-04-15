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

export type ViewMode = "month" | "week" | "day" | "agenda" | "source";

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
  range: DateRange | null;
};

export const SOURCE_COLORS: Record<string, string> = {
  "AmeriLife Affiliates & Carriers Events": "#5b9bd5",
  "Social Media (Notion)": "#7eb8e0",
  "2026 Marketing Channel Activity": "#4a8abf",
  "Integrated Marketing Calendar": "#6fa8d3",
  "Editorial Tracker": "#8ec5e5",
  "Employee Comms Channel Tracker": "#5090bf",
  "2025 Key Event Calendar": "#a3d0ea",
  "Marketing Mentors Deliverables": "#3f7ca8",
  "Professor Leads": "#b8daee",
  "Medicarians LIVE 2026": "#2f6b93",
};

export const DEFAULT_SOURCE_COLOR = "#5b9bd5";
