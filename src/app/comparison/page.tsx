import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Comparison } from "@/components/Comparison";
import { CTA } from "@/components/CTA";
import { treatments } from "@/data/site";
export const metadata:Metadata={title:"インプラント・ブリッジ・入れ歯の比較",description:"歯を失ったときの3つの治療方法について、仕組み、周囲の歯への影響、費用、期間、注意点を公平に比較します。"};
export default function Page(){return <><PageHero eyebrow="TREATMENT COMPARISON" title="治療方法を比較する" intro="どの方法にもメリットと制約があります。単純な優劣ではなく、ご自身の状態や生活に合うかどうかを一緒に考えます。"/><section className="content-section dark-content"><div className="container"><Comparison/></div></section><section className="content-section"><div className="container"><p className="section-number">TREATMENT DETAILS</p><div className="treatment-detail-grid">{treatments.map((t,i)=><article key={t.key}><span>0{i+1}</span><h2>{t.name}</h2><p>{t.summary}</p><ul>{t.points.map(([a,b])=><li key={a}><strong>{a}</strong><span>{b}</span></li>)}</ul></article>)}</div><p className="medical-box">この比較は一般的な特徴を整理したものです。適応や治療内容は診査・診断によって異なります。</p></div></section><CTA/></>}
