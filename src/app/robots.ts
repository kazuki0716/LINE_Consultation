import type { MetadataRoute } from "next";
import { site } from "@/data/site";
export default function robots():MetadataRoute.Robots{const production=process.env.NEXT_PUBLIC_PRODUCTION==="true";return production?{rules:{userAgent:"*",allow:"/",disallow:["/articles/implant-vs-denture","/articles/implant-treatment-period","/articles/implant-contraindications"]},sitemap:`${site.siteUrl}/sitemap.xml`}:{rules:{userAgent:"*",disallow:"/"}}}
