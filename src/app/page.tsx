import { About, AccessNotice, Ejes, Hero, SiteFooter } from "@/modules/landing";
import { MapSection } from "@/modules/interactive-map";
import { PortalSection } from "@/modules/exhibitors";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Ejes />
      <MapSection />
      <PortalSection />
      <AccessNotice />
      <SiteFooter />
    </main>
  );
}
