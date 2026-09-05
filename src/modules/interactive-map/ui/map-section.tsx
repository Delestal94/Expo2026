import { EntranceVein } from "@/lib/ui/entrance-vein";
import { VenueMap } from "./venue-map";

export async function MapSection() {
  return (
    <section
      id="mapa"
      className="relative border-t border-line px-4 sm:px-6 lg:px-8 xl:px-12 py-3 sm:py-4 lg:py-5 w-full min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-between overflow-hidden"
    >
      <EntranceVein color="var(--color-lavender)" />
      <div className="w-full h-full flex-1 flex flex-col min-h-0">
        <VenueMap />
      </div>
    </section>
  );
}
