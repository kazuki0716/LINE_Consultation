# おおた未来カイギ 集客ページ

先着120名で自動的に締め切る申込フォーム付きのランディングページ。

## 構成
- `index.html` … ページ本体
- `api/status.js` … 残席数を返す（`GET /api/status`）
- `api/register.js` … 申込を受け付ける（`POST /api/register`）。定員・重複は Redis 内で一度に判定するので、同時に申し込まれても120名を超えない
- `api/admin.js` … 申込者一覧をCSVでダウンロード（`/api/admin`、ユーザー名 `admin`）

## Vercel での公開手順
1. Vercel で「Add New → Project」から、このリポジトリを選ぶ
2. Root Directory を `ota-mirai-kaigi` にする（Framework Preset は Other）
3. プロジェクトの「Storage」から「Upstash for Redis」を作成して、このプロジェクトに接続する（`KV_REST_API_URL` と `KV_REST_API_TOKEN` が自動で入る）
4. Settings → Environment Variables に次を追加
   - `ADMIN_PASSWORD` … 申込者一覧を見るためのパスワード
   - `CAPACITY` … 定員（省略時は 120）
5. 再デプロイする

## テスト
`redis-server` が入っている環境で `npm test`。
