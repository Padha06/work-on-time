import { Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import TrustStrip from "../components/TrustStrip.jsx";
import Testimonials from "../components/Testimonials.jsx";
import { SERVICES, PORTFOLIO, BEFORE_AFTER, waLink } from "../data/content.js";

// Marketplace preview — static illustrative cards (real data on /marketplace)
const PREVIEW_REQUESTS = [
  { id: "p1", title: "Dining Table Repair — Wobbling Legs", type: "Furniture Repair", location: "Bansdroni, Kolkata", urgency: "high", budget: "₹8,000 flexible", claims: 4 },
  { id: "p2", title: "Custom Wardrobe — Master Bedroom", type: "Custom Furniture", location: "Tollygunge, Kolkata", urgency: "medium", budget: "₹45,000", claims: 2 },
  { id: "p3", title: "Balcony Sliding Door Install", type: "Sliding Doors", location: "Garia, Kolkata", urgency: "low", budget: "₹22,000", claims: 6 },
];

const URGENCY_COLOR = { high: "bg-red-100 text-red-700", medium: "bg-amber-100 text-amber-700", low: "bg-green-100 text-green-700" };

export default function HomePage() {
  return (
    <>
      {/* ── Hero (unchanged) ─────────────────────────────────────── */}
      <Hero />

      {/* ── Trust strip (unchanged) ──────────────────────────────── */}
      <TrustStrip />

      {/* ── Services Preview ─────────────────────────────────────── */}
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-charcoal md:text-5xl">
                One team for wood, repair &amp; aluminum.
              </h2>
            </div>
            <Link to="/services" className="text-sm font-semibold text-accent hover:underline">
              View all services →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Link
                key={s.id}
                to="/services"
                className="reveal group overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold text-charcoal">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-graphite">{s.blurb}</p>
                  <p className="mt-2 text-[13px] font-semibold text-accent">✓ {s.points[0]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Repair proof teaser (real before/after) ────────────────── */}
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-charcoal md:text-5xl">
                See the comeback.
              </h2>
              <p className="mt-3 max-w-xl text-graphite">
                Real repair transformations from our workshop — tired &amp; damaged on the left, handed back on the right.
              </p>
            </div>
            <Link to="/services" className="text-sm font-semibold text-accent hover:underline">
              Try the slider →
            </Link>
          </div>
          <div className="reveal mt-8 grid grid-cols-2 gap-4">
            {[
              { src: BEFORE_AFTER[0].beforeImg, label: "Before", tone: "bg-black/60" },
              { src: BEFORE_AFTER[0].img, label: "After", tone: "bg-accent" },
            ].map((p) => (
              <figure key={p.label} className="relative overflow-hidden rounded-2xl border border-charcoal/10 shadow-sm">
                <img src={p.src} alt={`${BEFORE_AFTER[0].title} — ${p.label.toLowerCase()}`} loading="lazy" className="h-56 w-full object-cover sm:h-72" />
                <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white ${p.tone}`}>
                  {p.label}
                </span>
              </figure>
            ))}
          </div>
          <p className="reveal mt-4 text-sm font-medium text-graphite">{BEFORE_AFTER[0].title}</p>
        </div>
      </section>

      {/* ── Marketplace Preview ──────────────────────────────────── */}
      <section className="section-pad bg-charcoal text-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal max-w-2xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Need a job done? Post it.<br />
              <span className="text-aluminum">Can you do the job? Claim it.</span>
            </h2>
            <p className="mt-3 text-cream/70">
              Work On Time is also a marketplace — connecting people who need craftwork done with skilled providers.
              No account required. Post a request, providers find you.
            </p>
            <p className="mt-2 text-sm text-cream/50">
              Want Work On Time directly? Get a quote. Open to any skilled provider? Post it — free, 2 minutes, no account.
            </p>
          </div>
          <div className="reveal mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PREVIEW_REQUESTS.map((r) => (
              <div key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-snug text-cream">{r.title}</h3>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${URGENCY_COLOR[r.urgency]}`}>
                    {r.urgency}
                  </span>
                </div>
                <p className="mt-2 text-sm text-cream/60">{r.type} · {r.location}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-wood">{r.budget}</span>
                  <span className="text-[12px] text-cream/50">{r.claims} claimed</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[12px] text-cream/50">{r.claims} claimed</span>
                </div>
              </div>
            ))}
          </div>
          <div className="reveal mt-8 flex flex-wrap gap-3">
            <Link to="/marketplace" className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110">
              Browse Marketplace
            </Link>
            <Link to="/post-request" className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-white/15">
              Post a Request →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works Preview ─────────────────────────────────── */}
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal max-w-2xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight text-charcoal md:text-5xl">
              Three steps to get work done.
            </h2>
          </div>
          <div className="reveal mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { n: "01", title: "Post a Request", text: "Describe the job, add photos. No account needed. Takes 2 minutes." },
              { n: "02", title: "Providers Claim It", text: "Skilled providers browse and claim your open request." },
              { n: "03", title: "Connect on WhatsApp", text: "Providers introduce themselves via WhatsApp. You choose your provider." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl bg-white border border-charcoal/8 p-6 shadow-sm">
                <span className="text-[13px] font-bold text-accent">{s.n}</span>
                <h3 className="font-display mt-2 text-xl font-semibold text-charcoal">{s.title}</h3>
                <p className="mt-2 text-sm text-graphite">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="reveal mt-6">
            <Link to="/how-it-works" className="text-sm font-semibold text-accent hover:underline">
              See the full flow →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Work Preview ─────────────────────────────────────────── */}
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-4xl font-semibold tracking-tight text-charcoal md:text-5xl">
                A wall of finished jobs.
              </h2>
            </div>
            <Link to="/work" className="text-sm font-semibold text-accent hover:underline">
              View all work →
            </Link>
          </div>
          <div className="reveal mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {PORTFOLIO.slice(0, 3).map((p) => (
              <Link key={p.id} to="/work" className="group overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative overflow-hidden">
                  <img src={p.img} alt={p.title} loading="lazy" className="w-full object-cover h-48 transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">{p.cat}</span>
                </div>
                <div className="px-4 py-3 text-sm font-semibold text-charcoal">{p.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────── */}
      <Testimonials />

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="section-pad bg-charcoal text-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6 text-center">
          <div className="reveal max-w-2xl mx-auto">
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Need something built, repaired or installed?
            </h2>
            <p className="mt-4 text-cream/70">
              Post a request and let skilled providers come to you — or get a direct quote from Work On Time.
            </p>
            <p className="mt-2 text-[13px] font-semibold text-cream/50">
              Fixed quote before we start · Photo walkthrough on handover
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/post-request" className="rounded-full bg-accent px-8 py-4 text-[15px] font-bold text-white shadow-lg transition hover:brightness-110">
                Post a Request
              </Link>
              <Link to="/contact" className="rounded-full border border-white/25 bg-white/5 px-8 py-4 text-[15px] font-semibold text-white transition hover:bg-white/15">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
