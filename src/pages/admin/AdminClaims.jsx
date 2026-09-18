import { useState, useEffect } from "react";
import { adminGetAllClaims, assignClaim, completeClaim } from "../../lib/marketplace.js";
import { WHATSAPP_NUMBER_LINK } from "../../data/content.js";
import StatusBadge from "../../components/marketplace/StatusBadge.jsx";

const CLAIM_STATUSES = ["All", "pending", "assigned", "completed"];

export default function AdminClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [actioning, setActioning] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await adminGetAllClaims({ status: filterStatus }).catch(() => []);
    setClaims(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filterStatus]);

  const filtered = claims.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.provider_name?.toLowerCase().includes(q) || c.service_requests?.title?.toLowerCase().includes(q);
  });

  const action = async (fn, ...args) => {
    setActioning(args[0]);
    await fn(...args).catch(() => {});
    await load();
    setActioning(null);
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-charcoal mb-6">Claims</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search provider or request…"
          className="rounded-xl border border-charcoal/15 bg-white px-4 py-2 text-sm outline-none focus:border-accent" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-charcoal/15 bg-white px-4 py-2 text-sm outline-none focus:border-accent capitalize">
          {CLAIM_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <span className="self-center text-sm text-graphite/60">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-charcoal/8 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center animate-pulse text-graphite">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-graphite">No claims found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F4F4F2] text-[11px] uppercase tracking-widest text-graphite border-b border-charcoal/8">
                <tr>
                  <th className="px-5 py-3 text-left">Provider</th>
                  <th className="px-4 py-3 text-left">Request</th>
                  <th className="px-4 py-3 text-left">Experience</th>
                  <th className="px-4 py-3 text-left">Background</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F9F9F7] transition">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-charcoal">{c.provider_name}</p>
                      <p className="text-[11px] text-graphite/60">{c.whatsapp_number}</p>
                      {c.portfolio_url && (
                        <a href={c.portfolio_url} target="_blank" rel="noreferrer" className="text-[11px] text-accent hover:underline">Portfolio →</a>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-charcoal">{c.service_requests?.title}</p>
                      <p className="text-[11px] text-graphite/60">{c.service_requests?.location}</p>
                      <StatusBadge status={c.service_requests?.status} className="mt-1" />
                    </td>
                    <td className="px-4 py-4 text-graphite">
                      {c.years_experience ? `${c.years_experience} yrs` : "—"}
                    </td>
                    <td className="px-4 py-4 max-w-[200px]">
                      <p className="text-graphite text-[12px] leading-relaxed line-clamp-3">{c.background}</p>
                    </td>
                    <td className="px-4 py-4"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5">
                        <a
                          href={`https://wa.me/${c.whatsapp_number?.replace(/\D/g, "")}`}
                          target="_blank" rel="noreferrer"
                          className="rounded-full bg-[#25D366] px-3 py-1 text-[11px] font-bold text-[#0b3d20] hover:brightness-110 text-center"
                        >
                          WhatsApp
                        </a>
                        {c.status === "pending" && (
                          <button
                            disabled={actioning === c.id}
                            onClick={() => action(assignClaim, c.id, c.request_id)}
                            className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-white hover:brightness-110 disabled:opacity-50"
                          >
                            {actioning === c.id ? "…" : "Assign"}
                          </button>
                        )}
                        {c.status === "assigned" && (
                          <button
                            disabled={actioning === c.id}
                            onClick={() => action(completeClaim, c.id, c.request_id)}
                            className="rounded-full bg-charcoal px-3 py-1 text-[11px] font-semibold text-white hover:bg-graphite disabled:opacity-50"
                          >
                            {actioning === c.id ? "…" : "Mark Done"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
