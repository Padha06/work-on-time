import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { waLink } from "../data/content.js";

const LINKS = [
  ["Services", "/services"],
  ["Marketplace", "/marketplace"],
  ["How It Works", "/how-it-works"],
  ["Work", "/work"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-charcoal/90 text-cream backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" onClick={close}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-aluminum/15">
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <rect x="6" y="4" width="8" height="24" rx="1.5" fill="#C7CBCF" />
              <rect x="18" y="4" width="8" height="24" rx="1.5" fill="#A9764E" />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[17px] font-semibold tracking-tight">Work On Time</span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-aluminum/80">Furniture · Marketplace</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 text-sm font-medium lg:flex" aria-label="Primary">
          {LINKS.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `transition hover:text-white ${isActive ? "text-white" : "text-cream/75"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/admin/login"
            className="inline-flex min-h-[44px] items-center rounded-full px-4 py-2 text-[13px] font-semibold text-cream/50 transition hover:text-white"
          >
            Admin
          </Link>
          <Link
            to="/post-request"
            className="inline-flex min-h-[44px] items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Post a Request
          </Link>
          <a
            href={waLink("your services")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[44px] items-center rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/15"
          >
            WhatsApp us
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className="text-xl leading-none">{open ? "×" : "☰"}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-white/10 px-4 py-3 lg:hidden" aria-label="Mobile">
          <div className="grid gap-1">
            {LINKS.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                onClick={close}
                className={({ isActive }) =>
                  `flex min-h-[44px] items-center rounded-lg px-3 py-2.5 text-[15px] font-medium transition hover:bg-white/10 ${
                    isActive ? "text-white bg-white/10" : "text-cream/90"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/post-request"
              onClick={close}
              className="mt-1 flex min-h-[44px] items-center justify-center rounded-lg bg-accent px-3 py-2.5 text-center text-[15px] font-semibold text-white"
            >
              Post a Request
            </Link>
            <a
              href={waLink("your services")}
              target="_blank"
              rel="noreferrer"
              onClick={close}
              className="mt-1 flex min-h-[44px] items-center justify-center rounded-lg border border-white/25 px-3 py-2.5 text-center text-[15px] font-semibold"
            >
              WhatsApp us
            </a>
            <Link
              to="/admin/login"
              onClick={close}
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-lg px-3 py-2 text-center text-[13px] font-medium text-cream/40"
            >
              Admin Dashboard
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
