import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

const sha = (s: string) => createHash("sha256").update(s).digest();

/**
 * アクセスの動作モード。
 *  - locked      : ACCESS_CODE が設定されている → 合言葉が必要
 *  - open        : ACCESS_CODE が無く、ALLOW_PUBLIC=true → 誰でも使える（API利用料に注意）
 *  - unconfigured: どちらも無い → 動かさない（公開してAPI利用料を使われる事故を防ぐため）
 */
export function accessMode(): "locked" | "open" | "unconfigured" {
  if (process.env.ACCESS_CODE) return "locked";
  return process.env.ALLOW_PUBLIC === "true" ? "open" : "unconfigured";
}

export function checkAccess(req: Request): "ok" | "unconfigured" | "denied" {
  const mode = accessMode();
  if (mode === "unconfigured") return "unconfigured";
  if (mode === "open") return "ok";

  // ヘッダーは日本語を直接送れないので、クライアントが encodeURIComponent した値を受け取る
  let given = req.headers.get("x-access-code") ?? "";
  try {
    given = decodeURIComponent(given);
  } catch {
    return "denied";
  }
  return timingSafeEqual(sha(given), sha(process.env.ACCESS_CODE!)) ? "ok" : "denied";
}

// サーバーレスではインスタンスごとの簡易制限（ベストエフォート）。本格的に守るなら Vercel の WAF / Upstash 等を併用。
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const LIMIT = Number(process.env.RATE_LIMIT_PER_MIN ?? 12);

export function rateLimited(req: Request): boolean {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return false;
}
