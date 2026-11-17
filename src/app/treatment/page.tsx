import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/components/CTA";
import { journey } from "@/data/site";
export const metadata:Metadata={title:"インプラント治療の流れ",description:"診査・診断から治療計画、外科処置、人工歯の装着、メンテナンスまで、一般的な治療の流れをご案内します。"};
export default function Page(){return <><PageHero eyebrow="TREATMENT JOURNEY" title="インプラント治療の流れ" intro="治療は、インプラントを埋める処置だけではありません。診断からメンテナンスまで、一つずつ確認しながら進めます。"/><section className="content-section"><div className="container timeline-page">{journey.map(([n,t,d])=><article key={n}><span>{n}</span><div><h2>{t}</h2><p>{d}</p></div></article>)}<p className="medical-box">掲載しているのは一般的な流れです。治療順序・期間・通院回数は、お口の状態や追加処置の有無によって異なります。</p></div></section><CTA/></>}
