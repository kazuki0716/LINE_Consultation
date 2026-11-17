import Link from "next/link";
export default function NotFound(){return <section className="not-found"><div><p className="eyebrow">404 — NOT FOUND</p><h1>ページが見つかりません</h1><p>URLをご確認いただくか、トップページからお探しください。</p><Link href="/" className="button primary-button">トップページへ</Link></div></section>}
