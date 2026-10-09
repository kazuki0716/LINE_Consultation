import { CAPACITY, isConfigured, register } from './_redis.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v, max) => String(v ?? '').trim().slice(0, max);

// POST /api/register  { name, kana, email, phone?, agree, website(ボット対策・空のはず) }
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  if (!isConfigured()) {
    return res.status(503).json({ error: 'not_configured', message: '現在お申し込みを受け付けていません。' });
  }

  const body = typeof req.body === 'object' && req.body !== null ? req.body : {};

  // ボット対策：画面に見えない入力欄に値が入っていたら、登録せずに成功したふりをする
  if (clean(body.website, 200)) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(body.name, 50);
  const kana = clean(body.kana, 50);
  const email = clean(body.email, 254).toLowerCase();
  const phone = clean(body.phone, 20);

  const errors = {};
  if (!name) errors.name = 'お名前を入力してください。';
  if (!kana) errors.kana = 'ふりがなを入力してください。';
  if (!EMAIL_RE.test(email)) errors.email = 'メールアドレスを正しく入力してください。';
  if (phone && !/^[0-9+\-() ]{8,20}$/.test(phone)) errors.phone = '電話番号を正しく入力してください。';
  if (body.agree !== true) errors.agree = '個人情報の取り扱いへの同意が必要です。';
  if (Object.keys(errors).length) {
    return res.status(400).json({ error: 'invalid', errors });
  }

  try {
    const entry = JSON.stringify({ name, kana, email, phone, at: new Date().toISOString() });
    const result = await register(email, entry);
    if (result === -1) {
      return res.status(409).json({ error: 'full', message: '定員に達したため、受付を終了しました。' });
    }
    if (result === -2) {
      return res.status(409).json({ error: 'duplicate', message: 'このメールアドレスはすでにお申し込み済みです。' });
    }
    return res.status(201).json({ ok: true, number: result, remaining: Math.max(CAPACITY - result, 0) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error', message: '送信に失敗しました。時間をおいて再度お試しください。' });
  }
}
