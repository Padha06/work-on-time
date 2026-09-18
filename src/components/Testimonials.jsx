import { useState } from "react";
import { TESTIMONIALS } from "../data/content.js";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  return (
    <section id="reviews" className="section-pad bg-cream">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">Reviews</p>
          <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight text-charcoal">Quiet proof, not hype.</h2>
        </div>
        <blockquote className="reveal mx-auto mt-8 max-w-2xl rounded-3xl border border-charcoal/10 bg-white p-8 text-center shadow-sm">
          <p className="font-display text-xl leading-relaxed text-charcoal sm:text-2xl">“{t.text}”</p>
          <footer className="mt-4 text-sm font-semibold text-graphite">{t.name} · <span className="font-normal">{t.job}</span></footer>
          <div className="mt-5 flex items-center justify-center gap-2">
            <button onClick={() => setI((i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-charcoal/15 px-4 py-2 text-sm font-semibold hover:bg-charcoal hover:text-white" aria-label="Previous review">←</button>
            <span className="text-sm text-graphite/60">{i + 1} / {TESTIMONIALS.length}</span>
            <button onClick={() => setI((i + 1) % TESTIMONIALS.length)} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-charcoal/15 px-4 py-2 text-sm font-semibold hover:bg-charcoal hover:text-white" aria-label="Next review">→</button>
          </div>
        </blockquote>
      </div>
    </section>
  );
}
