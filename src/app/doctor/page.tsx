import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, InfoSection } from "@/components/PageHero";
import { CTA } from "@/components/CTA";
import { doctor } from "@/data/site";

export const metadata: Metadata = { title: "院長紹介｜上田大介", description: "うえだ歯科医院 院長・上田大介の経歴、資格・所属をご紹介します。" };

export default function Page() {
  return <>
    <PageHero eyebrow="DOCTOR" title="院長紹介" intro="口腔外科での診療経験を生かし、治療の選択肢を丁寧に説明することを大切にしています。"/>
    <section className="doctor-detail"><div className="container doctor-detail-grid"><div className="doctor-detail-photo"><Image src="/images/doctor/ueda-daisuke-portrait.jpg" alt="うえだ歯科医院 院長 上田大介" fill sizes="(max-width: 760px) 100vw, 42vw"/></div><div><p className="eyebrow">DIRECTOR</p><h2>上田 大介</h2><p className="en-name">DAISUKE UEDA</p><p className="lead">「きれいな口から健康な身体をつくる」を理念に、お口だけでなく全身の状態にも目を向けた診療を行っています。インプラントに決めつけず、患者さんの希望と診査結果に合う方法を一緒に考えます。</p></div></div></section>
    <InfoSection number="01" title="経歴"><ol className="career-list">{doctor.career.map(x => <li key={x}>{x}</li>)}</ol></InfoSection>
    <InfoSection number="02" title="資格・所属" muted><ul>{doctor.affiliations.map(x => <li key={x}>{x}</li>)}</ul><p className="medical-box">国立病院機構 熊本医療センター歯科口腔外科での勤務経験を持ち、日本口腔外科学会認定医として診査・診断を大切にしています。</p><Link className="button primary-button" href="/doctor/expertise">専門性・活動実績を見る →</Link></InfoSection>
    <CTA/>
  </>;
}
