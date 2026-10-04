# 凪に相談（LINE風チャット）

喫茶店の店主「凪（なぎ）」に、LINEみたいに相談できる Next.js アプリです。
**凪は完全に架空のキャラクターで、AI（Claude）が演じています。** 実在の人物・店舗・団体とは関係ありません。

## 特徴

- LINE風の画面（吹き出し・既読・入力中の表示・返信の逐次表示・ダークモード・履歴の保存）
- 返信は空行ごとに別の吹き出しになり、会話のテンポがLINEっぽくなる
- 日本語入力の変換中は Enter で送信されない（スマホは Enter で改行）
- 深刻な悩み（自傷など）には、相談窓口を案内する安全ルール入り
- 合言葉でガード。未設定のままでは動かない（誤公開によるAPI利用料の事故を防ぐ）

## 構成

- `app/page.tsx` … チャットUI
- `app/api/chat/route.ts` … Claude API への中継（履歴の検証・ストリーミング）
- `app/api/auth/route.ts` … 合言葉の確認・動作モードの通知
- `lib/persona.ts` … システムプロンプト（中核プロンプト＋参照資料＋アプリ実行ルール）
- `lib/guard.ts` … 合言葉チェック・簡易レート制限
- `knowledge/` … 凪の設定。`00_core.txt` が中核プロンプト、`01〜04` が参照資料（すべて架空）。ビルド時に `lib/persona.generated.ts` へ固められる

## 環境変数

| 名前 | 必須 | 説明 |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | ✅ | Anthropic の API キー |
| `ACCESS_CODE` | どちらか | 画面に入るための合言葉（おすすめ） |
| `ALLOW_PUBLIC` | どちらか | `true` にすると合言葉なしで誰でも使える（API利用料に注意） |
| `ANTHROPIC_MODEL` | | 既定は `claude-sonnet-5-5` |
| `RATE_LIMIT_PER_MIN` | | 1IPあたり1分間の送信上限（既定 12） |

## ローカルで動かす

```bash
npm install
cp .env.example .env.local   # 値を入れる
npm run dev                   # http://localhost:3000
```

## Vercel にデプロイする

1. このリポジトリを Vercel で Import（Next.js は自動検出されます）
2. Settings → Environment Variables に `ANTHROPIC_API_KEY` と `ACCESS_CODE` を登録
3. Deploy

## キャラクターを変える

`knowledge/` のテキストを書き換えるだけで、別のキャラクターにできます（`00_` で始まるファイルが中核プロンプト、それ以外が参照資料）。
実在の人物をモデルにする場合は、本人の許可を得て、私的な情報を含めないようにしてください。

## 注意

- 医療・法律・投資などの専門的な判断を代わりに行うものではありません。
- 深刻な状況では、専門の相談窓口や周囲の人につないでください（例：よりそいホットライン 0120-279-338）。
