import { useState } from "react";
import { waLink, WHATSAPP_NUMBER, ADDRESS } from "../data/content.js";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", service: "Custom Furniture Building", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    console.log("[demo quote request]", form); // no backend for the demo per spec 5.10
    setSent(true);
  };

  return (
    <section id="contact" className="section-pad bg-charcoal text-cream">
      <div className="mx-auto grid max-w-content gap-8 px-4 sm:px-6 lg:grid-cols-2">
        <div className="reveal">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Get a quote</p>
          <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Send photos. Get a fixed price.</h2>
          <p className="mt-3 max-w-md text-cream/70">Fastest route is WhatsApp — photos + rough size is enough for a first estimate. Or leave the form and we’ll call back.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={waLink(form.service)} target="_blank" rel="noreferrer" className="rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-bold text-[#0b3d20] transition hover:brightness-110">
              WhatsApp click-to-chat
            </a>
            <a href={`tel:${WHATSAPP_NUMBER.replace(/\s/g, "")}`} className="rounded-full border border-white/25 px-6 py-3 text-[15px] font-semibold hover:bg-white/10">
              Call {WHATSAPP_NUMBER}
            </a>
          </div>
          <p className="mt-3 text-[12px] text-cream/50">WhatsApp: {WHATSAPP_NUMBER} · Prefilled message: “Hi, I saw your new site and I’m interested in [service]”.</p>
          <ul className="mt-6 space-y-2 text-sm text-cream/70">
            <li>✓ Site visit for wardrobes, kitchens &amp; full-home jobs</li>
            <li>✓ Shade cards &amp; samples shown before you pay anything</li>
            <li>✓ Visit us: {ADDRESS}</li>
            <li>✓ Hours: Mon–Sat, 10am–7pm</li>
          </ul>
        </div>
        <form onSubmit={submit} className="reveal rounded-3xl bg-white p-6 text-charcoal sm:p-8">
          {sent ? (
            <div className="grid min-h-[320px] place-items-center text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-100 text-2xl">✓</div>
                <h3 className="font-display mt-4 text-2xl font-semibold">Request noted (demo).</h3>
                <p className="mt-2 text-sm text-graphite">No backend in this pitch build — in production this lands in email/WhatsApp/CRM. We logged it to the console.</p>
                <button type="button" onClick={() => setSent(false)} className="mt-4 rounded-full border border-charcoal/15 px-5 py-2 text-sm font-semibold">Send another</button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <label htmlFor="q-name" className="text-[13px] font-bold">Name</label>
                <input id="q-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="rounded-xl border border-charcoal/15 px-4 py-3 text-[15px] outline-none focus:border-accent" />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="q-phone" className="text-[13px] font-bold">Phone / WhatsApp</label>
                <input id="q-phone" required inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 …" className="rounded-xl border border-charcoal/15 px-4 py-3 text-[15px] outline-none focus:border-accent" />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="q-service" className="text-[13px] font-bold">Service needed</label>
                <select id="q-service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-accent">
                  <option>Custom Furniture Building</option>
                  <option>Furniture Repair &amp; Restoration</option>
                  <option>Aluminum Doors</option>
                  <option>Sliding Aluminum Doors</option>
                </select>
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="q-msg" className="text-[13px] font-bold">Message</label>
                <textarea id="q-msg" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Room size, photos you can share on WhatsApp, timeline…" className="rounded-xl border border-charcoal/15 px-4 py-3 text-[15px] outline-none focus:border-accent" />
              </div>
              <button type="submit" className="rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-white transition hover:brightness-110">Request callback →</button>
              <p className="text-center text-[12px] text-graphite/60">Demo form — no data leaves your browser.</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
