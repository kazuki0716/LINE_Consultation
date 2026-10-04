import Anthropic from "@anthropic-ai/sdk";
import { checkAccess, rateLimited } from "@/lib/guard";
import { buildSystem } from "@/lib/persona";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const MAX_TURNS = 40; // 送る履歴の上限（長い会話でコストが膨らむのを防ぐ）
const MAX_CHARS = 2000; // 1メッセージの上限

type Msg = { role: "user" | "assistant"; content: string };

const fail = (error: string, status: number) => Response.json({ error }, { status });

function parseMessages(body: unknown): Msg[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const msgs: Msg[] = [];
  for (const m of raw.slice(-MAX_TURNS)) {
    const role = (m as Msg)?.role;
    const content = (m as Msg)?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string" || !content.trim()) return null;
    msgs.push({ role, content: content.slice(0, MAX_CHARS) });
  }
  while (msgs.length && msgs[0].role !== "user") msgs.shift(); // 先頭は必ず user
  return msgs.length && msgs[msgs.length - 1].role === "user" ? msgs : null;
}

export async function POST(req: Request) {
  const access = checkAccess(req);
  if (access === "unconfigured") return fail("サーバーに ACCESS_CODE が設定されていません。", 503);
  if (access === "denied") return fail("合言葉が違います", 401);
  if (rateLimited(req)) return fail("送信が早すぎます。少し待ってからもう一度どうぞ。", 429);
  if (!process.env.ANTHROPIC_API_KEY) return fail("サーバーに ANTHROPIC_API_KEY が設定されていません。", 503);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("リクエストが不正です", 400);
  }
  const messages = parseMessages(body);
  if (!messages) return fail("メッセージが不正です", 400);

  const client = new Anthropic();
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 1500,
    system: buildSystem(),
    messages,
  });

  // 最初のイベントを待つことで、接続時のエラー（キー不正・混雑など）をストリーム開始前に JSON で返せる
  const events = stream[Symbol.asyncIterator]();
  let first: IteratorResult<Anthropic.MessageStreamEvent>;
  try {
    first = await events.next();
  } catch (e) {
    console.error("anthropic error", e instanceof Error ? e.message : e);
    const status = e instanceof Anthropic.APIError ? e.status : undefined;
    if (status === 429) return fail("いまアクセスが集中してる。少し待ってもう一回送って。", 429);
    if (status === 529 || status === 503) return fail("AIが混み合ってる。少ししてからもう一回。", 503);
    return fail("AIとの接続でエラーが出た。時間をおいてもう一回。", 502);
  }

  const enc = new TextEncoder();
  const textOf = (r: IteratorResult<Anthropic.MessageStreamEvent>) =>
    !r.done && r.value.type === "content_block_delta" && r.value.delta.type === "text_delta" ? r.value.delta.text : "";

  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let r = first;
        for (;;) {
          const t = textOf(r);
          if (t) controller.enqueue(enc.encode(t));
          if (r.done) break;
          r = await events.next();
        }
        controller.close();
      } catch (e) {
        console.error("stream error", e instanceof Error ? e.message : e);
        controller.error(e);
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store, no-transform" },
  });
}
