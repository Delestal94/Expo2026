import { About, AccessNotice, Ejes, Hero, SiteFooter } from "@/modules/landing";
import { MapSection } from "@/modules/interactive-map";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Ejes />
      <MapSection />
      <AccessNotice />
      <SiteFooter />
    </main>
  );
}
