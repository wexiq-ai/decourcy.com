import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  jsonb,
  real,
  index,
} from "drizzle-orm/pg-core";

export const gmailAccounts = pgTable("gmail_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  refreshTokenEncrypted: text("refresh_token_encrypted").notNull(),
  accessTokenEncrypted: text("access_token_encrypted"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable(
  "messages",
  {
    gmailId: text("gmail_id").primaryKey(),
    threadId: text("thread_id").notNull(),
    senderEmail: text("sender_email").notNull(),
    senderName: text("sender_name"),
    subject: text("subject"),
    snippet: text("snippet"),
    internalDate: timestamp("internal_date").notNull(),
    listUnsubscribeHeader: text("list_unsubscribe_header"),
    category: text("category"),
    confidence: real("confidence"),
    classifiedByModel: text("classified_by_model"),
    classifiedAt: timestamp("classified_at"),
    actedOnAt: timestamp("acted_on_at"),
    actionTaken: text("action_taken"),
    fetchedAt: timestamp("fetched_at").defaultNow().notNull(),
  },
  (t) => [
    index("messages_sender_idx").on(t.senderEmail),
    index("messages_category_idx").on(t.category),
    index("messages_internal_date_idx").on(t.internalDate),
  ],
);

export const senders = pgTable("senders", {
  senderEmail: text("sender_email").primaryKey(),
  messageCount: integer("message_count").notNull().default(0),
  vip: boolean("vip").notNull().default(false),
  notes: text("notes"),
  patternCategory: text("pattern_category"),
  patternConfidence: real("pattern_confidence"),
  lastSeenAt: timestamp("last_seen_at"),
});

export const vipSeeds = pgTable("vip_seeds", {
  email: text("email").primaryKey(),
  lastSentToAt: timestamp("last_sent_to_at"),
  sentCount: integer("sent_count").notNull().default(0),
});

export const actions = pgTable(
  "actions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: text("kind").notNull(),
    scopeJson: jsonb("scope_json").$type<Record<string, unknown>>(),
    messageIds: text("message_ids").array(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    undoneAt: timestamp("undone_at"),
  },
  (t) => [index("actions_created_idx").on(t.createdAt)],
);

export const usageEvents = pgTable(
  "usage_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: text("session_id"),
    model: text("model").notNull(),
    inputTokens: integer("input_tokens").notNull().default(0),
    outputTokens: integer("output_tokens").notNull().default(0),
    cachedTokens: integer("cached_tokens").notNull().default(0),
    costUsd: real("cost_usd").notNull().default(0),
    kind: text("kind").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("usage_events_session_idx").on(t.sessionId),
    index("usage_events_created_idx").on(t.createdAt),
  ],
);

export const rules = pgTable("rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  criteriaJson: jsonb("criteria_json").$type<Record<string, unknown>>().notNull(),
  action: text("action").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  lastAppliedAt: timestamp("last_applied_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
