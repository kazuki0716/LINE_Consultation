import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
export const metadata:Metadata={title:"インプラント治療のよくある質問",description:"治療期間、痛み、年齢、持病、入れ歯との違い、メンテナンスなど、インプラント治療に関する一般的な質問にお答えします。"};
export default function Page(){return <><PageHero eyebrow="よくあるご質問" title="よくあるご質問" intro="相談前に知っておきたいことをまとめました。回答は一般的な情報であり、個別の診断に代わるものではありません。"/><section className="content-section"><div className="container narrow"><FAQ/><p className="medical-box">症状や持病について心配なことがある方は、受診時に歯科医師へお知らせください。</p></div></section><CTA/></>}
