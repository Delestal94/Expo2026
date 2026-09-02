import {
  About,
  AccessInfo,
  Directions,
  Ejes,
  EventStructuredData,
  Hero,
  Partners,
  SectionNav,
  SiteFooter,
} from "@/modules/landing";
import { MapSection } from "@/modules/interactive-map";
import { PortalSection } from "@/modules/exhibitors";
import { GalleryPreview } from "@/modules/gallery";

export default function Home() {
  return (
    <main>
      <EventStructuredData />
      <SectionNav />
      <Hero />
      <About />
      <Ejes />
      <GalleryPreview />
      <MapSection />
      <Directions />
      <PortalSection />
      <AccessInfo />
      <Partners />
      <SiteFooter />
    </main>
  );
}
