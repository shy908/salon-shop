// src/pages/home.tsx
import { Link } from "react-router-dom";
import { ArrowRight, Scissors, Sparkles, Heart, Clock } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import g1 from "@/assets/gallery-2.jpg";
import g2 from "@/assets/gallery-8.jpg";
import g6 from "@/assets/gallery-9.jpg";
import { SERVICES, SALON } from "@/lib/salon-config";
import PageTransition from "@/components/PageTransition";

export default function Home() {
  const featured = SERVICES.slice(0, 4);

  return (
   <PageTransition>
      <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-14 md:px-8 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="flex flex-col justify-center">
            <p className="eyebrow">Est. 2018 · Cape Town</p>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-primary md:text-7xl">
              A salon that
              <span className="italic text-gold"> lingers.</span>
              <br />
              Never rushes.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              At Maison Salon we take the time to listen — to your hair, your
              week, your hopes for the evening ahead. Then we pour tea and begin.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/booking" className="btn-primary">
                Book an appointment <ArrowRight size={16} />
              </Link>
              <Link to="/services" className="btn-outline">
                View the menu
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8 text-sm">
              <div>
                <dt className="eyebrow">Chairs</dt>
                <dd className="mt-1 font-serif text-2xl text-primary">6</dd>
              </div>
              <div>
                <dt className="eyebrow">Stylists</dt>
                <dd className="mt-1 font-serif text-2xl text-primary">9</dd>
              </div>
              <div>
                <dt className="eyebrow">Since</dt>
                <dd className="mt-1 font-serif text-2xl text-primary">2018</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md shadow-lift">
              <img
                src={heroImg}
                alt="Sunlit salon interior with marble stations and brass fixtures"
                width={1600}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-md border border-border bg-card p-5 shadow-soft md:block">
              <p className="eyebrow">Open today</p>
              <p className="mt-2 font-serif text-xl text-primary">09:00 — 18:00</p>
              <p className="mt-1 text-xs text-muted-foreground">Walk-ins welcome anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro strip */}
      <section aria-label="What we do" className="border-y border-border bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-4 md:px-8">
          {[
            { icon: Scissors, title: "Cut & Colour", copy: "Precision cuts and hand-painted colour." },
            { icon: Sparkles, title: "Nails & Skin", copy: "Manicures, pedicures and glow facials." },
            { icon: Heart, title: "Bridal", copy: "Trials, day-of styling and touch-ups." },
            { icon: Clock, title: "Unrushed", copy: "One guest per stylist, per hour." },
          ].map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/60 text-gold">
                <Icon size={18} aria-hidden />
              </span>
              <div className="min-w-0">
                <h3 className="font-serif text-xl text-primary">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured services */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Signature services</p>
            <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">
              A short list of<br />what we love most.
            </h2>
          </div>
          <Link to="/services" className="btn-outline">Full menu</Link>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {featured.map((s) => (
            <li
              key={s.id}
              className="group relative rounded-md border border-border bg-card p-6 transition-all hover:border-gold hover:shadow-soft"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="eyebrow">{s.category}</p>
                  <h3 className="mt-2 font-serif text-2xl text-primary">{s.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl text-primary">R{s.price}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.duration} min</p>
                </div>
              </div>
              <Link
                to={`/booking?service=${s.id}`}
                className="mt-5 inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:text-gold hover:underline"
              >
                Book this <ArrowRight size={14} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Gallery peek */}
      <section className="bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Recent work</p>
              <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">
                From the chair.
              </h2>
            </div>
            <Link to="/gallery" className="btn-outline">See gallery</Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[g1, g2, g6].map((src, i) => (
              <div key={i} className="aspect-[4/5] overflow-hidden rounded-md">
                <img
                  src={src}
                  alt={["Glossy caramel waves", "Balayage blow-out", "Bridal updo with pearls"][i]}
                  loading="lazy"
                  width={900}
                  height={1200}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="mx-auto max-w-4xl px-5 py-24 text-center md:px-8">
        <p className="eyebrow">In their words</p>
        <blockquote className="mt-6 font-serif text-3xl leading-snug text-primary md:text-4xl">
          <span className="text-gold">"</span>
          I walked in for a trim and left feeling like a better version of
          myself. The tea was excellent. The colour was even better.
          <span className="text-gold">"</span>
        </blockquote>
        <p className="mt-6 text-sm text-muted-foreground">— Zanele M., loyal guest since 2020</p>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative overflow-hidden rounded-lg bg-primary px-8 py-16 text-primary-foreground md:px-16 md:py-20">
          <div
            aria-hidden
            className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl"
          />
          <div className="relative grid gap-8 md:grid-cols-[2fr_1fr] md:items-center">
            <div>
              <p className="eyebrow text-primary-foreground/70">Ready when you are</p>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl">
                Reserve a chair.
              </h2>
              <p className="mt-4 max-w-lg text-primary-foreground/75">
                Choose a date, pick your slot, and we'll be waiting with the
                kettle on. Confirmation lands on WhatsApp instantly.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-medium uppercase tracking-[0.08em] text-gold-foreground transition-transform hover:-translate-y-0.5"
              >
                Book now <ArrowRight size={16} />
              </Link>
              <a
                href={`tel:${SALON.phone}`}
                className="text-sm text-primary-foreground/70 hover:text-gold"
              >
                or call {SALON.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
    </PageTransition>
  );
}