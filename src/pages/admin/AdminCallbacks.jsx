import { useState, useEffect } from "react";
import { adminGetCallbacks, updateCallbackStatus } from "../../lib/marketplace.js";

const STATUS_STYLE = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

function formatDateTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

export default function AdminCallbacks() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acting, setActing] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await adminGetCallbacks());
    } catch (err) {
      setError(err.message || "Couldn't load callbacks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const mark = async (id, status) => {
    setActing(id);
    try {
      await updateCallbackStatus(id, status);
      setItems((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    } catch (err) {
      setError(err.message || "Couldn't update.");
    } finally {
      setActing(null);
    }
  };

  const fresh = items.filter((c) => c.status === "new").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-charcoal">Callbacks</h1>
          <p className="mt-1 text-sm text-graphite">
            Contact-form callback requests. {fresh > 0 ? `${fresh} new — call them back.` : "You're all caught up."}
          </p>
        </div>
        <button onClick={load} className="rounded-full border border-charcoal/15 px-4 py-2 text-sm font-semibold text-charcoal hover:bg-charcoal hover:text-white transition">
          Refresh
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-charcoal/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#F4F4F2] text-[11px] uppercase tracking-widest text-graphite border-b border-charcoal/8">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Service</th>
              <th className="text-left px-4 py-3">Message</th>
              <th className="text-left px-4 py-3">Received</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-charcoal/5 animate-pulse">
                  <td colSpan={7} className="px-4 py-4"><div className="h-4 rounded bg-charcoal/10" /></td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="font-semibold text-charcoal">No callback requests yet</p>
                  <p className="mt-1 text-sm text-graphite">Contact-form submissions will appear here.</p>
                </td>
              </tr>
            ) : (
              items.map((c) => (
                <tr key={c.id} className="border-b border-charcoal/5 last:border-0 hover:bg-cream/60">
                  <td className="px-4 py-3 font-semibold text-charcoal whitespace-nowrap">{c.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a href={`tel:${(c.phone || "").replace(/\s/g, "")}`} className="font-semibold text-accent hover:underline">{c.phone}</a>
                  </td>
                  <td className="px-4 py-3 text-graphite whitespace-nowrap">{c.service}</td>
                  <td className="px-4 py-3 text-graphite max-w-[220px]">
                    <span className="block truncate" title={c.message || ""}>{c.message || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-graphite whitespace-nowrap">{formatDateTime(c.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLE[c.status] || STATUS_STYLE.new}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {c.status === "new" && (
                      <button onClick={() => mark(c.id, "contacted")} disabled={acting === c.id}
                        className="rounded-full bg-blue-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                        {acting === c.id ? "…" : "Contacted"}
                      </button>
                    )}
                    {c.status === "contacted" && (
                      <button onClick={() => mark(c.id, "done")} disabled={acting === c.id}
                        className="rounded-full bg-green-600 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                        {acting === c.id ? "…" : "Done"}
                      </button>
                    )}
                    {c.status === "done" && <span className="text-[12px] text-graphite/50">✓ Closed</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
