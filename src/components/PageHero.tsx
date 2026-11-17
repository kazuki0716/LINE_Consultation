import Link from "next/link";

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <section className="page-hero"><div className="container"><nav aria-label="パンくずリスト" className="breadcrumbs"><Link href="/">ホーム</Link><span>/</span><span>{title}</span></nav><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div></section>;
}

export function InfoSection({ number, title, children, muted = false }: { number: string; title: string; children: React.ReactNode; muted?: boolean }) {
  return <section className={`content-section ${muted ? "muted-section" : ""}`}><div className="container content-grid"><div><p className="section-number">{number}</p><h2>{title}</h2></div><div className="prose">{children}</div></div></section>;
}
