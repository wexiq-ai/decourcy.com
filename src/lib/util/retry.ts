export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: {
    maxAttempts?: number;
    isRetryable?: (e: unknown) => boolean;
    baseDelayMs?: number;
    maxDelayMs?: number;
  } = {},
): Promise<T> {
  const maxAttempts = opts.maxAttempts ?? 6;
  const baseDelayMs = opts.baseDelayMs ?? 2000;
  const maxDelayMs = opts.maxDelayMs ?? 60_000;
  const isRetryable = opts.isRetryable ?? (() => true);

  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= maxAttempts || !isRetryable(err)) throw err;
      const delay = Math.min(
        maxDelayMs,
        baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 1000,
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

export function isRateLimitError(err: unknown): boolean {
  if (typeof err !== "object" || !err) return false;
  const e = err as { code?: unknown; status?: unknown; message?: unknown };
  const codes = [e.code, e.status]
    .filter((v) => typeof v === "number")
    .map(Number);
  if (codes.includes(403) || codes.includes(429)) return true;
  if (typeof e.message === "string") {
    return /quota|rate.?limit|too many requests|overloaded/i.test(e.message);
  }
  return false;
}
