import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles } from "@/data/articles";

export function generateStaticParams(){return articles.map(a=>({slug:a.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const a=articles.find(x=>x.slug===slug);return a?{title:a.title,description:a.desc,robots:{index:false,follow:true}}:{}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=articles.find(a=>a.slug===slug);if(!article)notFound();return <article className="article-page"><header><div className="container narrow"><nav className="breadcrumbs"><Link href="/">ホーム</Link><span>/</span><Link href="/articles">記事</Link></nav><p className="eyebrow">IMPLANT JOURNAL</p><h1>{article.title}</h1><p className="lead">{article.desc}</p><div className="review-banner">この記事は医学監修前の構成案です。公開用の医療情報として確定していません。</div></div></header><div className="container narrow article-body"><h2>まず知っておきたいこと</h2><p>治療方法の適否は、お口の状態だけでなく全身の健康状態や生活上の希望によっても異なります。一般的な情報だけで自己判断せず、診査を受けて相談することが大切です。</p><h2>比較するときの視点</h2><ul><li>治療の仕組みと外科処置の有無</li><li>周囲の歯への影響</li><li>治療期間と通院の見通し</li><li>費用とメンテナンス</li><li>主なリスク・注意点</li></ul><h2>個別の判断について</h2><p>この記事の詳細本文は、上田院長による医学監修と参考資料の確認後に公開します。</p><p className="medical-box">ステータス：review_required（医学監修待ち）</p></div></article>}
