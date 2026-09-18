import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";

export default function AdminRoute({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-charcoal grid place-items-center">
        <div className="text-cream/60 animate-pulse">Checking authentication…</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
