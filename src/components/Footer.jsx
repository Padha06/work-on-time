import { ADDRESS } from "../data/content.js";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#141416] py-10 text-cream/60">
      <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-5 px-4 sm:px-6 md:flex-row md:items-center">
        <div>
          <div className="font-display text-lg font-semibold text-cream">Work On Time</div>
          <p className="mt-1 max-w-md text-[13px] leading-relaxed">
            Custom furniture, honest repairs &amp; sliding aluminum doors — measured, built and installed
            by one team in Bansdroni, Kolkata.
          </p>
          <p className="mt-2 max-w-md text-[12px] leading-relaxed text-cream/40">{ADDRESS}</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Footer">
          <a href="#services" className="hover:text-cream">Services</a>
          <a href="#before-after" className="hover:text-cream">Repairs</a>
          <a href="#finishes" className="hover:text-cream">Finishes</a>
          <a href="#work" className="hover:text-cream">Work</a>
          <a href="#contact" className="hover:text-cream">Contact</a>
          <a href="#top" className="hover:text-cream">Back to top ↑</a>
        </nav>
      </div>
    </footer>
  );
}
