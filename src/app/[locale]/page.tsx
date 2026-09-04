import { setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import {
  About,
  AccessInfo,
  Contact,
  Ejes,
  EventStructuredData,
  Hero,
  SectionNav,
  SiteFooter,
} from "@/modules/landing";
import { MapSection } from "@/modules/interactive-map";
import { PortalSection } from "@/modules/exhibitors";
import { GalleryPreview } from "@/modules/gallery";
import { NewsSection } from "@/modules/news";
import { ProgramSection } from "@/modules/business-rounds";

type Locale = (typeof routing.locales)[number];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <EventStructuredData />
      <SectionNav />
      <Hero />
      <About />
      <Ejes />
      <NewsSection />
      <GalleryPreview />
      <MapSection />
      <ProgramSection />
      <PortalSection />
      <AccessInfo />
      <Contact />
      <SiteFooter />
    </main>
  );
}
