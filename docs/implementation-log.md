# 実装記録

## 実装済み

- Next.js App Router / TypeScript strict / Tailwind CSS
- レスポンシブなトップページと全指定ルート
- インタラクティブ治療比較、治療工程、アクセシブルFAQ
- Reduced Motion、キーボード操作、スキップリンク
- Metadata、canonical基盤、sitemap、robots、Dentist構造化データ
- 公式写真のローカル管理と Next/Image 最適化
- 医学監修前コンテンツのステータス表示と noindex

## 公開前に残る作業

- 医学監修と広告表現確認
- 正式料金、診療時間、予約URLの反映
- 公開ドメイン決定、GA4・Search Console設定
- 本番環境でのLighthouse計測

## 検証結果（2026-11-17）

- `npm run typecheck`：成功
- `npm run build`：成功（全18ルートを生成）
- Playwright：デスクトップ／モバイル計7件成功、対象外1件スキップ
- 主要ページのHTTP 200応答を確認
- 1440px、390pxで視覚確認済み
