"use client";

import Link from "next/link";
import { CalendarDays, Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { nav, site } from "@/data/site";

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="header-inner">
      <Link href="/" className="brand" onClick={() => setOpen(false)} aria-label="うえだ歯科医院 インプラント情報サイト トップ">
        <span className="brand-mark" aria-hidden="true">U</span><span><strong>うえだ歯科医院</strong><small>IMPLANT INFORMATION</small></span>
      </Link>
      <div className="header-contact"><a className="header-phone" href={`tel:${site.phone.replaceAll("-", "")}`} aria-label="うえだ歯科医院へ電話する"><Phone size={18}/><span><small>予約・問い合わせ</small>{site.phone}</span></a><a className="header-booking" href={site.booking} target="_blank" rel="noopener noreferrer"><CalendarDays size={18}/>初診相談をWEB予約</a></div>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "メニューを閉じる" : "メニューを開く"}>{open ? <X/> : <Menu/>}</button>
    </div>
    <nav className="desktop-nav" aria-label="メインナビゲーション"><div>{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<Link href="/doctor/expertise">院長の実績</Link><Link href="/articles">記事一覧</Link><Link href="/access">アクセス</Link></div></nav>
    <nav id="mobile-nav" className={`mobile-nav ${open ? "open" : ""}`} aria-label="モバイルナビゲーション"><p>知りたい内容を選んでください</p>{nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}<span>→</span></Link>)}<Link href="/doctor/expertise" onClick={() => setOpen(false)}>院長の専門性・実績<span>→</span></Link><Link href="/articles" onClick={() => setOpen(false)}>インプラント記事一覧<span>→</span></Link><Link href="/access" onClick={() => setOpen(false)}>医院案内・アクセス<span>→</span></Link></nav>
    <div className="mobile-quick-actions"><a href={`tel:${site.phone.replaceAll("-", "")}`}><Phone size={19}/>電話で問い合わせ</a><a href={site.booking} target="_blank" rel="noopener noreferrer"><CalendarDays size={19}/>初診WEB予約</a></div>
  </header>;
}
