import { Link } from "react-router-dom";
import { ADDRESS, MAPS_URL } from "../data/content.js";

export default function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-white/10 bg-[#141416] py-10 text-cream/60">
      <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-5 px-4 sm:px-6 md:flex-row md:items-center">
        <div>
          <div className="font-display text-lg font-semibold text-cream">Work On Time</div>
          <p className="mt-1 max-w-md text-[13px] leading-relaxed">
            Custom furniture, honest repairs &amp; sliding aluminum doors — measured, built and installed
            by one team in Bansdroni, Kolkata.
          </p>
          <a href={MAPS_URL} target="_blank" rel="noreferrer" className="mt-2 block max-w-md text-[12px] leading-relaxed text-cream/40 hover:text-cream hover:underline">{ADDRESS} ↗</a>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Footer">
          <Link to="/services" className="inline-block py-2 hover:text-cream">Services</Link>
          <Link to="/services" className="inline-block py-2 hover:text-cream">Repairs</Link>
          <Link to="/services" className="inline-block py-2 hover:text-cream">Finishes</Link>
          <Link to="/work" className="inline-block py-2 hover:text-cream">Work</Link>
          <Link to="/contact" className="inline-block py-2 hover:text-cream">Contact</Link>
          <button onClick={toTop} className="inline-block py-2 hover:text-cream">Back to top ↑</button>
        </nav>
      </div>
    </footer>
  );
}
