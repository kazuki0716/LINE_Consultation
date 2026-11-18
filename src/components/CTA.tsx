import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { site } from "@/data/site";

export function CTA() {
  return <section className="cta-section"><div className="container cta-inner"><div><p className="eyebrow light">初診相談</p><h2>治療方法を<br/>決める前の相談から</h2><p>検査結果を一緒に見ながら、今のお口に合う方法を考えていきます。</p></div><div className="cta-actions"><a href={`tel:${site.phone.replaceAll("-", "")}`} className="cta-phone"><Phone/><span><small>電話で予約・問い合わせ</small>{site.phone}</span></a><a href={site.booking} target="_blank" rel="noopener noreferrer" className="button light-button">初診相談をWEB予約 <ArrowRight/></a><Link href="/access" className="text-link light">アクセス・診療案内を見る <ArrowRight/></Link></div></div></section>;
}
