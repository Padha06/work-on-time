import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";

const NAV = [
  { to: "/admin",           label: "Overview",   icon: "🏠", end: true },
  { to: "/admin/requests",  label: "Requests",   icon: "📋" },
  { to: "/admin/claims",    label: "Claims",     icon: "🤝" },
  { to: "/admin/portfolio", label: "Portfolio",  icon: "🖼️" },
  { to: "/admin/analytics", label: "Analytics",  icon: "📊" },
  { to: "/admin/settings",  label: "Settings",   icon: "⚙️" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-[100dvh] bg-[#F4F4F2] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-charcoal text-cream">
        {/* Logo */}
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-aluminum/15">
              <svg width="18" height="18" viewBox="0 0 32 32" aria-hidden="true">
                <rect x="6" y="4" width="8" height="24" rx="1.5" fill="#C7CBCF" />
                <rect x="18" y="4" width="8" height="24" rx="1.5" fill="#8F5A30" />
              </svg>
            </span>
            <div>
              <p className="font-display text-[15px] font-semibold">Work On Time</p>
              <p className="text-[10px] uppercase tracking-widest text-aluminum/60">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition ${
                  isActive ? "bg-accent text-white" : "text-cream/70 hover:bg-white/10 hover:text-cream"
                }`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Sign out */}
        <div className="border-t border-white/10 p-4">
          <button onClick={handleSignOut}
            className="w-full rounded-xl px-3 py-2.5 text-left text-[14px] font-medium text-cream/60 hover:bg-white/10 hover:text-cream transition">
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex min-h-14 items-center justify-between border-b border-charcoal/10 bg-charcoal px-4 pt-[env(safe-area-inset-top)] text-cream lg:hidden">
        <span className="font-display text-[16px] font-semibold">WOT Admin</span>
        <div className="flex items-center gap-1">
          {NAV.slice(0, 4).map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end} aria-label={label}
              className={({ isActive }) => `grid h-11 w-11 place-items-center rounded-lg text-lg ${isActive ? "bg-accent/20" : "hover:bg-white/10"}`}>
              <span aria-hidden="true">{icon}</span>
            </NavLink>
          ))}
          <button onClick={handleSignOut} aria-label="Sign out" className="grid h-11 w-11 place-items-center rounded-lg text-lg hover:bg-white/10"><span aria-hidden="true">🚪</span></button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-[calc(3.5rem+env(safe-area-inset-top))] lg:pt-0">
        <div className="p-6 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
