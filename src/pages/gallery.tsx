import { useState } from "react";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";
import g7 from "@/assets/gallery-7.jpg";
import g8 from "@/assets/gallery-8.jpg";
import g9 from "@/assets/gallery-9.jpg";
import { X } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const items = [
  { src: g7, alt: "Natural hair care", tag: "Natural", ratio: "aspect-[3/4]" },
  { src: g8, alt: "Glossy caramel waves, side profile", tag: "Braids", ratio: "aspect-[3/4]" },
  { src: g9, alt: "Glossy caramel waves, side profile", tag: "Braids", ratio: "aspect-[3/4]" },
  { src: g1, alt: "Glossy caramel waves, side profile", tag: "Colour", ratio: "aspect-[3/4]" },
  { src: g2, alt: "Balayage blow-out at the styling station", tag: "Blow-out", ratio: "aspect-[4/3]" },
  { src: g3, alt: "Nude French manicure on marble", tag: "Nails", ratio: "aspect-square" },
  { src: g4, alt: "Salon interior with brass mirror and dried pampas", tag: "The space", ratio: "aspect-[3/4]" },
  { src: g5, alt: "Copper wash bowls and folded towels", tag: "The space", ratio: "aspect-[4/3]" },
  { src: g6, alt: "Bridal updo with pearl pins", tag: "Bridal", ratio: "aspect-[3/4]" },
];

export default function GalleryPage() {
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const tags = ["All", ...Array.from(new Set(items.map((i) => i.tag)))];

  const visible = items
    .map((it, i) => ({ ...it, i }))
    .filter((it) => filter === "All" || it.tag === filter);

  return (
    <PageTransition>
    <>
      <section className="mx-auto max-w-7xl px-5 pb-6 pt-16 md:px-8 md:pt-24">
        <p className="eyebrow">Portfolio</p>
        <h1 className="mt-4 font-serif text-5xl text-primary md:text-6xl">
          From the chair.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          A rotating selection of recent work. Tap any image to see it larger.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((t) => {
            const on = filter === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setFilter(t)}
                aria-pressed={on}
                className={
                  "rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.14em] transition " +
                  (on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary")
                }
              >
                {t}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
          {visible.map((it) => (
            <li key={it.i} className="break-inside-avoid">
              <button
                type="button"
                onClick={() => setActive(it.i)}
                className={`group relative block w-full overflow-hidden rounded-md ${it.ratio} focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
                aria-label={`Enlarge: ${it.alt}`}
              >
                <img
                  src={it.src}
                  alt={it.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-primary/70 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-xs uppercase tracking-[0.18em] text-primary-foreground">
                    {it.tag}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={items[active].alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/85 p-4 backdrop-blur"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-background text-primary"
          >
            <X size={20} />
          </button>
          <img
            src={items[active].src}
            alt={items[active].alt}
            className="max-h-[85vh] max-w-full rounded-md object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
    </PageTransition>
  );
}