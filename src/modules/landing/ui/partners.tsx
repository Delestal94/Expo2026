import Image from "next/image";
import { INSTITUTIONAL_PARTNERS, SPONSORS, type Logo } from "./partners-data";

function LogoGrid({ logos }: { logos: Logo[] }) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
      {logos.map((logo) => (
        <div
          key={logo.src}
          className="flex h-24 w-40 items-center justify-center rounded-2xl bg-paper p-4 grayscale transition duration-300 hover:grayscale-0"
        >
          <div className="relative h-full w-full">
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              sizes="160px"
              className="object-contain"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Partners() {
  return (
    <section className="border-t border-line px-6 py-24 sm:px-10 lg:px-16">
      <div className="text-center">
        <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
          Acompañan
        </span>
        <LogoGrid logos={INSTITUTIONAL_PARTNERS} />
      </div>

      <div className="mt-16 text-center">
        <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
          Nuestros sponsors
        </span>
        <LogoGrid logos={SPONSORS} />
      </div>
    </section>
  );
}
