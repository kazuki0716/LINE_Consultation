import { timingSafeEqual } from 'node:crypto';
import { entries, isConfigured, reset, SchemaOutdatedError, setCapacity, status } from './_store.js';

// 管理用（ユーザー名 admin ／ パスワードは環境変数 ADMIN_PASSWORD）
//   GET  /api/admin              → 申込者一覧を CSV でダウンロード
//   GET  /api/admin?format=json  → 定員・申込数・申込者一覧（管理ページ用）
//   POST /api/admin { action: 'capacity', capacity }       → 定員を変える
//   POST /api/admin { action: 'reset', confirm: 'リセット' } → 申込を全件消す
export const RESET_WORD = 'リセット';

function authorized(req) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const header = req.headers.authorization || '';
  if (!header.startsWith('Basic ')) return false;
  const [user, ...rest] = Buffer.from(header.slice(6), 'base64').toString('utf8').split(':');
  const a = Buffer.from(rest.join(':'));
  const b = Buffer.from(expected);
  return user === 'admin' && a.length === b.length && timingSafeEqual(a, b);
}

const csvCell = (v) => {
  let s = String(v ?? '');
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // Excel の数式として実行されないようにする
  return `"${s.replace(/"/g, '""')}"`;
};
const jst = (iso) => new Date(iso).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

function toCsv(rows) {
  const lines = [['No', '申込日時（日本時間）', 'お名前', 'ふりがな', 'メール', '電話'].map(csvCell).join(',')];
  rows.forEach((r, i) => lines.push([i + 1, jst(r.at), r.name, r.kana, r.email, r.phone].map(csvCell).join(',')));
  return '﻿' + lines.join('\r\n');
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!authorized(req)) {
    // 管理ページからの呼び出しでは、ブラウザ標準のパスワード画面を出さない
    if (req.headers['x-admin-page'] !== '1') res.setHeader('WWW-Authenticate', 'Basic realm="ota-mirai-kaigi admin", charset="UTF-8"');
    return res.status(401).json({ error: 'unauthorized', message: 'パスワードが違います。' });
  }
  if (!isConfigured()) {
    return res.status(503).json({ error: 'not_configured', message: 'Supabase の設定がされていません。' });
  }

  try {
    if (req.method === 'GET') {
      const rows = await entries();
      const format = new URL(req.url || '/', 'http://x').searchParams.get('format');
      if (format === 'json') {
        return res.status(200).json({ status: await status(), entries: rows.map((r, i) => ({ no: i + 1, ...r, at: jst(r.at) })) });
      }
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="ota-mirai-kaigi-entries.csv"');
      return res.status(200).send(toCsv(rows));
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
      if (body.action === 'capacity') {
        const capacity = Number(body.capacity);
        if (!Number.isInteger(capacity) || capacity < 1 || capacity > 100000) {
          return res.status(400).json({ error: 'invalid', message: '定員は1以上の整数で入力してください。' });
        }
        await setCapacity(capacity);
        return res.status(200).json({ ok: true, status: await status() });
      }
      if (body.action === 'reset') {
        if (body.confirm !== RESET_WORD) {
          return res.status(400).json({ error: 'invalid', message: `確認のため「${RESET_WORD}」と入力してください。` });
        }
        await reset();
        return res.status(200).json({ ok: true, status: await status() });
      }
      return res.status(400).json({ error: 'invalid', message: '操作の指定が正しくありません。' });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  } catch (e) {
    console.error(e);
    if (e instanceof SchemaOutdatedError) {
      return res.status(503).json({ error: 'schema_outdated', message: 'Supabase の SQL Editor で、最新の schema.sql を実行してください。' });
    }
    return res.status(500).json({ error: 'server_error', message: 'エラーが起きました。時間をおいて再度お試しください。' });
  }
}
