import Link from "next/link";
import { nav, site } from "@/data/site";

export function Footer() {
  return <footer className="footer"><div className="container footer-grid">
    <div><p className="footer-brand">UEDA <span>DENTAL CLINIC</span></p><p>うえだ歯科医院<br/>インプラント情報サイト</p><p className="muted">{site.address}</p></div>
    <div className="footer-links"><p>Information</p>{nav.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}<Link href="/articles">記事一覧</Link><Link href="/access">アクセス</Link></div>
    <div className="footer-links"><p>Clinic</p><a href={site.official} target="_blank" rel="noopener noreferrer">医院公式サイト ↗</a><Link href="/privacy">プライバシーポリシー</Link><Link href="/site-policy">サイトポリシー</Link></div>
  </div><div className="container footer-bottom"><span>© UEDA DENTAL CLINIC</span><span>鹿児島市で、歯を失ったときの選択肢を考える</span></div></footer>;
}
