import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  User,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { SERVICES, SALON } from "@/lib/salon-config";
import PageTransition from "@/components/PageTransition";

/* --------------------------------- helpers -------------------------------- */

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function humanDate(d: Date) {
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}
function isSameDay(a: Date, b: Date) {
  return ymd(a) === ymd(b);
}
function startOfMonth(y: number, m: number) {
  return new Date(y, m, 1);
}

function hoursForDate(d: Date) {
  const idx = (d.getDay() + 6) % 7; // Mon=0 … Sun=6, matches SALON.hours order
  return SALON.hours[idx];
}

function buildSlots(d: Date, durationMin: number): string[] {
  const h = hoursForDate(d);
  if (h.closed) return [];
  const [oh, om] = h.open.split(":").map(Number);
  const [ch, cm] = h.close.split(":").map(Number);
  const start = oh * 60 + om;
  const end = ch * 60 + cm - durationMin;
  const step = 30;
  const slots: string[] = [];
  for (let t = start; t <= end; t += step) {
    const hh = Math.floor(t / 60);
    const mm = t % 60;
    slots.push(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
  }
  return slots;
}

// Deterministic pseudo-unavailability so preview always shows disabled slots.
function unavailableSlots(dateKey: string, allSlots: string[]): Set<string> {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  const taken = new Set<string>();
  const n = Math.min(allSlots.length, 2 + (hash % 3));
  for (let i = 0; i < n; i++) {
    taken.add(allSlots[(hash + i * 7) % allSlots.length]);
  }
  return taken;
}

/* -------------------------------- component ------------------------------- */

const searchSchema = z.object({
  service: z.string().optional(),
});

const detailsSchema = z.object({
  name: z.string().trim().min(2, "Please share your name").max(80),
  phone: z
    .string()
    .trim()
    .min(6, "Please enter a valid phone number")
    .max(20)
    .regex(/^[+\d\s()-]+$/, "Digits, spaces, +, -, ( ) only"),
  email: z.string().trim().email("Please use a valid email").max(120),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export default function BookingPage() {
  const [searchParams] = useSearchParams();

  // Parse search parameters safely using standard react-router params hooks
  const presetService = useMemo(() => {
    const rawService = searchParams.get("service") || undefined;
    const parsed = searchSchema.safeParse({ service: rawService });
    return parsed.success ? parsed.data.service : undefined;
  }, [searchParams]);

  // Sync document head metadata
  useEffect(() => {
    document.title = "Book an Appointment — Maison Lumière";
    
    const updateMeta = (property: string, content: string, isOg = false) => {
      const selector = isOg ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        if (isOg) el.setAttribute("property", property);
        else el.setAttribute("name", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    updateMeta("description", "Reserve a chair at Maison Lumière. Choose your service, date and time — confirmation delivered on WhatsApp.");
    updateMeta("og:title", "Book — Maison Lumière", true);
    updateMeta("og:description", "Book online in under a minute. WhatsApp confirmation.", true);
  }, []);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [serviceId, setServiceId] = useState<string>(
    SERVICES.find((s) => s.id === presetService)?.id ?? SERVICES[0].id,
  );
  
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  
  const [viewMonth, setViewMonth] = useState<Date>(startOfMonth(today.getFullYear(), today.getMonth()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [details, setDetails] = useState({ name: "", phone: "", email: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<null | {
    ref: string;
    date: Date;
    time: string;
  }>(null);

  const service = SERVICES.find((s) => s.id === serviceId)!;

  const slots = useMemo(() => (selectedDate ? buildSlots(selectedDate, service.duration) : []), [selectedDate, service.duration]);
  const takenSlots = useMemo(
    () => (selectedDate ? unavailableSlots(ymd(selectedDate), slots) : new Set<string>()),
    [selectedDate, slots],
  );

  /* ------------------------------ calendar grid ----------------------------- */
  const monthGrid = useMemo(() => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const firstWeekday = first.getDay();
    const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
    const cells: Array<Date | null> = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewMonth]);

  function canGoPrev() {
    const prev = new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1);
    return prev >= startOfMonth(today.getFullYear(), today.getMonth());
  }

  function goNextStep() {
    if (step === 1) setStep(2);
    else if (step === 2 && selectedDate && selectedSlot) setStep(3);
    else if (step === 3) submit();
  }
  
  function goPrevStep() {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  }

  function submit() {
    const parsed = detailsSchema.safeParse(details);
    if (!parsed.success) {
      const es: Record<string, string> = {};
      for (const iss of parsed.error.issues) es[String(iss.path[0])] = iss.message;
      setErrors(es);
      toast.error("Please complete your details.");
      return;
    }
    if (!selectedDate || !selectedSlot) {
      toast.error("Please pick a date and time.");
      setStep(2);
      return;
    }
    setErrors({});
    const ref = "ML-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setConfirmed({ ref, date: selectedDate, time: selectedSlot });
    setStep(4);
    toast.success("Appointment reserved.");
  }

  function whatsappHref() {
    if (!confirmed) return "#";
    const msg = `Hello ${SALON.name}, I would like to confirm my booking:%0A%0A• Service: ${service.name}%0A• Date: ${humanDate(confirmed.date)}%0A• Time: ${confirmed.time}%0A• Name: ${details.name}%0A• Reference: ${confirmed.ref}%0A%0AThank you!`;
    return `https://wa.me/${SALON.whatsapp}?text=${msg}`;
  }

  return (
    <PageTransition>
    <>
      <section className="mx-auto max-w-5xl px-5 pb-8 pt-16 md:px-8 md:pt-24">
        <p className="eyebrow">Book online</p>
        <h1 className="mt-4 font-serif text-5xl text-primary md:text-6xl">
          Reserve a chair.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Four short steps. Confirmation goes straight to WhatsApp.
        </p>
      </section>

      {/* Stepper */}
      <section aria-label="Booking progress" className="mx-auto max-w-5xl px-5 md:px-8">
        <ol className="grid grid-cols-4 gap-2 text-[11px] uppercase tracking-[0.14em] sm:text-xs">
          {[
            { n: 1, label: "Service", icon: Sparkles },
            { n: 2, label: "Date & time", icon: CalendarDays },
            { n: 3, label: "Details", icon: User },
            { n: 4, label: "Confirmed", icon: Check },
          ].map(({ n, label, icon: Icon }) => {
            const active = step === n;
            const done = step > n;
            return (
              <li
                key={n}
                aria-current={active ? "step" : undefined}
                className={
                  "flex items-center gap-2 border-t-2 pt-3 transition-colors " +
                  (done || active ? "border-primary text-primary" : "border-border text-muted-foreground")
                }
              >
                <span className={"grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] " + (done ? "bg-primary text-primary-foreground" : active ? "border border-primary" : "border border-border")}>
                  {done ? <Check size={12} /> : <Icon size={12} />}
                </span>
                <span className="hidden truncate sm:inline">{label}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 md:px-8">
        <div className="rounded-md border border-border bg-card p-5 md:p-8">
          {step === 1 && (
            <div>
              <h2 className="font-serif text-2xl text-primary">Choose a service</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You can change this later — nothing is booked yet.
              </p>
              <fieldset className="mt-6">
                <legend className="sr-only">Services</legend>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {SERVICES.map((s) => {
                    const on = serviceId === s.id;
                    return (
                      <li key={s.id}>
                        <label
                          className={
                            "flex cursor-pointer items-start justify-between gap-4 rounded-md border p-4 transition " +
                            (on ? "border-primary bg-secondary/50 ring-1 ring-primary" : "border-border hover:border-primary/60")
                          }
                        >
                          <input
                            type="radio"
                            name="service"
                            value={s.id}
                            checked={on}
                            onChange={() => setServiceId(s.id)}
                            className="sr-only"
                          />
                          <div className="min-w-0">
                            <p className="eyebrow">{s.category}</p>
                            <p className="mt-1 font-serif text-lg text-primary">{s.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{s.duration} min</p>
                          </div>
                          <p className="shrink-0 font-serif text-lg text-primary">R{s.price}</p>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <div>
                <h2 className="font-serif text-2xl text-primary">Pick a date</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sundays are closed. Past dates are unavailable.
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      canGoPrev() &&
                      setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
                    }
                    disabled={!canGoPrev()}
                    aria-label="Previous month"
                    className="grid h-10 w-10 place-items-center rounded-md border border-border text-primary transition disabled:cursor-not-allowed disabled:opacity-40 hover:enabled:border-primary"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <p className="font-serif text-lg text-primary">
                    {monthNames[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
                    }
                    aria-label="Next month"
                    className="grid h-10 w-10 place-items-center rounded-md border border-border text-primary transition hover:border-primary"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div role="grid" aria-label="Booking calendar" className="mt-4">
                  <div className="grid grid-cols-7 text-center text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {dayNames.map((d) => (
                      <div key={d} className="py-2">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {monthGrid.map((d, i) => {
                      if (!d) return <div key={i} aria-hidden />;
                      const past = d < today;
                      const closed = hoursForDate(d).closed;
                      const disabled = past || closed;
                      const selected = selectedDate && isSameDay(selectedDate, d);
                      const isToday = isSameDay(d, today);
                      return (
                        <button
                          key={i}
                          type="button"
                          role="gridcell"
                          aria-selected={!!selected}
                          aria-disabled={disabled}
                          disabled={disabled}
                          onClick={() => {
                            setSelectedDate(d);
                            setSelectedSlot(null);
                          }}
                          className={
                            "relative aspect-square rounded-md text-sm transition " +
                            (disabled
                              ? "cursor-not-allowed bg-muted/40 text-muted-foreground/50 line-through"
                              : selected
                              ? "bg-primary text-primary-foreground shadow-soft"
                              : "hover:bg-secondary text-foreground") +
                            (isToday && !selected && !disabled ? " ring-1 ring-gold" : "")
                          }
                        >
                          {d.getDate()}
                          {closed && !past && (
                            <span className="sr-only"> (closed)</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" /> Selected</span>
                  <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm ring-1 ring-gold" /> Today</span>
                  <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-muted" /> Closed / past</span>
                </p>
              </div>

              <div>
                <h2 className="font-serif text-2xl text-primary">Pick a time</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedDate
                    ? `Available slots for ${humanDate(selectedDate)}`
                    : "Choose a date first to see available slots."}
                </p>

                <div className="mt-6">
                  {!selectedDate && (
                    <div className="grid place-items-center rounded-md border border-dashed border-border py-14 text-sm text-muted-foreground">
                      <Clock size={24} className="mb-2 text-muted-foreground/60" aria-hidden />
                      No date selected
                    </div>
                  )}
                  {selectedDate && slots.length === 0 && (
                    <p className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
                      We're closed on this day. Please choose another.
                    </p>
                  )}
                  {selectedDate && slots.length > 0 && (
                    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {slots.map((t) => {
                        const taken = takenSlots.has(t);
                        const on = selectedSlot === t;
                        return (
                          <li key={t}>
                            <button
                              type="button"
                              disabled={taken}
                              aria-pressed={on}
                              aria-disabled={taken}
                              onClick={() => setSelectedSlot(t)}
                              className={
                                "w-full rounded-md border px-2 py-2.5 text-sm transition " +
                                (taken
                                  ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground/60 line-through"
                                  : on
                                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                                  : "border-border hover:border-primary hover:bg-secondary")
                              }
                            >
                              {t}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-serif text-2xl text-primary">Your details</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We use your number to send a WhatsApp confirmation.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {(
                  [
                    { id: "name", label: "Full name", type: "text", auto: "name" },
                    { id: "phone", label: "Phone", type: "tel", auto: "tel" },
                    { id: "email", label: "Email", type: "email", auto: "email" },
                  ] as const
                ).map((f) => (
                  <div key={f.id} className={f.id === "email" ? "sm:col-span-2" : ""}>
                    <label htmlFor={f.id} className="eyebrow">{f.label}</label>
                    <input
                      id={f.id}
                      name={f.id}
                      type={f.type}
                      autoComplete={f.auto}
                      value={details[f.id as keyof typeof details] ?? ""}
                      onChange={(e) => setDetails((d) => ({ ...d, [f.id]: e.target.value }))}
                      aria-invalid={!!errors[f.id]}
                      aria-describedby={errors[f.id] ? `${f.id}-err` : undefined}
                      className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-gold/40"
                    />
                    {errors[f.id] && <p id={`${f.id}-err`} className="mt-1 text-xs text-destructive">{errors[f.id]}</p>}
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="eyebrow">Notes (optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={details.notes}
                    onChange={(e) => setDetails((d) => ({ ...d, notes: e.target.value }))}
                    placeholder="e.g. Inspiration links, allergies, or preferred stylist."
                    className="mt-2 w-full resize-y rounded-md border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-gold/40"
                  />
                </div>
              </div>

              {/* Summary */}
              <dl className="mt-8 grid gap-3 rounded-md border border-border bg-secondary/40 p-5 text-sm sm:grid-cols-3">
                <div>
                  <dt className="eyebrow">Service</dt>
                  <dd className="mt-1 font-serif text-lg text-primary">{service.name}</dd>
                  <dd className="text-xs text-muted-foreground">R{service.price} · {service.duration} min</dd>
                </div>
                <div>
                  <dt className="eyebrow">Date</dt>
                  <dd className="mt-1 font-serif text-lg text-primary">{selectedDate ? humanDate(selectedDate) : "—"}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Time</dt>
                  <dd className="mt-1 font-serif text-lg text-primary">{selectedSlot ?? "—"}</dd>
                </div>
              </dl>
            </div>
          )}

          {step === 4 && confirmed && (
            <div className="text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check size={26} />
              </span>
              <h2 className="mt-5 font-serif text-4xl text-primary">You're booked in.</h2>
              <p className="mt-2 text-muted-foreground">
                A reference has been created. Confirm on WhatsApp so we can pop it into the diary.
              </p>

              <dl className="mx-auto mt-8 grid max-w-lg gap-4 rounded-md border border-border bg-secondary/40 p-6 text-left sm:grid-cols-2">
                <div>
                  <dt className="eyebrow">Reference</dt>
                  <dd className="mt-1 font-serif text-lg text-primary">{confirmed.ref}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Guest</dt>
                  <dd className="mt-1 font-serif text-lg text-primary">{details.name}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Service</dt>
                  <dd className="mt-1 font-serif text-lg text-primary">{service.name}</dd>
                </div>
                <div>
                  <dt className="eyebrow">When</dt>
                  <dd className="mt-1 font-serif text-lg text-primary">
                    {humanDate(confirmed.date)} · {confirmed.time}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3 text-sm font-medium uppercase tracking-[0.08em] text-white transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  Confirm on WhatsApp
                </a>
                <Link to="/" className="btn-outline">Back to home</Link>
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                Need to change or cancel? Reply on WhatsApp with your reference.
              </p>
            </div>
          )}

          {/* Nav buttons */}
          {step !== 4 && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
              <button
                type="button"
                onClick={goPrevStep}
                disabled={step === 1}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="button"
                onClick={goNextStep}
                disabled={step === 2 && (!selectedDate || !selectedSlot)}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {step === 3 ? "Confirm booking" : "Continue"} <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
    </PageTransition>
  );
}