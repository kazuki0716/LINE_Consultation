import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleCheck, ShieldCheck, Stethoscope, ScanLine } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Comparison } from "@/components/Comparison";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { TrustHero } from "@/components/TrustHero";
import { ClinicalNumbers } from "@/components/ClinicalNumbers";
import { doctor, journey } from "@/data/site";

export default function Home() {
  return <>
    <TrustHero/>

    <section id="concerns" className="section concerns"><div className="container"><Reveal><p className="section-number">01 — START HERE</p><div className="section-heading split"><h2>何がいちばん<br/>気になっていますか。</h2><p>入れ歯が合わない。手術がこわい。費用が分からない。まずは今の困りごとを整理するところから始めましょう。</p></div></Reveal><div className="concern-grid">{[
      ["歯を失った", "治療の選択肢を知りたい", "/about-implant"], ["入れ歯が合わない", "ほかの方法と比べたい", "/comparison"], ["手術が不安", "治療の流れを知りたい", "/treatment"], ["費用が気になる", "費用とリスクを確認したい", "/cost"], ["持病がある", "治療できるか相談したい", "/faq"], ["医師を知りたい", "経歴や考え方を確認したい", "/doctor"]
    ].map(([title, sub, href], i) => <Reveal key={title} delay={i * .05}><Link href={href} className="concern-card"><span>0{i + 1}</span><h3>{title}</h3><p>{sub}</p><ArrowRight/></Link></Reveal>)}</div></div></section>

    <section className="section comparison-section"><div className="container"><Reveal><p className="section-number light">02 — COMPARE OPTIONS</p><div className="section-heading split light"><h2>先に決めなくても<br/>大丈夫です。</h2><p>インプラント、ブリッジ、入れ歯。どれが合うかは、お口の状態だけでなく暮らし方や希望によっても変わります。まず違いを見てみましょう。</p></div></Reveal><Reveal><Comparison/></Reveal><Link href="/comparison" className="button outline-light">3つの方法を詳しく比べる <ArrowRight/></Link></div></section>

    <section className="section diagnosis-depth"><div className="container"><Reveal><p className="section-number">CLINICAL VIEW</p><div className="section-heading split"><h2>インプラントができるかは<br/>骨の量だけでは決まりません。</h2><p>CT画像、お口の清掃状態、噛み合わせ、全身の健康状態。いくつもの情報を重ねて、治療の適応を判断します。</p></div></Reveal><div className="diagnosis-grid">{[
      ["01", "骨と神経の位置", "CT画像で骨の高さ・幅・形を立体的に確認します。下顎の神経や上顎洞までの距離も、治療計画に欠かせない情報です。", "BONE / ANATOMY"],
      ["02", "歯ぐきと清掃性", "インプラントの周りを清潔に保てるか、歯ぐきの厚みや炎症の有無も確認します。入れた後に磨ける設計であることが大切です。", "SOFT TISSUE / HYGIENE"],
      ["03", "噛み合わせと力", "歯ぎしりや食いしばり、向かい合う歯の状態を調べます。特定の場所に力が集中すると、部品や骨に負担がかかります。", "OCCLUSION / FORCE"],
      ["04", "持病と服用薬", "糖尿病の状態、骨粗しょう症の薬、喫煙習慣なども治癒に関係します。必要な場合は主治医と連携して判断します。", "SYSTEMIC HEALTH"],
    ].map(([num,title,desc,en]) => <Reveal key={num} className="diagnosis-card"><div><span>{num}</span><small>{en}</small></div><h3>{title}</h3><p>{desc}</p></Reveal>)}</div><p className="depth-note">検査の結果によっては、先に歯周病の治療を行うことや、インプラント以外の方法をご提案することがあります。</p></div></section>

    <section className="section overview"><div className="container overview-grid"><Reveal className="overview-graphic"><div className="implant-abstract"><span/><span/><span/><div>IMPLANT<br/><small>STRUCTURE</small></div></div><p>※ 3つの構成要素を示すための模式図です。</p></Reveal><div><Reveal><p className="section-number">03 — UNDERSTAND</p><h2>まず仕組みから<br/>お話しします。</h2><p className="lead">インプラントは、顎の骨に人工の歯根を入れ、その上に歯をつくる治療です。外科処置が必要なので、事前の診査を丁寧に行います。</p></Reveal><div className="feature-list">{[[ScanLine, "はじめに診査", "顎の骨だけを見るのではなく、お口全体と全身の状態を確認します。"], [Stethoscope, "手術を伴う治療", "人工歯根を入れる処置があります。治療が適しているかを慎重に判断します。"], [ShieldCheck, "治療後もお付き合い", "長く使っていただくためには、ご自宅でのケアと定期的な確認が必要です。"]].map(([Icon, title, desc], i) => <Reveal key={String(title)} delay={i * .08} className="feature-row"><Icon size={28}/><div><h3>{String(title)}</h3><p>{String(desc)}</p></div></Reveal>)}</div><Link href="/about-implant" className="text-link">仕組みと注意点を詳しく見る <ArrowRight/></Link></div></div></section>

    <section className="clinic-scenes"><div className="container"><Reveal><div className="scene-heading"><div><p className="section-number light">THE CLINIC</p><h2>落ち着いて話せる場所を<br/>つくっています。</h2></div><p>治療内容をきちんと理解していただけるように、画像を見ながら説明する時間を大切にしています。</p></div></Reveal><div className="scene-grid"><Reveal className="scene scene-main"><Image src="/images/clinic/treatment-room.jpg" alt="うえだ歯科医院の診療室" fill sizes="(max-width: 760px) 100vw, 55vw"/><span>診療室 <small>TREATMENT ROOM</small></span></Reveal><Reveal className="scene scene-sub"><Image src="/images/clinic/reception.jpg" alt="うえだ歯科医院の受付" fill sizes="(max-width: 760px) 50vw, 26vw"/><span>受付 <small>RECEPTION</small></span></Reveal><Reveal className="scene scene-sub"><Image src="/images/clinic/waiting-room.jpg" alt="うえだ歯科医院の待合室" fill sizes="(max-width: 760px) 50vw, 26vw"/><span>待合室 <small>WAITING ROOM</small></span></Reveal><Reveal className="scene scene-wide"><Image src="/images/clinic/ct.jpg" alt="うえだ歯科医院の歯科用CT" fill sizes="(max-width: 760px) 100vw, 45vw"/><span>歯科用CT <small>CT IMAGING</small></span></Reveal></div><Link href="/access" className="button scene-button">医院について詳しく見る <ArrowRight/></Link></div></section>

    <section className="doctor-section"><div className="container doctor-grid"><Reveal className="doctor-photo"><Image src="/images/doctor/ueda-daisuke.jpg" alt="院長 上田大介" fill sizes="(max-width: 800px) 100vw, 50vw"/><div className="photo-index">04</div></Reveal><div className="doctor-copy"><Reveal><p className="section-number">04 — DOCTOR</p><h2>できるかどうかを<br/>きちんと見極めます。</h2><p className="lead">インプラントを希望されても、別の方法がよいことがあります。検査の結果と患者さんの希望を照らし合わせ、無理のない治療をご提案することを大切にしています。</p></Reveal><Reveal className="doctor-profile"><span>院長</span><h3>{doctor.name}</h3><p>Daisuke Ueda</p></Reveal><Link href="/doctor" className="button secondary-button">院長について詳しく見る <ArrowRight/></Link></div></div></section>

    <section className="section journey"><div className="container"><Reveal><p className="section-number">05 — TREATMENT JOURNEY</p><div className="section-heading split"><h2>治療を急いで<br/>進めることはありません。</h2><p>検査をして、計画をご説明し、納得いただいてから治療に進みます。期間や工程は一人ひとり異なります。</p></div></Reveal><div className="journey-grid"><div className="journey-sticky"><span>YOUR JOURNEY</span><strong>01</strong><p>分からないことを残さず<br/>一つずつ進めます。</p></div><ol className="journey-list">{journey.map(([num, title, desc]) => <Reveal key={num}><li><span>{num}</span><div><h3>{title}</h3><p>{desc}</p></div><CircleCheck/></li></Reveal>)}</ol></div><Link href="/treatment" className="button secondary-button journey-link">治療の流れを詳しく見る <ArrowRight/></Link></div></section>

    <section className="section cost-preview"><div className="container"><Reveal><p className="section-number">06 — COST & RISKS</p><div className="section-heading split"><h2>分からないまま<br/>進めることはありません。</h2><p>費用の内訳、治療にかかる期間、考えられるリスク。相談の段階から順番にご説明します。</p></div></Reveal><div className="cost-grid"><Reveal className="cost-card"><span>インプラント1本（税込）</span><h3>385,000円</h3><p>インプラント本体、かぶせ物、歯ぐきの手術を含みます。骨造成が必要な場合は材料費が加わります。</p></Reveal><Reveal className="risk-card"><span>主なリスク・副作用</span><ul><li>外科処置に伴う痛み、腫れ、出血、感染</li><li>神経や血管など周囲組織への影響</li><li>骨と結合しない、または脱落する可能性</li><li>治療後のインプラント周囲組織の炎症</li></ul></Reveal></div><Link href="/cost" className="button secondary-button">費用とリスクを確認する <ArrowRight/></Link></div></section>

    <section className="section faq-section"><div className="container"><Reveal><p className="section-number">07 — FAQ</p><div className="section-heading split"><h2>診察前によく<br/>いただくご質問</h2><p>痛みのこと、期間のこと、持病のこと。来院前に気になる内容からご覧ください。</p></div></Reveal><FAQ limit={5}/><Link href="/faq" className="text-link faq-more">ほかの質問も見る <ArrowRight/></Link></div></section>
    <ClinicalNumbers/>
    <CTA/>
  </>;
}
