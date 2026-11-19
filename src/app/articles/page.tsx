import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { articles } from "@/data/articles";
export const metadata:Metadata={title:"インプラント記事",description:"インプラント治療を検討する際に知っておきたい比較、治療期間、適応について解説する記事一覧です。"};
export default function Page(){return <><PageHero eyebrow="JOURNAL" title="上田先生のインプラント記事" intro="治療方法の違い、期間、診断の考え方を、患者さんの疑問に沿って解説します。"/><section className="content-section article-index"><div className="container"><div className="article-index__head"><h2>インプラントを知る</h2><p>{articles.length}件の記事</p></div><div className="article-list">{articles.map((a,i)=><Link href={`/articles/${a.slug}`} key={a.slug} className="article-list__item"><div className="article-list__image"><Image src={a.image} alt={`${a.title}のアイキャッチ`} fill sizes="(max-width:760px) 34vw, 260px"/></div><div className="article-list__body"><span>{a.category}</span><h2>{a.title}</h2><p>{a.desc}</p><div><time dateTime={a.publishedAt?.replaceAll(".","-")}>{a.publishedAt ?? `ARTICLE 0${i+1}`}</time><small>読了目安 {a.readTime}</small></div></div></Link>)}</div></div></section></>}
