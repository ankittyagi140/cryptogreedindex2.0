"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

const faqItems = [
  {
    id: "faq-1",
    titleKey: "faq1Title",
    bodyKeys: ["faq1Body1", "faq1Body2", "faq1Body3"],
  },
  {
    id: "faq-2",
    titleKey: "faq2Title",
    bodyKeys: ["faq2Body1", "faq2Body2"],
  },
  {
    id: "faq-3",
    titleKey: "faq3Title",
    bodyKeys: ["faq3Body1", "faq3Body2"],
  },
  {
    id: "faq-4",
    titleKey: "faq4Title",
    bodyKeys: ["faq4Body1"],
  },
];

const factorItems = [
  {
    id: "factor-1",
    titleKey: "factor1Title",
    bodyKey: "factor1Body",
  },
  {
    id: "factor-2",
    titleKey: "factor2Title",
    bodyKey: "factor2Body",
  },
  {
    id: "factor-3",
    titleKey: "factor3Title",
    bodyKey: "factor3Body",
  },
  {
    id: "factor-4",
    titleKey: "factor4Title",
    bodyKey: "factor4Body",
  },
  {
    id: "factor-5",
    titleKey: "factor5Title",
    bodyKey: "factor5Body",
  },
  {
    id: "factor-6",
    titleKey: "factor6Title",
    bodyKey: "factor6Body",
  },
];

function SectionHeading({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <div className="max-w-xl">
      {badge && (
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {badge}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export default function KnowledgeSections() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
      {/* FAQ Section */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
        <SectionHeading
          title={t("knowledgeFaqTitle")}
          subtitle={t("knowledgeFaqSubtitle")}
          badge="FAQ"
        />

        <Accordion
          type="single"
          collapsible
          className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur"
        >
          {faqItems.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className={index === 0 ? "" : "border-t border-border/40"}
            >
              <AccordionTrigger className="px-6 text-left text-base font-medium hover:no-underline">
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  {t(item.titleKey)}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pl-16 text-sm leading-relaxed text-muted-foreground">
                {item.bodyKeys.map((key, i) => (
                  <p key={key} className={i === 0 ? undefined : "mt-3"}>
                    {t(key)}
                  </p>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Factors Section */}
      <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
        <SectionHeading
          title={t("knowledgeFactorsTitle")}
          subtitle={t("knowledgeFactorsSubtitle")}
          badge="How It Works"
        />

        <Accordion
          type="single"
          collapsible
          className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur"
        >
          {factorItems.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className={index === 0 ? "" : "border-t border-border/40"}
            >
              <AccordionTrigger className="px-6 text-left text-base font-medium hover:no-underline">
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  {t(item.titleKey)}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pl-16 text-sm leading-relaxed text-muted-foreground">
                <p>{t(item.bodyKey)}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
