import { Link } from "react-router-dom";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import team1 from "@/assets/team-4.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-5.jpg";
import { SALON } from "@/lib/salon-config";
import PageTransition from "@/components/PageTransition";

const team = [
  {
    img: team1,
    name: "Amara Nkosi",
    role: "Founder & Master Stylist",
    bio: "Fifteen years cutting hair across Cape Town, Paris and Cape Town again.",
  },
  {
    img: team2,
    name: "Daniel Reyes",
    role: "Colourist",
    bio: "Balayage specialist. Trained under Sassoon London.",
  },
  {
    img: team3,
    name: "Racheal Martins",
    role: "Nails & Skin Lead",
    bio: "Certified in Bio Sculpture gel and Environ facial protocols.",
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
    <>
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Our story</p>

            <h1 className="mt-4 font-serif text-5xl leading-tight text-primary md:text-6xl">
              Built on <span className="italic text-gold">time,</span> not
              turnover.
            </h1>

            <p className="mt-6 text-muted-foreground">
              Maison Salon opened in a small Kloof Street studio in 2018 with
              one belief: the chair is a place to slow down. Six years, three
              expansions and thousands of appointments later, that belief is
              still the whole business plan.
            </p>

            <p className="mt-4 text-muted-foreground">
              Every stylist here books one guest per hour. That's it. It means
              we can listen properly, redraw the plan if your morning changed
              your mind, and finish with the kind of blow-dry that lasts a week.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] overflow-hidden rounded-md">
              <img
                src={g4}
                alt="Salon interior detail with brass mirror"
                loading="lazy"
                width={900}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-10 aspect-[4/5] overflow-hidden rounded-md">
              <img
                src={g5}
                alt="Copper wash bowls and folded towels"
                loading="lazy"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Consultation first",
              c: "Every appointment opens with a proper conversation, a hair diagnostic and a cup of tea.",
            },
            {
              n: "02",
              t: "One guest at a time",
              c: "Your stylist won't disappear mid-service. You have their full attention.",
            },
            {
              n: "03",
              t: "Products that last",
              c: "We use Kevin Murphy, Olaplex, and a small edit of local botanicals — nothing you'll regret in a week.",
            },
          ].map((v) => (
            <div key={v.n} className="border-t border-gold pt-5">
              <p className="eyebrow text-gold">{v.n}</p>
              <h3 className="mt-3 font-serif text-2xl text-primary">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.c}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <p className="eyebrow">The team</p>

          <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">
            People you'll come back for.
          </h2>

          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <li key={m.name}>
                <div className="aspect-[4/5] overflow-hidden rounded-md">
                  <img
                    src={m.img}
                    alt={`Portrait of ${m.name}`}
                    loading="lazy"
                    width={800}
                    height={1000}
                    className="h-full w-full object-cover"
                  />
                </div>

                <h3 className="mt-5 font-serif text-2xl text-primary">
                  {m.name}
                </h3>

                <p className="eyebrow mt-1">{m.role}</p>

                <p className="mt-2 text-sm text-muted-foreground">
                  {m.bio}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-24 text-center md:px-8">
        <h2 className="font-serif text-4xl text-primary">Come say hello.</h2>

        <p className="mt-4 text-muted-foreground">
          You'll find us at {SALON.address}. Street parking or a two-minute walk
          from the V&amp;A shuttle stop.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/booking" className="btn-primary">
            Book a chair
          </Link>

          <Link to="/contact" className="btn-outline">
            Get directions
          </Link>
        </div>
      </section>
    </>
    </PageTransition>
  );
}