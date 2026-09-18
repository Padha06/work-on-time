import { useState, useEffect } from "react";
import { adminGetAllRequests, approveRequest, rejectRequest, updateRequestStatus } from "../../lib/marketplace.js";
import { adminGetAllClaims } from "../../lib/marketplace.js";
import { supabase } from "../../lib/supabase.js";
import StatusBadge from "../../components/marketplace/StatusBadge.jsx";

const STATUSES = ["All", "pending", "open", "in_progress", "completed", "rejected"];
const SERVICE_TYPES = ["All", "Furniture Repair", "Custom Furniture", "Aluminum Doors", "Sliding Doors", "Restoration", "Other"];

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [claims, setClaims] = useState([]);
  const [images, setImages] = useState([]);
  const [actioning, setActioning] = useState(null);
  const [page, setPage] = useState(0);
  const PER_PAGE = 20;

  const load = async () => {
    setLoading(true);
    const data = await adminGetAllRequests({ status: filterStatus, serviceType: filterType, search }).catch(() => []);
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => { load(); setPage(0); }, [filterStatus, filterType]);
  useEffect(() => {
    const t = setTimeout(load, 400);
    return () => clearTimeout(t);
  }, [search]);

  const openDetail = async (r) => {
    setSelected(r);
    const [c, i] = await Promise.all([
      adminGetAllClaims({ requestId: r.id }),
      supabase.from("request_images").select("image_url").eq("request_id", r.id),
    ]);
    setClaims(c);
    setImages(i.data?.map((x) => x.image_url) || []);
  };

  const action = async (fn, ...args) => {
    setActioning(true);
    await fn(...args).catch(() => {});
    await load();
    if (selected) {
      const fresh = await adminGetAllRequests({ search: "" }).catch(() => []);
      const upd = fresh.find((r) => r.id === selected.id);
      if (upd) setSelected(upd);
    }
    setActioning(null);
  };

  const paginated = requests.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(requests.length / PER_PAGE);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-charcoal mb-6">Requests</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
          className="rounded-xl border border-charcoal/15 bg-white px-4 py-2 text-sm outline-none focus:border-accent" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-charcoal/15 bg-white px-4 py-2 text-sm outline-none focus:border-accent capitalize">
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="rounded-xl border border-charcoal/15 bg-white px-4 py-2 text-sm outline-none focus:border-accent">
          {SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <span className="self-center text-sm text-graphite/60">{requests.length} result{requests.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-charcoal/8 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center animate-pulse text-graphite">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F4F4F2] text-[11px] uppercase tracking-widest text-graphite border-b border-charcoal/8">
                <tr>
                  <th className="px-5 py-3 text-left">Request</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Urgency</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Claims</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {paginated.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F9F9F7] transition cursor-pointer" onClick={() => openDetail(r)}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-charcoal">{r.title}</p>
                      <p className="text-[11px] text-graphite/60">{new Date(r.created_at).toLocaleDateString("en-KE")}</p>
                    </td>
                    <td className="px-4 py-4 text-graphite">{r.service_type}</td>
                    <td className="px-4 py-4 text-graphite">{r.location}</td>
                    <td className="px-4 py-4 capitalize text-graphite">{r.urgency}</td>
                    <td className="px-4 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-4 text-graphite">{r.claim_count ?? 0}</td>
                    <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-wrap gap-1.5">
                        {r.status === "pending" && (
                          <button onClick={() => action(approveRequest, r.id)}
                            className="rounded-full bg-green-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-green-700">Approve</button>
                        )}
                        {r.status === "pending" && (
                          <button onClick={() => action(rejectRequest, r.id)}
                            className="rounded-full border border-red-300 px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50">Reject</button>
                        )}
                        {r.status === "in_progress" && (
                          <button onClick={() => action(updateRequestStatus, r.id, "completed")}
                            className="rounded-full bg-charcoal px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-graphite">Complete</button>
                        )}
                        {r.status === "open" && (
                          <button onClick={() => action(updateRequestStatus, r.id, "in_progress")}
                            className="rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-blue-700">Start</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-charcoal/8 px-5 py-3">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="rounded-full border border-charcoal/15 px-4 py-1.5 text-sm disabled:opacity-40">← Prev</button>
            <span className="text-sm text-graphite">Page {page + 1} of {totalPages}</span>
            <button disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}
              className="rounded-full border border-charcoal/15 px-4 py-1.5 text-sm disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <aside className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-charcoal/8 bg-charcoal p-6 text-cream">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <StatusBadge status={selected.status} />
                  <h2 className="font-display mt-2 text-xl font-semibold">{selected.title}</h2>
                  <p className="text-sm text-cream/60">{selected.location} · {selected.service_type}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-cream/60 hover:text-white text-xl">✕</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-[11px] font-bold uppercase text-graphite/50">Urgency</dt><dd className="capitalize">{selected.urgency}</dd></div>
                <div><dt className="text-[11px] font-bold uppercase text-graphite/50">Budget</dt><dd>{selected.budget || "—"}</dd></div>
                <div><dt className="text-[11px] font-bold uppercase text-graphite/50">Contact</dt><dd>{selected.contact_name}</dd></div>
                <div><dt className="text-[11px] font-bold uppercase text-graphite/50">WhatsApp</dt>
                  <dd><a href={`https://wa.me/${selected.whatsapp_number?.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="text-accent hover:underline">{selected.whatsapp_number}</a></dd>
                </div>
              </dl>

              <div>
                <p className="text-[11px] font-bold uppercase text-graphite/50 mb-1">Description</p>
                <p className="text-sm text-graphite whitespace-pre-wrap">{selected.description}</p>
              </div>

              {images.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase text-graphite/50 mb-2">Photos</p>
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer">
                        <img src={url} alt="" className="rounded-lg h-24 w-full object-cover hover:opacity-90" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Status changer */}
              <div>
                <p className="text-[11px] font-bold uppercase text-graphite/50 mb-2">Change Status</p>
                <div className="flex flex-wrap gap-2">
                  {["pending","open","in_progress","completed","rejected"].map((s) => (
                    <button key={s} disabled={actioning || selected.status === s}
                      onClick={() => action(updateRequestStatus, selected.id, s)}
                      className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                        selected.status === s ? "bg-charcoal text-white" : "border border-charcoal/20 text-graphite hover:bg-charcoal hover:text-white"
                      } disabled:opacity-50 capitalize`}>
                      {s.replace("_"," ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Claims */}
              <div>
                <p className="text-[11px] font-bold uppercase text-graphite/50 mb-2">Claims ({claims.length})</p>
                {claims.length === 0 ? (
                  <p className="text-sm text-graphite/60">No claims yet.</p>
                ) : (
                  <div className="space-y-3">
                    {claims.map((c) => (
                      <div key={c.id} className="rounded-xl border border-charcoal/10 p-3">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm">{c.provider_name}</p>
                          <StatusBadge status={c.status} />
                        </div>
                        <p className="text-[12px] text-graphite mt-1">{c.years_experience ? `${c.years_experience} yrs exp` : ""} · {c.background?.slice(0, 60)}…</p>
                        <a href={`https://wa.me/${c.whatsapp_number?.replace(/\D/g,"")}`} target="_blank" rel="noreferrer"
                          className="mt-2 inline-block rounded-full bg-wa px-3 py-1 text-[11px] font-bold text-wadeep hover:brightness-110">
                          WhatsApp
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
