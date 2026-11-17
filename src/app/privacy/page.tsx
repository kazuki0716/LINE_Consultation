import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
export const metadata:Metadata={title:"プライバシーポリシー",robots:{index:false}};
export default function Page(){return <><PageHero eyebrow="PRIVACY" title="プライバシーポリシー" intro="本サイトにおける個人情報の取り扱いについてご案内します。"/><section className="content-section"><div className="container narrow prose"><h2>基本方針</h2><p>うえだ歯科医院は、個人情報を適切に取り扱い、安全管理に努めます。</p><h2>お問い合わせについて</h2><p>本サイト内には患者情報を送信するフォームを設置していません。お問い合わせ・予約は医院公式サイトまたは電話をご利用ください。</p><h2>アクセス解析</h2><p>アクセス解析を導入する場合は、個人の病歴や相談内容などを解析イベントへ送信しません。導入内容と利用目的は公開前に追記します。</p><p className="review-banner">本ページは公開前に医院による確認が必要です。</p></div></section></>}
