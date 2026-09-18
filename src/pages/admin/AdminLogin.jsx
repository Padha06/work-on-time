import { useState } from "react";
import { supabase } from "../../lib/supabase.js";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
    setLoading(false);
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
          {sent ? (
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-3xl">✉️</div>
              <h2 className="font-display mt-4 text-2xl font-semibold text-charcoal">Check your email</h2>
              <p className="mt-2 text-sm text-graphite">
                We sent a magic link to <strong>{email}</strong>. Click it to sign in.
              </p>
              <button onClick={() => setSent(false)} className="mt-6 text-sm text-accent font-semibold hover:underline">
                Try a different email
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl font-semibold text-charcoal">Admin Sign In</h2>
              <p className="mt-1 text-sm text-graphite">We'll email you a magic sign-in link. No password needed.</p>
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
                <button type="submit" disabled={loading}
                  className="rounded-full bg-accent py-3.5 text-[15px] font-bold text-white transition hover:brightness-110 disabled:opacity-60">
                  {loading ? "Sending…" : "Send Magic Link →"}
                </button>
              </form>
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
