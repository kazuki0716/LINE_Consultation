"use client";

import { useState } from "react";
import { treatments } from "@/data/site";

export function Comparison() {
  const [active, setActive] = useState(0);
  const item = treatments[active];
  return <div className="comparison-widget">
    <div className="compare-tabs" role="tablist" aria-label="治療方法を選ぶ">{treatments.map((t, i) => <button key={t.key} role="tab" aria-selected={active === i} onClick={() => setActive(i)}><small>0{i + 1}</small>{t.name}</button>)}</div>
    <div className="compare-panel" role="tabpanel"><div><p className="eyebrow">{item.label}</p><h3>{item.name}</h3><p>{item.summary}</p></div><dl>{item.points.map(([dt, dd]) => <div key={dt}><dt>{dt}</dt><dd>{dd}</dd></div>)}</dl></div>
    <p className="medical-note">治療方法はお口や全身の状態、ご希望によって適否が異なります。比較表は一般的な特徴であり、診断に代わるものではありません。</p>
  </div>;
}
