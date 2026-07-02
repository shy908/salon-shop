import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/salon-config";
import PageTransition from "@/components/PageTransition";

export default function ServicesPage() {
  const categories = Array.from(new Set(SERVICES.map((s) => s.category)));

  return (
    <PageTransition>
    <>
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8 md:pt-24">
        <p className="eyebrow">The menu</p>
        <h1 className="mt-4 font-serif text-5xl text-primary md:text-6xl">
          Services & pricing
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Every appointment includes consultation, wash, styling and, of course,
          tea. Prices below are starting rates — your stylist will confirm the
          final quote on the day.
        </p>
      </section>

      {categories.map((cat) => (
        <section key={cat} className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-3xl text-primary">{cat}</h2>
            <span className="gold-rule" aria-hidden />
          </div>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {SERVICES.filter((s) => s.category === cat).map((s) => (
              <li
                key={s.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-6 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-8"
              >
                <div className="min-w-0">
                  <h3 className="font-serif text-xl text-primary">{s.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {s.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground sm:hidden">
                    {s.duration} min
                  </p>
                </div>
                <p className="hidden text-sm text-muted-foreground sm:block">
                  {s.duration} min
                </p>
                <div className="flex items-center gap-4">
                  <p className="font-serif text-xl text-primary">R{s.price}</p>
                  <Link
                    to={`/booking?service=${s.id}`}
                    aria-label={`Book ${s.name}`}
                    className="hidden items-center gap-1 text-sm text-primary underline-offset-4 hover:text-gold hover:underline sm:inline-flex"
                  >
                    Book <ArrowRight size={14} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="rounded-md border border-border bg-secondary/40 p-8 text-center md:p-12">
          <h2 className="font-serif text-3xl text-primary">
            Not sure what to book?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Message us on WhatsApp with a photo of your hair and any inspiration.
            We'll suggest the right service and stylist.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/booking" className="btn-primary">Start booking</Link>
            <Link to="/contact" className="btn-outline">Contact us</Link>
          </div>
        </div>
      </section>
    </>
    </PageTransition>
  );
}