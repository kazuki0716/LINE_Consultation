import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero, InfoSection } from "@/components/PageHero";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "インプラント治療とは", description: "インプラント治療の仕組み、メリット、デメリット、主なリスクとメンテナンスについて一般的な情報をご案内します。" };
export default function Page(){return <><PageHero eyebrow="ABOUT IMPLANT" title="インプラント治療とは" intro="歯を失った部分に人工歯根を埋め込み、人工歯を支える治療方法です。治療の特徴だけでなく、制約やリスクまで理解することが大切です。"/><InfoSection number="01" title="3つの構成要素"><h3>人工歯・連結部・人工歯根</h3><p>インプラントは一般に、顎の骨に埋める人工歯根、その上に取り付ける連結部、見える部分の人工歯から構成されます。実際の構造や材料は治療計画によって異なります。</p><div className="number-list"><div><b>01</b><span>人工歯<br/><small>噛む・見える部分</small></span></div><div><b>02</b><span>連結部<br/><small>人工歯と人工歯根をつなぐ</small></span></div><div><b>03</b><span>人工歯根<br/><small>顎の骨に埋め入れる部分</small></span></div></div></InfoSection><InfoSection number="02" title="メリットと制約" muted><div className="two-column"><div><h3>考えられるメリット</h3><ul><li>原則として隣の健康な歯を削らずに欠損を補える</li><li>取り外し式ではない</li><li>ご自身の歯に近い感覚を目指せる</li></ul></div><div><h3>知っておきたい制約</h3><ul><li>外科処置が必要</li><li>治療期間がかかる場合がある</li><li>原則として自由診療</li><li>治療後も継続的なメンテナンスが必要</li></ul></div></div><p className="medical-box">治療効果や使用感には個人差があります。インプラントがすべての方に適するわけではありません。</p></InfoSection><InfoSection number="03" title="判断の前に"><h3>お口だけでなく、全身の状態も確認します</h3><p>顎の骨や歯ぐき、噛み合わせのほか、持病や服薬状況、喫煙習慣なども治療計画に関係します。詳しい診査のうえ、ほかの治療方法も含めて検討します。</p><Link href="/comparison" className="button secondary-button">治療方法を比較する <ArrowRight/></Link></InfoSection><CTA/></>}
