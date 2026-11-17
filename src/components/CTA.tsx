import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { site } from "@/data/site";

export function CTA() {
  return <section className="cta-section"><div className="container cta-inner"><div><p className="eyebrow light">CONSULTATION</p><h2>今の困りごとから<br/>お聞かせください。</h2><p>まだ治療方法が決まっていなくてもかまいません。<br/>相談をしてから、ゆっくり考えていただけます。</p></div><div className="cta-actions"><a href={`tel:${site.phone.replaceAll("-", "")}`} className="cta-phone"><Phone/><span><small>お電話でのお問い合わせ</small>{site.phone}</span></a><a href={site.booking} target="_blank" rel="noopener noreferrer" className="button light-button">初診WEB予約 <ArrowRight/></a><Link href="/access" className="text-link light">医院までの行き方 <ArrowRight/></Link></div></div></section>;
}
