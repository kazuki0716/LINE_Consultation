"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { faqs } from "@/data/site";

export function FAQ({ limit }: { limit?: number }) {
  return <Accordion.Root type="single" collapsible className="faq-list">{faqs.slice(0, limit).map(([q, a], i) => <Accordion.Item value={`faq-${i}`} key={q} className="faq-item"><Accordion.Header><Accordion.Trigger className="faq-trigger"><span><small>Q{String(i + 1).padStart(2, "0")}</small>{q}</span><Plus aria-hidden="true"/></Accordion.Trigger></Accordion.Header><Accordion.Content className="faq-content"><div>{a}</div></Accordion.Content></Accordion.Item>)}</Accordion.Root>;
}
