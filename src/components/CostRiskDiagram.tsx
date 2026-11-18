import Link from "next/link";
import { ArrowRight } from "lucide-react";

const bars = [
  { count: "1本", amount: "38.5万円", height: "34%" },
  { count: "2本", amount: "77万円", height: "67%" },
  { count: "3本", amount: "115.5万円", height: "100%" },
] as const;

export function CostRiskDiagram(){return <section className="cost-risk-diagram"><div className="container"><div className="cost-risk-diagram__label"><span>費用に関する注意点</span><b>02</b></div><h2>必要な本数によって<br/><strong>基本費用が変わります</strong></h2><p className="cost-risk-diagram__lead">インプラントは1本385,000円（税込）です。必要な本数や追加処置の有無によって総額が変わります。</p><div className="cost-risk-chart" role="img" aria-label="インプラント1本38万5千円、2本77万円、3本115万5千円の基本費用の比較"><div className="cost-risk-chart__axis"><span>120万円</span><span>80万円</span><span>40万円</span><span>0</span></div><div className="cost-risk-chart__bars">{bars.map(bar=><div className="cost-risk-chart__item" key={bar.count}><div className="cost-risk-chart__bar" style={{height:bar.height}}><strong>{bar.amount}</strong></div><b>{bar.count}の場合</b></div>)}</div></div><div className="cost-risk-diagram__note"><b>基本費用に含まれるもの</b><span>インプラント本体・かぶせ物・必要な歯ぐきの手術</span><small>骨を補う処置が必要な場合は、材料費が別途かかります。検査後に個別の総額をご説明します。</small></div><Link href="/cost">費用に含まれるものを詳しく見る <ArrowRight/></Link></div></section>}
