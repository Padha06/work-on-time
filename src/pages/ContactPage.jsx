import Contact from "../components/Contact.jsx";
import { Link } from "react-router-dom";
import { waLink } from "../data/content.js";

const RESPONSE_TIMES = [
  { channel: "WhatsApp photos", time: "~1 hour", note: "Photos + rough size gets you a first estimate." },
  { channel: "Callback request", time: "Same working day", note: "Leave the form below — we call back." },
  { channel: "Site visit", time: "Within 48 hours", note: "Wardrobes, kitchens & full-home jobs." },
];

const AREAS = [
  "Bansdroni", "Tollygunge", "Garia", "Jadavpur", "Behala", "Naktala",
  "Netaji Nagar", "Ranikuthi", "Lake Gardens", "Regent Park", "Golf Green", "Kasba",
];

export default function ContactPage() {
  return (
    <div className="pt-16">
      {/* Header — split with response-time card */}
      <section className="bg-charcoal py-20 text-cream">
        <div className="mx-auto grid max-w-content items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="reveal max-w-2xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accentsoft">Contact</p>
            <h1 className="font-display mt-2 font-semibold tracking-tight text-[clamp(2rem,7vw,3.75rem)]">
              Talk to a human,<br />
              <span className="text-aluminum">not a ticket queue.</span>
            </h1>
            <p className="mt-4 max-w-xl text-cream/70">
              Fastest route is WhatsApp — send photos and rough sizes and we'll reply with a first estimate.
              Prefer a call? Leave the form and we'll ring back the same working day.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={waLink("your services")}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-bold text-[#0b3d20] transition hover:brightness-110"
              >
                WhatsApp click-to-chat
              </a>
              <Link to="/services" className="rounded-full border border-white/25 px-6 py-3 text-[15px] font-semibold transition hover:bg-white/10">
                Browse Services
              </Link>
            </div>
          </div>
          <div className="reveal rounded-3xl bg-white p-6 text-charcoal shadow-xl sm:p-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight">How fast we reply</h2>
            <ul className="mt-5 space-y-4">
              {RESPONSE_TIMES.map((r) => (
                <li key={r.channel} className="flex items-start justify-between gap-4 border-b border-charcoal/10 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold">{r.channel}</p>
                    <p className="mt-0.5 text-sm text-graphite">{r.note}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-[12px] font-bold text-green-800">{r.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Contact />

      {/* Service area */}
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Service area</p>
              <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight text-charcoal md:text-5xl">
                We come to you, anywhere in South Kolkata.
              </h2>
              <p className="mt-3 text-graphite">Measurements, installs and repairs across the city. Outside Kolkata? Ask on WhatsApp — bigger jobs travel.</p>
            </div>
          </div>
          <div className="reveal mt-8 flex flex-wrap gap-2">
            {AREAS.map((a) => (
              <span key={a} className="rounded-full border border-charcoal/15 bg-white px-4 py-2 text-sm font-semibold text-charcoal shadow-sm">
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
