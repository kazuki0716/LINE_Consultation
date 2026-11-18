import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Building2, ShieldCheck } from "lucide-react";
import { CTA } from "@/components/CTA";
import { Reveal } from "@/components/Reveal";
import { credentials, expertiseRecords, memberships } from "@/data/expertise";
import { doctor, site } from "@/data/site";

export const metadata: Metadata = {
  title: "上田大介院長の専門性・活動実績｜うえだ歯科医院",
  description: "うえだ歯科医院 上田大介院長の経歴、口腔外科の認定資格、所属学会、第三者メディアによる取材・掲載情報を出典とともにご紹介します。",
  alternates: { canonical: "/doctor/expertise" },
};

const categoryLabels = {
  official: "医院公式",
  interview: "第三者取材",
  media: "外部メディア",
  association: "関連団体",
  warranty: "保証関連",
} as const;

const formatDate = (date: string | null) => date ? `${date.replaceAll("-", ".")} 最終更新` : "PROFILE";
const sourceImages: Record<string, string> = {
  "doctors-file-interview": "/images/sources/doctors-file-interview.jpg",
  "doctors-file-clinic": "/images/sources/doctors-file-clinic.jpg",
  "kagoshima-dental-association": "/images/clinic/exterior.jpg",
  "guidedent-listing": "/images/sources/guidedent.jpg",
};

export default function ExpertisePage() {
  const mediaRecords = expertiseRecords.filter((item) => item.category !== "official");
  const articleRecords = mediaRecords.filter((item) => item.category === "interview");
  const listingRecords = mediaRecords.filter((item) => item.category !== "interview");
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "上田 大介",
    alternateName: "上田大介",
    jobTitle: "歯科医師・院長",
    image: `${site.siteUrl}/images/doctor/ueda-daisuke-portrait.jpg`,
    url: `${site.siteUrl}/doctor/expertise`,
    worksFor: { "@type": "Dentist", name: site.name, url: site.official, address: site.address },
    alumniOf: { "@type": "CollegeOrUniversity", name: "九州歯科大学" },
    hasCredential: [{ "@type": "EducationalOccupationalCredential", name: "日本口腔外科学会 認定医" }],
    memberOf: memberships.map((name) => ({ "@type": "Organization", name })),
    sameAs: [
      "https://ueda-dental.net/doctor/",
      "https://doctorsfile.jp/h/199133/df/1/",
      "https://doctorsfile.jp/h/199133/",
    ],
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
    <main className="expertise-page">
      <section className="expertise-hero">
        <div className="container expertise-hero__grid">
          <div className="expertise-hero__copy">
            <nav aria-label="パンくずリスト" className="breadcrumbs"><Link href="/">ホーム</Link><span>/</span><Link href="/doctor">院長紹介</Link><span>/</span><span>専門性・活動実績</span></nav>
            <p className="expertise-kicker">CLINICAL BACKGROUND / VERIFIED PROFILE</p>
            <h1>診断の背景まで、<br/><em>確かめて選べる。</em></h1>
            <p className="expertise-intro">インプラントは、手術だけで完結する治療ではありません。口腔外科で培った診断経験を土台に、お口全体と全身状態を確認し、治療後まで見通してご提案します。</p>
            <div className="expertise-proof"><BadgeCheck aria-hidden="true"/><span><b>経歴と診療姿勢を一つのページに</b>資格・所属、第三者インタビューまで、上田院長を知る情報をまとめました。</span></div>
          </div>
          <div className="expertise-portrait">
            <Image src="/images/doctor/ueda-daisuke-portrait.jpg" alt="うえだ歯科医院 院長 上田大介" fill priority sizes="(max-width: 760px) 100vw, 45vw"/>
            <div className="expertise-portrait__caption"><span>DIRECTOR / DENTIST</span><strong>上田 大介</strong><small>DAISUKE UEDA</small></div>
          </div>
        </div>
      </section>

      <section className="expertise-statement"><div className="container expertise-statement__grid">
        <p>PHILOSOPHY</p><blockquote>「できる治療」ではなく、<br/>その方にとって<strong>選ぶ理由のある治療</strong>を。</blockquote>
        <p>検査結果とご希望をすり合わせ、入れ歯やブリッジも含めて比較します。インプラントを前提にせず、分からないことを残さない相談から始めます。</p>
      </div></section>

      <section className="expertise-section" id="career"><div className="container expertise-two-col">
        <div className="expertise-heading"><span>01 / BACKGROUND</span><h2>口腔外科から、<br/>地域の日常診療へ。</h2><p>病院歯科口腔外科での勤務経験を経て、2021年に鹿児島市で開院しました。</p></div>
        <ol className="expertise-timeline">{doctor.career.map((item, index) => { const [year, ...rest] = item.split("　"); return <Reveal key={item}><li><span>{String(index + 1).padStart(2, "0")}</span><time>{year}</time><p>{rest.join("　")}</p></li></Reveal>; })}</ol>
      </div></section>

      <section className="expertise-section expertise-section--dark" id="credentials"><div className="container">
        <div className="expertise-section__head"><div><span>02 / CREDENTIALS</span><h2>認定資格と、<br/>継続して学ぶ環境。</h2></div><p>口腔外科の認定資格に加え、インプラントや歯周治療に関わる学会・研究会に所属し、日々の診療に知見を取り入れています。</p></div>
        <div className="credential-grid">
          {credentials.map((item) => <Reveal key={item.title} className="credential-card"><ShieldCheck aria-hidden="true"/><span>{item.kind}</span><h3>{item.title}</h3><p>{item.note}</p></Reveal>)}
          <Reveal className="membership-card"><Building2 aria-hidden="true"/><span>所属学会・研究会</span><ul>{memberships.map((name) => <li key={name}>{name}</li>)}</ul><small>所属は、資格や学会発表歴を意味するものではありません。</small></Reveal>
        </div>
      </div></section>

      <section className="expertise-section" id="media"><div className="container">
        <div className="expertise-section__head expertise-section__head--light"><div><span>03 / MEDIA &amp; RECORDS</span><h2>第三者の取材から、<br/>人柄と診療姿勢を知る。</h2></div><p>上田院長がどのような思いで患者さんと向き合い、医院をつくってきたのか。外部メディアの記事もあわせてご覧ください。</p></div>
        <div className="media-list">
          <div className="media-list__bar"><span>上田大介院長の掲載記事</span><small>{articleRecords.length} INTERVIEW</small></div>
          {articleRecords.map((item, index) => <Reveal key={item.id} delay={index * .03}>
            <a className="media-list__item" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
              <div className="media-list__thumb"><Image src={sourceImages[item.id]} alt="" fill sizes="(max-width:760px) 110px, 210px"/></div>
              <div className="media-list__body">
                <div className="media-list__meta"><span>{categoryLabels[item.category]}</span><b>{item.publisher}</b></div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <small>{item.id === "doctors-file-interview" ? "取材日 2024年10月11日　最終更新 2026年7月31日" : formatDate(item.date)}</small>
              </div>
              <ArrowUpRight className="media-list__arrow" aria-hidden="true"/>
            </a>
          </Reveal>)}
        </div>
        <div className="external-listings">
          <div className="external-listings__head"><span>EXTERNAL PROFILES</span><h3>医院の外部掲載情報</h3><p>第三者機関・サービスに掲載されている医院情報です。</p></div>
          <div>{listingRecords.map((item) => <a key={item.id} href={item.sourceUrl} target="_blank" rel="noopener noreferrer"><span>{categoryLabels[item.category]}</span><strong>{item.publisher}</strong><small>{item.title}</small><ArrowUpRight aria-hidden="true"/></a>)}</div>
        </div>
      </div></section>

      <section className="expertise-section expertise-approach"><div className="container expertise-two-col">
        <div className="expertise-heading"><span>04 / IMPLANT POLICY</span><h2>外科処置の前に、<br/>診断と対話がある。</h2></div>
        <div className="expertise-approach__body"><p>歯を失った原因、残っている歯の状態、顎の骨や歯ぐき、全身の健康状態。同じ「一本を失った」状態でも、必要な治療は一人ひとり異なります。</p><p>うえだ歯科医院では検査結果を共有し、治療期間・費用・リスクを含めて説明します。迷っている段階でも構いません。まず、今のお口にどんな選択肢があるかを一緒に整理しましょう。</p><div className="approach-links"><Link href="/about-implant">インプラントを知る<ArrowRight aria-hidden="true"/></Link><Link href="/comparison">治療方法を比較する<ArrowRight aria-hidden="true"/></Link></div><a className="source-note" href="https://ueda-dental.net/menu/implant/" target="_blank" rel="noopener noreferrer">出典：うえだ歯科医院 公式インプラント治療ページ<ArrowUpRight aria-hidden="true"/></a></div>
      </div></section>
    </main>
    <CTA/>
  </>;
}
