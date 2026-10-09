// 本物の redis-server を起動し、Upstash REST 互換の小さな中継サーバー越しに API を検証する。
// 実行: npm test（redis-server が PATH にあること）
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import net from 'node:net';
import http from 'node:http';

const REDIS_PORT = 6390 + Math.floor(Math.random() * 500);
let redisProc, shim, status, register, admin;

// --- RESP（Redis のプロトコル）を最小限だけ話すクライアント ---
function encode(args) {
  return `*${args.length}\r\n` + args.map((a) => `$${Buffer.byteLength(String(a))}\r\n${a}\r\n`).join('');
}
function parse(buf, i = 0) {
  const type = String.fromCharCode(buf[i]);
  const end = buf.indexOf('\r\n', i);
  const line = buf.toString('utf8', i + 1, end);
  if (type === '+') return [line, end + 2];
  if (type === '-') return [{ error: line }, end + 2];
  if (type === ':') return [Number(line), end + 2];
  if (type === '$') {
    const len = Number(line);
    if (len === -1) return [null, end + 2];
    return [buf.toString('utf8', end + 2, end + 2 + len), end + 4 + len];
  }
  if (type === '*') {
    const n = Number(line);
    let pos = end + 2;
    const out = [];
    for (let k = 0; k < n; k++) { const [v, p] = parse(buf, pos); out.push(v); pos = p; }
    return [out, pos];
  }
  throw new Error('bad RESP');
}
function command(args) {
  return new Promise((resolve, reject) => {
    const sock = net.connect(REDIS_PORT, '127.0.0.1');
    let data = Buffer.alloc(0);
    sock.on('data', (d) => {
      data = Buffer.concat([data, d]);
      try { const [v] = parse(data); sock.end(); resolve(v); } catch { /* 続きを待つ */ }
    });
    sock.on('error', reject);
    sock.write(encode(args));
  });
}

async function call(handler, { method = 'GET', body, headers = {} } = {}) {
  const res = {
    statusCode: 200, headers: {}, body: undefined,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; },
    send(b) { this.body = b; return this; },
  };
  await handler({ method, body, headers }, res);
  return res;
}

before(async () => {
  redisProc = spawn('redis-server', ['--port', String(REDIS_PORT), '--save', '', '--appendonly', 'no'], { stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    try { if ((await command(['PING'])) === 'PONG') break; } catch { await new Promise((r) => setTimeout(r, 100)); }
  }
  shim = http.createServer((req, res) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', async () => {
      if (req.headers.authorization !== 'Bearer test-token') { res.writeHead(401); return res.end('{}'); }
      const result = await command(JSON.parse(raw));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result && result.error ? { error: result.error } : { result }));
    });
  });
  await new Promise((r) => shim.listen(0, '127.0.0.1', r));
  process.env.KV_REST_API_URL = `http://127.0.0.1:${shim.address().port}`;
  process.env.KV_REST_API_TOKEN = 'test-token';
  process.env.CAPACITY = '120';
  process.env.ADMIN_PASSWORD = 'secret-pass';
  status = (await import('../api/status.js')).default;
  register = (await import('../api/register.js')).default;
  admin = (await import('../api/admin.js')).default;
});

after(() => { shim?.close(); redisProc?.kill(); });

const person = (i) => ({ name: `テスト${i}`, kana: `てすと${i}`, email: `user${i}@example.com`, agree: true });

test('入力が不正なら 400 と項目ごとのエラーを返す', async () => {
  const r = await call(register, { method: 'POST', body: { email: 'not-an-email' } });
  assert.equal(r.statusCode, 400);
  assert.deepEqual(Object.keys(r.body.errors).sort(), ['agree', 'email', 'kana', 'name']);
});

test('GET では申し込めない', async () => {
  const r = await call(register, { method: 'GET' });
  assert.equal(r.statusCode, 405);
});

test('ボット用の隠し欄が埋まっていたら登録しない', async () => {
  const r = await call(register, { method: 'POST', body: { ...person('bot'), website: 'spam' } });
  assert.equal(r.statusCode, 200);
  assert.equal((await call(status)).body.count, 0);
});

test('同時に150人申し込んでも、ちょうど120人で締め切る', async () => {
  const results = await Promise.all(
    Array.from({ length: 150 }, (_, i) => call(register, { method: 'POST', body: person(i) })),
  );
  const ok = results.filter((r) => r.statusCode === 201);
  const full = results.filter((r) => r.body.error === 'full');
  assert.equal(ok.length, 120);
  assert.equal(full.length, 30);
  assert.deepEqual(ok.map((r) => r.body.number).sort((a, b) => a - b), Array.from({ length: 120 }, (_, i) => i + 1));

  const s = (await call(status)).body;
  assert.deepEqual(s, { capacity: 120, count: 120, remaining: 0, open: false });
});

test('同じメールアドレスでは二重に申し込めない（大文字小文字の違いも同じ扱い）', async () => {
  await command(['DEL', 'ota:emails', 'ota:entries']);
  const first = await call(register, { method: 'POST', body: person('dup') });
  assert.equal(first.statusCode, 201);
  const second = await call(register, { method: 'POST', body: { ...person('dup'), email: 'USERdup@Example.com' } });
  assert.equal(second.statusCode, 409);
  assert.equal(second.body.error, 'duplicate');
});

test('管理用 CSV はパスワードが合うときだけ取得でき、数式は無害化される', async () => {
  await call(register, { method: 'POST', body: { ...person('csv'), name: '=HYPERLINK("x")' } });
  const denied = await call(admin, { headers: { authorization: 'Basic ' + Buffer.from('admin:wrong').toString('base64') } });
  assert.equal(denied.statusCode, 401);
  const ok = await call(admin, { headers: { authorization: 'Basic ' + Buffer.from('admin:secret-pass').toString('base64') } });
  assert.equal(ok.statusCode, 200);
  assert.match(ok.body, /お名前/);
  assert.match(ok.body, /"'=HYPERLINK\(""x""\)"/);
});
