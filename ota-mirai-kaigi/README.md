# おおた未来カイギ 集客ページ

定員（先着順）で自動的に締め切る申込フォーム付きのランディングページ。申込データは Supabase に保存する。

## 構成
- `index.html` … ページ本体（定員の数字は設定値に合わせて自動で変わる）
- `api/status.js` … 残席数を返す（`GET /api/status`）
- `api/register.js` … 申込を受け付ける（`POST /api/register`）
- `api/admin.js` … 申込者一覧をCSVでダウンロード（`/api/admin`、ユーザー名 `admin`）
- `supabase/schema.sql` … Supabase に作るテーブルと関数。定員・重複のチェックと登録をロックをかけて一度に行うので、同時に申し込まれても定員を超えない

## Supabase と Vercel の設定
1. Supabase でプロジェクトを作る（リージョンは Tokyo がおすすめ）
2. SQL Editor に `supabase/schema.sql` の中身を貼り付けて Run
3. Vercel の Settings → Environment Variables に次を追加
   - `SUPABASE_URL` … Supabase の Project URL（例：https://xxxx.supabase.co）
   - `SUPABASE_SERVICE_ROLE_KEY` … Supabase の service_role キー（または sb_secret_ で始まる Secret key）。公開してはいけない鍵
   - `ADMIN_PASSWORD` … 申込者一覧を見るためのパスワード
   - `CAPACITY` … 定員（省略時は 120）
4. Redeploy する

## テスト
PostgreSQL のサーバープログラムが入っている環境で `npm test`（場所は `PG_BIN` で指定できる）。
