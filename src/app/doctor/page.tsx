import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, InfoSection } from "@/components/PageHero";
import { CTA } from "@/components/CTA";
import { doctor } from "@/data/site";
export const metadata:Metadata={title:"院長紹介｜上田大介",description:"うえだ歯科医院 院長・上田大介の経歴、資格・所属をご紹介します。"};
export default function Page(){return <><PageHero eyebrow="DOCTOR" title="院長紹介" intro="口腔外科での診療経験を生かし、治療の選択肢を丁寧に説明することを大切にしています。"/><section className="doctor-detail"><div className="container doctor-detail-grid"><div className="doctor-detail-photo"><Image src="/images/doctor/ueda-daisuke-portrait.jpg" alt="うえだ歯科医院 院長 上田大介" fill sizes="(max-width: 760px) 100vw, 42vw"/></div><div><p className="eyebrow">DIRECTOR</p><h2>上田 大介</h2><p className="en-name">DAISUKE UEDA</p><p className="lead">患者さまが何に迷い、何を不安に感じているか。まずその背景を理解し、インプラント以外の方法も含めて相談できる診療を目指します。</p><p className="review-label">診療方針の文章は院長による最終確認前の案です。</p></div></div></section><InfoSection number="01" title="経歴"> <ol className="career-list">{doctor.career.map(x=><li key={x}>{x}</li>)}</ol></InfoSection><InfoSection number="02" title="資格・所属" muted><ul>{doctor.affiliations.map(x=><li key={x}>{x}</li>)}</ul><p className="medical-box">資格・所属の正式名称と現在の状況は、本番公開前に最終確認します。「日本口腔インプラント学会 所属」は専門医資格を示すものではありません。</p></InfoSection><CTA/></>}
