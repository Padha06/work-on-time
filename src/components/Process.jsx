import { PROCESS } from "../data/content.js";

export default function Process() {
  return (
    <section id="process" className="section-pad bg-cream">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="reveal max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-charcoal md:text-5xl">Fixed quote. Tidy site. No surprises.</h2>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {PROCESS.map((p) => (
            <li key={p.step} className="reveal rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm">
              <div className="font-display text-4xl font-semibold text-aluminum">{p.step}</div>
              <h3 className="mt-2 text-lg font-bold text-charcoal">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-graphite">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
