import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

const URGENCY_COLOR = {
  high:   "text-red-600",
  medium: "text-amber-600",
  low:    "text-green-700",
};

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function RequestCard({ request }) {
  const urgency = request.urgency?.toLowerCase() || "medium";
  const shortDesc = request.description?.length > 100
    ? request.description.slice(0, 100) + "…"
    : request.description;

  return (
    <article className="reveal group flex flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex-1 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 font-display text-[17px] font-semibold leading-snug text-charcoal group-hover:text-accent transition-colors break-words">
            {request.title}
          </h3>
          <StatusBadge status={request.status} className="shrink-0" />
        </div>

        {/* Meta row */}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-graphite">
          <span className="font-semibold text-aluminum">{request.service_type}</span>
          <span>·</span>
          <span>{request.location}</span>
          <span>·</span>
          <span className={`font-semibold ${URGENCY_COLOR[urgency]}`}>
            {urgency.toUpperCase()} URGENCY
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-graphite">{shortDesc}</p>

        {/* Footer row */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            {request.budget && (
              <p className="text-[13px] font-semibold text-wood">{request.budget}</p>
            )}
            <p className="text-[11px] text-graphite/60">{formatDate(request.created_at)}</p>
          </div>
          <span className="text-[12px] text-graphite/60">
            {request.claim_count ?? 0} provider{request.claim_count !== 1 ? "s" : ""} claimed
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-charcoal/8 px-5 py-3">
        <Link
          to={`/marketplace/request/${request.id}`}
          className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-charcoal py-2.5 text-center text-[13px] font-semibold text-white transition hover:bg-accent"
        >
          Claim This Work →
        </Link>
      </div>
    </article>
  );
}
