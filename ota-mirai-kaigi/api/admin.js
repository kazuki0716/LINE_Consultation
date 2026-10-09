import { timingSafeEqual } from 'node:crypto';
import { entries, isConfigured } from './_redis.js';

// GET /api/admin → 申込者一覧を CSV でダウンロード（ユーザー名 admin ／ パスワードは環境変数 ADMIN_PASSWORD）
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

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!authorized(req)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="ota-mirai-kaigi admin", charset="UTF-8"');
    return res.status(401).send('Unauthorized');
  }
  if (!isConfigured()) {
    return res.status(503).send('Redis is not configured');
  }
  try {
    const rows = await entries();
    const lines = [['No', '申込日時', 'お名前', 'ふりがな', 'メール', '電話'].map(csvCell).join(',')];
    rows.forEach((r, i) => lines.push([i + 1, r.at, r.name, r.kana, r.email, r.phone].map(csvCell).join(',')));
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="ota-mirai-kaigi-entries.csv"');
    return res.status(200).send('﻿' + lines.join('\r\n'));
  } catch (e) {
    console.error(e);
    return res.status(500).send('Server error');
  }
}
