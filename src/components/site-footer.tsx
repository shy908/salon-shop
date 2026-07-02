import { Link } from "react-router-dom"
import { Mail, Phone, MapPin } from "lucide-react";
import { SALON } from "@/lib/salon-config";

// Custom inline SVG components to replace the missing lucide-react brand icons
function InstagramIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <p className="eyebrow text-primary-foreground/70">Maison Salon</p>
          <h2 className="mt-3 font-serif text-3xl">
            An atelier for hair, hands &amp; glow.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/70">
            A calm room in the middle of the city where each guest is greeted by
            name and every appointment ends with tea.
          </p>
        </div>

        <div>
          <h3 className="eyebrow text-primary-foreground/70">Visit</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/85">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden />
              <span>{SALON.address}</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden />
              <a href={`tel:${SALON.phone}`} className="hover:text-gold">
                {SALON.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden />
              <a href={`mailto:${SALON.email}`} className="hover:text-gold">
                {SALON.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-primary-foreground/70">Menu</h3>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/85">
            <li><Link to="/services" className="hover:text-gold">Services</Link></li>
            <li><Link to="/about" className="hover:text-gold">About</Link></li>
            <li><Link to="/gallery" className="hover:text-gold">Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link to="/booking" className="hover:text-gold">Book an appointment</Link></li>
          </ul>
          <div className="mt-6 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-full border border-primary-foreground/30 hover:border-gold hover:text-gold"
            >
              <InstagramIcon size={16} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Facebook"
              className="grid h-9 w-9 place-items-center rounded-full border border-primary-foreground/30 hover:border-gold hover:text-gold"
            >
              <FacebookIcon size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-5 py-6 text-xs text-primary-foreground/60 md:flex-row md:items-center md:px-8">
          <p>© {new Date().getFullYear()} Maison Salon. All rights reserved.</p>
          <p>Crafted with care in Cape Town.</p>
        </div>
      </div>
    </footer>
  );
}