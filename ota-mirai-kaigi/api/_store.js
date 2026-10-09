// 申込データの保存先（Supabase）を REST で呼ぶ最小クライアント。
// テーブルと関数は supabase/schema.sql で作る。_ で始まるファイルは Vercel の API ルートにならない。

const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

export const CAPACITY = Number.parseInt(process.env.CAPACITY || '120', 10);

export function isConfigured() {
  return Boolean(url && key);
}

function headers() {
  const h = { apikey: key, 'Content-Type': 'application/json' };
  // 従来の service_role キー（JWT）は Authorization にも付ける。新しい sb_secret_ キーは apikey だけでよい
  if (!key.startsWith('sb_')) h.Authorization = `Bearer ${key}`;
  return h;
}

async function call(path, init = {}) {
  if (!isConfigured()) throw new Error('Supabase is not configured');
  const res = await fetch(`${url}/rest/v1/${path}`, { ...init, headers: { ...headers(), ...init.headers } });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data && data.message) || `Supabase HTTP ${res.status}`);
  return data;
}

const rpc = (fn, args = {}) => call(`rpc/${fn}`, { method: 'POST', body: JSON.stringify(args) });

// 戻り値: 1以上 = 登録後の人数、-1 = 満席、-2 = 登録済みのメールアドレス
export async function register({ name, kana, email, phone }) {
  return Number(await rpc('ota_register', { p_name: name, p_kana: kana, p_email: email, p_phone: phone, p_capacity: CAPACITY }));
}

export async function count() {
  return Number(await rpc('ota_count'));
}

export async function entries() {
  const rows = await call('ota_entries?select=name,kana,email,phone,created_at&order=id.asc');
  return rows.map((r) => ({ name: r.name, kana: r.kana, email: r.email, phone: r.phone, at: r.created_at }));
}
