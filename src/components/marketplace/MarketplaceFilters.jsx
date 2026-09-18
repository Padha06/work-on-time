import { useState, useEffect, useCallback } from "react";
import { getOpenRequests } from "../../lib/marketplace.js";
import RequestCard from "../../components/marketplace/RequestCard.jsx";

const SERVICE_TYPES = ["All", "Furniture Repair", "Custom Furniture", "Aluminum Doors", "Sliding Doors", "Restoration", "Other"];
const URGENCIES = ["All", "high", "medium", "low"];

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

export default function MarketplaceFilters({ onResults, onLoading }) {
  const [search, setSearch] = useState("");
  const [serviceType, setServiceType] = useState("All");
  const [urgency, setUrgency] = useState("All");

  const fetchResults = useCallback(async () => {
    onLoading(true);
    try {
      const data = await getOpenRequests({ serviceType, urgency, search });
      onResults(data);
    } catch {
      onResults([]);
    } finally {
      onLoading(false);
    }
  }, [search, serviceType, urgency]);

  useEffect(() => {
    const t = setTimeout(fetchResults, 300);
    return () => clearTimeout(t);
  }, [fetchResults]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-graphite/40">🔍</span>
        <input
          type="search"
          placeholder="Search requests…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-charcoal/15 bg-white py-4 pl-10 pr-4 text-[15px] outline-none focus:border-accent shadow-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[180px]">
          <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-widest text-graphite">Service Type</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-accent"
          >
            {SERVICE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-widest text-graphite">Urgency</label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-accent capitalize"
          >
            {URGENCIES.map((u) => <option key={u} value={u} className="capitalize">{u === "All" ? "All" : u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
