// 本物の PostgreSQL に supabase/schema.sql を流し、Supabase の REST（PostgREST）を
// まねた小さな中継サーバー越しに API を検証する。
// 実行: npm test（PostgreSQL のサーバープログラムが入っていること。PG_BIN で場所を指定できる）
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, execFile, spawn } from 'node:child_process';
import { mkdtempSync, existsSync, readdirSync, chmodSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import http from 'node:http';

const SCHEMA = path.join(import.meta.dirname, '..', 'supabase', 'schema.sql');
const KEY = 'test-service-key';
const PORT = 5400 + Math.floor(Math.random() * 500);

function findPgBin() {
  if (process.env.PG_BIN) return process.env.PG_BIN;
  const base = '/usr/lib/postgresql';
  if (!existsSync(base)) return null;
  const v = readdirSync(base).sort().pop();
  return v ? path.join(base, v, 'bin') : null;
}
const PG_BIN = findPgBin();
const asRoot = process.getuid && process.getuid() === 0;
// root では PostgreSQL を起動できないので postgres ユーザーで動かす
const run = (bin, args) => (asRoot ? ['runuser', ['-u', 'postgres', '--', path.join(PG_BIN, bin), ...args]] : [path.join(PG_BIN, bin), args]);

let dir, pg, shim, status, register, admin;

function psql(sql, vars = {}, role = 'service_role') {
  const args = ['-h', dir, '-p', String(PORT), '-U', 'postgres', '-d', 'postgres', '-tAq', '-v', 'ON_ERROR_STOP=1'];
  for (const [k, v] of Object.entries(vars)) args.push('-v', `${k}=${v}`);
  // -c では :'変数' が展開されないため、SQL は標準入力から渡す
  const [cmd, a] = run('psql', args);
  return new Promise((resolve, reject) => {
    const child = execFile(cmd, a, (err, out, errOut) => (err ? reject(new Error(errOut || err.message)) : resolve(out.trim())));
    child.stdin.end(`set role ${role};\n${sql};\n`);
  });
}

// Supabase REST のうち、受付プログラムが使う呼び出しだけをまねる
function startShim() {
  shim = http.createServer((req, res) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', async () => {
      const send = (code, body) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); };
      if (req.headers.apikey !== KEY) return send(401, { message: 'Invalid API key' });
      try {
        const u = new URL(req.url, 'http://x');
        if (req.method === 'POST' && u.pathname === '/rest/v1/rpc/ota_register') {
          const b = JSON.parse(raw);
          const out = await psql("select ota_register(:'n', :'k', :'e', :'p', :c)", { n: b.p_name, k: b.p_kana, e: b.p_email, p: b.p_phone, c: b.p_capacity });
          return send(200, Number(out));
        }
        if (req.method === 'POST' && u.pathname === '/rest/v1/rpc/ota_count') return send(200, Number(await psql('select ota_count()')));
        // 本物の Supabase と同じく、関数がないときは PGRST202 を返す
        const fnExists = async (fn) => (await psql(`select count(*) from pg_proc where proname = '${fn}'`, {}, 'postgres')) !== '0';
        if (u.pathname.startsWith('/rest/v1/rpc/') && !(await fnExists(u.pathname.split('/').pop().replace(/\W/g, '')))) {
          return send(404, { code: 'PGRST202', message: `Could not find the function ${u.pathname}` });
        }
        if (req.method === 'POST' && u.pathname === '/rest/v1/rpc/ota_status') {
          return send(200, JSON.parse(await psql("select ota_status(:'d')", { d: JSON.parse(raw).p_default })));
        }
        if (req.method === 'POST' && u.pathname === '/rest/v1/rpc/ota_set_capacity') {
          await psql("select ota_set_capacity(:'c')", { c: JSON.parse(raw).p_capacity });
          res.writeHead(204); return res.end();
        }
        if (req.method === 'POST' && u.pathname === '/rest/v1/rpc/ota_reset') {
          await psql('select ota_reset()');
          res.writeHead(204); return res.end();
        }
        if (req.method === 'GET' && u.pathname === '/rest/v1/ota_entries') {
          const out = await psql("select coalesce(json_agg(t order by t.id), '[]') from (select id, name, kana, email, phone, created_at from ota_entries) t");
          return send(200, JSON.parse(out));
        }
        send(404, { message: 'not found' });
      } catch (e) {
        send(400, { message: e.message });
      }
    });
  });
  return new Promise((r) => shim.listen(0, '127.0.0.1', r));
}

async function call(handler, { method = 'GET', url = '/', body, headers = {} } = {}) {
  const res = {
    statusCode: 200, headers: {}, body: undefined,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; },
    send(b) { this.body = b; return this; },
  };
  await handler({ method, url, body, headers }, res);
  return res;
}

const skip = !PG_BIN || !existsSync(path.join(PG_BIN, 'postgres')) ? 'PostgreSQL が見つからないためスキップ' : false;

before(async () => {
  if (skip) return;
  dir = mkdtempSync(path.join(tmpdir(), 'ota-pg-'));
  chmodSync(dir, 0o777);
  const data = path.join(dir, 'data');
  execFileSync(...run('initdb', ['-D', data, '-U', 'postgres', '--auth=trust']), { stdio: 'ignore' });
  pg = spawn(...run('postgres', ['-D', data, '-p', String(PORT), '-k', dir, '-c', 'listen_addresses=', '-c', 'max_connections=300', '-c', 'fsync=off']), { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) {
    try { execFileSync(...run('pg_isready', ['-h', dir, '-p', String(PORT)]), { stdio: 'ignore' }); break; } catch { await new Promise((r) => setTimeout(r, 200)); }
  }
  // Supabase にある役割（ロール）を用意してから、本番と同じ SQL を流す
  await psql('create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;', {}, 'postgres');
  // 旧版の SQL を流して申込を1件入れてから、新しい SQL を2回流す（作り直しても申込が消えないことの確認用）
  const applySql = (file) => execFileSync(...run('psql', ['-h', dir, '-p', String(PORT), '-U', 'postgres', '-v', 'ON_ERROR_STOP=1', '-q', '-f', file]), { stdio: 'ignore' });
  applySql(path.join(import.meta.dirname, 'fixtures', 'schema-v1.sql'));
  await psql("insert into ota_entries (name, kana, email) values ('旧版', 'きゅうばん', 'old@example.com')", {}, 'postgres');
  applySql(SCHEMA);
  applySql(SCHEMA);

  await startShim();
  process.env.SUPABASE_URL = `http://127.0.0.1:${shim.address().port}/`;
  process.env.SUPABASE_SERVICE_ROLE_KEY = KEY;
  process.env.CAPACITY = '120';
  process.env.ADMIN_PASSWORD = 'secret-pass';
  status = (await import('../api/status.js')).default;
  register = (await import('../api/register.js')).default;
  admin = (await import('../api/admin.js')).default;
});

after(() => {
  shim?.close();
  pg?.kill();
  if (dir) setTimeout(() => rmSync(dir, { recursive: true, force: true }), 500);
});

const auth = (pw = 'secret-pass') => ({ authorization: 'Basic ' + Buffer.from(`admin:${pw}`).toString('base64') });
const setCap = (c) => psql(`update ota_settings set capacity = ${c === null ? 'null' : Number(c)} where id = 1`, {}, 'postgres');

test('新しい SQL を旧版の上から流しても、申込は消えない', { skip }, async () => {
  assert.equal(await psql("select count(*) from ota_entries where email = 'old@example.com'", {}, 'postgres'), '1');
});

const person = (i) => ({ name: `テスト${i}`, kana: `てすと${i}`, email: `user${i}@example.com`, agree: true });
const reset = async () => { await psql('truncate ota_entries restart identity', {}, 'postgres'); await setCap(null); };

test('入力が不正なら 400 と項目ごとのエラーを返す', { skip }, async () => {
  const r = await call(register, { method: 'POST', body: { email: 'not-an-email' } });
  assert.equal(r.statusCode, 400);
  assert.deepEqual(Object.keys(r.body.errors).sort(), ['agree', 'email', 'kana', 'name']);
});

test('GET では申し込めない', { skip }, async () => {
  assert.equal((await call(register, { method: 'GET' })).statusCode, 405);
});

test('ボット用の隠し欄が埋まっていたら登録しない', { skip }, async () => {
  await reset();
  const r = await call(register, { method: 'POST', body: { ...person('bot'), website: 'spam' } });
  assert.equal(r.statusCode, 200);
  assert.equal((await call(status)).body.count, 0);
});

test('同時に150人申し込んでも、ちょうど120人で締め切る', { skip }, async () => {
  await reset();
  const results = await Promise.all(Array.from({ length: 150 }, (_, i) => call(register, { method: 'POST', body: person(i) })));
  const ok = results.filter((r) => r.statusCode === 201);
  assert.equal(ok.length, 120);
  assert.equal(results.filter((r) => r.body.error === 'full').length, 30);
  assert.deepEqual(ok.map((r) => r.body.number).sort((a, b) => a - b), Array.from({ length: 120 }, (_, i) => i + 1));
  assert.deepEqual((await call(status)).body, { capacity: 120, count: 120, remaining: 0, open: false });
});

test('同じメールアドレスでは二重に申し込めない（大文字小文字の違いも同じ扱い）', { skip }, async () => {
  await reset();
  assert.equal((await call(register, { method: 'POST', body: person('dup') })).statusCode, 201);
  const second = await call(register, { method: 'POST', body: { ...person('dup'), email: 'USERdup@Example.com' } });
  assert.equal(second.statusCode, 409);
  assert.equal(second.body.error, 'duplicate');
});

test('管理用 CSV はパスワードが合うときだけ取得でき、数式は無害化される', { skip }, async () => {
  await reset();
  await call(register, { method: 'POST', body: { ...person('csv'), name: '=HYPERLINK("x")' } });
  assert.equal((await call(admin, { headers: auth('wrong') })).statusCode, 401);
  const ok = await call(admin, { headers: auth('secret-pass') });
  assert.equal(ok.statusCode, 200);
  assert.match(ok.body, /お名前/);
  assert.match(ok.body, /"'=HYPERLINK\(""x""\)"/);
  assert.match(ok.body, /\d{4}\/\d{1,2}\/\d{1,2} \d{1,2}:\d{2}:\d{2}/); // 日本時間の日時
});

test('公開用キー（anon など）では申込者も設定も読めず、関数も呼べない', { skip }, async () => {
  for (const role of ['anon', 'authenticated']) {
    await assert.rejects(psql('select * from ota_entries', {}, role), /permission denied/);
    await assert.rejects(psql('select * from ota_settings', {}, role), /permission denied/);
    await assert.rejects(psql("select ota_register('a','a','a@a.a','',999)", {}, role), /permission denied/);
    await assert.rejects(psql('select ota_status(1)', {}, role), /permission denied/);
    await assert.rejects(psql('select ota_set_capacity(999)', {}, role), /permission denied/);
    await assert.rejects(psql('select ota_reset()', {}, role), /permission denied/);
  }
});

test('管理画面から定員を変えると、すぐに受付と残席に反映される', { skip }, async () => {
  await reset();
  assert.equal((await call(status)).body.capacity, 120); // 未設定のときは CAPACITY（120）
  const r = await call(admin, { method: 'POST', headers: auth(), body: { action: 'capacity', capacity: 2 } });
  assert.equal(r.statusCode, 200);
  assert.deepEqual(r.body.status, { capacity: 2, count: 0, remaining: 2, open: true });
  assert.equal((await call(register, { method: 'POST', body: person('a') })).statusCode, 201);
  assert.equal((await call(register, { method: 'POST', body: person('b') })).statusCode, 201);
  assert.equal((await call(register, { method: 'POST', body: person('c') })).body.error, 'full');
  // 増やせば、また受け付ける
  await call(admin, { method: 'POST', headers: auth(), body: { action: 'capacity', capacity: 3 } });
  assert.equal((await call(register, { method: 'POST', body: person('c') })).body.number, 3);
});

test('定員の値が不正なら変更しない', { skip }, async () => {
  for (const capacity of [0, -1, 1.5, 'abc', 100001]) {
    assert.equal((await call(admin, { method: 'POST', headers: auth(), body: { action: 'capacity', capacity } })).statusCode, 400);
  }
});

test('リセットは確認の言葉が合うときだけ実行され、受付番号が1に戻る', { skip }, async () => {
  await reset();
  await call(register, { method: 'POST', body: person('x') });
  await call(register, { method: 'POST', body: person('y') });
  assert.equal((await call(admin, { method: 'POST', headers: auth(), body: { action: 'reset', confirm: 'りせっと' } })).statusCode, 400);
  assert.equal((await call(status)).body.count, 2);
  const r = await call(admin, { method: 'POST', headers: auth(), body: { action: 'reset', confirm: 'リセット' } });
  assert.equal(r.statusCode, 200);
  assert.equal(r.body.status.count, 0);
  assert.equal((await call(register, { method: 'POST', body: person('z') })).body.number, 1);
});

test('管理の操作はパスワードがないとできない', { skip }, async () => {
  await reset();
  await call(register, { method: 'POST', body: person('keep') });
  const reset1 = await call(admin, { method: 'POST', headers: auth('wrong'), body: { action: 'reset', confirm: 'リセット' } });
  const cap1 = await call(admin, { method: 'POST', body: { action: 'capacity', capacity: 1 } });
  assert.equal(reset1.statusCode, 401);
  assert.equal(cap1.statusCode, 401);
  assert.equal((await call(status)).body.count, 1);
  // 管理ページからの呼び出しでは、ブラウザ標準のパスワード画面を出さない
  const fromPage = await call(admin, { headers: { ...auth('wrong'), 'x-admin-page': '1' } });
  assert.equal(fromPage.statusCode, 401);
  assert.equal(fromPage.headers['www-authenticate'], undefined);
});

test('最新の SQL を流す前でも残席は表示でき、管理の操作は案内付きで止まる', { skip }, async () => {
  await reset();
  await call(register, { method: 'POST', body: person('old') });
  await psql('alter function ota_status(int) rename to ota_status_hidden; alter function ota_set_capacity(int) rename to ota_set_capacity_hidden', {}, 'postgres');
  try {
    assert.deepEqual((await call(status)).body, { capacity: 120, count: 1, remaining: 119, open: true });
    const r = await call(admin, { method: 'POST', headers: auth(), body: { action: 'capacity', capacity: 5 } });
    assert.equal(r.statusCode, 503);
    assert.equal(r.body.error, 'schema_outdated');
  } finally {
    await psql('alter function ota_status_hidden(int) rename to ota_status; alter function ota_set_capacity_hidden(int) rename to ota_set_capacity', {}, 'postgres');
  }
});

test('管理ページ用の一覧（JSON）に、定員・申込数・申込者が入る', { skip }, async () => {
  await reset();
  await call(register, { method: 'POST', body: { ...person('j'), phone: '090-1234-5678' } });
  const r = await call(admin, { url: '/api/admin?format=json', headers: auth() });
  assert.equal(r.statusCode, 200);
  assert.deepEqual(r.body.status, { capacity: 120, count: 1, remaining: 119, open: true });
  assert.equal(r.body.entries[0].no, 1);
  assert.equal(r.body.entries[0].email, 'userj@example.com');
  assert.equal(r.body.entries[0].phone, '090-1234-5678');
});
