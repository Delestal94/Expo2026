import {
  About,
  AccessInfo,
  Contact,
  Ejes,
  EventStructuredData,
  Faq,
  Hero,
  SectionNav,
  SiteFooter,
} from "@/modules/landing";
import { MapSection } from "@/modules/interactive-map";
import { PortalSection } from "@/modules/exhibitors";
import { GalleryPreview } from "@/modules/gallery";
import { NewsSection } from "@/modules/news";
import { ProgramSection } from "@/modules/business-rounds";

export default function Home() {
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
      <Faq />
      <SiteFooter />
    </main>
  );
}
