import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, TriangleAlert } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = {
  title: "インプラント治療とは",
  description: "インプラントの仕組み、メリットと注意点、治療に向いている方、診査、メンテナンスまで分かりやすくご案内します。",
};

const suitable = [
  "見た目を自然に整えたい",
  "自分の歯に近い感覚で噛みたい",
  "入れ歯が合わない、または取り外し式を避けたい",
  "隣の健康な歯をできるだけ削りたくない",
  "奥歯を失い、ブリッジでの治療が難しい",
  "治療後も定期的な管理を続けられる",
];

export default function Page(){return <>
  <PageHero eyebrow="ABOUT IMPLANT" title="インプラント治療とは" intro="特徴だけでなく、外科処置や治療期間、治療後の管理まで理解したうえで選ぶ治療です。入れ歯やブリッジも含めて比較します。"/>
  <section className="implant-guide implant-guide--structure"><div className="container implant-guide__split">
    <div className="implant-guide__photo"><Image src="/images/implant/implant-model.jpg" alt="人工歯根に人工歯を装着するインプラントの構造" fill priority sizes="(max-width:760px) 100vw, 52vw"/></div>
    <div className="implant-guide__body"><p className="implant-guide__index">01 / STRUCTURE</p><h2>人工歯根を顎の骨に<br/>固定する治療</h2><p>インプラントは、歯を失った部分の顎の骨に人工歯根を埋め、その上に人工歯を装着する治療です。骨に固定されるため安定しやすく、原則として隣の健康な歯を削らずに欠損を補えます。</p><ol className="implant-parts"><li><b>01</b><div><strong>人工歯</strong><span>口の中に見える、噛む部分</span></div></li><li><b>02</b><div><strong>連結部</strong><span>人工歯と人工歯根をつなぐ部分</span></div></li><li><b>03</b><div><strong>人工歯根</strong><span>顎の骨に埋め入れる部分</span></div></li></ol></div>
  </div></section>
  <section className="implant-guide implant-guide--contrast"><div className="container"><div className="implant-guide__heading"><p className="implant-guide__index">02 / BENEFIT &amp; CAUTION</p><h2>良い面と注意点を<br/>どちらもお伝えします</h2><p>インプラントがすべての方にとって最善とは限りません。お口と全身の状態、生活背景、ご希望を踏まえて検討します。</p></div><div className="implant-balance">
    <article><span>MERIT</span><h3>期待できること</h3><ul><li><Check/>固定式で安定した噛み心地を目指せる</li><li><Check/>天然歯に近い見た目を目指せる</li><li><Check/>隣の健康な歯を原則として削らない</li><li><Check/>取り外しの手間がない</li></ul></article>
    <article><span>CAUTION</span><h3>知っておきたいこと</h3><ul><li><TriangleAlert/>人工歯根を埋める外科処置が必要</li><li><TriangleAlert/>骨の量や質によって追加処置が必要な場合がある</li><li><TriangleAlert/>治療に数か月から1年程度かかる場合がある</li><li><TriangleAlert/>自由診療で、治療後も定期管理が必要</li></ul></article>
  </div></div></section>
  <section className="implant-guide implant-guide--fit"><div className="container implant-guide__split implant-guide__split--reverse"><div className="implant-guide__body"><p className="implant-guide__index">03 / INDICATION</p><h2>このような方は<br/>選択肢の一つです</h2><div className="implant-checklist">{suitable.map((item)=><div key={item}><Check/><span>{item}</span></div>)}</div><p className="implant-guide__note">持病、服薬、喫煙、骨や歯ぐきの状態によって適応は異なります。診査を行い、治療できるかを慎重に判断します。</p></div><div className="implant-guide__photo implant-guide__photo--exam"><Image src="/images/implant/ct-exam.jpg" alt="うえだ歯科医院の診療室と診療設備" fill sizes="(max-width:760px) 100vw, 48vw"/></div></div></section>
  <section className="implant-guide implant-guide--maintenance"><div className="container"><div className="implant-guide__heading"><p className="implant-guide__index">04 / AFTER CARE</p><h2>治療後の管理までが<br/>インプラント治療</h2></div><div className="maintenance-panel"><div><h3>毎日のセルフケア</h3><p>人工歯そのものはむし歯になりませんが、周囲の歯ぐきには炎症が起こることがあります。歯ブラシや補助清掃用具の使い方を確認し、清潔な状態を保ちます。</p></div><div><h3>医院での定期管理</h3><p>歯ぐきの腫れや出血、清掃状態、噛み合わせ、部品の緩みなどを確認します。インプラント周囲炎の予防と早期発見のため、継続的な受診が大切です。</p></div></div><div className="implant-guide__links"><Link href="/treatment" className="button primary-button">7段階の治療工程を見る <ArrowRight/></Link><Link href="/comparison" className="button secondary-button">ほかの治療と比較する <ArrowRight/></Link></div></div></section>
  <CTA/>
</>}
