"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { site } from "@/data/site";

const slides = [
  { src: "/images/doctor/ueda-daisuke.jpg", alt: "うえだ歯科医院 院長 上田大介", label: "DIRECTOR / DAISUKE UEDA", position: "center 24%" },
  { src: "/images/clinic/ct.jpg", alt: "うえだ歯科医院の歯科用CT", label: "DIAGNOSIS / DENTAL CT", position: "center" },
  { src: "/images/clinic/treatment-room.jpg", alt: "うえだ歯科医院の診療室", label: "CLINIC / TREATMENT ROOM", position: "center" },
];

export function ModernHero() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [playing, reduced]);

  return <>
    <section className="precision-hero" aria-label="うえだ歯科医院 インプラント情報サイト">
      <div className="precision-hero__grid" aria-hidden="true"/>
      <div className="container precision-hero__inner">
        <div className="precision-hero__copy">
          <div className="precision-hero__meta"><span>鹿児島市 うえだ歯科医院</span><span>口腔外科認定医による診査・診断</span></div>
          <p className="precision-hero__eyebrow"><i/> インプラントに決める前の相談から</p>
          <h1>手術の前に、<br/><em>診断を丁寧に。</em></h1>
          <p className="precision-hero__lead">口腔外科で経験を積んだ院長が、CTだけでなく歯ぐき、噛み合わせ、全身状態まで確認します。入れ歯やブリッジも含め、今のお口に合う方法を一緒に考えます。</p>
          <div className="precision-hero__actions"><a href={site.booking} target="_blank" rel="noopener noreferrer" className="precision-button">初診相談を予約する <ArrowRight/></a><Link href="/comparison" className="precision-link">治療方法を比べる <ArrowRight/></Link></div>
          <dl className="precision-hero__facts"><div><dt>01</dt><dd><strong>口腔外科認定医</strong><span>院長が診査・診断</span></dd></div><div><dt>02</dt><dd><strong>歯科用CT</strong><span>骨と神経を立体的に確認</span></dd></div><div><dt>03</dt><dd><strong>385,000円</strong><span>1本・税込</span></dd></div></dl>
        </div>
        <div className="precision-hero__visual">
          <div className="precision-hero__media" aria-live="off">{slides.map((slide, index) => <Image key={slide.src} src={slide.src} alt={index === active ? slide.alt : ""} fill priority={index === 0} sizes="(max-width: 800px) 100vw, 48vw" className={index === active ? "is-active" : ""} style={{ objectPosition: slide.position }} aria-hidden={index !== active}/>)}</div>
          <div className="precision-hero__caption"><span>{slides[active].label}</span><div>{slides.map((slide, index) => <button key={slide.src} onClick={() => setActive(index)} className={index === active ? "is-active" : ""} aria-label={`${index + 1}枚目の写真を表示`}><span>{String(index + 1).padStart(2, "0")}</span></button>)}</div><button className="precision-hero__play" onClick={() => setPlaying(!playing)} aria-label={playing ? "スライドショーを停止" : "スライドショーを再生"}>{playing ? <Pause/> : <Play/>}</button></div>
          <p className="precision-hero__side">DIAGNOSIS BEFORE TREATMENT</p>
        </div>
        <a href="#concerns" className="precision-hero__scroll">SCROLL <ArrowDown/></a>
      </div>
    </section>
    <nav className="precision-nav" aria-label="知りたい内容から探す"><div className="container"><span>EXPLORE</span><Link href="/comparison">治療方法</Link><Link href="/treatment">治療の流れ</Link><Link href="/cost">費用・期間</Link><Link href="/doctor">院長紹介</Link></div></nav>
  </>;
}
