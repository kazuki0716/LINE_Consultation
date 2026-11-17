import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { articles } from "@/data/articles";
export const metadata:Metadata={title:"インプラント記事",description:"インプラント治療を検討する際に知っておきたい比較、治療期間、適応について解説する記事一覧です。"};
export default function Page(){return <><PageHero eyebrow="JOURNAL" title="知るための記事" intro="治療を急いで決める前に、比較し、疑問を整理するための読みものです。"/><section className="content-section"><div className="container article-grid">{articles.map((a,i)=><Link href={`/articles/${a.slug}`} key={a.slug} className="article-card"><span>ARTICLE 0{i+1}</span><h2>{a.title}</h2><p>{a.desc}</p><small>医学監修：確認中</small><ArrowRight/></Link>)}</div></section></>}
