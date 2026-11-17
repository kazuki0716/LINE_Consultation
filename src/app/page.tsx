import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, CircleCheck, ShieldCheck, Stethoscope, ScanLine } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Comparison } from "@/components/Comparison";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { doctor, journey } from "@/data/site";

export default function Home() {
  return <>
    <section className="hero"><div className="hero-orbit" aria-hidden="true"/><div className="container hero-grid">
      <div className="hero-copy"><Reveal><p className="eyebrow">UEDA DENTAL CLINIC <span/> IMPLANT INFORMATION</p></Reveal><Reveal delay={.08}><h1>歯を失ったときの<br/>選択肢を、<br/><em>納得して選ぶ。</em></h1></Reveal><Reveal delay={.16}><p className="hero-lead">インプラント治療の特徴や、ほかの治療方法との違い、費用・期間・リスクについて。判断の前に知っておきたいことを、順序立ててご案内します。</p></Reveal><Reveal delay={.24} className="hero-actions"><Link href="/comparison" className="button primary-button">治療方法を比べる <ArrowRight/></Link><Link href="/about-implant" className="text-link">インプラントを知る <ArrowRight/></Link></Reveal>
      </div><Reveal delay={.12} className="hero-visual"><div className="hero-image-wrap"><Image src="/images/doctor/ueda-daisuke-portrait.jpg" alt="うえだ歯科医院 院長 上田大介" fill priority sizes="(max-width: 800px) 84vw, 42vw"/><div className="doctor-caption"><span>DIRECTOR</span><strong>上田 大介</strong><small>Daisuke Ueda</small></div></div><p className="hero-quote">「治療法を決める前に、まず選択肢を知ってほしい。」</p></Reveal>
    </div><a href="#concerns" className="scroll-cue">SCROLL <ArrowDown/></a></section>

    <section id="concerns" className="section concerns"><div className="container"><Reveal><p className="section-number">01 — START HERE</p><div className="section-heading split"><h2>迷っていることから、<br/>お聞かせください。</h2><p>歯を失ったときの悩みは、治療法だけではありません。不安を一つずつ整理することが、納得できる選択への第一歩です。</p></div></Reveal><div className="concern-grid">{[
      ["歯を失った", "治療の選択肢を知りたい", "/about-implant"], ["入れ歯が合わない", "ほかの方法と比べたい", "/comparison"], ["手術が不安", "治療の流れを知りたい", "/treatment"], ["費用が気になる", "費用とリスクを確認したい", "/cost"], ["持病がある", "治療できるか相談したい", "/faq"], ["医師を知りたい", "経歴や考え方を確認したい", "/doctor"]
    ].map(([title, sub, href], i) => <Reveal key={title} delay={i * .05}><Link href={href} className="concern-card"><span>0{i + 1}</span><h3>{title}</h3><p>{sub}</p><ArrowRight/></Link></Reveal>)}</div></div></section>

    <section className="section comparison-section"><div className="container"><Reveal><p className="section-number light">02 — COMPARE OPTIONS</p><div className="section-heading split light"><h2>インプラントだけが、<br/>選択肢ではありません。</h2><p>治療法にはそれぞれ特徴と注意点があります。大切なのは、違いを理解したうえで、ご自身の状態と希望に合う方法を相談することです。</p></div></Reveal><Reveal><Comparison/></Reveal><Link href="/comparison" className="button outline-light">比較を詳しく見る <ArrowRight/></Link></div></section>

    <section className="section overview"><div className="container overview-grid"><Reveal className="overview-graphic"><div className="implant-abstract"><span/><span/><span/><div>IMPLANT<br/><small>STRUCTURE</small></div></div><p>※ 医学的な構造模型ではなく、3つの構成要素を示す抽象図です。</p></Reveal><div><Reveal><p className="section-number">03 — UNDERSTAND</p><h2>インプラント治療とは</h2><p className="lead">失った歯の部分に人工歯根を埋め込み、その上に人工歯を装着する治療方法です。</p></Reveal><div className="feature-list">{[[ScanLine, "診査と診断", "顎の骨だけでなく、お口全体と全身の状態を確認します。"], [Stethoscope, "外科処置", "人工歯根を埋める処置を伴います。適応の慎重な判断が必要です。"], [ShieldCheck, "継続的な管理", "治療後も毎日のケアと定期的なメンテナンスが欠かせません。"]].map(([Icon, title, desc], i) => <Reveal key={String(title)} delay={i * .08} className="feature-row"><Icon size={28}/><div><h3>{String(title)}</h3><p>{String(desc)}</p></div></Reveal>)}</div><Link href="/about-implant" className="text-link">メリットと注意点を詳しく見る <ArrowRight/></Link></div></div></section>

    <section className="doctor-section"><div className="container doctor-grid"><Reveal className="doctor-photo"><Image src="/images/doctor/ueda-daisuke.jpg" alt="院長 上田大介" fill sizes="(max-width: 800px) 100vw, 50vw"/><div className="photo-index">04</div></Reveal><div className="doctor-copy"><Reveal><p className="section-number">04 — DOCTOR</p><h2>口腔外科での経験を、<br/>一人ひとりの診断へ。</h2><p className="lead">治療ありきではなく、まず状態を丁寧に確認すること。ほかの治療法も含め、患者さまと一緒に考える診療を大切にしています。</p><p className="review-label">診療方針の本文は院長確認後に最終確定します。</p></Reveal><Reveal className="doctor-profile"><span>院長</span><h3>{doctor.name}</h3><p>Daisuke Ueda</p></Reveal><Link href="/doctor" className="button secondary-button">院長・経歴を見る <ArrowRight/></Link></div></div></section>

    <section className="section journey"><div className="container"><Reveal><p className="section-number">05 — TREATMENT JOURNEY</p><div className="section-heading split"><h2>治療は、診断から<br/>始まります。</h2><p>実際の工程や期間は状態によって異なります。ここでは一般的な流れをご案内します。</p></div></Reveal><div className="journey-grid"><div className="journey-sticky"><span>YOUR JOURNEY</span><strong>01</strong><p>一つずつ確認しながら、<br/>治療を進めます。</p></div><ol className="journey-list">{journey.map(([num, title, desc]) => <Reveal key={num}><li><span>{num}</span><div><h3>{title}</h3><p>{desc}</p></div><CircleCheck/></li></Reveal>)}</ol></div><Link href="/treatment" className="button secondary-button journey-link">治療の流れを詳しく見る <ArrowRight/></Link></div></section>

    <section className="section cost-preview"><div className="container"><Reveal><p className="section-number">06 — COST & RISKS</p><div className="section-heading split"><h2>費用も、期間も、<br/>リスクも隠さない。</h2><p>自由診療だからこそ、治療内容だけでなく、追加費用の可能性や主なリスクまで確認してから判断することが大切です。</p></div></Reveal><div className="cost-grid"><Reveal className="cost-card"><span>治療費</span><h3>個別のお見積もり</h3><p>検査・処置・人工歯・メンテナンスなど、費用に含まれる範囲を診査後にご説明します。</p><p className="review-label caution">正式な料金は院長確認後に掲載します。</p></Reveal><Reveal className="risk-card"><span>主なリスク・副作用</span><ul><li>外科処置に伴う痛み、腫れ、出血、感染</li><li>神経や血管など周囲組織への影響</li><li>骨と結合しない、または脱落する可能性</li><li>治療後のインプラント周囲組織の炎症</li></ul></Reveal></div><Link href="/cost" className="button secondary-button">費用とリスクを確認する <ArrowRight/></Link></div></section>

    <section className="section faq-section"><div className="container"><Reveal><p className="section-number">07 — FAQ</p><div className="section-heading split"><h2>よくあるご質問</h2><p>気になることを事前に知っておくと、相談の際に確認したいことが整理しやすくなります。</p></div></Reveal><FAQ limit={5}/><Link href="/faq" className="text-link faq-more">すべての質問を見る <ArrowRight/></Link></div></section>
    <CTA/>
  </>;
}
