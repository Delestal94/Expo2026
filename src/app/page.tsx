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

export default function Home() {
  return (
    <main>
      <EventStructuredData />
      <Hero />
      <About />
      <Ejes />
      <MapSection />
      <PortalSection />
      <AccessInfo />
      <SiteFooter />
    </main>
  );
}
