import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login"); // 'login' or 'forgot'
  const [sentReset, setSentReset] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
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

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email first.");
    setError("");
    setLoading(true);
    
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/settings`,
    });
    
    if (err) {
      setError(err.message);
    } else {
      setSentReset(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] bg-charcoal grid place-items-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-aluminum/15">
            <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
              <rect x="6" y="4" width="8" height="24" rx="1.5" fill="#C7CBCF" />
              <rect x="18" y="4" width="8" height="24" rx="1.5" fill="#8F5A30" />
            </svg>
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-cream">Work On Time</p>
            <p className="text-[11px] uppercase tracking-widest text-aluminum/60">Admin Dashboard</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          {mode === "login" ? (
            <>
              <h2 className="font-display text-2xl font-semibold text-charcoal">Admin Sign In</h2>
              <p className="mt-1 text-sm text-graphite">Sign in with your admin credentials.</p>
              
              <form onSubmit={handleLogin} className="mt-6 grid gap-4">
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
                )}
                
                <div className="grid gap-1.5">
                  <label className="text-[13px] font-bold text-charcoal">Email address</label>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@workontime.in"
                    className="rounded-xl border border-charcoal/15 px-4 py-3 text-base outline-none focus:border-accent"
                  />
                </div>
                
                <div className="grid gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[13px] font-bold text-charcoal">Password</label>
                    <button type="button" onClick={() => setMode("forgot")} className="text-[12px] font-semibold text-accent hover:underline">
                      Forgot?
                    </button>
                  </div>
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-xl border border-charcoal/15 px-4 py-3 text-base outline-none focus:border-accent"
                  />
                </div>
                
                <button type="submit" disabled={loading}
                  className="mt-2 rounded-full bg-accent py-3.5 text-[15px] font-bold text-white transition hover:brightness-110 disabled:opacity-60">
                  {loading ? "Signing in…" : "Sign In →"}
                </button>
              </form>
            </>
          ) : (
            <>
              {sentReset ? (
                <div className="text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-3xl">✉️</div>
                  <h2 className="font-display mt-4 text-2xl font-semibold text-charcoal">Check your email</h2>
                  <p className="mt-2 text-sm text-graphite">
                    We sent a password reset link to <strong>{email}</strong>. Click it to set a new password.
                  </p>
                  <button onClick={() => { setMode("login"); setSentReset(false); }} className="mt-6 text-sm text-accent font-semibold hover:underline">
                    Return to login
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-semibold text-charcoal">Reset Password</h2>
                  <p className="mt-1 text-sm text-graphite">Enter your email and we'll send you a reset link.</p>
                  
                  <form onSubmit={handleForgot} className="mt-6 grid gap-4">
                    {error && (
                      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
                    )}
                    
                    <div className="grid gap-1.5">
                      <label className="text-[13px] font-bold text-charcoal">Email address</label>
                      <input
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@workontime.in"
                        className="rounded-xl border border-charcoal/15 px-4 py-3 text-base outline-none focus:border-accent"
                      />
                    </div>
                    
                    <button type="submit" disabled={loading}
                      className="mt-2 rounded-full bg-charcoal py-3.5 text-[15px] font-bold text-white transition hover:bg-black disabled:opacity-60">
                      {loading ? "Sending…" : "Send Reset Link"}
                    </button>
                    
                    <button type="button" onClick={() => setMode("login")} className="mt-2 text-sm text-graphite font-semibold hover:text-charcoal transition">
                      Cancel
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>

        <p className="mt-6 text-center text-[12px] text-aluminum/40">
          This area is restricted to Work On Time administrators.
        </p>
      </div>
    </div>
  );
}
