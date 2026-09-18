import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getRequestById } from "../lib/marketplace.js";
import StatusBadge from "../components/marketplace/StatusBadge.jsx";
import ClaimModal from "../components/marketplace/ClaimModal.jsx";

const URGENCY_COLOR = { high: "text-red-600", medium: "text-amber-600", low: "text-green-700" };

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });
}

export default function RequestDetailPage() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRequestById(id)
      .then(setRequest)
      .catch(() => setError("Request not found or no longer available."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-20">
          <div className="animate-pulse space-y-4 max-w-2xl">
            <div className="h-4 w-24 rounded bg-charcoal/10" />
            <div className="h-8 w-3/4 rounded bg-charcoal/10" />
            <div className="h-4 w-1/2 rounded bg-charcoal/10" />
            <div className="h-32 w-full rounded bg-charcoal/10" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="pt-16 min-h-screen bg-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6 py-20 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-display text-2xl font-semibold text-charcoal">{error || "Request not found"}</h2>
          <Link to="/marketplace" className="mt-6 inline-block text-accent font-semibold hover:underline">← Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  const shortId = request.id.slice(0, 8).toUpperCase();
  const urgency = request.urgency?.toLowerCase() || "medium";
  const canClaim = ["open"].includes(request.status);

  return (
    <div className="pt-16 min-h-screen bg-cream">
      {/* Back link */}
      <div className="mx-auto max-w-content px-4 sm:px-6 pt-8">
        <Link to="/marketplace" className="text-sm font-semibold text-accent hover:underline">← Back to Marketplace</Link>
      </div>

      <div className="mx-auto max-w-content px-4 sm:px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="rounded-3xl bg-charcoal text-cream p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-aluminum">REQUEST #{shortId}</p>
                  <h1 className="font-display mt-2 text-3xl font-semibold leading-snug md:text-4xl">{request.title}</h1>
                </div>
                <StatusBadge status={request.status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-cream/70">
                <span>{request.service_type}</span>
                <span>·</span>
                <span>{request.location}</span>
                <span>·</span>
                <span className={`font-semibold ${URGENCY_COLOR[urgency]}`}>{urgency.toUpperCase()} URGENCY</span>
                <span>·</span>
                <span>Posted {formatDate(request.created_at)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-3xl bg-white border border-charcoal/8 p-8 shadow-sm">
              <h2 className="font-display text-xl font-semibold text-charcoal mb-4">Job Description</h2>
              <p className="text-graphite leading-relaxed whitespace-pre-wrap">{request.description}</p>
            </div>

            {/* Photos */}
            {request.images?.length > 0 && (
              <div className="rounded-3xl bg-white border border-charcoal/8 p-8 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-charcoal mb-4">Photos</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {request.images.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer">
                      <img src={url} alt={`Job photo ${i + 1}`} className="rounded-xl h-32 w-full object-cover hover:opacity-90 transition" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick facts */}
            <div className="rounded-3xl bg-white border border-charcoal/8 p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Quick Facts</h3>
              <dl className="space-y-3 text-sm">
                {request.budget && (
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-widest text-graphite/60">Budget</dt>
                    <dd className="mt-0.5 font-semibold text-wood text-base">{request.budget}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-widest text-graphite/60">Urgency</dt>
                  <dd className={`mt-0.5 font-semibold capitalize ${URGENCY_COLOR[urgency]}`}>{urgency}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-widest text-graphite/60">Location</dt>
                  <dd className="mt-0.5 text-charcoal">{request.location}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-widest text-graphite/60">Providers Claimed</dt>
                  <dd className="mt-0.5 font-semibold text-charcoal">{request.claim_count ?? 0}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-widest text-graphite/60">Status</dt>
                  <dd className="mt-0.5"><StatusBadge status={request.status} /></dd>
                </div>
              </dl>
            </div>

            {/* CTA */}
            {canClaim ? (
              <button
                onClick={() => setClaiming(true)}
                className="w-full rounded-full bg-accent py-4 text-[15px] font-bold text-white shadow-lg transition hover:brightness-110"
              >
                Claim This Work →
              </button>
            ) : (
              <div className="rounded-2xl bg-charcoal/8 p-4 text-center text-sm text-graphite">
                This request is <StatusBadge status={request.status} className="ml-1" /> and no longer accepting claims.
              </div>
            )}

            <p className="text-center text-[12px] text-graphite/50">
              No account required. Claim in 60 seconds.
            </p>
          </div>
        </div>
      </div>

      {claiming && <ClaimModal request={request} onClose={() => setClaiming(false)} />}
    </div>
  );
}
