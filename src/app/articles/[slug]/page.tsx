import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CTA } from "@/components/CTA";
import { ArticleDiagram } from "@/components/ArticleDiagram";
import { articleReadTime, articles } from "@/data/articles";

export function generateStaticParams(){return articles.map(a=>({slug:a.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const a=articles.find(x=>x.slug===slug);return a?{title:a.title,description:a.desc,openGraph:{title:a.title,description:a.desc,images:[a.image]}}:{}}

export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const currentIndex=articles.findIndex(a=>a.slug===slug);
  const article=articles[currentIndex];
  if(!article)notFound();
  const nextArticle=articles[(currentIndex+1)%articles.length];
  const moreArticles=articles.filter(a=>a.slug!==article.slug&&a.slug!==nextArticle.slug).slice(0,2);
  return <><article className="article-page">
    <header><div className="container article-header-grid"><div><nav className="breadcrumbs"><Link href="/">ホーム</Link><span>/</span><Link href="/articles">記事一覧</Link></nav><p className="eyebrow">IMPLANT JOURNAL / {article.category}</p><h1>{article.title}</h1><p className="lead">{article.desc}</p><div className="article-meta"><span>著者・監修　上田大介 院長</span>{article.publishedAt&&<time dateTime={article.publishedAt.replaceAll(".","-")}>{article.publishedAt}</time>}<span>読了目安 {articleReadTime(article)}</span></div></div><div className="article-eyecatch"><Image src={article.image} alt={`${article.title}のアイキャッチ`} fill priority sizes="(max-width:760px) 100vw, 40vw"/></div></div></header>
    <div className="container article-layout"><div className="article-body">{article.sections.map(section=><section key={section.title}><h2>{section.title}</h2>{section.image&&<figure className="article-inline-image"><div><Image src={section.image} alt={section.imageAlt ?? ""} fill sizes="(max-width:760px) 100vw, 720px"/></div>{section.caption&&<figcaption>{section.caption}</figcaption>}</figure>}{section.paragraphs.map(p=><p key={p}>{p}</p>)}{section.diagram&&<ArticleDiagram type={section.diagram}/>} {section.points&&<ul>{section.points.map(point=><li key={point}>{point}</li>)}</ul>}</section>)}<section className="article-author"><div className="article-author__image"><Image src="/images/doctor/ueda-daisuke-portrait.jpg" alt="うえだ歯科医院 院長 上田大介" fill sizes="120px"/></div><div><span>AUTHOR / SUPERVISOR</span><h2>上田 大介</h2><p>うえだ歯科医院 院長。日本口腔外科学会認定医、日本口腔インプラント学会所属。歯を失った部分だけでなく、残っている歯と口全体を長く守る視点から治療方法をご提案します。</p></div></section><p className="article-disclaimer">本記事は一般的な歯科医療情報を提供するもので、個別の診断や治療方針を示すものではありません。治療の適否、必要な処置、期間、費用は口腔内と全身の状態によって異なります。</p></div><aside className="article-sources"><p>REFERENCES</p><h2>参考情報</h2>{article.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer"><span>{source.name}</span><strong>{source.title}</strong><ArrowUpRight aria-hidden="true"/></a>)}<small>治療の適応・期間・結果には個人差があります。診断は診察と検査に基づいて行います。</small></aside></div>
    <section className="article-continuation"><div className="container"><p className="article-continuation__label">NEXT ARTICLE</p><h2>次に読むなら</h2><Link href={`/articles/${nextArticle.slug}`} className="article-next"><div className="article-next__image"><Image src={nextArticle.image} alt="" fill loading="eager" sizes="(max-width:760px) 34vw, 360px"/></div><div><span>{nextArticle.category}・{articleReadTime(nextArticle)}で読む</span><h3>{nextArticle.title}</h3><p>{nextArticle.desc}</p></div></Link><div className="article-more">{moreArticles.map(a=><Link href={`/articles/${a.slug}`} key={a.slug}><div><Image src={a.image} alt="" fill loading="eager" sizes="(max-width:760px) 30vw, 180px"/></div><span>{a.category}・{articleReadTime(a)}</span><h3>{a.title}</h3></Link>)}</div><Link href="/articles" className="article-all-link">記事をすべて見る</Link></div></section>
    <div className="container article-back"><Link href="/articles"><ArrowLeft/>記事一覧に戻る</Link></div>
  </article><CTA/></>
}
