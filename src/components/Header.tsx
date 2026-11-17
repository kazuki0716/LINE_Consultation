"use client";

import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { nav, site } from "@/data/site";

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="header-inner">
      <Link href="/" className="brand" onClick={() => setOpen(false)} aria-label="うえだ歯科医院 インプラント情報サイト トップ">
        <span className="brand-mark" aria-hidden="true">U</span><span><strong>UEDA DENTAL CLINIC</strong><small>IMPLANT INFORMATION</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="メインナビゲーション">{nav.slice(0, 5).map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <a className="header-phone" href={`tel:${site.phone.replaceAll("-", "")}`}><Phone size={16}/><span>{site.phone}</span></a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "メニューを閉じる" : "メニューを開く"}>{open ? <X/> : <Menu/>}</button>
    </div>
    <nav id="mobile-nav" className={`mobile-nav ${open ? "open" : ""}`} aria-label="モバイルナビゲーション">{nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}<span>→</span></Link>)}<Link href="/access" onClick={() => setOpen(false)}>アクセス<span>→</span></Link></nav>
  </header>;
}
