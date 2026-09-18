import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-charcoal grid place-items-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-aluminum/15">
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <rect x="6" y="4" width="8" height="24" rx="1.5" fill="#C7CBCF" />
              <rect x="18" y="4" width="8" height="24" rx="1.5" fill="#A9764E" />
            </svg>
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-cream">Work On Time</p>
            <p className="text-[11px] uppercase tracking-widest text-aluminum/60">Admin Dashboard</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <h2 className="font-display text-2xl font-semibold text-charcoal">Admin Sign In</h2>
          <p className="mt-1 text-sm text-graphite">Sign in with your admin credentials.</p>
          
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
            )}
            
            <div className="grid gap-1.5">
              <label className="text-[13px] font-bold text-charcoal">Email address</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@workontime.co.ke"
                className="rounded-xl border border-charcoal/15 px-4 py-3 text-[15px] outline-none focus:border-accent"
              />
            </div>
            
            <div className="grid gap-1.5">
              <label className="text-[13px] font-bold text-charcoal">Password</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl border border-charcoal/15 px-4 py-3 text-[15px] outline-none focus:border-accent"
              />
            </div>
            
            <button type="submit" disabled={loading}
              className="mt-2 rounded-full bg-accent py-3.5 text-[15px] font-bold text-white transition hover:brightness-110 disabled:opacity-60">
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[12px] text-aluminum/40">
          This area is restricted to Work On Time administrators.
        </p>
      </div>
    </div>
  );
}
