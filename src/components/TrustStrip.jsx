import { useEffect, useRef, useState } from "react";
import { STATS } from "../data/content.js";

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1400;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function TrustStrip() {
  return (
    <section id="trust" className="border-y border-charcoal/10 bg-cream">
      <div className="mx-auto grid max-w-content grid-cols-2 gap-px overflow-hidden px-4 py-10 sm:px-6 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="reveal rounded-2xl px-5 py-4 text-center">
            <div className="font-display text-4xl font-semibold text-charcoal md:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-1 text-sm font-semibold text-graphite">{s.label}</div>
            <div className="mt-1 text-[11px] text-graphite/60">{s.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
