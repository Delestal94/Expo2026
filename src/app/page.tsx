import {
  About,
  AccessInfo,
  Ejes,
  EventStructuredData,
  Hero,
  SiteFooter,
} from "@/modules/landing";
import { MapSection } from "@/modules/interactive-map";
import { PortalSection } from "@/modules/exhibitors";
import { GalleryPreview } from "@/modules/gallery";

export default function Home() {
  return (
    <main>
      <EventStructuredData />
      <Hero />
      <About />
      <Ejes />
      <GalleryPreview />
      <MapSection />
      <PortalSection />
      <AccessInfo />
      <SiteFooter />
    </main>
  );
}
