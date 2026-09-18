import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";

export default function AdminRoute({ children }) {
  const [state, setState] = useState({ loading: true });
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!alive) return;
      if (!sess.session) {
        setState({ loading: false, denied: "no-session" });
        return;
      }
      // Must be registered in admin_users — otherwise RLS hides all
      // rows and the dashboard silently shows zeros everywhere.
      const { data: row, error } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", sess.session.user.id)
        .maybeSingle();
      if (!alive) return;
      if (error) {
        setState({ loading: false, denied: "error", message: error.message });
      } else if (!row) {
        setState({ loading: false, denied: "not-admin", email: sess.session.user.email });
      } else {
        setState({ loading: false, denied: null });
      }
    })();
    return () => { alive = false; };
  }, []);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-charcoal grid place-items-center">
        <div className="text-cream/60 animate-pulse">Checking authentication…</div>
      </div>
    );
  }

  if (state.denied === "no-session") {
    return <Navigate to="/admin/login" replace />;
  }

  if (state.denied) {
    const signOut = async () => {
      await supabase.auth.signOut();
      navigate("/admin/login", { replace: true });
    };
    return (
      <div className="min-h-screen bg-charcoal grid place-items-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-100 text-2xl">⛔</div>
          <h2 className="font-display mt-4 text-2xl font-semibold text-charcoal">Access restricted</h2>
          {state.denied === "not-admin" ? (
            <p className="mt-2 text-sm leading-relaxed text-graphite">
              <strong>{state.email}</strong> is signed in but is not registered as an admin.
              Ask an existing admin to add this email to the <code>admin_users</code> table in Supabase,
              then sign in again.
            </p>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-graphite">
              Couldn't verify admin access: {state.message || "unknown error."}
            </p>
          )}
          <button
            onClick={signOut}
            className="mt-6 rounded-full bg-charcoal px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-black"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return children;
}
