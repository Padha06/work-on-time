import { Link } from "react-router-dom";
import Portfolio from "../components/Portfolio.jsx";
import CaseStudy from "../components/CaseStudy.jsx";
import Testimonials from "../components/Testimonials.jsx";
import { PORTFOLIO, STATS } from "../data/content.js";

export default function WorkPage() {
  return (
    <div className="pt-16">
      {/* Header — proof-first hero with photo + stats */}
      <section className="bg-charcoal py-20 text-cream">
        <div className="mx-auto grid max-w-content items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="reveal max-w-2xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Our Work</p>
            <h1 className="font-display mt-2 text-4xl sm:text-5xl font-semibold tracking-tight md:text-6xl">
              Don't take our word.<br />
              <span className="text-aluminum">Take the photos.</span>
            </h1>
            <p className="mt-4 max-w-xl text-cream/70">
              Every project ends with a photo walkthrough — finished work, close-ups of joints and finishes, glide-tests on video. This wall is that habit, published.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contact" className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110">
                Start Your Project
              </Link>
              <Link to="/services" className="rounded-full border border-white/25 px-6 py-3 text-[15px] font-semibold transition hover:bg-white/10">
                What We Build
              </Link>
            </div>
          </div>
          <div className="reveal overflow-hidden rounded-3xl border border-white/10 shadow-xl">
            <img src={PORTFOLIO[0].img} alt={PORTFOLIO[0].title} className="h-72 w-full object-cover lg:h-80" />
            <div className="flex items-center justify-between bg-white/5 px-5 py-3 backdrop-blur">
              <p className="text-sm font-semibold text-cream">{PORTFOLIO[0].title}</p>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-aluminum">{PORTFOLIO[0].cat}</span>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <dl className="reveal mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="order-2 mt-1 block text-[13px] text-cream/60">{s.label}</dt>
                <dd className="font-display order-1 text-4xl font-semibold text-white">{s.value}{s.suffix}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CaseStudy />
      <Portfolio />
      <Testimonials />

      {/* Closing CTA */}
      <section className="section-pad bg-charcoal text-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6 text-center">
          <div className="reveal mx-auto max-w-xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight">Have a similar job in mind?</h2>
            <p className="mt-3 text-cream/70">Send photos and rough sizes on WhatsApp — first estimate within a day.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/post-request" className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110">
                Post a Request
              </Link>
              <Link to="/contact" className="rounded-full border border-white/25 px-6 py-3 text-[15px] font-semibold transition hover:bg-white/10">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
