import Process from "../components/Process.jsx";
import { Link } from "react-router-dom";

const VALUES = [
  { title: "Measure twice, cut once", text: "Site visits, shade cards and samples before money changes hands. Surprises are for birthdays, not invoices." },
  { title: "One team, one quote", text: "The people who measure your room build your furniture and install your doors. No hand-offs, no finger-pointing." },
  { title: "Tidy sites, always", text: "Floors protected, dust managed, offcuts cleared. Your home should look better when we leave, not worse." },
  { title: "Proof, not promises", text: "Photo walkthroughs, glide-tests and finish close-ups on every handover — published on our Work wall." },
];

const FACTS = [
  { label: "Base", value: "Nairobi, Kenya" },
  { label: "Crew", value: "Workshop + site team" },
  { label: "Trades", value: "Wood · Repair · Aluminum" },
  { label: "First reply", value: "Within a day on WhatsApp" },
];

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Header — editorial, light */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal max-w-3xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">About Us</p>
            <h1 className="font-display mt-2 text-5xl font-semibold tracking-tight text-charcoal md:text-6xl">
              One team, from first measurement to final walkthrough.
            </h1>
            <p className="mt-4 max-w-xl text-graphite">
              Work On Time is a Nairobi craftwork studio and marketplace. We build custom furniture, restore tired pieces
              and install aluminum and sliding doors — then we opened the same pipeline to independent providers.
            </p>
          </div>
          <div className="reveal mt-10 overflow-hidden rounded-3xl border border-charcoal/10 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1600&auto=format&fit=crop"
              alt="Finished interior with custom furniture by Work On Time"
              className="h-72 w-full object-cover md:h-96"
              loading="lazy"
            />
          </div>
          <dl className="reveal mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.label} className="rounded-2xl border border-charcoal/10 bg-white px-5 py-4 shadow-sm">
                <dt className="text-[11px] font-bold uppercase tracking-widest text-graphite/70">{f.label}</dt>
                <dd className="mt-1 font-bold text-charcoal">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Story */}
      <section className="section-pad bg-white">
        <div className="mx-auto grid max-w-content gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="reveal">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Our story</p>
            <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight text-charcoal md:text-5xl">
              Started with a wobbling table.
            </h2>
          </div>
          <div className="reveal grid gap-4 text-[15px] leading-relaxed text-graphite">
            <p>
              Most of our jobs start the same way: a dining table that wobbles, a wardrobe door that won't close,
              a balcony slider that needs two hands and a prayer. Small annoyances that sit unfixed for months
              because finding someone reliable feels harder than living with the problem.
            </p>
            <p>
              So we built the crew we kept wishing existed — measurers, builders and installers under one roof,
              quoting fixed prices and documenting every handover with photos. Then we realised good independent
              fundis face the same trust problem from the other side, and opened our pipeline as a marketplace:
              anyone can post a request, any skilled provider can claim it.
            </p>
            <p>
              Studio or marketplace, the rule is identical: honest work, photographed proof, and a team that
              comes back if something isn't right.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad bg-charcoal text-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="reveal max-w-2xl">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">What we stand by</p>
            <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
              Four promises, kept on every job.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {VALUES.map((v, i) => (
              <div key={v.title} className="reveal rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="font-display text-4xl font-semibold text-accent">0{i + 1}</div>
                <h3 className="mt-2 text-lg font-bold text-cream">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-cream/65">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Process />

      {/* CTA */}
      <section className="section-pad bg-cream">
        <div className="mx-auto max-w-content px-4 sm:px-6 text-center">
          <div className="reveal mx-auto max-w-xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-charcoal">See the proof, then say hello.</h2>
            <p className="mt-3 text-graphite">Browse finished jobs — or skip straight to a fixed quote.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/work" className="rounded-full bg-charcoal px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-graphite">
                See Our Work
              </Link>
              <Link to="/contact" className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white transition hover:brightness-110">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
