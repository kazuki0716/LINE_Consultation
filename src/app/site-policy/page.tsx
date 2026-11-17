import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
export const metadata:Metadata={title:"サイトポリシー",robots:{index:false}};
export default function Page(){return <><PageHero eyebrow="SITE POLICY" title="サイトポリシー" intro="この情報サイトの目的とご利用上の注意をご案内します。"/><section className="content-section"><div className="container narrow prose"><h2>医療情報について</h2><p>本サイトの情報は一般的な情報提供を目的としており、個別の診断や治療を代替するものではありません。症状や治療については歯科医師にご相談ください。</p><h2>情報の更新</h2><p>医療情報は確認・更新に努めますが、内容の完全性や最新性を常に保証するものではありません。</p><h2>外部リンク</h2><p>外部サイトの内容について、当院が責任を負うものではありません。</p></div></section></>}
