import { useState, useEffect } from "react";
import { getAnalytics } from "../../lib/marketplace.js";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#B45625", "#C7CBCF", "#8F5A30", "#1C1C1E", "#6b7280"];

function KPICard({ label, value, sub }) {
  return (
    <div className="rounded-2xl bg-white border border-charcoal/8 p-5 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-widest text-graphite/60">{label}</p>
      <p className="font-display mt-1 text-4xl font-semibold text-charcoal">{value ?? "—"}</p>
      {sub && <p className="mt-1 text-[12px] text-graphite/60">{sub}</p>}
    </div>
  );
}

function exportCSV(data, filename) {
  const rows = data.requestsByDay.map((d) => `${d.date},${d.requests},${d.claims}`);
  const csv = ["Date,Requests,Claims", ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch((e) => setError(e.message || "Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 text-center animate-pulse text-graphite">Loading analytics…</div>;
  if (error) return <div className="py-20 text-center text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl font-semibold text-charcoal">Analytics</h1>
        <button
          onClick={() => exportCSV(data, "workontime-analytics.csv")}
          className="rounded-full border border-charcoal/15 px-5 py-2 text-sm font-semibold text-charcoal hover:bg-charcoal hover:text-white transition"
        >
          ⬇ Export CSV
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        <KPICard label="Total Requests" value={data.total} />
        <KPICard label="Open Requests" value={data.open} />
        <KPICard label="Completed" value={data.completed} sub={`${data.completionRate}% completion rate`} />
        <KPICard label="Total Claims" value={data.totalClaims} sub={`${data.avgClaims} avg per request`} />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        <KPICard label="In Progress" value={data.inProgress} />
        <KPICard label="Active Providers" value={data.activeProviders} sub="unique WhatsApp numbers" />
        <KPICard label="Active Seekers" value={data.activeSeekers} sub="approved requests" />
        <KPICard label="Avg Days to Complete" value={data.avgDays !== null ? `${data.avgDays}d` : "N/A"} sub="from approval to done" />
      </div>

      {/* Charts grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Requests by Service Type */}
        <div className="rounded-2xl bg-white border border-charcoal/8 p-6 shadow-sm">
          <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Requests by Service Type</h3>
          {data.byTypeChart.length === 0 ? (
            <p className="text-sm text-graphite/60">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data.byTypeChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {data.byTypeChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Status Breakdown */}
        <div className="rounded-2xl bg-white border border-charcoal/8 p-6 shadow-sm">
          <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Work Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.statusBreakdown} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#B45625" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Requests & Claims over time */}
        <div className="rounded-2xl bg-white border border-charcoal/8 p-6 shadow-sm lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Requests &amp; Claims — Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.requestsByDay} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip labelFormatter={(d) => d} />
              <Legend />
              <Line type="monotone" dataKey="requests" stroke="#B45625" strokeWidth={2} dot={false} name="Requests" />
              <Line type="monotone" dataKey="claims" stroke="#8F5A30" strokeWidth={2} dot={false} name="Claims" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
