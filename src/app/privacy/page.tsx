import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
export const metadata:Metadata={title:"プライバシーポリシー",robots:{index:false}};
export default function Page(){return <><PageHero eyebrow="PRIVACY" title="プライバシーポリシー" intro="本サイトにおける個人情報の取り扱いについてご案内します。"/><section className="content-section"><div className="container narrow prose"><h2>基本方針</h2><p>うえだ歯科医院は、個人情報を適切に取り扱い、安全管理に努めます。</p><h2>お問い合わせについて</h2><p>本サイト内には患者情報を送信するフォームを設置していません。お問い合わせ・予約は医院公式サイトまたは電話をご利用ください。</p><h2>アクセス情報</h2><p>サイトの品質改善と安全な運用に必要な範囲で、閲覧日時、端末・ブラウザの種類、参照元などの情報を取得することがあります。病歴や相談内容などの要配慮個人情報をアクセス解析へ送信することはありません。</p><h2>個人情報に関するお問い合わせ</h2><p>個人情報の開示、訂正、削除などのお申し出は、うえだ歯科医院までご連絡ください。</p></div></section></>}
