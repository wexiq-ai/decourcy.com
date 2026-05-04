import { db, schema } from "@/lib/db/client";

export type ModelId =
  | "claude-haiku-4-5-20251001"
  | "claude-sonnet-4-6"
  | "claude-opus-4-7";

type Pricing = {
  inputPerM: number;
  outputPerM: number;
  cacheReadPerM: number;
  cacheWritePerM: number;
};

const PRICING: Record<ModelId, Pricing> = {
  "claude-haiku-4-5-20251001": {
    inputPerM: 1,
    outputPerM: 5,
    cacheReadPerM: 0.1,
    cacheWritePerM: 1.25,
  },
  "claude-sonnet-4-6": {
    inputPerM: 3,
    outputPerM: 15,
    cacheReadPerM: 0.3,
    cacheWritePerM: 3.75,
  },
  "claude-opus-4-7": {
    inputPerM: 15,
    outputPerM: 75,
    cacheReadPerM: 1.5,
    cacheWritePerM: 18.75,
  },
};

export type ApiUsage = {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number | null;
  cache_creation_input_tokens?: number | null;
};

export function computeCost(model: ModelId, usage: ApiUsage): number {
  const p = PRICING[model];
  const cacheRead = usage.cache_read_input_tokens ?? 0;
  const cacheWrite = usage.cache_creation_input_tokens ?? 0;
  const freshInput = usage.input_tokens - cacheRead - cacheWrite;
  return (
    (freshInput * p.inputPerM +
      cacheRead * p.cacheReadPerM +
      cacheWrite * p.cacheWritePerM +
      usage.output_tokens * p.outputPerM) /
    1_000_000
  );
}

export async function recordUsage(input: {
  sessionId?: string | null;
  model: ModelId;
  usage: ApiUsage;
  kind: string;
}): Promise<number> {
  const cost = computeCost(input.model, input.usage);
  await db.insert(schema.usageEvents).values({
    sessionId: input.sessionId ?? null,
    model: input.model,
    inputTokens: input.usage.input_tokens,
    outputTokens: input.usage.output_tokens,
    cachedTokens:
      (input.usage.cache_read_input_tokens ?? 0) +
      (input.usage.cache_creation_input_tokens ?? 0),
    costUsd: cost,
    kind: input.kind,
  });
  return cost;
}

export async function getLifetimeCost(): Promise<number> {
  const rows = await db.select().from(schema.usageEvents);
  return rows.reduce((sum, r) => sum + r.costUsd, 0);
}

export async function getSessionCost(sessionId: string): Promise<number> {
  const rows = await db.select().from(schema.usageEvents);
  return rows
    .filter((r) => r.sessionId === sessionId)
    .reduce((sum, r) => sum + r.costUsd, 0);
}
