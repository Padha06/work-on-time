import { useState } from "react";
import { waLink } from "../data/content.js";

const LINKS = [
  ["Services", "#services"],
  ["Repairs", "#before-after"],
  ["Finishes", "#finishes"],
  ["Work", "#work"],
  ["Process", "#process"],
  ["Reviews", "#reviews"],
  ["Contact", "#contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-charcoal/85 text-cream backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-aluminum/15">
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <rect x="6" y="4" width="8" height="24" rx="1.5" fill="#C7CBCF" />
              <rect x="18" y="4" width="8" height="24" rx="1.5" fill="#A9764E" />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[17px] font-semibold tracking-tight">Work On Time</span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-aluminum/80">Furniture · Aluminum Doors</span>
          </span>
        </a>
        <nav className="hidden items-center gap-5 text-sm font-medium lg:flex" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} className="text-cream/80 transition hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={waLink("custom furniture")}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            WhatsApp us
          </a>
        </div>
        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className="text-xl leading-none">{open ? "×" : "☰"}</span>
        </button>
      </div>
      {open && (
        <nav className="border-t border-white/10 px-4 py-3 lg:hidden" aria-label="Mobile">
          <div className="grid gap-1">
            {LINKS.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-cream/90 hover:bg-white/10"
              >
                {label}
              </a>
            ))}
            <a
              href={waLink("custom furniture")}
              target="_blank"
              rel="noreferrer"
              className="mt-1 rounded-lg bg-accent px-3 py-2.5 text-center text-[15px] font-semibold text-white"
            >
              WhatsApp us
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
