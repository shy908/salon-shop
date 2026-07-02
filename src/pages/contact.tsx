import { useState } from "react";
import { MapPin, Phone, Mail, Send, Loader2, Check } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { SALON } from "@/lib/salon-config";
import PageTransition from "@/components/PageTransition";

const schema = z.object({
  name: z.string().trim().min(2, "Please share your name").max(80),
  email: z.string().trim().email("Please use a valid email"),
  message: z.string().trim().min(10, "A little more detail, please").max(1000),
});

export default function ContactPage() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
    });
    if (!parsed.success) {
      const es: Record<string, string> = {};
      for (const iss of parsed.error.issues) es[String(iss.path[0])] = iss.message;
      setErrors(es);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    setState("sending");
    setTimeout(() => {
      setState("sent");
      toast.success("Message sent. We'll be in touch within a day.");
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setState("idle"), 3500);
    }, 900);
  }

  return (
    <PageTransition>
    <>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 md:px-8 md:pt-24">
        <p className="eyebrow">Get in touch</p>
        <h1 className="mt-4 font-serif text-5xl text-primary md:text-6xl">
          Say hello.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          For bookings, WhatsApp is fastest — we usually reply within the hour.
          For anything else, send us a note.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 md:px-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/60 text-gold">
                <MapPin size={18} aria-hidden />
              </span>
              <div>
                <p className="eyebrow">Visit</p>
                <p className="mt-1 font-serif text-lg text-primary">
                  {SALON.address}
                </p>
                <a
                  href="https://maps.google.com/?q=42+Kloof+Street+Cape+Town"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/60 text-gold">
                <Phone size={18} aria-hidden />
              </span>
              <div>
                <p className="eyebrow">Call or WhatsApp</p>
                <a href={`tel:${SALON.phone}`} className="mt-1 block font-serif text-lg text-primary hover:text-gold">
                  {SALON.phone}
                </a>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/60 text-gold">
                <Mail size={18} aria-hidden />
              </span>
              <div>
                <p className="eyebrow">Email</p>
                <a href={`mailto:${SALON.email}`} className="mt-1 block font-serif text-lg text-primary hover:text-gold">
                  {SALON.email}
                </a>
              </div>
            </li>
          </ul>

          <div className="mt-10 rounded-md border border-border bg-card p-6">
            <h2 className="font-serif text-2xl text-primary">Opening hours</h2>
            <ul className="mt-4 divide-y divide-border text-sm">
              {SALON.hours.map((h) => (
                <li
                  key={h.day}
                  className="grid grid-cols-2 py-2.5"
                >
                  <span className="text-muted-foreground">{h.day}</span>
                  <span className={h.closed ? "text-right text-destructive" : "text-right text-primary"}>
                    {h.closed ? "Closed" : `${h.open} — ${h.close}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="rounded-md border border-border bg-card p-6 md:p-8">
          <h2 className="font-serif text-3xl text-primary">Send a note</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We answer everything within one working day.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="name" className="eyebrow">Your name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-err" : undefined}
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-gold/40"
              />
              {errors.name && <p id="name-err" className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="eyebrow">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-err" : undefined}
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-gold/40"
              />
              {errors.email && <p id="email-err" className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="message" className="eyebrow">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "msg-err" : undefined}
                className="mt-2 w-full resize-y rounded-md border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-gold/40"
              />
              {errors.message && <p id="msg-err" className="mt-1 text-xs text-destructive">{errors.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={state === "sending"}
            className="btn-primary mt-6 w-full disabled:opacity-70"
          >
            {state === "sending" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Sending…
              </>
            ) : state === "sent" ? (
              <>
                <Check size={16} /> Sent
              </>
            ) : (
              <>
                Send message <Send size={16} />
              </>
            )}
          </button>
        </form>
      </section>
    </>
    </PageTransition>
  );
}