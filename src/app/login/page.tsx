import type { Metadata } from "next";

export const metadata: Metadata = { title: "閲覧ログイン", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; returnTo?: string }> }) {
  const params = await searchParams;
  return <section className="login-page"><div className="login-panel"><div className="login-mark">U</div><p className="eyebrow">PRIVATE PREVIEW</p><h1>閲覧パスワードを<br/>入力してください</h1><p>このサイトは現在、関係者向けの確認用プレビューです。</p><form action="/api/login" method="post"><input type="hidden" name="returnTo" value={params.returnTo || "/"}/><label htmlFor="password">パスワード</label><input id="password" name="password" type="password" autoComplete="current-password" required autoFocus aria-describedby={params.error ? "login-error" : undefined}/>{params.error && <p id="login-error" className="login-error" role="alert">パスワードが正しくありません。</p>}<button type="submit" className="button primary-button">サイトを見る <span>→</span></button></form><small>うえだ歯科医院 インプラント情報サイト</small></div></section>;
}
