// Upstash Redis（Vercel Marketplace の「Upstash for Redis」）を REST で呼ぶ最小クライアント。
// _ で始まるファイルは Vercel の API ルートにならない。

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const CAPACITY = Number.parseInt(process.env.CAPACITY || '120', 10);
export const KEYS = { emails: 'ota:emails', entries: 'ota:entries' };

export function isConfigured() {
  return Boolean(url && token);
}

export async function redis(...command) {
  if (!isConfigured()) throw new Error('Redis is not configured');
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) throw new Error(data.error || `Redis HTTP ${res.status}`);
  return data.result;
}

// 重複チェック・定員チェック・登録を Redis 内で一度に行う（同時申込でも定員を超えない）。
// 戻り値: 1以上 = 登録後の人数、-1 = 満席、-2 = 登録済みのメールアドレス
const REGISTER_SCRIPT = `
local cap = tonumber(ARGV[1])
if redis.call('SISMEMBER', KEYS[1], ARGV[2]) == 1 then return -2 end
local n = redis.call('SCARD', KEYS[1])
if n >= cap then return -1 end
redis.call('SADD', KEYS[1], ARGV[2])
redis.call('RPUSH', KEYS[2], ARGV[3])
return n + 1
`;

export async function register(email, entryJson) {
  return Number(await redis('EVAL', REGISTER_SCRIPT, '2', KEYS.emails, KEYS.entries, String(CAPACITY), email, entryJson));
}

export async function count() {
  return Number(await redis('SCARD', KEYS.emails));
}

export async function entries() {
  const rows = await redis('LRANGE', KEYS.entries, '0', '-1');
  return rows.map((r) => JSON.parse(r));
}
