"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const slides = [
  { src: "/images/doctor/ueda-daisuke.jpg", alt: "うえだ歯科医院 院長 上田大介", label: "DIRECTOR / DAISUKE UEDA", position: "center 28%" },
  { src: "/images/clinic/treatment-room.jpg", alt: "うえだ歯科医院の診療室", label: "CLINIC / TREATMENT ROOM", position: "center" },
  { src: "/images/clinic/exterior.jpg", alt: "うえだ歯科医院の外観", label: "KAGOSHIMA / MASAGO", position: "center" },
];

export function ModernHero() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, [playing, reduced]);

  return <>
    <section className="modern-hero" aria-label="うえだ歯科医院 インプラント情報サイト">
      <div className="hero-media" aria-live="off">{slides.map((slide, index) => <Image key={slide.src} src={slide.src} alt={index === active ? slide.alt : ""} fill priority={index === 0} sizes="100vw" className={index === active ? "is-active" : ""} style={{ objectPosition: slide.position }} aria-hidden={index !== active}/>)}</div>
      <div className="hero-shade" aria-hidden="true"/><div className="hero-grid-lines" aria-hidden="true"/>
      <div className="container modern-hero-inner">
        <div className="hero-kicker"><span>IMPLANT INFORMATION</span><span>KAGOSHIMA / 2026</span></div>
        <div className="modern-hero-copy"><p className="hero-status"><span/> CONSULTATION FIRST</p><h1>選ぶ前に<br/><em>きちんと知る。</em></h1><p>インプラントにすると決めてから来ていただく必要はありません。今のお口にどんな選択肢があるのか。そこから一緒に考えていきます。</p><div className="modern-hero-actions"><Link href="/comparison" className="button hero-primary">治療方法を比べる <ArrowRight/></Link><Link href="/about-implant" className="hero-secondary">まず仕組みを知る <ArrowDownRight/></Link></div></div>
        <div className="hero-doctor-tag"><small>DIRECTOR</small><strong>上田 大介</strong><span>日本口腔外科学会 認定医</span></div>
        <div className="hero-controller"><span className="slide-label">{slides[active].label}</span><div className="hero-dots">{slides.map((slide, index) => <button key={slide.src} onClick={() => setActive(index)} className={index === active ? "is-active" : ""} aria-label={`${index + 1}枚目の写真を表示`}/>)}</div><button className="play-toggle" onClick={() => setPlaying(!playing)} aria-label={playing ? "スライドショーを停止" : "スライドショーを再生"}>{playing ? <Pause/> : <Play/>}</button></div>
      </div>
    </section>
    <div className="info-ticker" aria-label="このサイトで確認できること"><div className="ticker-label">EXPLORE</div><div className="ticker-track"><div><span>治療方法を先に決めなくても大丈夫です</span><i>•</i><span>入れ歯やブリッジとも比べます</span><i>•</i><span>費用とリスクも最初にお話しします</span><i>•</i><span>相談だけでもかまいません</span><i>•</i><span>治療方法を先に決めなくても大丈夫です</span><i>•</i></div></div></div>
    <nav className="topic-dock" aria-label="知りたい内容から探す"><div className="container topic-dock-inner"><span>いま知りたいのは？</span><Link href="/comparison">治療方法の違い <ArrowRight/></Link><Link href="/treatment">治療の流れ <ArrowRight/></Link><Link href="/cost">費用とリスク <ArrowRight/></Link><Link href="/doctor">担当する医師 <ArrowRight/></Link></div></nav>
  </>;
}
