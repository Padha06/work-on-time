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

export default function MarketplacePage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="bg-charcoal py-20 text-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Marketplace</p>
              <h1 className="font-display mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
                Find Work.<br />
                <span className="text-aluminum">Build Your Next Job.</span>
              </h1>
              <p className="mt-4 text-cream/70">
                Browse open service requests and claim work that matches your skills. No account needed.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/post-request"
                className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110 text-center"
              >
                Post a Request
              </Link>
              <Link
                to="/how-it-works"
                className="rounded-full border border-white/25 px-6 py-3 text-[15px] font-semibold text-center transition hover:bg-white/10"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="section-pad bg-cream">
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

      {/* Bottom CTA */}
      <section className="section-pad bg-white">
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
