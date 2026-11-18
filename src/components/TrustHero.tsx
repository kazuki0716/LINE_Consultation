import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Phone } from "lucide-react";
import { site } from "@/data/site";

const routes = [
  ["治療を知る", "インプラントの仕組み", "/about-implant"],
  ["方法を比べる", "入れ歯・ブリッジとの違い", "/comparison"],
  ["費用を知る", "費用・期間・リスク", "/cost"],
  ["院長を知る", "経歴・資格・診療方針", "/doctor/expertise"],
  ["記事を読む", "治療選びの基礎知識", "/articles"],
  ["医院へ行く", "診療案内・アクセス", "/access"],
] as const;

export function TrustHero(){return <>
  <section className="trust-hero">
    <div className="container trust-hero__grid">
      <div className="trust-hero__copy">
        <p className="trust-hero__label">鹿児島市のインプラント相談</p>
        <h1>しっかり診て、<br/><em>きちんと説明する。</em></h1>
        <p className="trust-hero__lead">インプラントに決めてから来院する必要はありません。口腔外科で経験を積んだ院長が、入れ歯やブリッジも含めて、今のお口に合う方法を一緒に考えます。</p>
        <ul><li><Check/>日本口腔外科学会 認定医</li><li><Check/>歯科用CTによる立体的な診査</li><li><Check/>費用・期間・リスクを治療前に説明</li></ul>
        <div className="trust-hero__actions"><a href={site.booking} target="_blank" rel="noopener noreferrer"><CalendarDays/>WEBで相談予約 <ArrowRight/></a><a href={`tel:${site.phone.replaceAll("-","")}`}><Phone/>電話で相談する</a></div>
      </div>
      <div className="trust-hero__visual"><Image src="/images/doctor/ueda-daisuke-portrait.jpg" alt="うえだ歯科医院 院長 上田大介" fill priority sizes="(max-width:760px) 100vw, 46vw"/><div><small>DIRECTOR / DENTIST</small><strong>院長　上田 大介</strong><span>日本口腔外科学会 認定医</span></div></div>
    </div>
    <div className="trust-facts"><div className="container"><div><span>インプラント1本</span><strong>385,000<small>円（税込）</small></strong><p>本体・かぶせ物・必要な歯ぐきの手術を含む</p></div><div><span>治療のスタート</span><strong>相談・診査から</strong><p>治療方法を決める前の相談も承ります</p></div><div><span>治療後</span><strong>継続サポート</strong><p>清掃状態・歯ぐき・噛み合わせを定期管理</p></div></div></div>
  </section>
  <nav className="route-panel" aria-label="目的から探す"><div className="container"><h2>知りたいことから選ぶ</h2><div>{routes.map(([title,desc,href],i)=><Link href={href} key={href}><span>{String(i+1).padStart(2,"0")}</span><strong>{title}</strong><small>{desc}</small><ArrowRight/></Link>)}</div></div></nav>
  </>}
