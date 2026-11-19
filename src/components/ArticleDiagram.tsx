import { Activity, Bone, CircleDollarSign, Clock3, GitCompareArrows, HeartPulse, Pill, ScanLine, ShieldAlert, Stethoscope, Syringe, UserRoundCheck } from "lucide-react";

export type ArticleDiagramType = "decision" | "comparison" | "planning" | "cost" | "age" | "bone" | "pain";

export function ArticleDiagram({ type }: { type: ArticleDiagramType }) {
  if (type === "age") return <figure className="article-diagram article-diagram--clinical" aria-label="年齢より先に確認する4項目">
    <figcaption>年齢より先に確認すること</figcaption>
    <div>{[[HeartPulse,"全身状態","持病が安定しているか"],[Pill,"服薬","手術に影響する薬はないか"],[Bone,"顎の骨","人工歯根を支えられるか"],[UserRoundCheck,"治療後の管理","通院と清掃を続けられるか"]].map(([Icon,title,text])=><article key={String(title)}><Icon aria-hidden="true"/><div><strong>{String(title)}</strong><span>{String(text)}</span></div></article>)}</div>
  </figure>;

  if (type === "bone") return <figure className="article-diagram article-diagram--bone" aria-label="骨が少ないときの検討の流れ">
    <figcaption>「骨が足りない」の次に調べること</figcaption>
    <div><span><ScanLine aria-hidden="true"/><b>CTで確認</b><small>不足する場所と量</small></span><i>→</i><span><Bone aria-hidden="true"/><b>方法を検討</b><small>骨造成・位置・設計</small></span><i>→</i><span><GitCompareArrows aria-hidden="true"/><b>負担を比較</b><small>追加手術か別治療か</small></span></div>
  </figure>;

  if (type === "pain") return <figure className="article-diagram article-diagram--pain" aria-label="手術前から術後までの痛みへの対応">
    <figcaption>痛みは術中と術後で分けて考える</figcaption>
    <div><article><span>手術前</span><Syringe aria-hidden="true"/><strong>局所麻酔</strong><p>処置中の痛みを抑える</p></article><article><span>手術中</span><Activity aria-hidden="true"/><strong>圧迫感や振動</strong><p>痛み以外の感覚は残ることがある</p></article><article><span>手術後</span><Clock3 aria-hidden="true"/><strong>腫れ・痛み</strong><p>程度と期間には個人差がある</p></article></div>
  </figure>;

  if (type === "decision") return <figure className="article-diagram article-diagram--decision" aria-label="歯を失ったときに確認する4つの判断材料">
    <figcaption>治療方法を決める前に見る4つのこと</figcaption>
    <div>{[[Bone,"残っている歯","健康な歯を削る必要があるか"],[ScanLine,"顎の骨","幅・高さ・形はどうか"],[GitCompareArrows,"噛み合わせ","周囲の歯に無理がないか"],[Stethoscope,"全身状態","持病・服薬・喫煙の影響"]].map(([Icon,title,text])=><article key={String(title)}><Icon aria-hidden="true"/><strong>{String(title)}</strong><span>{String(text)}</span></article>)}</div>
  </figure>;

  if (type === "comparison") return <figure className="article-diagram article-diagram--comparison" aria-label="ブリッジ、入れ歯、インプラントの特徴比較">
    <figcaption>歯を1本失ったときの主な選択肢</figcaption>
    <div><article><strong>ブリッジ</strong><span>固定式</span><p>隣の歯を支えにする</p></article><article><strong>入れ歯</strong><span>取り外し式</span><p>外科処置を行わない</p></article><article><strong>インプラント</strong><span>固定式</span><p>顎の骨で独立して支える</p></article></div>
    <small>優劣ではなく、残っている歯・身体への負担・手入れ・費用を合わせて考えます</small>
  </figure>;

  if (type === "planning") return <figure className="article-diagram article-diagram--planning" aria-label="インプラント治療計画で確認する順序">
    <figcaption>人工歯から逆算して治療を計画</figcaption>
    <div><span>噛みやすい<br/><b>人工歯の位置</b></span><i>→</i><span>力と清掃性を考えた<br/><b>人工歯根の角度</b></span><i>→</i><span>骨・神経・上顎洞を<br/><b>CTで確認</b></span></div>
    <p><ShieldAlert aria-hidden="true"/>骨がある場所へ単純に埋めるのではなく、最終的な人工歯から位置を考えます</p>
  </figure>;

  return <figure className="article-diagram article-diagram--cost" aria-label="インプラント治療費で確認する項目">
    <figcaption>表示金額と一緒に確認したい項目</figcaption>
    <div><CircleDollarSign aria-hidden="true"/><strong>1本 385,000円（税込）</strong><span>かぶせ物・歯ぐきの手術を含む</span></div>
    <ul><li>診査・CT撮影</li><li>骨造成の材料費</li><li>仮歯・追加処置</li><li>治療後の管理費</li></ul>
  </figure>;
}
