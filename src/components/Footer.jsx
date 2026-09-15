export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#141416] py-10 text-cream/60">
      <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-5 px-4 sm:px-6 md:flex-row md:items-center">
        <div>
          <div className="font-display text-lg font-semibold text-cream">Work On Time [Demo]</div>
          <p className="mt-1 max-w-md text-[13px] leading-relaxed">
            Pitch demo — single page per build spec. Spline remix slot via <code>VITE_SPLINE_SCENE_URL</code>.
            R3F boilerplate pattern (Drei + GSAP) reserved for the stretch configurator, now merged live into §5.
          </p>
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
