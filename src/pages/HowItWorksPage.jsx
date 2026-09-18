import { Link } from "react-router-dom";

const SEEKER_STEPS = [
  { n: "01", title: "Post your request", text: "Fill in a short form — service type, location, description, photos. No account needed. Takes 2 minutes." },
  { n: "02", title: "Admin review", text: "Work On Time reviews your request and approves it within 24 hours to keep quality high." },
  { n: "03", title: "Providers discover you", text: "Skilled providers browse the open marketplace and find your request." },
  { n: "04", title: "Providers contact you", text: "Each interested provider sends you a prefilled WhatsApp message introducing themselves." },
  { n: "05", title: "Choose your provider", text: "Compare providers, ask questions on WhatsApp, then choose who you want." },
  { n: "06", title: "Work gets completed", text: "Provider does the work. When done, the request is marked completed." },
];

const PROVIDER_STEPS = [
  { n: "01", title: "Browse available work", text: "Visit the marketplace to see all open service requests." },
  { n: "02", title: "Search & filter", text: "Filter by service type, location, urgency. Find work that matches your skills." },
  { n: "03", title: "Claim work", text: "Click 'Claim This Work', fill in a short form — your name, experience, background." },
  { n: "04", title: "Introduce yourself on WhatsApp", text: "A prefilled WhatsApp message is generated. Send it to the seeker to introduce yourself." },
  { n: "05", title: "Discuss price & timing", text: "Chat on WhatsApp to agree on scope, price and schedule." },
  { n: "06", title: "Get assigned & complete the job", text: "Once selected, the request is assigned to you. Do the work and earn a completed status." },
];

function StepList({ steps, color }) {
  return (
    <div className="space-y-4">
      {steps.map((s) => (
        <div key={s.n} className="flex gap-4">
          <span className={`mt-1 shrink-0 text-[13px] font-bold ${color}`}>{s.n}</span>
          <div>
            <h3 className="font-semibold text-charcoal">{s.title}</h3>
            <p className="mt-1 text-sm text-graphite">{s.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="pt-16">
      <section className="bg-charcoal py-20 text-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal max-w-2xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">How It Works</p>
            <h1 className="font-display mt-2 text-5xl font-semibold tracking-tight md:text-6xl">
              Simple. WhatsApp-first.<br />
              <span className="text-aluminum">No account needed.</span>
            </h1>
            <p className="mt-4 text-cream/70">
              The Work On Time marketplace works for both people who need a job done and skilled providers who want work.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal grid gap-12 lg:grid-cols-2">
            {/* Seekers */}
            <div className="rounded-3xl bg-white border border-charcoal/8 p-8 shadow-sm">
              <div className="mb-6">
                <span className="rounded-full bg-accent/10 px-3 py-1 text-[12px] font-bold uppercase tracking-widest text-accent">
                  For People Who Need Work Done
                </span>
                <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-charcoal">
                  Post a request. Get connected.
                </h2>
              </div>
              <StepList steps={SEEKER_STEPS} color="text-accent" />
              <div className="mt-8">
                <Link
                  to="/post-request"
                  className="inline-block rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110"
                >
                  Post a Request →
                </Link>
              </div>
            </div>

            {/* Providers */}
            <div className="rounded-3xl bg-charcoal text-cream p-8 shadow-sm">
              <div className="mb-6">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold uppercase tracking-widest text-aluminum">
                  For Service Providers
                </span>
                <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight">
                  Find work. Build your next job.
                </h2>
              </div>
              <div className="space-y-4">
                {PROVIDER_STEPS.map((s) => (
                  <div key={s.n} className="flex gap-4">
                    <span className="mt-1 shrink-0 text-[13px] font-bold text-aluminum">{s.n}</span>
                    <div>
                      <h3 className="font-semibold text-cream">{s.title}</h3>
                      <p className="mt-1 text-sm text-cream/65">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to="/marketplace"
                  className="inline-block rounded-full border border-white/25 bg-white/5 px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-white/15"
                >
                  Browse Marketplace →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status lifecycle */}
      <section className="section-pad bg-white">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal max-w-2xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Request Lifecycle</p>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-charcoal">
              Every request has a clear status.
            </h2>
          </div>
          <div className="reveal mt-8 flex flex-wrap items-center gap-2">
            {[
              { label: "PENDING", color: "bg-gray-100 text-gray-600", desc: "Waiting for admin approval" },
              { label: "→", color: "", desc: "" },
              { label: "OPEN", color: "bg-green-100 text-green-700", desc: "Live on marketplace" },
              { label: "→", color: "", desc: "" },
              { label: "IN PROGRESS", color: "bg-blue-100 text-blue-700", desc: "Provider assigned" },
              { label: "→", color: "", desc: "" },
              { label: "COMPLETED", color: "bg-charcoal text-white", desc: "Job done" },
            ].map((item, i) =>
              item.label === "→" ? (
                <span key={i} className="text-graphite/40 font-bold text-lg">→</span>
              ) : (
                <div key={i} className="text-center">
                  <span className={`block rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest ${item.color}`}>
                    {item.label}
                  </span>
                  <span className="mt-1 block text-[11px] text-graphite">{item.desc}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
