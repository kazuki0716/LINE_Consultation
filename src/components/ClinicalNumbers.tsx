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
    <div className="clinical-numbers__head"><p>CLINICAL NUMBERS</p><h2>判断に必要なことを、<br/>曖昧にしない。</h2><span>数字だけで治療の良し悪しは決まりません。だからこそ、費用、工程、診断項目を最初から見える形にします。</span></div>
    <div className="clinical-numbers__grid"><article><small>DIAGNOSTIC VIEW</small><strong><Count to={4}/><i>つ</i></strong><h3>診断の視点</h3><p>骨と神経、歯ぐき、噛み合わせ、全身状態を重ねて判断します。</p></article><article><small>TREATMENT JOURNEY</small><strong><Count to={7}/><i>段階</i></strong><h3>治療の工程</h3><p>診査から人工歯の装着、治療後のメンテナンスまで続きます。</p></article><article className="is-accent"><small>IMPLANT / 1 UNIT</small><strong><Count to={385000}/><i>円</i></strong><h3>治療費（税込）</h3><p>インプラント本体、かぶせ物、歯ぐきの手術を含みます。</p></article></div>
  </div></section>;
}
