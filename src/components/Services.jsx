import SampleTag from "./SampleTag.jsx";
import { SERVICES, waLink } from "../data/content.js";

export default function Services() {
  return (
    <section id="services" className="section-pad bg-cream">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="reveal max-w-2xl">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">What we do</p>
          <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight text-charcoal md:text-5xl">
            One team for wood, repair &amp; aluminum.
          </h2>
          <p className="mt-3 text-graphite">Four services, one phone number. Hover a card — every job ends with a photo walkthrough.</p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <article
              key={s.id}
              className="reveal group overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3"><SampleTag /></div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold text-charcoal">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{s.blurb}</p>
                <ul className="mt-3 space-y-1.5 text-[13px] text-graphite">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2"><span className="text-accent">✓</span>{p}</li>
                  ))}
                </ul>
                <a
                  href={waLink(s.title.toLowerCase())}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex min-h-[44px] items-center rounded-full border border-charcoal/15 px-4 py-2 text-[13px] font-semibold text-charcoal transition hover:bg-charcoal hover:text-white"
                >
                  Ask about this →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
