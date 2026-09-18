import { useState, useEffect } from "react";
import { submitClaim } from "../../lib/marketplace.js";
import { WHATSAPP_NUMBER_LINK, buildClaimMessage } from "../../data/content.js";

export default function ClaimModal({ request, onClose }) {
  const [form, setForm] = useState({ name: "", whatsapp: "", experience: "", portfolio: "", background: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Overlay UX: Esc closes, background scroll locks while open.
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("lightbox-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("lightbox-open");
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await submitClaim(request.id, form);
      setDone(true);
      // Build and open WhatsApp link
      const msg = buildClaimMessage(
        { name: form.name, experience: form.experience, background: form.background },
        request
      );
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER_LINK}?text=${encodeURIComponent(msg)}`;
      setTimeout(() => window.open(waUrl, "_blank", "noreferrer"), 600);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Claim this work"
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="grid place-items-center p-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100 text-3xl mx-auto">✓</div>
            <h3 className="font-display mt-4 text-2xl font-semibold text-charcoal">Claim Submitted!</h3>
            <p className="mt-2 text-sm text-graphite">
              Your claim has been saved. WhatsApp is opening with a prefilled introduction message.
              If it didn't open, tap below.
            </p>
            <button
              onClick={() => {
                const msg = buildClaimMessage(
                  { name: form.name, experience: form.experience, background: form.background },
                  request
                );
                window.open(`https://wa.me/${WHATSAPP_NUMBER_LINK}?text=${encodeURIComponent(msg)}`, "_blank", "noreferrer");
              }}
              className="mt-4 rounded-full bg-wa px-6 py-3 font-bold text-wadeep transition hover:brightness-110"
            >
              Open WhatsApp →
            </button>
            <button onClick={onClose} className="mt-3 inline-flex min-h-[44px] items-center px-4 text-sm text-graphite/60 hover:text-graphite">
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-charcoal/10 bg-charcoal p-6 text-cream">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-bold uppercase tracking-widest text-aluminum">Claim Work</p>
                  <h2 className="font-display mt-1 text-xl font-semibold leading-snug break-words">{request.title}</h2>
                  <p className="mt-1 text-sm text-cream/60">{request.location} · {request.service_type}</p>
                </div>
                <button onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-cream/60 hover:text-white" aria-label="Close">✕</button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 grid gap-4">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>
              )}
              <div className="grid gap-1.5">
                <label className="text-[13px] font-bold text-charcoal">Your Name *</label>
                <input required value={form.name} onChange={set("name")} placeholder="Full name"
                  className="rounded-xl border border-charcoal/15 px-4 py-3 text-base outline-none focus:border-accent" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-[13px] font-bold text-charcoal">WhatsApp Number *</label>
                <input required value={form.whatsapp} onChange={set("whatsapp")} placeholder="+91 7XX XXX XXX" inputMode="tel"
                  className="rounded-xl border border-charcoal/15 px-4 py-3 text-base outline-none focus:border-accent" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-[13px] font-bold text-charcoal">Years of Experience</label>
                <input value={form.experience} onChange={set("experience")} placeholder="e.g. 5" inputMode="numeric"
                  className="rounded-xl border border-charcoal/15 px-4 py-3 text-base outline-none focus:border-accent" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-[13px] font-bold text-charcoal">Portfolio Link <span className="font-normal text-graphite/50">(optional)</span></label>
                <input value={form.portfolio} onChange={set("portfolio")} placeholder="https://…"
                  className="rounded-xl border border-charcoal/15 px-4 py-3 text-base outline-none focus:border-accent" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-[13px] font-bold text-charcoal">Brief Background / Qualifications *</label>
                <textarea required rows={3} value={form.background} onChange={set("background")}
                  placeholder="Describe your skills and relevant experience for this job…"
                  className="rounded-xl border border-charcoal/15 px-4 py-3 text-base outline-none focus:border-accent resize-none" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-accent py-3.5 text-[15px] font-bold text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {loading ? "Submitting…" : "Claim Work →"}
              </button>
              <p className="text-center text-[12px] text-graphite/50">
                After submitting, WhatsApp will open with a prefilled introduction message.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
