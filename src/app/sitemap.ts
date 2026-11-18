import type { MetadataRoute } from "next";
import { site } from "@/data/site";
export default function sitemap():MetadataRoute.Sitemap{const paths=["","/about-implant","/comparison","/treatment","/cost","/doctor","/doctor/expertise","/faq","/articles","/access"];return paths.map(path=>({url:`${site.siteUrl}${path}`,lastModified:new Date(),changeFrequency:path===""?"weekly":"monthly",priority:path===""?1:.7}))}
