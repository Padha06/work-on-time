import { useState } from "react";
import { Link } from "react-router-dom";
import RequestCard from "../components/marketplace/RequestCard.jsx";
import MarketplaceFilters from "../components/marketplace/MarketplaceFilters.jsx";

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
      <div className="h-5 w-3/4 rounded bg-charcoal/10 mb-3" />
      <div className="h-3 w-1/2 rounded bg-charcoal/8 mb-4" />
      <div className="h-3 w-full rounded bg-charcoal/8 mb-2" />
      <div className="h-3 w-5/6 rounded bg-charcoal/8 mb-6" />
      <div className="h-10 w-full rounded-full bg-charcoal/10" />
    </div>
  );
}

const TRUST = [
  { title: "No account needed", text: "Post or claim with just a name and a WhatsApp number." },
  { title: "Admin-reviewed requests", text: "Every request is approved within 24 hours to keep quality high." },
  { title: "WhatsApp-first contact", text: "Providers introduce themselves with a prefilled message. You choose." },
];

const CLAIM_STEPS = [
  { n: "01", title: "Browse & filter", text: "Filter open requests by service type, location and urgency." },
  { n: "02", title: "Claim with a short form", text: "Name, experience and background — takes a minute, no account." },
  { n: "03", title: "Say hello on WhatsApp", text: "A prefilled intro message is generated. Send it and discuss scope." },
];

export default function MarketplacePage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="pt-16">
      {/* Header — light, two-audience split */}
      <section className="bg-cream py-20">
        <div className="mx-auto grid max-w-content items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="reveal max-w-2xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Marketplace</p>
            <h1 className="font-display mt-2 font-semibold tracking-tight text-charcoal text-[clamp(2rem,7vw,3.75rem)]">
              Need a job done? Post it.<br />
              Can do the job? Claim it.
            </h1>
            <p className="mt-4 max-w-xl text-graphite">
              An open board of real craftwork requests across Kolkata. Seekers post for free, providers claim the work that fits their skills.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/post-request"
                className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110"
              >
                Post a Request
              </Link>
              <Link
                to="/how-it-works"
                className="rounded-full border border-charcoal/15 px-6 py-3 text-[15px] font-semibold text-charcoal transition hover:bg-charcoal hover:text-white"
              >
                How claiming works
              </Link>
            </div>
          </div>
          <div className="reveal grid gap-4">
            {TRUST.map((t) => (
              <div key={t.title} className="flex gap-3 rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-green-100 font-bold text-green-700">✓</span>
                <div>
                  <h2 className="font-bold text-charcoal">{t.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-graphite">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          {/* Filters */}
          <MarketplaceFilters onResults={setResults} onLoading={setLoading} />

          {/* Results */}
          <div className="mt-8">
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : results.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-5xl mb-4">🔨</div>
                <h3 className="font-display text-2xl font-semibold text-charcoal">No open requests right now.</h3>
                <p className="mt-2 text-graphite">Check back soon, or be the first to post a request.</p>
                <Link
                  to="/post-request"
                  className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110"
                >
                  Post a Request →
                </Link>
              </div>
            ) : (
              <>
                <p className="mb-5 text-sm text-graphite/70">{results.length} open request{results.length !== 1 ? "s" : ""}</p>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((r) => <RequestCard key={r.id} request={r} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How claiming works */}
      <section className="section-pad bg-charcoal text-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">For providers</p>
              <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
                Three steps to your next job.
              </h2>
            </div>
            <Link to="/how-it-works" className="text-sm font-semibold text-aluminum hover:text-white hover:underline">
              Full guide →
            </Link>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {CLAIM_STEPS.map((s) => (
              <li key={s.n} className="reveal rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="font-display text-4xl font-semibold text-accent">{s.n}</div>
                <h3 className="mt-2 text-lg font-bold text-cream">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-cream/65">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6 text-center">
          <div className="reveal max-w-xl mx-auto">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-charcoal">Have a job that needs doing?</h2>
            <p className="mt-3 text-graphite">Post your request and let skilled providers come to you.</p>
            <Link
              to="/post-request"
              className="mt-6 inline-block rounded-full bg-accent px-8 py-4 text-[15px] font-bold text-white transition hover:brightness-110"
            >
              Post a Request →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
