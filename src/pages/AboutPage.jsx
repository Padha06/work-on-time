import Process from "../components/Process.jsx";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="pt-16">
      <section className="bg-charcoal py-20 text-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal max-w-2xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">About Us</p>
            <h1 className="font-display mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
              Built like furniture.<br />
              <span className="text-aluminum">Sealed like engineering.</span>
            </h1>
            <p className="mt-4 text-cream/70 max-w-xl">
              Work On Time is a Nairobi-based craftwork studio and marketplace. We build custom furniture, restore tired pieces,
              and install aluminum and sliding doors — all by one team, with one quote, and no surprises.
            </p>
          </div>
        </div>
      </section>

      <Process />

      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal max-w-2xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">The Marketplace</p>
            <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight text-charcoal md:text-5xl">
              More than a service provider.
            </h2>
            <p className="mt-4 text-graphite">
              Work On Time also runs a marketplace connecting people who need craftwork done with skilled independent providers across Nairobi.
              Whether you need a job done or can do one — the platform is designed to make that connection fast, safe, and WhatsApp-first.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/marketplace" className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110">
                Browse Marketplace
              </Link>
              <Link to="/how-it-works" className="rounded-full border border-charcoal/15 px-6 py-3 text-[15px] font-semibold text-charcoal transition hover:bg-charcoal hover:text-white">
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
