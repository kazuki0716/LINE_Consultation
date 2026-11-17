import type { Metadata } from "next";
import { PageHero, InfoSection } from "@/components/PageHero";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = { title: "インプラントの費用・期間・リスク", description: "うえだ歯科医院のインプラント費用と、治療期間、追加費用、主なリスクをご案内します。" };

export default function Page() {
  return <>
    <PageHero eyebrow="COST & RISKS" title="費用・期間・リスク" intro="金額だけでなく、何が含まれるのか。治療にどのくらい時間がかかるのか。考えられるリスクまで、判断に必要な情報をまとめました。"/>
    <InfoSection number="01" title="治療費">
      <div className="price-feature"><div><span>IMPLANT / 1本</span><strong>385,000<small>円（税込）</small></strong></div><p>インプラント本体、かぶせ物、歯ぐきの手術を含みます。</p></div>
      <div className="cost-detail-grid"><article><span>INCLUDED</span><h3>費用に含まれるもの</h3><ul><li>インプラント埋入処置</li><li>かぶせ物（上部構造）</li><li>必要な歯ぐきの手術</li></ul></article><article><span>ADDITIONAL</span><h3>追加費用の可能性</h3><p>骨造成が必要な場合は、症例に応じて材料費がかかります。CTで骨の高さ・幅を確認したうえで、治療前にご説明します。</p></article></div>
      <p className="medical-box">自由診療です。お口の状態によって必要な処置が異なるため、最終的な費用は診査・診断後にお見積もりします。</p>
    </InfoSection>
    <InfoSection number="02" title="治療期間" muted>
      <p className="lead">一般的なインプラント治療は数か月、骨や歯ぐきの処置を伴う場合は1年ほどかかることがあります。</p>
      <div className="period-grid"><article><b>01</b><span>診査・治療計画</span><p>CTで骨、神経、上顎洞の位置を立体的に確認します。</p></article><article><b>02</b><span>インプラント埋入</span><p>人工歯根を入れ、骨と安定するまで治癒を待ちます。</p></article><article><b>03</b><span>人工歯の装着</span><p>噛み合わせを調整し、最終的なかぶせ物を装着します。</p></article></div>
      <h3>抜歯から計画できる、低侵襲インプラント治療</h3><p>抜歯の段階で骨と歯ぐきを守る処置を行い、将来のインプラントを見据えて治療を進める方法にも対応しています。抜歯後4〜6か月でインプラントを埋入し、その2〜4か月後に人工歯を装着する流れを基本としています。</p>
      <p className="medical-box">治癒には個人差があります。炎症の状態、骨造成の有無、治療部位によって期間と通院回数は変わります。</p>
    </InfoSection>
    <InfoSection number="03" title="主なリスク・副作用">
      <div className="risk-detail-grid"><article><span>手術後</span><h3>痛み・腫れ・出血・感染</h3><p>外科処置後には一時的な症状が出ることがあります。術後の注意事項を守り、経過を確認します。</p></article><article><span>周囲組織</span><h3>神経・血管・上顎洞への影響</h3><p>治療部位によって注意すべき組織が異なります。CT画像を用いて位置関係を確認します。</p></article><article><span>治癒</span><h3>骨と結合しない可能性</h3><p>全身状態、喫煙、骨質などの影響で、インプラントが十分に安定しない場合があります。</p></article><article><span>治療後</span><h3>周囲炎・破損・緩み</h3><p>清掃不良や噛み合わせの変化により炎症や部品の不具合が起こることがあります。</p></article></div>
    </InfoSection>
    <InfoSection number="04" title="長く使うために" muted><h3>治療が終わった日から、メンテナンスが始まります</h3><p>インプラントはむし歯にはなりませんが、周囲の歯ぐきに炎症が起こることがあります。毎日のセルフケアに加え、歯科医院で清掃状態、歯ぐき、噛み合わせを継続して確認することが大切です。</p></InfoSection>
    <CTA/>
  </>;
}
