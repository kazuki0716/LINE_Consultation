import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Manrope, Noto_Serif_JP } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/data/site";
import "./globals.css";

const zen = Zen_Kaku_Gothic_New({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-jp", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-en", display: "swap" });
const notoSerif = Noto_Serif_JP({ subsets: ["latin"], weight: ["600"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: { default: "鹿児島市のインプラント相談｜うえだ歯科医院", template: "%s｜うえだ歯科医院" },
  description: "インプラント・ブリッジ・入れ歯の違い、治療の流れ、費用やリスクを丁寧にご案内する、うえだ歯科医院のインプラント情報サイトです。",
  openGraph: { title: "歯を失ったときの選択肢を、納得して選ぶために。", description: "鹿児島市・うえだ歯科医院のインプラント情報サイト", type: "website", locale: "ja_JP", images: [{ url: "/images/doctor/ueda-daisuke-portrait.jpg", width: 400, height: 600 }] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = { "@context": "https://schema.org", "@type": "Dentist", name: site.name, url: site.siteUrl, telephone: site.phone, address: { "@type": "PostalAddress", postalCode: "890-0066", addressRegion: "鹿児島県", addressLocality: "鹿児島市", streetAddress: "真砂町65-1 アカシア県庁前1階" } };
  return <html lang="ja" data-scroll-behavior="smooth" className={`${zen.variable} ${manrope.variable} ${notoSerif.variable}`}><body><a href="#main" className="skip-link">本文へ移動</a><Header/><main id="main">{children}</main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/></body></html>;
}
