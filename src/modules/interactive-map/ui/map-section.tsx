import { EntranceVein } from "@/lib/ui/entrance-vein";
import { VenueMap } from "./venue-map";

export async function MapSection() {
  return (
    <section
      id="mapa"
      className="relative w-full h-auto motion-safe:sm:min-h-[135vh] border-t border-line"
    >
      <div className="lg:sticky lg:top-0 w-full h-auto lg:min-h-screen lg:h-screen px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-5 lg:py-5 flex flex-col justify-between overflow-visible">
        <EntranceVein color="var(--color-lavender)" />
        <div className="w-full h-auto lg:h-full flex-1 flex flex-col min-h-0">
          <VenueMap />
        </div>
      </div>
    </section>
  );
}
