"use client";

import { useEffect, useRef, useState } from "react";

function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (reduced) return setValue(to);
      const from = Math.round(to * .72);
      setValue(from);
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1100, 1);
        setValue(Math.round(from + (to - from) * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: .45 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [to]);
  return <span ref={ref} aria-label={`${to.toLocaleString("ja-JP")}${suffix}`}>{value.toLocaleString("ja-JP")}{suffix}</span>;
}

export function ClinicalNumbers() {
  return <section className="clinical-numbers"><div className="container">
    <div className="clinical-numbers__head"><p>診断から治療後まで</p><h2>治療前に、流れを<br/>分かりやすくお伝えします。</h2><span>検査で見るポイント、治療の工程、治療後の管理まで、順を追ってご説明します。</span></div>
    <div className="clinical-numbers__grid"><article><small>診断で確認すること</small><strong><Count to={4}/><i>つ</i></strong><h3>診断の視点</h3><p>骨と神経、歯ぐき、噛み合わせ、全身状態を重ねて判断します。</p></article><article><small>相談から治療後まで</small><strong><Count to={7}/><i>段階</i></strong><h3>治療の工程</h3><p>診査から人工歯の装着、治療後のメンテナンスまで続きます。</p></article><article className="is-accent"><small>治療後も継続</small><strong className="clinical-word">定期管理</strong><h3>長く使うために</h3><p>歯ぐき、清掃状態、部品、噛み合わせを定期的に確認します。</p></article></div>
  </div></section>;
}
