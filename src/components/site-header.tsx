// src/components/site-header.tsx
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SALON } from "@/lib/salon-config";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label={`${SALON.name} — home`}
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold text-gold font-serif text-lg"
          >
            M
          </span>
          <span className="font-serif text-xl leading-none tracking-tight">
            {SALON.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `relative text-sm tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:bg-gold after:transition-transform hover:after:scale-x-100 ${
                  isActive
                    ? "text-primary after:scale-x-100"
                    : "text-muted-foreground hover:text-primary after:scale-x-0"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link to="/booking" className="btn-primary">
            Book now
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="grid h-11 w-11 place-items-center rounded-md border border-border text-primary md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-border/60 bg-background md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-3 text-base ${
                      isActive ? "bg-secondary text-primary" : ""
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <Link to="/booking" onClick={() => setOpen(false)} className="btn-primary w-full">
                Book now
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}