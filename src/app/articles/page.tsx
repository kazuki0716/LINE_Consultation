import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { articles } from "@/data/articles";
export const metadata:Metadata={title:"インプラント記事",description:"インプラント治療を検討する際に知っておきたい比較、治療期間、適応について解説する記事一覧です。"};
export default function Page(){return <><PageHero eyebrow="JOURNAL" title="インプラントを知る" intro="治療方法の違い、期間、診断の考え方を、患者さんの疑問に沿って解説します。"/><section className="content-section"><div className="container article-grid">{articles.map((a,i)=><Link href={`/articles/${a.slug}`} key={a.slug} className="article-card"><div className="article-card__image"><Image src={a.image} alt="" fill sizes="(max-width:760px) 100vw, 33vw"/></div><div className="article-card__body"><span>ARTICLE 0{i+1} / {a.category}</span><h2>{a.title}</h2><p>{a.desc}</p><small>読了目安 {a.readTime}</small><ArrowRight/></div></Link>)}</div></section></>}
