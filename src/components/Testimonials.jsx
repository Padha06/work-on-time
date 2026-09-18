import { useState } from "react";
import { TESTIMONIALS } from "../data/content.js";
import { useSwipe } from "../lib/useSwipe.js";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  const prev = () => setI((v) => (v - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setI((v) => (v + 1) % TESTIMONIALS.length);
  const swipe = useSwipe({ onLeft: next, onRight: prev });
  return (
    <section id="reviews" className="section-pad bg-cream">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="reveal mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-charcoal">Quiet proof, not hype.</h2>
        </div>
        <blockquote className="reveal mx-auto mt-8 max-w-2xl rounded-3xl border border-charcoal/10 bg-white p-8 text-center shadow-sm" {...swipe}>
          <p className="font-display text-xl leading-relaxed text-charcoal sm:text-2xl">“{t.text}”</p>
          <footer className="mt-4 text-sm font-semibold text-graphite">{t.name} · <span className="font-normal">{t.job}</span></footer>
          <div className="mt-5 flex items-center justify-center gap-2">
            <button onClick={prev} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-charcoal/15 px-4 py-2 text-sm font-semibold hover:bg-charcoal hover:text-white" aria-label="Previous review">←</button>
            <span className="text-sm text-graphite/60">{i + 1} / {TESTIMONIALS.length}</span>
            <button onClick={next} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-charcoal/15 px-4 py-2 text-sm font-semibold hover:bg-charcoal hover:text-white" aria-label="Next review">→</button>
          </div>
        </blockquote>
      </div>
    </section>
  );
}
