import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminGetAllRequests, approveRequest, rejectRequest } from "../../lib/marketplace.js";
import StatusBadge from "../../components/marketplace/StatusBadge.jsx";

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-2xl ${color} p-5`}>
      <p className="text-[12px] font-bold uppercase tracking-widest text-current opacity-70">{label}</p>
      <p className="font-display mt-1 text-4xl font-semibold">{value ?? "—"}</p>
    </div>
  );
}

export default function AdminOverview() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await adminGetAllRequests().catch(() => []);
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const pending  = requests.filter((r) => r.status === "pending");
  const open     = requests.filter((r) => r.status === "open");
  const progress = requests.filter((r) => r.status === "in_progress");
  const done     = requests.filter((r) => r.status === "completed");

  const approve = async (id) => {
    setActioning(id);
    await approveRequest(id).catch(() => {});
    await load();
    setActioning(null);
  };

  const reject = async (id) => {
    if (!window.confirm("Reject this request?")) return;
    setActioning(id);
    await rejectRequest(id).catch(() => {});
    await load();
    setActioning(null);
  };

  const approveAll = async () => {
    if (!window.confirm(`Approve all ${pending.length} pending requests?`)) return;
    for (const r of pending) await approveRequest(r.id).catch(() => {});
    await load();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-charcoal">Overview</h1>
        <p className="mt-1 text-sm text-graphite">Platform summary at a glance.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        <StatCard label="Active Requests" value={open.length + progress.length} color="bg-charcoal text-cream" />
        <StatCard label="Pending Approval" value={pending.length} color="bg-amber-100 text-amber-900" />
        <StatCard label="In Progress" value={progress.length} color="bg-blue-100 text-blue-900" />
        <StatCard label="Completed" value={done.length} color="bg-green-100 text-green-900" />
      </div>

      {/* Pending requests table */}
      <div className="rounded-2xl bg-white border border-charcoal/8 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal/8">
          <h2 className="font-display text-lg font-semibold text-charcoal">
            Pending Requests {pending.length > 0 && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[12px] text-amber-800">{pending.length}</span>}
          </h2>
          {pending.length > 0 && (
            <button onClick={approveAll} className="rounded-full bg-green-600 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-green-700">
              Approve All
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-8 text-center text-graphite animate-pulse">Loading…</div>
        ) : pending.length === 0 ? (
          <div className="p-8 text-center text-graphite">
            <span className="text-3xl">✓</span>
            <p className="mt-2">No pending requests. You're all caught up!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F4F4F2] text-[12px] uppercase tracking-widest text-graphite">
                <tr>
                  <th className="px-6 py-3 text-left">Request</th>
                  <th className="px-4 py-3 text-left">Service</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Urgency</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {pending.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F4F4F2] transition">
                    <td className="px-6 py-4">
                      <Link to={`/admin/requests`} className="font-semibold text-charcoal hover:text-accent">{r.title}</Link>
                      <p className="text-[11px] text-graphite/60 mt-0.5">{new Date(r.created_at).toLocaleDateString("en-KE")}</p>
                    </td>
                    <td className="px-4 py-4 text-graphite">{r.service_type}</td>
                    <td className="px-4 py-4 text-graphite">{r.location}</td>
                    <td className="px-4 py-4 capitalize text-graphite">{r.urgency}</td>
                    <td className="px-4 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => approve(r.id)} disabled={actioning === r.id}
                          className="rounded-full bg-green-600 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-green-700 disabled:opacity-50">
                          {actioning === r.id ? "…" : "Approve"}
                        </button>
                        <button onClick={() => reject(r.id)} disabled={actioning === r.id}
                          className="rounded-full border border-red-300 px-3 py-1.5 text-[12px] font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Link to="/admin/requests" className="rounded-2xl bg-white border border-charcoal/8 p-4 text-center shadow-sm hover:shadow transition">
          <span className="text-2xl">📋</span>
          <p className="mt-2 text-sm font-semibold text-charcoal">All Requests</p>
          <p className="text-[12px] text-graphite">{requests.length} total</p>
        </Link>
        <Link to="/admin/claims" className="rounded-2xl bg-white border border-charcoal/8 p-4 text-center shadow-sm hover:shadow transition">
          <span className="text-2xl">🤝</span>
          <p className="mt-2 text-sm font-semibold text-charcoal">Claims</p>
          <p className="text-[12px] text-graphite">View &amp; manage</p>
        </Link>
        <Link to="/admin/analytics" className="rounded-2xl bg-white border border-charcoal/8 p-4 text-center shadow-sm hover:shadow transition">
          <span className="text-2xl">📊</span>
          <p className="mt-2 text-sm font-semibold text-charcoal">Analytics</p>
          <p className="text-[12px] text-graphite">Real data insights</p>
        </Link>
      </div>
    </div>
  );
}
