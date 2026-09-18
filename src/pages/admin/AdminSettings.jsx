import { useState } from "react";
import { supabase } from "../../lib/supabase.js";

export default function AdminSettings() {
  const [waNumber, setWaNumber] = useState(import.meta.env.VITE_WHATSAPP_NUMBER || "");
  const [saved, setSaved] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [adminMsg, setAdminMsg] = useState("");

  const saveSettings = (e) => {
    e.preventDefault();
    // WhatsApp number is env-var based — guide the user
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addAdmin = async (e) => {
    e.preventDefault();
    setAddingAdmin(true);
    setAdminMsg("");
    // Invite the user via Supabase Auth
    const { error } = await supabase.auth.admin?.inviteUserByEmail?.(adminEmail) ||
      { error: { message: "Use the Supabase dashboard to invite admin users." } };
    setAdminMsg(error ? error.message : `Invitation sent to ${adminEmail}.`);
    setAddingAdmin(false);
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-semibold text-charcoal mb-6">Settings</h1>

      {/* WhatsApp */}
      <div className="rounded-2xl bg-white border border-charcoal/8 p-6 shadow-sm mb-5">
        <h2 className="font-display text-lg font-semibold text-charcoal mb-1">WhatsApp Configuration</h2>
        <p className="text-sm text-graphite mb-4">
          The WhatsApp number is configured via the <code className="rounded bg-charcoal/8 px-1.5 py-0.5 text-[13px]">VITE_WHATSAPP_NUMBER</code> environment variable in your Vercel project settings.
        </p>
        <div className="rounded-xl bg-[#F4F4F2] px-4 py-3 text-sm">
          <p className="font-mono text-charcoal">Current: {import.meta.env.VITE_WHATSAPP_NUMBER || "Not set (using placeholder)"}</p>
          <p className="mt-2 text-graphite/70">To update: go to Vercel Dashboard → Project → Settings → Environment Variables → update <code>VITE_WHATSAPP_NUMBER</code> → redeploy.</p>
        </div>
      </div>

      {/* Admin users */}
      <div className="rounded-2xl bg-white border border-charcoal/8 p-6 shadow-sm mb-5">
        <h2 className="font-display text-lg font-semibold text-charcoal mb-1">Admin Users</h2>
        <p className="text-sm text-graphite mb-4">
          To add an admin, invite them via Supabase Auth, then add their user ID to the <code className="rounded bg-charcoal/8 px-1.5 py-0.5 text-[13px]">admin_users</code> table.
        </p>
        <div className="rounded-xl bg-[#F4F4F2] px-4 py-3 text-[13px] font-mono text-charcoal">
          insert into admin_users (id, email) values (auth.uid(), 'email@example.com');
        </div>
        <p className="mt-3 text-[12px] text-graphite/60">Run this in Supabase Dashboard → SQL Editor after signing in with the new admin email.</p>
      </div>

      {/* Security */}
      <div className="rounded-2xl bg-white border border-charcoal/8 p-6 shadow-sm mb-5">
        <h2 className="font-display text-lg font-semibold text-charcoal mb-1">Security</h2>
        <p className="text-sm text-graphite mb-4">Update your admin account password.</p>
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          const btn = e.target.querySelector('button');
          const pass = e.target.password.value;
          if (pass.length < 6) return alert('Password must be at least 6 characters.');
          
          btn.disabled = true;
          btn.textContent = 'Updating...';
          const { error } = await supabase.auth.updateUser({ password: pass });
          if (error) {
            alert(error.message);
          } else {
            alert('Password updated successfully!');
            e.target.reset();
          }
          btn.disabled = false;
          btn.textContent = 'Update Password';
        }} className="flex items-center gap-3">
          <input 
            type="password" 
            name="password"
            placeholder="New password" 
            required
            minLength={6}
            className="flex-1 rounded-xl border border-charcoal/15 px-4 py-2.5 text-[15px] outline-none focus:border-accent"
          />
          <button type="submit" className="rounded-full bg-charcoal px-6 py-2.5 text-[14px] font-bold text-white transition hover:bg-black disabled:opacity-50">
            Update Password
          </button>
        </form>
      </div>

      {/* Database info */}
      <div className="rounded-2xl bg-white border border-charcoal/8 p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-charcoal mb-3">Platform Information</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-graphite">Supabase URL</dt>
            <dd className="font-mono text-[12px] text-charcoal">{import.meta.env.VITE_SUPABASE_URL ? "✓ Connected" : "⚠ Not configured"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-graphite">WhatsApp</dt>
            <dd className="font-mono text-[12px] text-charcoal">{import.meta.env.VITE_WHATSAPP_NUMBER ? "✓ Configured" : "⚠ Using placeholder"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-graphite">Storage bucket</dt>
            <dd className="font-mono text-[12px] text-charcoal">request-images, portfolio</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
