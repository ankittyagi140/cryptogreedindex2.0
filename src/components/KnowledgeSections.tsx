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
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-xl">
      <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export default function KnowledgeSections() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-16 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
        <SectionHeading
          title={t("knowledgeFaqTitle")}
          subtitle={t("knowledgeFaqSubtitle")}
        />

        <Accordion
          type="single"
          collapsible
          className="rounded-xl border border-border bg-background/50"
        >
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="px-6 text-left text-base font-medium">
                {t(item.titleKey)}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-sm text-muted-foreground">
                {item.bodyKeys.map((key, index) => (
                  <p key={key} className={index === 0 ? undefined : "mt-3"}>
                    {t(key)}
                  </p>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
        <SectionHeading
          title={t("knowledgeFactorsTitle")}
          subtitle={t("knowledgeFactorsSubtitle")}
        />

        <Accordion
          type="single"
          collapsible
          className="rounded-xl border border-border bg-background/50"
        >
          {factorItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="px-6 text-left text-base font-medium">
                {t(item.titleKey)}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-sm text-muted-foreground">
                <p>{t(item.bodyKey)}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

