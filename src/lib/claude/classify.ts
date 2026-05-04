import { getAnthropic } from "./client";
import { recordUsage, type ModelId } from "./cost";

export type Bucket =
  | "PERSONAL"
  | "TRANSACTIONAL"
  | "NEWSLETTER"
  | "PROMOTIONAL"
  | "NOTIFICATIONS"
  | "JOB"
  | "UNCERTAIN";

export const BUCKETS: Bucket[] = [
  "PERSONAL",
  "TRANSACTIONAL",
  "NEWSLETTER",
  "PROMOTIONAL",
  "NOTIFICATIONS",
  "JOB",
  "UNCERTAIN",
];

export type ClassifyResult = {
  category: Bucket;
  confidence: number;
};

export type MessageInput = {
  from: string;
  subject: string;
  snippet: string;
};

const SYSTEM_PROMPT = `You classify a single email into one of these buckets:

- PERSONAL: A human writing directly to the recipient (1:1 correspondence, replies, threads)
- TRANSACTIONAL: Receipts, order confirmations, shipping notices, statements, invoices, calendar invites — automated but tied to a specific real action the recipient took
- NEWSLETTER: Recurring editorial content the recipient opted into (blogs, digests, weekly roundups)
- PROMOTIONAL: Sales pitches, deals, marketing, discount offers, upsells — sender is trying to drive a purchase
- NOTIFICATIONS: Automated app/service alerts (LinkedIn updates, GitHub PRs, calendar reminders, security alerts, social media notifications)
- JOB: Recruiter outreach, job listings, hiring updates, interview scheduling
- UNCERTAIN: You cannot confidently place it in one of the above

Output strictly as JSON: {"category": "<BUCKET>", "confidence": <0-1>}

Confidence is your subjective certainty (0 to 1). Below 0.75 means the classification should be reviewed by a human or a stronger model. Be honest — over-confidence is worse than uncertainty.`;

export async function classifyOne(
  model: ModelId,
  message: MessageInput,
): Promise<{ result: ClassifyResult; cost: number }> {
  const anthropic = getAnthropic();
  const userText = `From: ${message.from}\nSubject: ${message.subject}\nSnippet: ${message.snippet}`;

  const response = await anthropic.messages.create({
    model,
    max_tokens: 64,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userText }],
  });

  const cost = await recordUsage({
    model,
    usage: response.usage,
    kind: "classification",
  });

  const text =
    response.content[0]?.type === "text" ? response.content[0].text : "";
  const result = parseClassifyResult(text);
  return { result, cost };
}

function parseClassifyResult(text: string): ClassifyResult {
  const jsonMatch = text.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) return { category: "UNCERTAIN", confidence: 0 };
  try {
    const parsed = JSON.parse(jsonMatch[0]) as {
      category?: string;
      confidence?: number;
    };
    const category =
      parsed.category && BUCKETS.includes(parsed.category as Bucket)
        ? (parsed.category as Bucket)
        : "UNCERTAIN";
    const confidence =
      typeof parsed.confidence === "number"
        ? Math.max(0, Math.min(1, parsed.confidence))
        : 0;
    return { category, confidence };
  } catch {
    return { category: "UNCERTAIN", confidence: 0 };
  }
}
