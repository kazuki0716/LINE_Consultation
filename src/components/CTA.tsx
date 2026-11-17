import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { site } from "@/data/site";

export function CTA() {
  return <section className="cta-section"><div className="container cta-inner"><div><p className="eyebrow light">CONSULTATION</p><h2>まずは、いまの状態を<br/>聞かせてください。</h2><p>インプラントに決めていなくても大丈夫です。<br/>治療方法を一緒に考えるところから始めます。</p></div><div className="cta-actions"><a href={`tel:${site.phone.replaceAll("-", "")}`} className="cta-phone"><Phone/><span><small>お電話でのお問い合わせ</small>{site.phone}</span></a><a href={site.official} target="_blank" rel="noopener noreferrer" className="button light-button">医院公式サイトを確認する <ArrowRight/></a><Link href="/access" className="text-link light">アクセスを見る <ArrowRight/></Link></div></div></section>;
}
